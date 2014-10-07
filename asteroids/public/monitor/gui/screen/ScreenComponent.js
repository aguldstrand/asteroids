define([
	'Bifrost',
	'monitor/gui/objects/Poly',
	'monitor/gui/objects/Starmap',
	'monitor/gui/objects/Ships',
	'monitor/gui/objects/Asteroids',
	'monitor/gui/objects/Debug',
	'monitor/gui/objects/MiniMap',

	'monitor/gui/objects/Camera',

	'monitor/gui/objects/Explosions',
	'hektorskraffs/webgl'
], function(
	Bifrost,
	Poly,
	Starmap,
	Ships,
	Asteroids,
	Debug,
	MiniMap,

	Camera,

	Explosions,
	WebGL) {

	function ScreenComponent(options) {
		if (options) {
			Bifrost.BaseComponent.call(this, options);

			this.canvas = null;
			this.SW = 0;
			this.SH = 0;
			this.pixel = 1;


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

		this.colorProgram = WebGL.loadProgram('monitor/gui/shaders/color.vert', 'monitor/gui/shaders/color.frag', ['a_position'], ['u_color', 'u_position', 'u_rotation', 'u_scale', 'u_resolution', 'u_camera']);

	};



	ScreenComponent.prototype.update = function(step, gameState) {


		var polys = [];
		var numPolys = 0;



		//focus
		var focusPoint = {
			x: 0,
			y: 0
		};
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
			focusPoint.y += (Math.random() - 0.5) * numExplosions * 30;
			focusPoint.x += (Math.random() - 0.5) * numExplosions * 30;
		}


		Poly.setFocusPoint(focusPoint);

		//CLEAR
		polys = [];
		numPolys = Poly.addS(0, 0, this.SW * this.pixel, this.SH * this.pixel, polys);
		this.draw(polys, numPolys, 0, 0, 0, 1);

		//STARMAP
		polys = [];
		numPolys = this.starmap1.update(step, polys, focusPoint);
		this.draw(polys, numPolys, 1, 1, 0, 1);

		polys = [];
		numPolys = this.starmap2.update(step, polys, focusPoint);
		this.draw(polys, numPolys, 1, 1, 0, 1);

		//EXPLOSIONS
		polys = [];
		numPolys = this.explosions.update(step, polys, gameState.explosions);
		this.draw(polys, numPolys, 1, 1, 0, 1);



		//Asteroids
		polys = [];
		numPolys = this.asteroids.update(step, polys, gameState.asteroids);
		this.draw(polys, numPolys, 0.5, 0.5, 0.5, 1);


		//gravity - debug
		polys = [];
		numPolys = this.debug.update(step, polys, gameState.gravity, focusPoint);
		this.draw(polys, numPolys, 1, 0, 0, 1);


		//minimap BG
		/*polys = [];
		numPolys = Poly.addS(0, 0, 150, 150, polys, false, false, 0, 0);
		this.draw(polys, numPolys, 0, 0, 0, 0.8);*/

		//Minimap
		polys = [];
		numPolys = this.miniMap.updateAsteroids(step, polys, gameState);
		this.draw(polys, numPolys, 0.5, 0.5, 0.5, 1);

		polys = [];
		numPolys = this.miniMap.updateShips(step, polys, gameState);
		this.draw(polys, numPolys, 0, 1, 0, 1);



		//FPS BAR
		polys = [];
		numPolys = Poly.add(500, 5, step * 10, 4, polys);
		this.draw(polys, numPolys, 1, 0, 0, 1);



	};

	ScreenComponent.prototype.drawing = function(step, gameState) {

		//focus
		var focusPoint = {
			x: 0,
			y: 0
		};
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
			focusPoint.y += (Math.random() - 0.5) * numExplosions * 30;
			focusPoint.x += (Math.random() - 0.5) * numExplosions * 30;
		}



		this.camera.setTargetPosition(focusPoint.x, focusPoint.y);



		if (!WebGL.useProgram(this.colorProgram)) {
			return;
		}

		var program = this.colorProgram;


		//window.tracker.outFixed('camera', focusPoint.x + ',' + focusPoint.y);
		//window.tracker.outFixed('ship', activeShip.pos.x + ',' + activeShip.pos.y);

		this.camera.update();

		WebGL.beginDraw([0.0, 0.0, 0.0, 1.0]);


		WebGL.bindUniform(program.uniforms.u_camera, this.camera.position);

		this.debug.draw(program, gameState.gravity);
		this.ships.draw(program, gameState.ships);
		this.asteroids.draw(program, gameState.asteroids);
		this.miniMap.draw(program, gameState, focusPoint, activeShip.id);
		this.explosions.draw(program, gameState);


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