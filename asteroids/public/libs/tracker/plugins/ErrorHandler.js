define([], function() {
	function ErrorHandler(options) {
		this.enabled = false;
		this.___Handlebars = options.Handlebars;
		this.___tracker = options.tracker;


		var that = this;
		window.onerror = function eHandler(errorMsg, url, lineNumber) {
			if (that.enabled) {
				window.tracker.out('error', errorMsg + ', ' + url + ', ' + lineNumber, true);
			}
		}
	}

	ErrorHandler.prototype.ID = 'eh';

	ErrorHandler.prototype.ENABLED_BY_DEFAULT = true;

	ErrorHandler.prototype.refresh = function() {};
	return ErrorHandler;
});