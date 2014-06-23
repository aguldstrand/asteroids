(function() {


	if (!window.trackerPlugins) {
		window.trackerPlugins = [];
	}
	window.trackerPlugins.push(Redirector);



	function Redirector(options) {
		this.enabled = false;

		this.___tracker = options.tracker;

		this.outMode = 0;

		this.modes = {
			0: 'default',
			1: 'tracker > console',
			2: 'console > tracker'
		};


		this.savedTrackerOut = {};
		this.___saveTrackerOut();

		this.savedConsole = {};
		this.___saveConsole();



	}

	Redirector.prototype.ID = 'rdr';

	Redirector.prototype.refresh = function() {
		if (this.enabled) {
			this.___render();
		}
	};


	Redirector.prototype.___saveTrackerOut = function() {
		this.savedTrackerOut = this.___tracker.out;
	};

	Redirector.prototype.___saveConsole = function() {
		if (window.console) {
			for (var key in window.console) {
				this.savedConsole[key] = window.console[key];
			}
		}
	};

	Redirector.prototype.help = function() {
		return 'Redirecter overrides native console to tracker or overrides tracker to output to native console';
	};

	Redirector.prototype.___defaultBehaviour = function() {
		this.___tracker.out = this.savedTrackerOut;
		if (window.console) {
			for (var key in this.savedConsole) {
				window.console[key] = this.savedConsole[key];
			}
		}
	};

	Redirector.prototype.___overrideConsole = function() {
		if (window.console) {
			for (var key in this.savedConsole) {
				if (window[this.___tracker.___namespace][key] && this.savedConsole[key]) {
					window.console[key] = window[this.___tracker.___namespace][key];
				}
			}
		}
	};

	Redirector.prototype.___overrideTracker = function() {

		var tracker = this.___tracker;

		tracker.out = function(key, arg, force) {
			if ((tracker.___filter[key] || force) && !tracker.___paused) {
				if (window.console) {
					if (window.console[key]) {
						window.console[key](arg);
					} else {
						window.console.log(arg);
					}
				}
			}
		};
	};


	Redirector.prototype.___render = function() {

		var html = this.___tracker.___renderHTML(this.___template, {
			id: this.ID
		});

		var target = window.document.getElementById('tracker-plugin-' + this.ID);
		target.innerHTML = html;
		this.out();
	};

	Redirector.prototype.___template = '<div><p style="cursor:pointer;margin:0px;" id="tracker-plugin-{{id}}-change">[CHANGE REDIRECTOR MODE]</p></div>';


	Redirector.prototype.events = [{
		id: 'plugin-rdr-change',
		handler: '___changeHandler',
		event: 'click'
	}];

	Redirector.prototype.___changeHandler = function(e) {
		this.outMode++;
		if (this.outMode > 2) {
			this.outMode = 0;
		}

		switch (this.outMode) {
			case 0:
				this.___defaultBehaviour();

				break;
			case 1:
				this.___defaultBehaviour();
				this.___overrideTracker();
				break;

			case 2:
				this.___defaultBehaviour();
				this.___overrideConsole();
				break;
		}


		this.out();

	};

	Redirector.prototype.out = function() {

		window[this.___tracker.___namespace].outFixed('RDR mode:', this.modes[this.outMode], true);

	};


	return Redirector;
})();


/*
define([], function() {
	function Redirector(options) {
		this.enabled = false;

		this.___tracker = options.tracker;

		this.outMode = 0;

		this.modes = {
			0: 'default',
			1: 'tracker > console',
			2: 'console > tracker'
		};


		this.savedTrackerOut = {};
		this.___saveTrackerOut();

		this.savedConsole = {};
		this.___saveConsole();

	}

	Redirector.prototype.ID = 'rdr';

	Redirector.prototype.refresh = function() {
		if (this.enabled) {
			this.___render();
		}
	};


	Redirector.prototype.___saveTrackerOut = function() {
		this.savedTrackerOut = this.___tracker.out;
	};

	Redirector.prototype.___saveConsole = function() {
		if (window.console) {
			for (var key in window.console) {
				this.savedConsole[key] = window.console[key];
			}
		}
	};

	Redirector.prototype.help = function() {
		return 'Redirecter overrides native console to tracker or overrides tracker to output to native console';
	};

	Redirector.prototype.___defaultBehaviour = function() {
		this.___tracker.out = this.savedTrackerOut;
		if (window.console) {
			for (var key in this.savedConsole) {
				window.console[key] = this.savedConsole[key];
			}
		}
	};

	Redirector.prototype.___overrideConsole = function() {
		if (window.console) {
			for (var key in this.savedConsole) {
				if (window[this.___tracker.___namespace][key] && this.savedConsole[key]) {
					window.console[key] = window[this.___tracker.___namespace][key];
				}
			}
		}
	};

	Redirector.prototype.___overrideTracker = function() {

		var tracker = this.___tracker;

		tracker.out = function(key, arg, force) {
			if ((tracker.___filter[key] || force) && !tracker.___paused) {
				if (window.console) {
					if (window.console[key]) {
						window.console[key](arg);
					} else {
						window.console.log(arg);
					}
				}
			}
		};
	};


	Redirector.prototype.___render = function() {

		var html = this.___tracker.___renderHTML(this.___template, {
			id: this.ID
		});

		var target = window.document.getElementById('tracker-plugin-' + this.ID);
		target.innerHTML = html;
		this.out();
	};

	Redirector.prototype.___template = '<div><p style="cursor:pointer;margin:0px;" id="tracker-plugin-{{id}}-change">[CHANGE REDIRECTOR MODE]</p></div>';


	Redirector.prototype.events = [{
		id: 'plugin-rdr-change',
		handler: '___changeHandler',
		event: 'click'
	}];

	Redirector.prototype.___changeHandler = function(e) {
		this.outMode++;
		if (this.outMode > 2) {
			this.outMode = 0;
		}

		switch (this.outMode) {
			case 0:
				this.___defaultBehaviour();

				break;
			case 1:
				this.___defaultBehaviour();
				this.___overrideTracker();
				break;

			case 2:
				this.___defaultBehaviour();
				this.___overrideConsole();
				break;
		}


		this.out();

	};

	Redirector.prototype.out = function() {

		window[this.___tracker.___namespace].outFixed('RDR mode:', this.modes[this.outMode], true);

	};


	return Redirector;
});*/