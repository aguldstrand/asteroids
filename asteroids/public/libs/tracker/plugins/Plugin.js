define([], function() {
	function TestPlugin(options) {
		this.enabled = false;
		this.___refresh = options.___refresh;
		this.___manipulateEvents = options.___manipulateEvents;
	}

	TestPlugin.prototype.ID = 'test';

	TestPlugin.prototype.refresh = function() {
		// body...
	};
});