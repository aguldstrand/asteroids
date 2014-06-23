/**
 * @name Log
 * @author oscjoh
 * @namespace Bifrost.utils.Log
 */

define(['../Bicore'], function(Bifrost) {

	function Log() {

		this.labelHash = {};

		this.filter = {};
		this.jsonFormatting = true;
		this.timeStamp = false;
		this.debugRemote = false;
		this.levels = {
			log: "log",
			warn: "warn",
			info: "info",
			error: "error",
			message: "message",
			metrics: "metrics",
			assets: "assets",
			command: "command",
			event: "event",
			release: "release",
			label: "label",
			all: "all",
			bifrost: 'bifrost'
		};
		this.setFilter([this.levels.error]
			/*[
            this.levels.error, this.levels.assets, this.levels.log, this.levels.info, this.levels.command, this.levels.warn, this.levels.metrics, this.levels.event]*/
		);
	}

	Log.prototype.bootTimeStamp = new Date().getTime();

	Log.prototype.setFilter = function(filterArr) {
		this.filter = {};
		var len = filterArr.length;
		for (var i = 0; i < len; i++) {
			this.filter[this.levels[filterArr[i]]] = true;
		}
		this.filter[this.levels.release] = true; //release is always enabled
		return this.filter;
	};

	Log.prototype.setLogElements = function(elementIds) {
		var len = elementIds.length;
		for (var i = 0; i < len; i++) {
			var elementId = elementIds[i];
			Log.prototype['vis' + i] = this.___generateLoggerFunc(elementId, i);
			this.levels[elementId] = elementId;
		}
	};

	Log.prototype.___generateLoggerFunc = function(elementId, i) {
		var element = window[elementId] || window.document[elementId];
		var that = this;
		if (!element) {
			return function() {};
		}
		element.innerHTML = 'Bifrost.out.vis' + i + '(value,value)//  value,value';
		return function() {
			if (that.levels[elementId]) {
				var out = [];
				for (var key in arguments) {
					if (arguments.hasOwnProperty(key)) {
						out.push(arguments[key]);
					}
				}
				element.innerHTML = i + ': ' + out.join(',');
			}
		};

	};

	Log.prototype.release = function() {
		this.out(this.levels.release, arguments);
	};
	Log.prototype.command = function() {
		this.out(this.levels.command, arguments);
	};
	Log.prototype.log = function() {
		this.out(this.levels.log, arguments);
	};

	Log.prototype.warn = function() {
		this.out(this.levels.warn, arguments);
	};

	Log.prototype.info = function() {
		this.out(this.levels.info, arguments);
	};

	Log.prototype.error = function() {
		this.out(this.levels.error, arguments);
	};

	Log.prototype.message = function() {
		this.out(this.levels.message, arguments);
	};

	Log.prototype.metrics = function() {
		this.out(this.levels.metrics, arguments);
	};

	Log.prototype.assets = function() {
		this.out(this.levels.assets, arguments);
	};
	Log.prototype.event = function() {
		this.out(this.levels.event, arguments);
	};

	Log.prototype.label = function() {
		if (!this.labelHash[arguments[0]]) {
			this.out(this.levels.label, arguments);
			this.labelHash[arguments[0]] = true;
		}
	};

	Log.prototype.getTimeStamp = function(time) {

		var millis = Math.floor(time % 1000);
		var seconds = Math.floor((time / 1000) % 60);
		var minutes = Math.floor((time / (1000 * 60)) % 60);

		var ret = "";
		if (minutes > 0) {
			ret += minutes + ":";
		}

		if (millis < 100) {
			millis = "0" + millis;
		} else if (millis < 10) {
			millis = "00" + millis;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}

		ret += seconds + ":" + millis;

		return ret;
	};


	Log.prototype.out = function(level, args) {

		var outp = "";
		var stamp = "";

		if (this.filter[level] || this.filter[this.levels.all]) {
			if (window.console) {


				if (this.jsonFormatting) {
					try {
						outp = JSON.stringify(args);
					} catch (ex) {

					}
				} else {
					outp = args;
				}

				if (this.timeStamp) {
					stamp = this.getTimeStamp(new Date().getTime() - this.bootTimeStamp) + " ";
				}


				if (window.console[level]) {
					if (this.jsonFormatting) {
						window.console[level](outp);
					} else {
						window.console[level](stamp + level + ": ", args);
					}
				} else {

					if (this.jsonFormatting) {
						window.console.log(outp);
					} else {
						window.console.log(stamp + level + ": ", args);
					}
				}
			}

			/*if (Bifrost && Bifrost.remoteLogger && this.debugRemote) {

				var len = args.length;
				var output = [];
				output.push(stamp);
				for (var i = 0; i < len; i++) {
					output[i + 1] = args[i];
				}

				Bifrost.remoteLogger.log(level, output);
			}*/
		}
	};

	//window.Bifrost = window.Bifrost || {};
	//window.Bifrost.out = new Log();

	Bifrost.out = new Log();

	return Bifrost;
});