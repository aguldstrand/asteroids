/**
 * @name MultiCommand
 * @author oscjoh
 * @namespace Bifrost.commands
 */
define(['../Bicore', './BaseCommand'], function(Bifrost) {
	function MultiCommand(applicationController, lockLevel, faultModel, subCommands) {
		this.__i = 0;
		this.subCommands = subCommands;
		this.subCommand = null;
		this.__previousResponse = null;

		var len = this.subCommands.length;
		for (var i = 0; i < len; i++) {
			this.subCommands[i].parentCommand = this;
		}

		Bifrost.BaseCommand.call(this, applicationController, lockLevel, faultModel);
	}
	MultiCommand.prototype = new Bifrost.BaseCommand();

	MultiCommand.prototype.executeHandler = function() {
		//Bifrost.out.command('MultiCommand.executeHandler');
		this.__i = 0;
		this.__arguments = arguments;
		this.executeSubCommand();
	};

	MultiCommand.prototype.responseHandler = function(error, response) {
		//Bifrost.out.command("MultiCommand responseHandler");
	};

	MultiCommand.prototype.executeSubCommand = function() {

		var params = [];
		var len = this.__arguments.length;
		for (var i = 0; i < len; i++) {
			params.push(this.__arguments[i]);
		}
		params.push(this.__previousResponse);


		this.subCommand = this.subCommands[this.__i];
		this.subCommand.execute.apply(this.subCommand, params);
	};

	MultiCommand.prototype.responseSubCommand = function(error, response) {
		//Bifrost.out.command('MultiCommand.responseSubCommand');
		if (this.subCommand) {
			this.__previousResponse = response;
			this.__i++;
			if (this.__i < this.subCommands.length) {
				this.executeSubCommand();
			} else {
				this.subCommand = null;
				this.response(error, response);
			}
		}
	};

	Bifrost.MultiCommand = MultiCommand;

	return Bifrost;
});