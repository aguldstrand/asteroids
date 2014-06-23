/**
 * @name BaseComponent
 * @author oscjoh
 * @namespace framework/components/BaseComponent
 */
define([
	'../Bicore',
	//'../libs/hammer/Hammer',
	'../libs/touchSwipe/jquery.touchSwipe',
	//dependencies
	'../utils/ScrollUtil',
	'../constants/UILockLevels',
	'../utils/TouchClick',
	'../utils/LabelHelper',
	'../utils/Log',
	'../libs/jquery/jqueryWrapper'
], function(Bifrost, TouchSwipe) {

	function BaseComponent(options) {

		if (options) {
			if (!options.app) {
				throw "missing params : " + "app: " + options.app;
			}
			options.lockLevel = options.lockLevel || (options.parent ? options.parent.lockLevel : Bifrost.UILockLevels.NONE);

			this.___options = options;
			this.lockLevel = options.lockLevel;
			this.elSelector = options.selector;
			this.___viewState = options.___viewState || {
				components: {}
			};

			this.___coreEvents = options.coreEvents || [];
			this.instanceName = options.instanceName || Bifrost.NAMESPACE.toLowerCase();

			this.$el = options.$el;
			this.app = options.app;
			this.components = {};

			this.parent = options.parent;
			this.coreEventHandlers = {};
			this.___mapCoreEvents();
			this.rendered = false;

			this.isNavigationFragment = options.isNavigationFragment || false;
			this.isActive = options.isActive === false ? false : true;
			this.isVisible = options.isVisible === false ? false : true;

			this.___uiEvents = options.uiEvents || {};

			if (this.app.debug) {
				this.___debugMode = this.app.debug.debugMode;
			}

			this.___lastRenderedData = "";

			if (!Bifrost.NAMESPACE) {
				throw 'MISSING NAMESPACE';
			}


			if (!BaseComponent.helpersRegistered) {
				this.___registerHelpers();
				BaseComponent.helpersRegistered = true;
			}

			/*
			var orgRender = this.render;
			this.render = function() {
				try {
					console.group('render', this.getFullName())
					return orgRender.apply(this, arguments);
				} finally {
					console.groupEnd();
				}
			};
			*/
		}

	}

	//BaseComponent.NAMESPACE = null;

	////////////////////////////////////////////////////////////////////////////
	/**  PUBLIC METHODS **/
	////////////////////////////////////////////////////////////////////////////

	BaseComponent.prototype.getTimedDeferred = function(ms) {
		var that = this;
		var d = Bifrost.$.Deferred();
		var handle = setTimeout(function() {
			d.resolve();
		}, ms);
		return d;
	};

	BaseComponent.prototype.initComponents = function() {

		this.destroyChildren(true);

		var components = this.getComponents();

		if (components && components.length === undefined) {
			throw 'components must be of type array @ ' + this.getFullName();
		}

		if (components) {
			this.___addComponents(components);
		}
	};

	BaseComponent.prototype.renderComponentsAsync = function() {
		var components = this.components;

		var promises = [];
		for (var name in components) {

			if (components.hasOwnProperty(name)) {
				var component = components[name];
				if (component.shouldRender) {
					component.___lastRenderedData = null;
					component.rendered = false;
					if (component.$el) {
						component.$el.html('<p>NOT RENDERED</p>');
					}
					//console.log(this.getFullName(), ' > RENDERED > ', component.getFullName());
					promises.push(component.renderAsync());
				} else {
					//console.warn(this.getFullName(), ' > skipped > ', component.getFullName());
				}
			}
		}

		return Bifrost.$.when.apply(Bifrost.$, promises);
	};

	//optional version param
	BaseComponent.prototype.isIE = function(version) {
		var userAgent = this.___getGlobalNS().userAgent;
		if (userAgent.ie) {
			if (version && userAgent.ieVersion >= version) {
				return true;
			} else {
				return false;
			}
			return true;
		}
		return false;
	};

	BaseComponent.prototype.renderAsync = function() {

		var d = this.render();
		if (!d) {
			d = Bifrost.$.Deferred();
			d.resolve();
		}
		return d;
	};

	BaseComponent.prototype.preRender = function() {};

	BaseComponent.prototype.baseRender = function(templateName, data, forceRender, batchRender) {

		this.preRender();

		//console.error('RENDER', this.getFullName(), this.isActive, this.isVisible);

		//console.log(this.elSelector);
		//console.log(this.selector);


		if (this.rendered && !forceRender && this.___isOldData(data)) {
			//console.warn(this.getFullName(), 'SKIPPED RENDER');



			return;
		}

		if (data) {
			data.debugMode = this.___debugMode;
		}

		this.___unbindEvents();
		var that = this;

		/*if (!window.idHash) {
			window.idHash = {};
		}

		if (this.elSelector.indexOf('#') === 0) {
			if (window.idHash[this.elSelector]) {
				if (window.idHash[this.elSelector] !== this.getFullName()) {
					debugger;
				}
			}

			window.idHash[this.elSelector] = this.getFullName();

		}*/


		if (this.elSelector) {
			if (this.parent) {

				if (!this.parent.$el) {
					//debugger;
					throw 'no parent $el element @ ' + this.getFullName();
				}

				this.$el = this.parent.$el.find(this.elSelector);

				if (this.$el.length > 1) {
					throw 'multiple selector matches [GENERALFEL] ' + this.getFullName() + ' with ' + this.elSelector;
				}
				if (this.$el.length === 0) {
					throw 'missing selector [GENERALFEL] ' + this.getFullName() + ' with ' + this.elSelector;
				}
			} else {
				//is root
			}
		} else {
			throw 'missing selector @ ' + this.getFullName();
		}

		var templates = this.___getGlobalNS().templates = this.___getGlobalNS().templates || {};
		var tplFn = templates[templateName];

		if (!tplFn) {
			throw 'No template with name "' + templateName + '" found';
		}


		var html = tplFn(data);


		var app = this.app;
		if (!batchRender) {
			this.$el.each(function() {
				this.innerHTML = html;
			});
		} else {
			this.___batchedHTML = '<div>' + html + '</div>';
			this.___savedEL = this.$el;
			this.$el = Bifrost.$(this.___batchedHTML);
		}

		this.renderComponentsAsync();

		this.___bindEvents();

		this.rendered = true;

		this.postRender();

	};


	BaseComponent.prototype.completeBatchRender = function() {

		if (this.___batchedHTML) {
			var that = this;

			this.___savedEL.each(function() {
				////console.log("completing batch render", this.innerHTML, that.___batchedHTML);
				// Timer.start('Base.baseRender@innerHTML');
				this.appendChild(that.$el[0]);


				// Timer.end('Base.baseRender@innerHTML');
			});
			that.$el = that.___savedEL;
		}
	};



	/* LABS code */
	/* 
		get dynamic data runtime with faultCheck ex:
		this.getDynamic('models.configuration.selectedModel.name')
	*/
	BaseComponent.prototype.getDynamic = function(dynamicPath) {
		if (!dynamicPath) {
			return dynamicPath;
		}

		var parts = dynamicPath.split('.');
		var len = parts.length;
		var activeObj = this.app;
		for (var i = 0; i < len; i++) {
			var part = parts[i];
			activeObj = activeObj[part];
			if (!activeObj) {
				break;
			}
		}
		return activeObj;
	};

	BaseComponent.prototype.getFullName = function() {

		var names = [];

		for (var component = this; component; component = component.parent) {
			names.push(component.instanceName);
		}

		names.reverse();

		return names.join('-');

	};



	/*
		Simple wrapper for ___addComponents which only takes one component.
		So no need to wrap it in an array.
	*/
	BaseComponent.prototype.___addComponent = function(component, dont) {
		if (dont) {
			throw 'maybe you want to use ___addComponent(s) instead since you are passing multiple arguments';
		}
		this.___addComponents([component]);
	};
	/*
		Use this function instead of creating childComponents manually.
		This will create the components, destroy them if they already exist,
		and add uiEvents if they exist and match the childrens events.
		
		example:
		var components = [{
			component: ComponentA,
			selector: '#idName1',
			name: 'uniqueName1',
			options: { //optional
				isX: true
			},
			render: false //optional,

		},{
			component: ComponentA,
			selector: '#idName2',
			name: 'uniqueName2',
			options: { //optional
				isX: true
			},
			render: false,optional
			hide : true //optional
		}]];

		this.___addComponents(components);

	*/
	BaseComponent.prototype.___addComponents = function(components, dont) {

		//console.group('init', this.instanceName);

		if (dont) {
			throw '___addComponents takes an array with components';
		}

		var Component = null;
		var selector = null;
		var name = null;
		var componentObj = {};
		var options = {};
		//var uiEvents		= null;
		var instance = null;
		var render = null;
		var hide = null;

		var cLen = components.length;
		for (var i = 0; i < cLen; i++) {
			componentObj = components[i];

			//get critical parts
			Component = componentObj.component;
			selector = componentObj.selector;
			name = componentObj.name;

			/*if (name !== name.toLowerCase()) {
				throw 'names must be lower case @' + this.getFullName() + ' > ' + name;
			}*/

			//check if critical parts exist
			if (!Component || !selector || !name) {
				throw ('___addComponent: missing component params @ ___addComponents> Component: ' + !!Component + ', selector: ' + !!selector + ', name: ' + !!name + ' @ ' + this.getFullName());
			}

			//get non critical parts
			options = componentObj.options || {};
			render = componentObj.render;
			//uiEvents			= componentObj.uiEvents;

			//add base options params
			options.app = this.app;
			options.selector = selector;
			options.parent = this; //really? yes indeed (needed in baseDestroy)
			options.coreEvents = []; //testing <--- --->
			options.uiEvents = {}; //testing <--- --->


			//inherit active / vis state if not explicit set
			if (options.isActive !== false && options.isActive !== true) {
				options.isActive = this.isActive;
			}
			if (options.isVisible !== false && options.isVisible !== true) {
				options.isVisible = this.isVisible;
			}



			if (!this.___viewState.components[name]) {
				this.___viewState.components[name] = {
					state: {},
					components: {}
				};
			}
			options.___viewState = this.___viewState.components[name];

			//destroy the old component if it exists
			if (this.components[name]) {
				this.components[name].baseDestroy(false); //Skicka med flagga att inte clearar viewState
			}

			options.instanceName = name;

			//create and add the new component
			instance = new Component(options);
			this.components[name] = instance;

			instance.shouldRender = render !== false; // render if no render flag is set

			instance.initComponents();

			if (hide === true) {
				instance.hide(); //really?
			}
		}
	};


	BaseComponent.prototype.renderChildren = function() {
		if (this.components) {
			for (var name in this.components) {
				if (this.components.hasOwnProperty(name)) {
					var component = this.components[name];
					component.___lastRenderedData = null;
					component.render();
				}
			}
		}
	};


	BaseComponent.prototype.destroyChildren = function(destroyState) {
		//oscjoh  full destroy test  2013-05-28 
		if (this.components) {
			for (var name in this.components) {
				if (this.components.hasOwnProperty(name)) {
					this.components[name].baseDestroy(destroyState);
				}
			}
		}
	};

	/*
		uiEvents uses this to dispatch uiEvent.
		example: 
		this.dispatch(this.EVENT_NAME , {customArg:'kiwi', customArg2:'lemon'});
	*/
	BaseComponent.prototype.dispatch = function(event, arg) {

		////console.log('DISPATCH:', event, arg, '@', this.getFullName());



		arg = arg || {};
		arg.event = event;
		arg.target = this;

		for (var component = this; component; component = component.parent) {

			if (component.___uiEvents && component.___uiEvents[event]) {
				var uiEvent = component.___uiEvents[event];



				var ret = component.___runHandlerFunction(component, component[uiEvent.handler], component.___getLockLevel(Bifrost.UILockLevels.FORCE), true, [arg]);
				if (ret === false) {
					Bifrost.out.log('breaking ui Event chain from ', this.getFullName(), '@', component.getFullName(), 'in', uiEvent.handler);
					break;
				}

			}
		}

	};

	BaseComponent.prototype.baseUnrender = function() {

		this.preBaseUnrender();


		for (var componentKey in this.components) {
			if (this.components.hasOwnProperty(componentKey)) {
				var component = this.components[componentKey];
				component.baseUnrender();
			}
		}

		this.___unbindEvents();

		if (this.rendered) {
			var el = this.$el[0];
			if (el) {
				el.innerHTML = '';
			}
			this.rendered = false;
			this.___lastRenderedData = null;
		}
	};

	/* destroy the whole shabang including all children created by parent(this) */
	BaseComponent.prototype.baseDestroy = function(destroyState) {

		this.___lastRenderedData = null;
		this.destroy();
		// this.baseRender("", {});
		this.baseUnrender();

		//console.warn(this.instanceName, 'BASE destroy', this.getFullName());


		if (this.___coreEvents) {
			var len = this.___coreEvents.length;
			for (var i = 0; i < len; i++) {
				var coreEvent = this.___coreEvents[i];
				var model = this.app.models[coreEvent.model];

				if (!model) { //support direct access to instance of model (needed when a model is passed to a component)
					model = coreEvent.model;
				}

				var eventName = model[coreEvent.event];
				var boundHandler = this.coreEventHandlers[eventName];

				model.removeListener(eventName, boundHandler);
				//Bifrost.$(model).unbind(eventName, boundHandler);
			}
		}

		this.destroyChildren(destroyState);

		//this.___unbindEvents();
		Bifrost.$(this).unbind();


		this.isActive = false;


		//this might fuck things up..
		if (this.parent) {
			var pComponents = this.parent.components;

			this.parent.childRemoved(this.instanceName, destroyState);
			/*if (pComponents && pComponents[this.instanceName]) {
				delete pComponents[this.instanceName];
			}*/
			this.parent = undefined;
		}
	};

	BaseComponent.prototype.childRemoved = function(name, destroyState) {
		if (destroyState !== false) {
			delete this.___viewState.components[name];
			delete this.___viewState.state[name];
		}
		delete this.components[name];
	};



	/**
	 * Base function for setting view state
	 *
	 * Every GUI action that doesn't alter any data but just how it's presented should
	 * update the view state.
	 *
	 * @param {String} key   A key which identies the action taken to apply a state.
	 *                       Actions that create a component MUST have same key as
	 *                       the components name so the state is removed correclty when removing the component
	 * @param {Object} state The state object contains an action and params
	 *                       {
	 *                          action: 'callback',function to call
	 *
	 *                          //optional
	 *                          params: [],         //arguments sent to callback
	 *                          toggle: true/false  //if toggle is [true] and there is a state with the same key the state will be removed
	 *                                              //if toggle is [false] and there is a state with the same key the state will be replaced
	 *                       }
	 */
	BaseComponent.prototype.setViewState = function ViewState(key, state) {
		if (state.toggle === true && this.___viewState.state[key]) {
			delete this.___viewState.state[key];
		} else {
			this.___viewState.state[key] = state;
		}

		//Params must be a part of state object
		if (!state.params) {
			state.params = [];
		}

		//The first argument in all functions that are called by viewState actions
		//is an object with state information
		state.params.unshift({
			//Flag specifies it the action is called when restoring the state or not
			restore: false
		});

		//Call function
		this[state.action].apply(this, state.params);
	};


	BaseComponent.prototype.resetViewState = function() {
		this.___viewState.state = {};
		this.___viewState.components = {};
	};


	/**
	 * Replays every state in viewState object
	 */
	BaseComponent.prototype.applyViewState = function ViewState() {

		var viewState = this.___viewState;

		for (var name in viewState.state) {
			var state = viewState.state[name];

			//Restore flag is set to true
			state.params[0].restore = true;
			this[state.action].apply(this, state.params);
		}

	};



	/**
	 * Used for groups where only one element can be active at the same time
	 * @param {String/DOMElement} selector  Element/Selector for the one being activated
	 * @param {String} className            Class which represents an active element
	 */
	BaseComponent.prototype.setActiveElement = function(selector, className) {
		Bifrost.$('.' + className).removeClass(className);
		if (selector) {
			Bifrost.$(selector).addClass(className);
		}
	};


	BaseComponent.prototype.preventDefault = function(event) {


		if (event.preventDefault) {

			event.preventDefault();
		} else if (typeof window.event !== "undefined") {
			//IE old fix for preventDefault behaviour


			window.event.returnValue = false;
			return window.event;
		}


		return false;
	};


	BaseComponent.prototype.scrollTo = function(top, animationSpeed) {
		Bifrost.ScrollUtil.scrollTo(top, animationSpeed);
	};



	////////////////////////////////////////////////////////////////////////////
	/**  PUBLIC METHODS OVERRIDE **/
	////////////////////////////////////////////////////////////////////////////

	BaseComponent.prototype.getComponents = function() {};

	/*
	this can be overriden in component to destroy custom objects (like bing maps for example)
	*/
	BaseComponent.prototype.preBaseUnrender = function() {};

	BaseComponent.prototype.destroy = function() {};

	BaseComponent.prototype.stateChanged = function(active, visible) {};

	BaseComponent.prototype.postRender = function() {};

	////////////////////////////////////////////////////////////////////////////
	/**  PRIVATE METHODS **/
	////////////////////////////////////////////////////////////////////////////


	/**
	 * Registers helpers in Handlebars
	 */
	BaseComponent.prototype.___registerHelpers = function() {
		var settings = this.app.models.settings;
		var configurationModel = this.app.models.configuration;
		var layoutModel = this.app.models.layout;

		Bifrost.Handlebars.registerHelper('label', function(label, placeholder, isLabel) {
			var value = Bifrost.LabelHelper.getLabel(label, settings, placeholder, isLabel);
			return new Bifrost.Handlebars.SafeString(value);
		});


		//hix-hax partial version
		Bifrost.Handlebars.registerHelper('dynamicTemplate', function(template, context, opts) {
			template = template.replace(/\//g, '_');
			var f = Bifrost.Handlebars.partials[template];
			if (!f) {
				return "Partial not loaded";
			}
			return new Bifrost.Handlebars.SafeString(f(context));
		});
	};


	/*
		small util to get global NS object
	*/
	BaseComponent.prototype.___getGlobalNS = function() {
		return window[Bifrost.NAMESPACE];
	};



	/*
	this.componentState = 0;
	this.STATE_CREATED = 0;
	this.STATE_RENDERED = 1;
	this.STATE_ACTIVE = 2;
	this.STATE_VISIBLE = 3;
	*/
	BaseComponent.prototype.___setActive = function(active) {

		this.isActive = active;



		//console.log(this.getFullName(), 'active', active);

		if (!this.rendered && active) {
			this.render();
		}


		if (this.components) {
			for (var name in this.components) {
				if (this.components.hasOwnProperty(name)) {
					this.components[name].___setActive(active);

				}
			}
		}



		if (!active && this.isVisible) {
			this.___setVisible(false);
		} else {
			this.stateChanged(this.isActive, this.isVisible);
		}

	};


	BaseComponent.prototype.___setVisible = function(visible) {



		//console.log(this.getFullName(), 'visible', visible);

		this.isVisible = visible;

		if (!this.isActive && visible) {
			this.___setActive(true);
		}
		if (this.components) {
			for (var name in this.components) {
				if (this.components.hasOwnProperty(name)) {
					this.components[name].___setVisible(visible);

				}
			}
		}

		this.stateChanged(this.isActive, this.isVisible);
		//this.stateChanged(active);
	};


	/*
		helper for detection of old data. does not work on browsers without JSON.		
	*/
	BaseComponent.prototype.___isOldData = function(data) {

		if (!window.JSON) {
			return false;
		}
		var newData = JSON.stringify(data);
		if (newData === this.___lastRenderedData) {
			////console.log("skipped render on ",this);
			return true;
		}
		this.___lastRenderedData = newData;
		return false;
	};


	BaseComponent.prototype.___mapCoreEvents = function() {
		if (this.___coreEvents) {
			var that = this;
			var len = this.___coreEvents.length;
			for (var i = 0; i < len; i++) {
				var coreEvent = this.___coreEvents[i];
				var model = this.app.models[coreEvent.model];

				if (!model) { //support direct access to instance of model (needed when a model is passed to a component)
					model = coreEvent.model;
				}

				var eventName = model[coreEvent.event];
				if (!eventName) {
					throw '> event ' + coreEvent.event + ' not found @ ' + this.getFullName() + ' component on ' + coreEvent.model + ' model';
				}

				if (!this[coreEvent.handler]) {
					throw '> handler not found @ ' + this.getFullName() + ' component';
				}

				var proxyHandler = Bifrost.$.proxy(this.___coreEventProxyHandler(coreEvent), this);

				this.coreEventHandlers[eventName] = proxyHandler;

				model.addListener(eventName, proxyHandler);
				//console.log(eventName, this.getFullName(), coreEvent.handler);
				//Bifrost.$(model).bind(eventName, proxyHandler);
			}
		}
	};

	BaseComponent.prototype.___coreEventProxyHandler = function(coreEvent) {
		var that = this;
		var proxyHandler = function() {
			if (that.isActive || coreEvent.always) {
				return that[coreEvent.handler].apply(this, arguments);
			} else {
				Bifrost.out.event('ignored > ' + coreEvent.handler + ' @ ' + this.instanceName);
			}
		};
		return proxyHandler;
	};


	BaseComponent.prototype.compileTemplate = function(template, data) {
		if (data) {
			data.debugMode = this.app.debug.debugMode;
		}
		if (this.___lastTemplate !== template && !this.___templateFunc) {
			this.___lastTemplate = template;
			this.___templateFunc = Bifrost.Handlebars.compile(template);
		}
		var html = this.___templateFunc(data);
		return html;
	};



	BaseComponent.prototype.___makeHandler = function($thing, _this, handler, lockLevel, eventType, bubble) {

		// map click for touch devices (fast click)
		if (eventType === 'click' && typeof window.ontouchstart !== 'undefined') {
			Bifrost.TouchClick.attachTrigger($thing);
		}

		Bifrost.$($thing).bind(eventType, this.___makeHandlerFunction(_this, handler, lockLevel, bubble));
	};

	BaseComponent.prototype.___makeHandlerFunction = function(_this, handler, lockLevel, bubble) {
		return function EventHandlerFunction() {

			return _this.___runHandlerFunction(_this, handler, lockLevel, bubble, arguments);
		};
	};


	BaseComponent.prototype.___runHandlerFunction = function(_this, handler, lockLevel, bubble, event) {



		if (_this.app.models.application.getUILock() && _this.app.models.application.getUILockLevel() > lockLevel || !_this.isActive && lockLevel !== Bifrost.UILockLevels.FORCE) {



			Bifrost.out.log("UI LOCKED: " + _this.app.models.application.getUILockLevel() + " > " + lockLevel, _this.isActive, _this.instanceName);
			//Bifrost.out.info("UI LOCKED: " + _this.app.models.application.getUILockLevel() + " > " + lockLevel, _this.isActive, _this);
			//_this.app.controllers.application.showUILock();
			return false;
		} else {

			////console.log('applying handler', arguments);

			var ret = handler.apply(_this, Array.prototype.slice.call(arguments, 4)[0]);
			if (bubble) {
				return ret;
			} else {

				return _this.preventDefault(Array.prototype.slice.call(arguments, 4)[0][0]);
			}
		}

	};

	BaseComponent.prototype.___addDomListeners = function(def) {



		for (var selector in def) {
			var handlerArray = def[selector];
			var hammertime = null;


			var handlerLen = handlerArray.length;
			for (var i = 0; i < handlerLen; i++) {

				var handlerInfo = handlerArray[i];

				var infoLen = handlerInfo.event.length;
				for (var j = 0; j < infoLen; j++) {

					var event = handlerInfo.event[j];

					//needed because Bifrost.UILockLevels.NONE is 0 and a quick || will parse that as false
					var lockLevel = this.___getLockLevel(handlerInfo.lockLevel);
					var target;
					if (selector === '') {
						target = this.$el;
					} else {
						target = this.$el.find(selector);
					}
					if (selector === 'window') {
						target = window;
					}


					if (event.indexOf('swipe') > -1) {

						var that = this;

						//window.tracker.out('log', 'swipe handler on ' + selector + ' @ ' + handlerInfo.handler + ' > ' + this.instanceName);

						//no need to remove event handler, it will work itself out.
						this.$el.find(selector).swipe({
							allowPageScroll: "vertical",
							swipeStatus: that.___makeHandlerFunction(that, that[handlerInfo.handler], lockLevel, arguments, handlerInfo.bubble)

						});

						//Bifrost.$.proxy(that[handlerInfo.handler], this) //

					} else {
						this.___makeHandler(target, this, this[handlerInfo.handler], lockLevel, event, handlerInfo.bubble);
					}
				}
			}

		}
	};

	BaseComponent.prototype.___getLockLevel = function(lockLevel) {
		if (lockLevel !== undefined && lockLevel >= Bifrost.UILockLevels.NONE) {
			return lockLevel;
		}
		if (this.lockLevel !== undefined && this.lockLevel >= Bifrost.UILockLevels.NONE) {
			return this.lockLevel;
		}
		return Bifrost.UILockLevels.NONE;
	};

	BaseComponent.prototype.___bindEvents = function() {

		//dont bind uiEvents		here as they are bound from the ___addComponents()
		//and they can only be added after the child components are created.
		this.___addDomListeners(this.events);
	};

	BaseComponent.prototype.___unbindEvents = function() {

		//remove uiEvents		when removeing dom events, because childComponents need to be readded after
		//the parent(this) is rerendered.

		//this.$el.find('*').unbind();
	};



	//# Debug function
	// Send in arguments.calleee.caller
	BaseComponent.prototype.isCallerFromEvent = function() {
		var caller = arguments.callee.caller;

		while (caller) {
			if (caller.name === 'ViewState') {
				return false;
			} else if (caller.name === 'EventHandlerFunction') {
				return true;
			}
			caller = caller.caller;
		}
		return false;
	};


	BaseComponent.prototype.getBasePath = function() {
		return this.app.config.baseUrl + this.app.config.configuratorTypePath;
	};


	BaseComponent.prototype.animateEl = function($el, posX, posY, ms, HWA, easing) {

		var timeInSec = ms / 1000;
		if (HWA) {
			$el.css({
				'-webkit-transform': 'translate3d(' + posX + 'px, ' + posY + 'px, 0px)',
				'-moz-transform': 'translate(' + posX + 'px, ' + posY + 'px)',
				'-ms-transform': 'translate(' + posX + 'px, ' + posY + 'px)',
				'transform': 'translate(' + posX + 'px, ' + posY + 'px)',
				'transform-origin': 'top left',
				'-webkit-transition': '-webkit-transform ' + timeInSec + 's',
				'-moz-transition': '-moz-transform ' + timeInSec + 's',
				'-ms-transition': '-ms-transform ' + timeInSec + 's',
				'transition': 'transform ' + timeInSec + 's',
				'-webkit-backface-visibility': 'hidden'
			});
		} else {
			$el.animate({
				'margin-left': posX + 'px',
				'margin-top': posY + 'px'
			}, ms, easing ? easing : 'swing');
		}
		return this.getTimedDeferred(ms);
	};

	BaseComponent.prototype.findChildWithName = function(name) {
		var ret = null;
		for (var key in this.components) {
			if (this.components.hasOwnProperty(key)) {
				if (key === name) {
					ret = this.components[name];
					return ret;
				} else {
					var component = this.components[key];
					ret = component.findChildWithName(name);
					if (ret) {
						return ret;
					}
				}
			}
		}
	};

	BaseComponent.prototype.findParentWithName = function(name) {
		if (!this.parent) {
			return null;
		}
		if (this.parent.instanceName === name) {
			return this.parent;
		} else {
			return this.parent.findParentWithName(name);
		}
	};


	////////////////////////////////////////////////////////////////////////////
	/**  deprececated code or code that we are not sure that we want anymore **/
	////////////////////////////////////////////////////////////////////////////

	/** remove this **/
	BaseComponent.prototype.uiCallback = function(event, arg1, arg2, arg3, arg4, arg5, arg6) {



		if (this.uiCallbacks) {
			var handler = this.uiCallbacks[event];
			if (handler) {
				this[handler](arg1, arg2, arg3, arg4, arg5, arg6);
			}
		} else {
			this.parent.uiCallback(event, arg1, arg2, arg3, arg4, arg5, arg6);
		}
	};

	/** remove this? **/
	BaseComponent.prototype.runCallback = function() {

		var args = [].splice.call(arguments, 0);
		var callee = args.shift();
		if (callee) {
			callee.apply(this, args);
		}

		/*
		var callbackFunction = arguments[0];

		if (callbackFunction) {

			var argsArray = [];
			var len = arguments.length;

			//loop starts at 1 to skip callbackFunction as argument
			for (var i = 1; i < len; i++) {
				argsArray.push(arguments[i]);
			}
			callbackFunction.apply(this, argsArray);


			//callbackFunction.apply(this, arguments.unshift());
		} else {
			Bifrost.out.warn("callback not found (unable to retrieve name): @ BaseComponent");
		}*/

	};
	/** remove this **/
	//tooltipcomponent uses this ATM. Should be refactored to ___addComponents
	BaseComponent.prototype.getMergedOptions = function(selector, options) {

		if (!options) {
			options = {};
		}
		options.selector = selector;
		options.$el = this.$el.find(selector);
		options.parent = this;

		var merged = Bifrost.$.extend(true, this.___options, options);

		return merged;
	};



	BaseComponent.prototype.getActiveNavigationPath = function() {
		var component = null;
		var c;
		for (var key in this.components) {
			if (this.components.hasOwnProperty(key)) {
				c = this.components[key];
				if (c.isActive) {
					component = c;
					break;
				}
			}
		}

		if (component) {
			return component.getNavigationPath();
		} else {
			var names = [];

			for (c = this; c; c = c.parent) {
				if (c.isNavigationFragment) {
					names.push(c.getFullName());
				}
			}

			names.reverse();

			return names;
		}
	};

	BaseComponent.prototype.getNavigationPathFromFullName = function(fullName) {
		var root;
		for (root = this; root.parent; root = root.parent) {

		}

		var pieces = fullName.split('-');
		var len = pieces.length;
		var i;
		var path = [];

		var component = root;
		for (i = 1; i < len; i++) {
			component = component.components[pieces[i]];

			if (component.isNavigationFragment) {
				path.push(component.getFullName());
			}
		}

		return path;
	};



	BaseComponent.prototype.___debugTree = function(param, cb) {
		for (var key in this.components) {
			if (this.components.hasOwnProperty(key)) {
				var component = this.components[key];
				if (cb) {
					cb(component);
				} else {
					Bifrost.out.log(component.getFullName(), component[param]);
				}
				component.___debugTree(param, cb);
			}
		}
	};



	/*
	BaseComponent.prototype.hasComponents = function() {

		for (var component in this.components) {
			if (this.components.hasOwnProperty(component)) {
				return true;
			}
		}
		return false;
	};*/



	// Timer.track('Base', BaseComponent.prototype);

	//Timer.watch({
	//	name: '',
	//	limit: 50,
	//	childLimit: 2
	//});
	/*	Timer.watch({
		name: 'render',
		limit: 15,
		childLimit: 2
	});
*/
	Bifrost.BaseComponent = BaseComponent;
	return Bifrost;
});