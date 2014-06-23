(function() {



	var instance = function() {
		function Tracker() {

			window.tracker = {
				setup: this.___bind(this.___setup)
			};


			this.___eventHandlerHash = {};
			this.___fixedHash = {};
			this.___fixed = [];
			this.___rolling = [];

			this.___paused = false;
			this.___oldData = {};
			this.___showFilters = true;
			this.___timers = {};

			//this.___setup(options);



			var that = this;
			window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {
				window[that.___namespace].out('error', errorMsg + ', ' + url + ', ' + lineNumber + ', ' + column + ', ' + errorObj, true);
			};
		}

		Tracker.prototype.___setup = function(options) {

			options = options || {};



			this.___miniMized = options.minimized === true;
			this.___maxRolling = options.maxRolling || 12;
			this.___alpha = options.alpha || 0.8;



			if (!this.___plugins) {
				var plugins = window.trackerPlugins;
				window.trackerPlugins = null;
				this.___plugins = this.___addPlugins(plugins);
			}
			this.___timeStamp = (options.timeStamp === false) ? false : true;
			this.___targetFps = options.fps || 60;
			this.___fpsExtended = options.fpsExtended || false;
			this.___namespace = options.namespace || 'tracker';

			this.___filter = options.filter || {
				log: true,
				warn: true,
				error: true,
				fixed: true
			};
			this.___colorMap = options.colorMap || {
				fixed: 'cyan',
				log: 'white',
				warn: 'yellow',
				error: 'red'
			};

			this.___logs = options.logs || this.___filter;



			this.___target = options.target || this.___createTarget(options.targetId);
			this.___refresh(true);

			var publicApi = {
				out: this.___bind(this.out),
				outObj: this.___bind(this.outObj),
				outFixed: this.___bind(this.outFixed),
				start: this.___bind(this.___start),
				end: this.___bind(this.___end),
				filter: this.___filter,
				setup: this.___bind(this.___setup)
			};

			//window['tracker'] = null;

			window[this.___namespace] = publicApi;
			this.___addLogs(this.___logs);
		};

		Tracker.prototype.___fpsManager = function() {
			var fps = this.___targetFps;
			this.outFixed('FPS ' + fps, ' calculating...', true);
			if (this.___fpsExtended) {
				this.outFixed('FPS min', ' calculating...', true);
				this.outFixed('FPS max', ' calculating...', true);
				this.outFixed('FPS avg', ' calculating...', true);
			}

			var rTime = 1000 / fps;
			var lastTime = new Date().getTime();
			var combinedTime = 0;
			var longCombinedTime = 0;
			var lastLongUpdated = 0;
			var steps = 0;
			var longSteps = 0;
			var min = Number.MAX_VALUE;
			var max = 0;
			var that = this;
			this.FpsKey = setInterval(function() {
				var currentTime = new Date().getTime();
				var step = (currentTime - lastTime);

				min = Math.min(step, min);
				max = Math.max(step, max);

				lastTime = currentTime;
				combinedTime += step;
				longCombinedTime += step;
				steps++;
				longSteps++;
				if (combinedTime > 500) {



					that.outFixed('FPS ' + fps, Math.round(1000 / (combinedTime / steps)), true);

					combinedTime = 0;
					steps = 0;

					if (that.___fpsExtended && longCombinedTime - lastLongUpdated > 3000) {

						that.outFixed('FPS min', Math.round(1000 / max), true);
						that.outFixed('FPS max', Math.round(1000 / min), true);
						that.outFixed('FPS avg', Math.round(1000 / (longCombinedTime / longSteps)), true);
						lastLongUpdated = longCombinedTime;
						//longSteps = 0;
						//longCombinedTime = 0;
					}
				}
			}, rTime);
		};


		Tracker.prototype.___start = function(key, log, fixed) {
			var time = new Date().getTime();
			this.___timers[key] = time;

			if (log) {
				if (fixed) {
					this.outFixed(key, 'started', true);
				} else {
					this.out(key, 'started', true);
				}
			}
		};
		Tracker.prototype.___end = function(key, optionalMessage, fixed) {
			optionalMessage = optionalMessage || '';

			var startTime = this.___timers[key];
			var time = new Date().getTime();
			var result = (time - startTime);
			if (fixed) {
				this.outFixed(key, result + ' ms ' + optionalMessage, true);
			} else {
				this.out(key, result + ' ms ' + optionalMessage, true);
			}

			return result;
		};



		Tracker.prototype.___addLogs = function(logs) {
			var that = this;
			for (var log in logs) {



				window[this.___namespace][log] = function(log) {
					return that.___bind(function() {
						var logkey = log;
						var arr = [];
						for (var key in arguments) {
							var item = arguments[key];
							if (window.JSON && window.JSON.stringify) {
								item = window.JSON.stringify(item);
							}
							arr.push(item);
						}

						if (logkey === 'fixed') {
							var first = arr.shift();
							this.outFixed(first, arr.join(','));
						} else {
							this.out(logkey, arr.join(','));
						}

					});
				}(log);



			}
		};


		Tracker.prototype.___addPlugins = function(plugins) {
			if (!plugins) {
				return [];
			}

			var ret = [];
			var len = plugins.length;
			for (var i = 0; i < len; i++) {
				var reference = plugins[i];

				var instance = new reference({
					Handlebars: this.___Handlebars,
					tracker: this
				});

				if (instance.ENABLED_BY_DEFAULT) {
					instance.enabled = true;
				}

				var pluginObj = {
					id: instance.ID,
					instance: instance
				};

				ret.push(pluginObj);
			}

			return ret;
		};



		Tracker.prototype.___refresh = function(force) {

			this.___innerTarget = this.___renderShell();
			if (!this.___miniMized || force) {
				this.___render();

			}
		};

		Tracker.prototype.___pluginClickHandler = function(e) {
			var id = e.target.id.split('tracker-')[1];

			var len = this.___plugins.length;
			for (var i = 0; i < len; i++) {
				var pluginObj = this.___plugins[i];
				if (pluginObj.id === id) {
					pluginObj.instance.enabled = !pluginObj.instance.enabled;
					break;
				}
			}
			this.___refresh();
		};

		Tracker.prototype.___fpsHandler = function() {
			if (this.FpsKey) {
				window.clearInterval(this.FpsKey);
				this.FpsKey = null;
			} else {
				this.___fpsManager();
			}
			this.___refresh();
		};

		Tracker.prototype.___showFiltersHandler = function() {
			this.___showFilters = !this.___showFilters;
			this.___refresh();
		};

		Tracker.prototype.___minimizeHandler = function() {
			this.___miniMized = !this.___miniMized;
			this.___refresh();
		};
		Tracker.prototype.___toggleFilterHandler = function(event) {
			var key = event.target.id.split('-')[1];
			this.___filter[key] = !this.___filter[key];
			this.___refresh();
		};
		Tracker.prototype.___clearHandler = function() {
			this.___fixed = [];
			this.___fixedHash = {};
			this.___rolling = [];
			this.___refresh();
		};
		Tracker.prototype.___pauseHandler = function() {
			this.___paused = !this.___paused;
			this.___refresh();
		};
		Tracker.prototype.___helpHandler = function() {
			var maxRolling = this.___maxRolling;

			var savedPause = this.___paused;

			this.___paused = false;

			var helpers = [{
				'version': '0.2'
			}, {
				'<': 'minimize tracking (still collecting tracks)'
			}, {
				'>': 'maximize tracking (only available after minimize)'
			}, {
				'F': 'toggle show filter toggling'
			}, {
				'?': 'help'
			}, {
				'P': 'pause tracking'
			}, {
				'X': 'clear tracking'
			}, {
				'FPS': 'show fps monitor',
			}, {
				'options': '___________________________________________________'
			}, {
				'maxRolling': 'maximum fields displayed from tracker.out()'
			}, {
				'filter': '{log:true, error:true, customValue:true}'
			}, {
				'colorMap': '{log:blue,error:red, customValue:green}'
			}, {
				'Handlebars': 'instance of Handlebars (required)'
			}, {
				'alpha': 'float 0 - 1 (background)'
			}, {
				'logs': '{log:true, custom:true} enable static logs on window' + this.___namespace
			}, {
				'fps': '(number) set target FPS for FPS monitor'
			}, {
				'fpsExtended': '(boolean) show extended FPS information'
			}, {
				'namespace': 'where to put the global tracker object (defaults to tracker)'
			}, {
				'usage': '_____________________________________________________'
			}, {
				'out': 'tracker.out(FILTER_LEVEL, ARG)'
			}, {
				'outFixed': 'tracker.outFixed(KEY, ARG)'
			}, {
				'outObj': 'tracker.outObj({key1:value1},RECURSIVE)'
			}, {
				'window.(namespace)': 'see browser console for available logs based on setup'
			}, {
				'filter states': '_____________________________________________'
			}];

			for (var key in this.___filter) {
				var obj = {};
				obj[key] = 'enable/disable current filter';
				helpers.push(obj);
			}

			helpers.push({
				'active plugins': '_____________________________________________'
			});


			for (var j = 0; j < this.___plugins.length; j++) {
				var pInstance = this.___plugins[j].instance;

				if (pInstance.help) {
					var phObj = {};
					phObj[pInstance.ID] = pInstance.help();
					helpers.push(phObj);
				}
			}

			this.___maxRolling = helpers.length;

			this.___refresh();



			for (var i = 0; i < this.___maxRolling; i++) {
				var helpItem = helpers[i];
				for (var hKey in helpItem) {
					this.out(hKey, helpItem[hKey], true);
				}
			}



			this.___maxRolling = maxRolling;

			this.___paused = savedPause;
		};

		Tracker.prototype.___bind = function(func, scope) {
			var that = scope || this;
			return function() {
				func.apply(that, arguments);
			};
		};

		Tracker.prototype.___addEvent = function(event, target, handler) {
			if (target.addEventListener) {
				target.addEventListener(event, handler);
			} else if (target.attachEvent) {
				target.attachEvent(event, handler);
			}
		};

		Tracker.prototype.out = function(key, value, force) {


			if ((this.___filter[key] || force) && !this.___paused) {

				if (window.JSON && typeof(value) === 'object') {
					value = window.JSON.stringify(value);
				}

				this.___rolling.push(this.___makeLogItem(this.___colorMap[key], key, value + ''));

				if (this.___rolling.length > this.___maxRolling) {
					this.___rolling.shift();
				}

				if (!this.___miniMized) {
					this.___render();
				}
			}

		};
		Tracker.prototype.outFixed = function(key, value, force) {
			if (!this.___paused && this.___filter.fixed || force) {
				this.___fixedHash[key] = this.___makeLogItem('cyan', key, value + '');
				if (!this.___miniMized) {
					this.___render();
				}
			}
		};
		Tracker.prototype.outObj = function(obj) {
			for (var key in obj) {
				if (window.JSON) {
					this.out(key, window.JSON.stringify(obj[key]), true);
				} else {
					this.out(key, obj[key], true);
				}
			}
		};

		Tracker.prototype.___makeLogItem = function(color, key, value) {

			if (this.___timeStamp) {
				value = '[' + new Date().getMilliseconds() + '] ' + value;
			}

			return {
				color: color,
				key: key,
				value: value
			};

		};



		Tracker.prototype.___createTarget = function(targetId) {


			var defualtTarget = window.document.getElementById(targetId || 'tracker');
			if (defualtTarget) {
				return defualtTarget;
			}

			var container = window.document.createElement('div');
			container.id = 'Tracker';
			container.style.position = 'fixed';
			container.style['z-index'] = 90000000;

			window.document.body.appendChild(container);

			return container;
		};


		Tracker.prototype.___render = function() {

			var fixed = [];

			for (var key in this.___fixedHash) {
				fixed.push(this.___fixedHash[key]);
			}

			var rolling = this.___rolling;



			var data = {
				fixed: fixed,
				rolling: rolling
			};


			this.___innerTarget.innerHTML = this.___renderHTML(this.___template, data);

		};
		Tracker.prototype.___renderShell = function() {

			var data = {

			};
			var items = [];

			items.push({
				title: this.___miniMized ? '>' : '<',
				id: 'move',
				color: this.___miniMized ? 'white' : 'gray',
				handler: '___minimizeHandler',
				event: 'click'
			});
			if (!this.___miniMized) {
				items.push({
						title: 'F',
						id: 'filters',
						color: this.___showFilters ? 'white' : 'gray',
						handler: '___showFiltersHandler',
						event: 'click'
					}, {
						title: '?',
						id: 'help',
						color: 'white',
						handler: '___helpHandler',
						event: 'click'
					}, {
						title: 'P',
						id: 'pause',
						color: this.___paused ? 'white' : 'gray',
						handler: '___pauseHandler',
						event: 'click'
					}, {
						title: 'X',
						id: 'clear',
						color: 'white',
						handler: '___clearHandler',
						event: 'click'
					}, {
						title: 'FPS',
						id: 'fps',
						color: this.FpsKey ? 'white' : 'gray',
						handler: '___fpsHandler',
						event: 'click'
					}
					/*, {
				title: 'CON',
				id: 'con',
			color: this.___consoleMode ? 'white' : 'gray',
				handler: '___toggleConsole',
				event: 'click'
			}*/
				);

				var len = this.___plugins.length;
				for (var i = 0; i < len; i++) {
					var pluginObj = this.___plugins[i];
					items.push({
						color: pluginObj.instance.enabled ? 'white' : 'gray',
						id: pluginObj.id,
						title: pluginObj.id,
						handler: '___pluginClickHandler',
						event: 'click'
					});

					this.___manipulateEvents(pluginObj.instance, pluginObj.events, false);

				}

				if (this.___showFilters) {

					for (var key in this.___filter) {
						items.push({
							title: key,
							color: this.___filter[key] ? this.___colorMap[key] : 'gray',
							id: key,
							handler: '___toggleFilterHandler',
							event: 'click'
						});
					}
				}
			}
			this.___manipulateEvents(this, this.___oldData.items, false);
			data.alpha = this.___alpha;
			data.items = items;
			data.plugins = this.___plugins;
			this.___target.innerHTML = this.___renderHTML(this.___templateShell, data);

			this.___manipulateEvents(this, items, true);

			this.___oldData = data;

			var lenp = this.___plugins.length;
			for (var j = 0; j < lenp; j++) {
				var pObj = this.___plugins[j];
				pObj.instance.refresh();
				if (pObj.instance.enabled) {
					this.___manipulateEvents(pObj.instance, pObj.instance.events, true);
				}
			}


			return window.document.getElementById('tracker-content');


		};

		Tracker.prototype.___manipulateEvents = function(scope, data, add) {

			for (var key in data) {
				var item = data[key];
				var handler = this.___bind(scope[item.handler], scope);
				this.___eventHandlerHash[item.id + item.event] = handler;
				var target = window.document.getElementById('tracker-' + item.id);



				if (add && target) {
					if (target.addEventListener) {
						target.addEventListener(item.event, handler);
					} else if (target.attachEvent) {
						target.attachEvent(item.event, handler);
					}
				} else if (target) {
					if (target.removeEventListener) {
						target.removeEventListener(item.event, this.___eventHandlerHash[item.id + item.event]);
					} else if (target.detachEvent) {
						target.detachEvent(item.event, this.___eventHandlerHash[item.id + item.event]);
					}
				}
			}
		};



		/*Tracker.prototype.___renderHTML = function(template, data) {
		var templateFunc = this.___Handlebars.compile(template);
		var html = templateFunc(data);
		html = html.split('\n').join('<br>');
		html = html.split('_space').join('&nbsp;');
		return html;
	};*/


		Tracker.prototype.___renderHTML = function(template, data) {

			template = this.___ifHandler(template, data);

			var bits = template.split('{{#');
			var len = bits.length;

			for (var i = 1; i < len; i++) {
				var bit = bits[i];
				var pp = bit.split('}}');
				var keyPiece = pp.shift();
				bit = pp.join('}}');

				var loopParts = bit.split('/' + keyPiece);
				var loopBit = loopParts[0];

				if (data[keyPiece]) {

					var dataArr = data[keyPiece];
					var dataArrLen = dataArr.length;

					var loopItems = [];

					for (var k = 0; k < dataArrLen; k++) {
						var loopItem = this.___renderReplace(loopBit, dataArr[k], true);
						loopItems.push(loopItem);


					}

					loopBit = loopItems.join('');
					bits[i] = loopBit;
				}

				bits[i] += loopParts[1];

			}

			/*var firstPart = bits[0];
		firstPart = this.___renderReplace(firstPart, data);
		bits[0] = firstPart;*/
			var html = bits.join('');

			html = this.___renderReplace(html, data);

			html = html.split('\n').join('<br>');
			html = html.split('_space').join('&nbsp;');



			return html;
		};

		Tracker.prototype.___ifHandler = function(template, data) {



			var bits = template.split('{{#if ');
			var len = bits.length;
			var pieces = [];
			for (var i = 0; i < len; i++) {
				var bit = bits[i];
				var parts = bit.split('{{/if}}');
				pieces = pieces.concat(parts);

			}

			len = pieces.length;
			for (var j = 1; j < len; j++) {
				var piece = pieces[j];
				if (piece && piece !== '') {



					var ifPieces = piece.split('}}');
					var ifPiece = ifPieces[0];



					if (data[ifPiece] === false) {
						ifPieces.shift();
						piece = ifPieces.join('}}');
						pieces[j] = piece;
						pieces.splice(j - 1, 2);

					}

				}
			}

			var html = pieces.join('');

			return html;
		};

		Tracker.prototype.___renderReplace = function(template, data, log) {
			var bits = template.split('{{');
			var len = bits.length;
			var pieces = [];


			for (var i = 0; i < len; i++) {
				var bit = bits[i];
				var parts = bit.split('}}');
				pieces = pieces.concat(parts);

			}

			len = pieces.length;
			for (var j = 0; j < len; j++) {
				var piece = pieces[j];
				if (data[piece]) {
					pieces[j] = data[piece];
				}
			}

			var html = pieces.join('');

			return html;
		};



		Tracker.prototype.___templateShell = '<div style="margin:1px; font-family:monospace; background:rgb(0,0,0); background:rgba(0,0,0,{{alpha}});padding:2px; font-size:12px; color:white; "><div>{{#items}}<p id="tracker-{{id}}" style="font-family:monospace;float:left; color:{{color}}; cursor:pointer; margin-top:0px;margin-bottom:0px;"> [{{title}}]</p>{{/items}}</div>{{#plugins}}<div style="clear:both;" id="tracker-plugin-{{id}}"></div>{{/plugins}}<div style="clear:both;" id="tracker-content"></div></div>';

		Tracker.prototype.___template = '<div>{{#fixed}}<p style="font-family:monospace;margin:1px; color:{{color}};">{{key}} : {{value}}</p>{{/fixed}}</div><div">{{#rolling}}<p style="margin:1px;color:{{color}};">{{key}} : {{value}}</p>{{/rolling}}</div>';


		return Tracker;
	};


	if (window.define) {
		define([], instance);
	} else {
		var tInstance = instance();
		new tInstance();
	}
})();