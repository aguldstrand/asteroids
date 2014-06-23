/**
 * @name BaseAsyncController
 * @namespace Bifrost.controllers
 *
 * @version 1.0
 * @author oscjoh
 */
define(['../Bicore',
	//dependencies
	'../libs/jquery/jqueryWrapper',
	'../constants/UILockLevels',
	'../commands/MultiCommand',
], function(Bifrost) {

	function BaseAsyncController(options) {
		if (options) {
			this.commands = {};
			this.app = options.app;
		}
	}


	BaseAsyncController.prototype.lockUISync = function(lock, level) {
		this.app.models.application.setUILock(lock, level);
	};


	////////////////////////////////////////////////////////////////////////////
	/**  PUBLIC METHODS **/
	////////////////////////////////////////////////////////////////////////////

	/*
		Async actions returns deferred objects
		NOTE: actionName will get Async appended
	*/
	BaseAsyncController.prototype.addAsyncAction = function(actionName, lockLevel, func) {

		var that = this;
		this[actionName + 'Async'] = function() {

			that.app.models.application.setUILock(true, lockLevel);

			var d = func.apply(this, arguments);
			if (!d.done || !d.fail || !d.always) {
				throw 'missing deferred on ' + actionName;
			}

			d.always(function() {
				that.app.models.application.setUILock(false, lockLevel);
			});

			return d;
		};
	};

	/*
		Sync actions are just plain function calls and must be synchronous
		NOTE: actionName will get Sync appended
	*/
	BaseAsyncController.prototype.addSyncAction = function(actionName, func) {
		this[actionName + 'Sync'] = Bifrost.$.proxy(function() {
			func.apply(this, arguments);
		}, this);
	};


	BaseAsyncController.prototype.registerMultiCommand = function(multiCommandObj, commandType, lockLevel, subCommandDefinitions) {

		var subCommands = [];
		var len = subCommandDefinitions.length;
		for (var i = 0; i < len; i++) {
			subCommands.push(this.___getCommandFromDefinition(lockLevel, subCommandDefinitions[i]));
		}

		var multiCommand = new Bifrost.MultiCommand(lockLevel, subCommands);

		this.___registerCommand(lockLevel, multiCommand, commandType);
	};


	BaseAsyncController.prototype.registerCommand = function(commandObj) {



		var commandObjWithInstance = this.___getCommandFromDefinition(commandObj);
		this.___registerCommand(commandObjWithInstance);
	};

	/*
		An Action must added to be able to run a command
		NOTE: actionName will get Async appended
		EXAMPLE:
		this.addCommandAction('sendToDct', CommandTypes.SEND_TO_DATA_COLLECTOR, function(command, apa, kiwi) {
			return command(apa, kiwi);
		});
	*/
	BaseAsyncController.prototype.addCommandAction = function(actionName, commandName, func) {

		var command = this.commands[commandName];
		this[actionName + 'Async'] = Bifrost.$.proxy(function() {
			Array.prototype.unshift.call(arguments, command);
			func.apply(this, arguments);
		}, this);
	};

	////////////////////////////////////////////////////////////////////////////
	/**  PRIVATE METHODS **/
	////////////////////////////////////////////////////////////////////////////

	/*
		Registering of multicommands, will run in the qeue system if locklevel is of type Bifrost.UILockLevels.NONE
	*/
	BaseAsyncController.prototype.___registerCommand = function(commandReference) {
		//this.commands[commandReference.type] = commandReference;



		this.commands[commandReference.type] = Bifrost.$.proxy(function() {
			if (commandReference.UILockLevel === Bifrost.UILockLevels.NONE) {

				Array.prototype.unshift.call(arguments, commandReference);

				return this.___execute.apply(this, arguments);
			} else {
				return commandReference.execute.apply(commandReference, arguments);
			}

		}, this);
	};


	/*
		extracts and instantiate a command with models and services from the command definition object		
	*/
	BaseAsyncController.prototype.___getCommandFromDefinition = function(commandObj) {

		var command = commandObj.command;
		var options = commandObj.options || {};

		if (!options.type) {
			throw 'missing type @ BaseAsyncController';
		}


		options.models = options.models || [];
		options.models.push('fault', 'application');
		options.UILockLevel = options.UILockLevel !== undefined ? options.UILockLevel : Bifrost.UILockLevels.NONE;
		if (options.service) {
			options.service = this.app.services[options.service];
		}
		options.appController = this;

		var modelReferences = {};
		var numModels = options.models.length;
		for (var i = 0; i < numModels; i++) {


			modelReferences[options.models[i]] = this.app.models[options.models[i]];

		}
		options.models = modelReferences;



		options.adaptors = options.adaptors || [];
		var adaptorReferences = {};
		var numAdaptors = options.adaptors.length;
		for (var j = 0; j < numAdaptors; j++) {
			adaptorReferences[options.adaptors[j]] = this.app.adaptors[options.adaptors[j]];
		}
		options.adaptors = adaptorReferences;

		return new command(options);
	};

	/*
		qeue contains (latest info to run command, key is commandtype)
	*/
	BaseAsyncController.prototype.___commandQeue = {};

	/*
		execute always return a deferred object.
		it can however be be rejected immediately if the qeue is full (1 length only)	
	*/
	BaseAsyncController.prototype.___execute = function() {

		var command = arguments[0];
		var commandType = command.type;
		var argsArray = [];
		var len = arguments.length;

		//loop starts at 2 to skip commandType and command
		for (var i = 1; i < len; i++) {
			argsArray.push(arguments[i]);
		}


		var activeDeferred = command.d;


		if (!activeDeferred || activeDeferred.state() !== "pending") {

			//run the command as usual if it is not in a pending state
			Bifrost.out.command("start command: " + commandType);
			return command.execute.apply(command, argsArray);

		} else {
			Bifrost.out.command("command is pending waiting..." + commandType);
			var newDeferred = Bifrost.$.Deferred();


			//reject deferred object of old queud command
			if (this.___commandQeue[commandType] !== undefined) {
				this.___commandQeue[commandType].deferred.reject();
			}

			//add new command data in the qeue
			this.___commandQeue[commandType] = {
				deferred: newDeferred,
				command: command,
				argsArray: argsArray
			};

			//set up callback to know when the pending command is ready and the latest in the qeue should be executed
			activeDeferred.done(Bifrost.$.proxy(function() {
				//Bifrost.out.command("starting after wait (done): " + commandType);

				this.___executeQeued(commandType);
			}, this)).fail(Bifrost.$.proxy(function() {
				//Bifrost.out.command("starting after wait (fail): " + commandType);

				this.___executeQeued(commandType);
			}, this));

			//returns a deferred object that is not set on a command and it might never be
			//but it will get rejected if not set on a command. Otherwise the fate of the
			//deferred object will be determined by the command
			return newDeferred;
		}
	};

	/*
		this will run the qeued command, functoin is called as many times as a command
		has been invoked during "pending" state but will only execute the pending command once.
	*/
	BaseAsyncController.prototype.___executeQeued = function(commandType) {
		var qeueParams = this.___commandQeue[commandType];
		if (qeueParams !== undefined) {

			this.___commandQeue[commandType] = undefined; //reset ___commandQeue for this command

			if (this.app.models.application.getUILock()) {
				Bifrost.out.command("skipped command (UI LOCKED) " + commandType);
				qeueParams.deferred.reject();
			} else {
				var command = this.commands[commandType];

				command.d = qeueParams.deferred;
				command.hasDeferred = true;

				Bifrost.out.command("running qeued command " + commandType);

				command.apply(command, qeueParams.argsArray);
			}
		} else {
			Bifrost.out.command("skipped (latest already executed) " + commandType);
		}
	};


	Bifrost.BaseAsyncController = BaseAsyncController;

	return Bifrost;
});