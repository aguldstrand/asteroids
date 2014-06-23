/*global require*/
(function(require) {

	require.config(requireConfig);

	define([
		'jqueryWrapper'
	], function(
		$) {

		function App(config) {
			BaseConfiguratorApp.apply(this, arguments);
		}

		App.prototype = new BaseConfiguratorApp();

		App.prototype.getModelDefinitions = function() {
			return {
				settings: {
					type: SettingsModel,
					params: {
						___pageConfig: this.config
					}
				},
				applicationSettings: {
					type: ApplicationSettingsModel,
					dependencies: ['settings']
				},
				application: {
					type: ApplicationModel
				},
				navigation: {
					type: NavigationModel
				},
				filter: {
					type: FilterModel
				},
				configuration: {
					type: ConfigurationModel,
					dependencies: ['settings', 'filter']
				},
				standardFeatures: {
					type: StandardFeaturesModel,
					dependencies: ['configuration']
				},
				featureInformation: {
					type: FeatureInformationModel,
					dependencies: ['configuration']
				},

				exterior: {
					type: ExteriorVisualizationModel,
					dependencies: ['configuration', 'settings']
				},
				interior: {
					type: InteriorVisualizationModel,
					dependencies: ['configuration', 'settings']
				},
				driversView: {
					type: DriversViewVisualizationModel,
					dependencies: ['configuration', 'settings']
				},
				layout: {
					type: LayoutVisualizationModel,
					dependencies: ['configuration', 'settings']
				},
				generalVisualization: {
					type: GeneralVisualizationModel
				},
				fault: {
					type: FaultModel
				},
				user: {
					type: UserModel,
					dependencies: ['settings']
				},
				complexity: {
					type: ComplexityResolverModel,
					dependencies: ['settings', 'configuration']
				},
				alertDialog: {
					type: DialogModel,
					dependencies: ['application'],
					params: {
						level: UILockLevels.ALERT
					}
				},
				generalDialog: {
					type: DialogModel,
					dependencies: ['application'],
					params: {
						level: UILockLevels.POPUP
					}
				},
				tooltip: {
					type: TooltipModel,
					dependencies: ['application'],
					params: {
						level: UILockLevels.tooltip
					}
				},
				dataCollector: {
					type: DataCollectorModel
				},
				dealer: {
					type: DealerModel
				},
				geoLocation: {
					type: GeoLocationModel
				},
				share: {
					type: ShareModel
				},
				alert: {
					type: AlertModel,
					dependencies: ['settings']
				},
				finance: {
					type: FinanceModel,
					dependencies: ['settings', 'configuration']
				},
				media: {
					type: MediaModel
				},
				drawer: {
					type: DrawerModel
				},
				scroll: {
					type: ScrollModel
				},

				description: {
					type: DescriptionModel
				}
			};
		};

		App.prototype.legacy = function() {

			// Setup controllers
			this.controllers = {};
			this.controllers.application = new ApplicationController({
				configMode: 'style',
				app: this
			});

			this.controllers.metrics = new MetricsController({
				app: this
			});

			this.controllers.navigation = new NavigationController({
				app: this
			});

			this.controllers.visualization = new VisualizationController({
				app: this
			});
			this.controllers.dialog = new DialogController([this.models.alertDialog, this.models.generalDialog], this.controllers.metrics);

			this.controllers.tooltip = new TooltipController(this.models.tooltip, this.controllers.metrics);

			this.controllers.featureInformation = new FeatureInformationController(this.models.featureInformation);

			this.controllers.finance = new FinanceController({
				app: this
			});
			this.controllers.filter = new FilterController(this.models.filter);

			this.controllers.description = new DescriptionController(this.models.description);

			this.controllers.media = new MediaController({
				app: this
			});

			this.controllers.dealer = new DealerController(this.models.dealer);

			this.controllers.drawer = new DrawerController(this.models.drawer);

			this.controllers.application.lockUI(true, UILockLevels.APPLICATION);

			this.controllers.scroll = new ScrollController(this.models.scroll);

			// Setup event listeners
			$(this.models.settings).bind(this.models.settings.SETTINGS_LOADED, $.proxy(this.settingsLoaded, this));
			$(this.models.configuration).bind(this.models.configuration.MODELS_RECIEVED, $.proxy(this.modelsRecieved, this));

			// load CSS

			this.css = CSS.initialize({
				app: this,
				path: CssClasses.MAIN_CSS_PATH
			});



			// TODO: Load partials
			this.partials = {};
			this.controllers.application.getUrlParams();
			//this.controllers.application.getUrlParams();
			// Load settings and translations
			this.controllers.application.loadSettings(this.models.settings)
				.fail($.proxy(function() {
					this.handleCommunicationError();
				}, this));


			this.topOut('loading settings...');

		};

		new App(config);

	});
})(require);