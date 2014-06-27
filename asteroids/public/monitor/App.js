define([
	'Bifrost',
	'monitor/gui/MainComponent'

], function(
	Bifrost,
	MainComponent
) {


	function App(config) {

		if (config) {

			Bifrost.BaseApp.apply(this, arguments);
			window.Asteroids.debug = this;

			this.models.application.setUILock(true, Bifrost.UILockLevels.APPLICATION);



			this.addRootComponent({
				component: MainComponent,
				selector: '#monitor'
			});


			this.models.application.setUILock(false, Bifrost.UILockLevels.APPLICATION);

		}
	}

	App.prototype = new Bifrost.BaseApp();

	App.prototype.getModels = function() {
		return [];
		f
		/*return [{
			name: 'navigation',
			type: NavigationModel,
			models: [], //optional
			params: [] //optional
		}];*/
	};

	App.prototype.getServices = function() {
		return [];
	};

	App.prototype.getAdaptors = function() {
		return [];
	};

	App.prototype.getControllers = function() {
		return [];

	};

	return App;

});