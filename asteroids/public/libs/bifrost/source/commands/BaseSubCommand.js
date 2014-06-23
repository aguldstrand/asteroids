/**
 * @name BaseSubCommand
 * @author oscjoh
 * @namespace Bifrost.commands
 */
define(['../Bicore'], function(Bifrost) {
	function BaseSubCommand(faultModel) {
		this.parentCommand = undefined;
		this.faultModel = faultModel;
	}

	BaseSubCommand.prototype.execute = function() {
		this.executeHandler.apply(this, arguments);
	};

	BaseSubCommand.prototype.response = function(error, response) {

		if (error) {
			this.faultModel.handleFault(error);
		} else {
			this.responseHandler.apply(this, arguments);
		}
		this.parentCommand.responseSubCommand(error, response);
	};

	Bifrost.BaseSubCommand = BaseSubCommand;
	return Bifrost;
});