define([
	'Bifrost',
	'monitor/gui/objects/Poly',
	'monitor/gui/objects/Starmap',
	'monitor/gui/objects/Ships',
	'monitor/gui/objects/Asteroids',
	'monitor/gui/objects/Debug',
	'monitor/gui/objects/MiniMap',
	'monitor/gui/objects/StarGrid',

	'monitor/gui/objects/Camera',

	'monitor/gui/objects/Explosions',
	'hektorskraffs/webgl',

	'glmatrix',
	'hektorskraffs/webgl-util'
], function(
	Bifrost,
	Poly,
	Starmap,
	Ships,
	Asteroids,
	Debug,
	MiniMap,
	StarGrid,

	Camera,

	Explosions,
	WebGL,
	glmatrix,
	Utils) {

	function ScreenComponent(options) {
		if (options) {
			Bifrost.BaseComponent.call(this, options);

			this.canvas = null;
			this.SW = 0;
			this.SH = 0;
			this.pixel = 1;

			this.oldFocusPoint = {
				x: 0,
				y: 0
			};


		}
	}

	ScreenComponent.prototype = new Bifrost.BaseComponent();



	ScreenComponent.prototype.setup = function() {

		this.starmap1 = new Starmap(this.pixel, this.SW, this.SH, 2, -0.4);
		this.starmap2 = new Starmap(this.pixel, this.SW, this.SH, 4, -0.6);
		this.explosions = new Explosions(this.pixel, this.SW, this.SH);
		this.ships = new Ships(this.pixel, this.SW, this.SH);
		this.asteroids = new Asteroids(this.pixel, this.SW, this.SH);
		this.debug = new Debug(this.pixel, this.SW, this.SH);
		this.miniMap = new MiniMap(this.pixel, this.SW, this.SH);
		this.starGrid = new StarGrid(this.pixel, this.SW, this.SH);

		this.camera = new Camera();
	};


	ScreenComponent.prototype.init = function() {
		// Get A WebGL context
		/*
		var canvas = this.canvas;
		var gl = canvas.getContext('webgl');
		window.gl = gl;

		WebGL.init(gl);
		this.colorProgram = WebGL.loadProgram('monitor/gui/shaders/color.vert', 'monitor/gui/shaders/color.frag', ['a_position'], ['u_color', 'u_position', 'u_rotation', 'u_scale', 'u_resolution', 'u_camera']);



		//var gl = getWebGLContext(canvas);
		if (!gl) {
			console.error('no GL');
			return;
		}
		this.gl = gl;

		// setup GLSL program
		var vertexShader = window.createShaderFromScriptElement(gl, '2d-vertex-shader');
		var fragmentShader = window.createShaderFromScriptElement(gl, '2d-fragment-shader');
		window.program = window.createProgram(gl, [vertexShader, fragmentShader]);
		gl.useProgram(window.program);

		// look up where the vertex data needs to go.
		var positionLocation = gl.getAttribLocation(window.program, 'a_position');

		// lookup uniforms
		var resolutionLocation = gl.getUniformLocation(window.program, 'u_resolution');
		//var colorLocation = gl.getUniformLocation(window.program, 'u_color');

		// set the resolution
		gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

		// Create a buffer.
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);*/
		var canvas = this.canvas;

		if (!WebGL.init(canvas)) {
			console.error('no GL');
			return;
		}
		window.gl = WebGL.gl;
		this.gl = WebGL.gl;
		Utils.init(WebGL);

		this.colorProgram = WebGL.loadProgram('monitor/gui/shaders/color.vert', 'monitor/gui/shaders/color.frag', ['a_position'], ['u_color', 'u_position', 'u_rotation', 'u_scale', 'u_resolution', 'u_camera']);
		this.textureProgram = WebGL.loadProgram(
			'monitor/gui/shaders/texture.vert', 'monitor/gui/shaders/texture_color.frag', ['a_position', 'a_texcoord'], ['u_resolution', 'u_position', 'u_scale', 'u_texture', 'u_color']
		);
		this.blendProgram = WebGL.loadProgram(
			'monitor/gui/shaders/texture.vert', 'monitor/gui/shaders/blend.frag', ['a_position', 'a_texcoord'], ['u_resolution', 'u_position', 'u_scale', 'u_texture1', 'u_texture2', 'u_a1', 'u_a2']
		);
		this.blurProgram = WebGL.loadProgram(
			'monitor/gui/shaders/texture.vert', 'monitor/gui/shaders/blur.frag', ['a_position', 'a_texcoord'], ['u_resolution', 'u_position', 'u_scale', 'u_texture', 'u_textureresolution', 'u_direction']
		);
		this.preglowProgram = WebGL.loadProgram(
			'monitor/gui/shaders/texture.vert', 'monitor/gui/shaders/preglow.frag', ['a_position', 'a_texcoord'], ['u_resolution', 'u_position', 'u_scale', 'u_texture']
		);

		this.rtScene = WebGL.createRenderTarget(1024, 1024);

		this.rtGlowSource = WebGL.createRenderTarget(1024, 1024);
		var res = 8;
		this.rtBlur1 = WebGL.createRenderTarget(1024 / res, 1024 / res);
		this.rtBlur2 = WebGL.createRenderTarget(1024 / res, 1024 / res);

	};



	ScreenComponent.prototype.drawing = function(step, gameState) {

		//focus
		var focusPoint = {
			x: 0,
			y: 0
		};

		var shake = 0;



		var activeShip = null;
		if (gameState.ships && gameState.ships.length > 0) {
			var len = gameState.ships.length;

			for (var i = 0; i < len; i++) {
				var ship = gameState.ships[i];
				if (ship.id === window.io.socket.sessionid) {
					activeShip = ship;
					break;
				}
			}
			if (activeShip) {
				focusPoint.x = activeShip.pos.x - this.SW * 0.5;
				focusPoint.y = activeShip.pos.y - this.SH * 0.5;
				if (focusPoint.x < 0) {
					focusPoint.x = 0;
				}
				if (focusPoint.x > gameState.SW - this.SW) {
					focusPoint.x = gameState.SW - this.SW;
				}
				if (focusPoint.y < 0) {
					focusPoint.y = 0;
				}
				if (focusPoint.y > gameState.SH - this.SH) {
					focusPoint.y = gameState.SH - this.SH;
				}
			}
		}


		var numExplosions = gameState.explosions.length;
		if (numExplosions > 0) {
			shake = (Math.random() - 0.5) * numExplosions * 30;
			focusPoint.y += shake;
			focusPoint.x += shake;
		}



		this.camera.setTargetPosition(focusPoint.x, focusPoint.y);



		if (!WebGL.useProgram(this.colorProgram)) {
			return;
		}

		var program = this.colorProgram;


		//window.tracker.outFixed('camera', focusPoint.x + ',' + focusPoint.y);
		//window.tracker.outFixed('ship', activeShip.pos.x + ',' + activeShip.pos.y);

		this.camera.update();


		WebGL.setRenderTarget(this.rtScene);
		WebGL.beginDraw([0.0, 0.0, 0.0, 1]);
		// debugger

		WebGL.bindUniform(program.uniforms.u_camera, this.camera.position);



		//if (shake > 0) {
		/*this.debug.draw(program, gameState.gravity);
		this.ships.draw(program, gameState.ships);
		this.asteroids.draw(program, gameState.asteroids);
		this.explosions.draw(program, gameState);*/
		//this.glowblur(shake * 0.1, shake * 0.1, 1);
		//this.glowblur(focusPoint.x - this.oldFocusPoint.x, focusPoint.y - this.oldFocusPoint.y, 1);
		/*} else {
			this.explosions.draw(program, gameState);

			this.glowblur(1.0, 1.0, 10);
		}*/
		/*this.debug.draw(program, gameState.gravity);
		this.ships.draw(program, gameState.ships);
		this.asteroids.draw(program, gameState.asteroids);
		this.explosions.draw(program, gameState);
		this.glowblur(1.0, 1.0, 10);*/
		this.debug.draw(program, gameState.gravity);
		this.explosions.draw(program, gameState);
		this.glowblur(1.0, 1.0, Math.random() * 15);

		WebGL.setRenderTarget(null);
		//WebGL.beginDraw([0.0, 0.0, 0.0, 1]);
		//Utils.drawRectangleColor(this.colorProgram, new Float32Array([0, 0]), new Float32Array([1, 1]), new Float32Array([0.0, 0.0, 0.0, 1.0]), new Float32Array([1, 1]));
		//WebGL.beginDraw([0.0, 0.0, 0.0, 1.0]);

		WebGL.useProgram(program);
		WebGL.bindUniform(program.uniforms.u_camera, this.camera.position);
		this.starGrid.draw(program);
		//this.debug.draw(program, gameState.gravity);
		this.ships.draw(program, gameState.ships);
		this.asteroids.draw(program, gameState.asteroids);
		//this.glowblur(shake * 0.02, shake * 0.02);


		WebGL.useProgram(program);
		//Utils.drawRectangleColor(this.colorProgram, [0, 0], [1, 1], [1.0, 0.0, 0.0, 0.1], [1, 1]);
		WebGL.bindUniform(program.uniforms.u_camera, this.camera.position);
		this.miniMap.draw(program, gameState, focusPoint, activeShip.id);


		this.oldFocusPoint = focusPoint;
	};

	ScreenComponent.prototype.glowblur = function(x, y, glow) {
		WebGL.getTextureFromRenderTarget(this.rtScene);


		Utils.renderTextureIntoTarget(this.preglowProgram, this.rtGlowSource, this.rtScene.frametexture);


		// blur using the glow map
		Utils.blurTextureIntoTarget(this.blurProgram, this.rtBlur1, this.rtGlowSource.frametexture, glmatrix.vec2.fromValues(x, 0.0));
		Utils.blurTextureIntoTarget(this.blurProgram, this.rtBlur2, this.rtBlur1.frametexture, glmatrix.vec2.fromValues(0.0, y));


		WebGL.setRenderTarget(null);
		WebGL.beginDraw([0.0, 0.0, 0.0, 1.0]);

		WebGL.useProgram(this.blendProgram);


		WebGL.bindUniform(this.blendProgram.uniforms.u_a2, glow);
		WebGL.bindUniform(this.blendProgram.uniforms.u_a1, 1);


		Utils.drawRectangleTexture(this.blendProgram, glmatrix.vec2.fromValues(0, 0), glmatrix.vec2.fromValues(1, 1), [this.rtScene.frametexture, this.rtBlur2.frametexture], glmatrix.vec2.fromValues(1, 1));


	};


	ScreenComponent.prototype.draw = function(polys, numPolys, red, green, blue, alpha) {
		var gl = this.gl;
		var colorLocation = gl.getUniformLocation(window.program, 'u_color');

		gl.uniform4f(colorLocation, red, green, blue, alpha);
		gl.bufferData(gl.ARRAY_BUFFER, new window.Float32Array(polys), gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, numPolys);

	};



	ScreenComponent.prototype.render = function() {
		this.baseRender('screen', {});

		var canvas = this.$el.find('canvas')[0];

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		//this.pixel = (canvas.width + canvas.height) * 0.0025;

		this.SW = parseInt(canvas.width / this.pixel, 10);
		this.SH = parseInt(canvas.height / this.pixel, 10);

		this.canvas = canvas;


		this.init();
		this.setup();
		this.resize();

	};

	ScreenComponent.prototype.resize = function() {
		var canvas = this.canvas;

		var width = window.innerWidth;
		var height = window.innerHeight;

		canvas.width = width;
		canvas.height = height;

		//this.pixel = (canvas.width + canvas.height) * 0.0025;

		this.screenWidth = parseInt(width / this.pixel, 10);
		this.screenHeight = parseInt(height / this.pixel, 10);


		this.camera.resize(width, height);
	};

	ScreenComponent.prototype.events = {
		'window': [{
			event: ['resize'],
			handler: 'resize'
		}]
	};

	return ScreenComponent;
});