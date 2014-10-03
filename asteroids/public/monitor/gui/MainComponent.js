define([
	'Bifrost',

	'monitor/gui/screen/ScreenComponent',

	'controller/controls/keyboard',
	'controller/controls/gamepad',
	'controller/controls/mouse'
], function(
	Bifrost,

	ScreenComponent,

	Keyboard,
	Gamepad,
	Mouse
) {

	function MainComponent(options) {
		if (options) {
			Bifrost.BaseComponent.call(this, options);

			Bifrost.Keyboard = new Keyboard();
			Bifrost.Gamepad = new Gamepad();
			Bifrost.Mouse = new Mouse();

			var that = this;
			window.io.emit('monitor:connect');
			window.io.on('monitor:game-state', function(state) {
				that.gameState = state;
			});

			window.io.emit('controller:connect', {
				name: 'apap'
				// etc from spec
			});

		}
	}

	MainComponent.prototype = new Bifrost.BaseComponent();


	MainComponent.prototype.render = function() {
		this.baseRender('main', {});


		this.$el.append('<div id="keyboard">');
		this.$el.append('<div id="gamepad">');
		this.$el.append('<div id="mouse">');
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

		Bifrost.Keyboard.update();
		Bifrost.Gamepad.update();
		Bifrost.Mouse.update();

		var old = this.time;

		var current = new Date().getTime();

		var step = current - old;

		this.time = current;
		if (this.gameState) {
			this.components.screen.drawing(step, this.gameState);
		}


		var keys = {};
		var pressed = Bifrost.Keyboard.getKeysDown();
		var len = pressed.length;
		for (var i = 0; i < len; i++) {
			keys[pressed[i]] = true;
		}

		window.io.emit('controller:input', keys);



		this.$el.find('#keyboard').html('Keyboard: ' + Bifrost.Keyboard.getKeysDown().join(', '));
		this.$el.find('#gamepad').html(Bifrost.Gamepad.isConnected() ? 'Gamepad: ' + Bifrost.Gamepad.getKeysDown().join(', ') + '; left: ' + Bifrost.Gamepad.getLeftStick() + ', right: ' + Bifrost.Gamepad.getRightStick() : 'Gamepad not connected');
		this.$el.find('#mouse').html('Mouse: ' + Bifrost.Mouse.getKeysDown().join(', ') + '; x: ' + Bifrost.Mouse.x + ', y: ' + Bifrost.Mouse.y);
	};
	MainComponent.prototype.postRender = function() {

		this.update();



	};


	return MainComponent;
});