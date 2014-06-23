define([
	'../Bicore',
	//dependencies
	'../libs/jquery/jqueryWrapper'
], function(Bifrost) {

	function BaseApp(options) {
		if (options) {
			this.models = {};
			this.models.application = Bifrost.ApplicationModel;
			this.models.settings = {};

			this.___addDefinitions('models', this.getModels());
			this.___addDefinitions('adaptors', this.getAdaptors());
			this.___addDefinitions('services', this.getServices());
			this.___addDefinitions('controllers', this.getControllers());
		}
	}

	BaseApp.prototype.addRootComponent = function(definition) {

		var component = definition.component;
		var selector = definition.selector;
		//console.log(selector);

		var options = definition.options || {};
		if (!options.coreEvents) {
			options.coreEvents = [];
		}

		if (!options.uiEvents) {
			options.uiEvents = {};
		}

		var optionsObject = {
			$el: Bifrost.$(definition.selector),
			selector: definition.selector,
			app: this
		};

		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				optionsObject[key] = options[key];
			}
		}

		this.rootComponent = new component(optionsObject);
		//console.log("------------------------ base app init -------------------------");
		this.rootComponent.initComponents();

		//console.log("------------------------ base app render -------------------------");
		this.rootComponent.render();

	};


	BaseApp.prototype.getComponentFromFullName = function(fullName) {
		if (!fullName) {
			return null;
		}

		var pieces = fullName.split('-');
		var len = pieces.length;
		var component = this.rootComponent;

		for (var i = 1; i < len; i++) {
			////console.info(fullName, pieces[i], component.components);
			component = component.components[pieces[i]];
		}
		return component;
	};


	/*
		The App class which extends BaseApp must implement 3 methods.
		getModels, getServices, getControllers.
		they must all return an array of definitions of the respectivee type.
		models and services can have denendencies of other models and take parameters.
		controllers get full access to the entire app object.
		example : 
		[{
			name: 'navigation',
			type: NavigationModel,
			models: [], //optional
			params: [] //optional
		}]
	*/

	BaseApp.prototype.___addDefinitions = function(type, definitions) {

		var numDefinitions = definitions.length;
		for (var j = 0; j < numDefinitions; j++) {

			var definition = definitions[j];
			var name = definition.name;
			var dependantModelNames = definition.models;

			var dependantModels = {};
			if (dependantModelNames) {
				var len = dependantModelNames.length;
				for (var i = 0; i < len; i++) {
					var dependantModel = this.models[dependantModelNames[i]];
					if (!dependantModel) {
						throw new Error('Model "' + dependantModelNames[i] + '" must be initialized before "' + name + '"');
					}

					dependantModels[dependantModelNames[i]] = dependantModel;
				}
			}

			if (!this[type]) {
				this[type] = {};
			}

			switch (type) {
				case 'controllers':
					this[type][name] = new definition.type({
						app: this
					});
					break;
				case 'models':
				case 'services':
				case 'adaptors':
					this[type][name] = new definition.type(dependantModels, definition.params);
					break;
			}



		}

	};

	Bifrost.BaseApp = BaseApp;

	return Bifrost;

});