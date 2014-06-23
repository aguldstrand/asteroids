define(['Bifrost', 'monitor/gui/screen/ScreenComponent'], function(Bifrost, ScreenComponent) {

	function MainComponent(options) {
		if (options) {
			Bifrost.BaseComponent.call(this, options);
		}
	}

	MainComponent.prototype = new Bifrost.BaseComponent();


	MainComponent.prototype.render = function() {
		this.baseRender('main', {});
	};


	MainComponent.prototype.getComponents = function() {
		var components = [];


		return [{
			component: ScreenComponent,
			name: 'screen',
			selector: '#screen'
		}];
	};


	MainComponent.prototype.update = function() {
		if (window.requestAnimationFrame) {
			window.requestAnimationFrame(Bifrost.$.proxy(this.update, this));
		} else {
			window.setTimeout(Bifrost.$.proxy(this.update, this), 33);
		}

		var old = this.time;

		var current = new Date().getTime();

		var step = current - old;

		this.time = current;

		this.components.screen.draw(step);
	};
	MainComponent.prototype.postRender = function() {

		this.update();



	};


	return MainComponent;
});