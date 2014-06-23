define(['utils/DebugTimer'], function(DebugTimer) {

	function Profiler(options) {

		this.___Handlebars = options.Handlebars;

		this.___wrapTimerOutput();

		this.___profiles = [];
		this.activeGroup = null;
	}

	Profiler.prototype.ID = 'profiler';

	Profiler.GUID = (function() {
		var _guid = 1;
		return function() {
			return _guid++;
		};
	}());


	Profiler.prototype.___wrapTimerOutput = function() {
		var c = DebugTimer.___console;
		DebugTimer.styleOutput = true;
		var that = this;


		function out() {
			var output = that.fixOuput(arguments);
			that.___profiles.push({
				original: arguments[0],
				first: output.first,
				rest: output.rest,
				id: Profiler.GUID(),
				collapsed: false
			});

			if (that.enabled) {
				that.___render();
			}
		}

		function wrap(name, fn) {
			var org = c[name];
			return function() {
				fn.apply(that, arguments);
				// out.apply(that, arguments);
				org.apply(c, arguments);
			};
		}

		c.log = wrap('log', this.___log);
		c.group = wrap('group', this.___groupStart);
		c.groupCollapsed = wrap('groupCollapsed', this.___groupStart);
		c.groupEnd = wrap('groupEnd', this.___groupEnd);
	};


	Profiler.prototype.___log = function() {
		if (this.activeGroup && !this.activeGroup.done) {
			this.activeGroup.logs.push(this.fixOuput(arguments, 1));
		} else {
			this.___profiles.push({
				done: true,
				header: this.fixOuput(arguments),
				id: Profiler.GUID()
			});
		}
	};
	Profiler.prototype.___groupStart = function() {
		if (!this.activeGroup || this.activeGroup.done) {
			this.activeGroup = {
				done: false,
				logs: [],
				header: this.fixOuput(arguments),
				id: Profiler.GUID()
			};
		} else {
			// new group started before old finished
		}
	};
	Profiler.prototype.___groupEnd = function() {
		if (this.activeGroup && !this.activeGroup.done) {
			this.activeGroup.done = true;

			this.___profiles.push(this.activeGroup);

			this.activeGroup = null;

			this.refresh();
		} else {
			// there is no active group to end
		}
	};


	Profiler.prototype.fixOuput = function(args, indentStart, tag) {
		indentStart = indentStart || 0;
		tag = tag || 'div';

		var text = args[0];
		var index = 1;

		text = text.replace(/\n *-+$/, ''); // remove last dotted line

		text = text.replace(/%c([^%]*)%c/g, function(all, content) {
			var style = args[index];
			index += 2; // there's a reset-style between each so increment by two
			return '<span style="' + style + '">' + content.replace(/"/g, '\"') + '</span>';
		});

		text = text.replace(/(^|\n *)([^\n]*)/g, function(str, spaces, content) {
			var padval = 10;
			spaces = spaces || '';
			spaces = spaces.replace(/[^ ]/g, '');
			var padcount = spaces.length / 2;
			var pad = (indentStart * padval) + (padcount * padval);

			return '<' + tag + ' style="padding-left:' + pad + 'px">' + content + '</' + tag + '>';
		});

		return text;
	};


	Profiler.prototype.refresh = function() {
		if (this.enabled) {
			this.___render();
		}
	};


	Profiler.prototype.___render = function() {

		var templateFfn = this.___Handlebars.compile(this.___template);
		var html = templateFfn({
			profiles: this.___profiles
		});
		var target = document.getElementById('tracker-plugin-' + this.ID);
		target.innerHTML = html;

		var container = target.getElementsByTagName('div')[0];
		container.scrollTop = container.scrollHeight;
	};

	Profiler.prototype.events = [{
		id: 'plugin-profiler-clear',
		handler: '___clearProfiles',
		event: 'click'
	}];

	Profiler.prototype.___clearProfiles = function() {
		this.___profiles = [];
		this.refresh();
	};


	Profiler.prototype.___template =
		'<div style="max-height:350px;overflow:auto;">' +
		'<div id="tracker-plugin-profiler-clear" style="cursor:pointer;">[X] Clear</div>' +
		'{{#profiles}}' +
		'<div data-header-id={{id}} style="margin-top:10px;font-weight:bold;border-top:dotted 1px gray;word-break:break-all;">' +
		'{{{header}}}' +
		'</div>' +
		'<div data-logs-id={{id}} style="font-weight:100;{{#if collapsed}}display:none;{{/if}}">' +
		'{{#each logs}}{{{this}}}{{/each}}' +
		'</div>' +
		'{{/profiles}}' +
		'</div>';


	return Profiler;
});