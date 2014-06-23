define(['Bifrost', 'hb!ui/main.tpl'], function(Bifrost, template) {

	function MainComponent(options) {
		if (options) {
			options.coreEvents.push({
				model: 'model',
				event: 'TICK',
				handler: 'render'
			});
			Bifrost.BaseComponent.call(this, options);
			Bifrost.out.release('APA');
		}
	}

	MainComponent.prototype = new Bifrost.BaseComponent();
	MainComponent.prototype.events = {
		'h1': [{
			event: ['click'],
			handler: 'hide',
			lockLevel: Bifrost.UILockLevels.POPUP
		}]
	};
	MainComponent.prototype.hide = function() {
		alert('trololo');
	};
	MainComponent.prototype.render = function() {
		this.baseRender(template, {
			hello: 'Bifrost 0.1 ' + (Math.random() > 0.5 ? '~{*-*}~' : '~{`-´}~')
		});
	};

	return MainComponent;
});