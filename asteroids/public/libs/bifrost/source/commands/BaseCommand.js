/**
 * @name BaseCommand
 * @author oscjoh
 */
define([
	'../Bicore',

	//dependencies
	'../libs/jquery/jqueryWrapper',
	'../constants/UILockLevels',
	'../utils/Log'
], function(Bifrost) {
	///**applicationController, UILockLevel, faultModel*/ 
	function BaseCommand(options) {
		if (options) {
			this.applicationController = options.appController;
			this.UILockLevel = options.UILockLevel;
			this.faultModel = options.models.fault;
			this.type = options.type;
			this.d = null;
			this.hasDeferred = false;
			this.parentCommand = null;
		}
	}

	BaseCommand.prototype.execute = function() {



		if (!this.hasDeferred) {
			this.d = Bifrost.$.Deferred();
		}

		this.hasDeferred = true;

		if (this.UILockLevel !== Bifrost.UILockLevels.NONE) {
			this.applicationController.lockUISync(true, this.UILockLevel);
		}

		this.executeHandler.apply(this, arguments);

		return this.d;
	};

	BaseCommand.prototype.response = function(error, response) {


		this.hasDeferred = false;

		if (error) {
			this.faultModel.handleFault(error, response ? response.error : undefined);
			this.d.reject();
			Bifrost.out.command("Command did not execute response, Fault set in fault model.", error);
		} else if (response) {
			this.responseHandler.apply(this, arguments);
			this.d.resolve();
		}

		if (this.UILockLevel !== Bifrost.UILockLevels.NONE) {
			this.applicationController.lockUISync(false, this.UILockLevel);
		}

		if (this.parentCommand) {
			this.parentCommand.responseSubCommand(error, response);
		}

	};

	Bifrost.BaseCommand = BaseCommand;

	return Bifrost;
});