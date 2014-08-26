define([
	'Bifrost',

	'glmatrix',

	'monitor/gui/objects/Camera',

	'monitor/gui/objects/Poly',
	'monitor/gui/objects/Starmap',
	'monitor/gui/objects/Ships',
	'monitor/gui/objects/Asteroids',
	'monitor/gui/objects/Debug',
	'monitor/gui/objects/MiniMap',

	'monitor/gui/objects/Explosions',

	'hektorskraffs/webgl'
], function(
	Bifrost,

	glmatrix,

	Camera,

	Poly,
	Starmap,
	Ships,
	Asteroids,
	Debug,
	MiniMap,
	Explosions,

	WebGL) {


	// define local imports
	var mat4 = glmatrix.mat4;
	var vec3 = glmatrix.vec3;



	function ScreenComponent(options) {
		if (options) {
			Bifrost.BaseComponent.call(this, options);

			this.canvas = null;
			this.screenWidth = 0;
			this.screenHeight = 0;
			this.pixel = 1;
		}
	}

	ScreenComponent.prototype = new Bifrost.BaseComponent();


	ScreenComponent.prototype.setup = function() {
		Poly.setFocusPoint({x: 0, y: 0});

		this.starmap1 = new Starmap(this.pixel, this.screenWidth, this.screenHeight, 2, -0.4);
		this.starmap2 = new Starmap(this.pixel, this.screenWidth, this.screenHeight, 4, -0.6);
		this.explosions = new Explosions(this.pixel, this.screenWidth, this.screenHeight);
		this.ships = new Ships(this.pixel, this.screenWidth, this.screenHeight);
		this.asteroids = new Asteroids(this.pixel, this.screenWidth, this.screenHeight);
		this.debug = new Debug(this.pixel, this.screenWidth, this.screenHeight);
		this.miniMap = new MiniMap(this.pixel, this.screenWidth, this.screenHeight);

		this.camera = new Camera();
	};


	ScreenComponent.prototype.init = function() {
		// Get A WebGL context
		var canvas = this.canvas;

		if (!WebGL.init(canvas)) {
			console.error('no GL');
			return;
		}
		window.gl = WebGL.gl;
		this.gl = WebGL.gl;

		this.colorProgram = WebGL.loadProgram('monitor/gui/shaders/color.vert', 'monitor/gui/shaders/color.frag', ['a_position'], ['u_color', 'u_position', 'u_rotation', 'u_scale', 'u_resolution', 'u_camera']);
		// this.colorProgram = WebGL.loadProgram('monitor/gui/shaders/color_3d.vert', 'monitor/gui/shaders/color.frag', ['a_position'], ['u_color', 'u_wvp']);
	};



	ScreenComponent.prototype.update = function(step, gameState) {
		var polys = [];
		var numPolys = 0;



		//focus
		var focusPoint = {
			x: 0,
			y: 0
		};
		if (gameState.ships && gameState.ships.length > 0) {
			var len = gameState.ships.length;
			var activeShip = null;
			for (var i = 0; i < len; i++) {
				var ship = gameState.ships[i];
				if (ship.id === window.io.socket.sessionid) {
					activeShip = ship;
					break;
				}
			}
			if (activeShip) {
				focusPoint.x = activeShip.pos.x - this.screenWidth * 0.5;
				focusPoint.y = activeShip.pos.y - this.screenHeight * 0.5;
				if (focusPoint.x < 0) {
					focusPoint.x = 0;
				}
				if (focusPoint.x > gameState.SW - this.screenWidth) {
					focusPoint.x = gameState.SW - this.screenWidth;
				}
				if (focusPoint.y < 0) {
					focusPoint.y = 0;
				}
				if (focusPoint.y > gameState.SH - this.screenHeight) {
					focusPoint.y = gameState.SH - this.screenHeight;
				}
			}
		}


		Poly.setFocusPoint(focusPoint);

		this.camera.setTargetPosition(focusPoint.x, focusPoint.y);

		//CLEAR
		/*polys = [];
		numPolys = Poly.addS(0, 0, this.screenWidth * this.pixel, this.screenHeight * this.pixel, polys);
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

		//SHIPS
		polys = [];
		numPolys = this.ships.update(step, polys, gameState.ships);
		this.draw(polys, numPolys, 0, 1, 0, 1);

		//Asteroids
		polys = [];
		numPolys = this.asteroids.update(step, polys, gameState.asteroids);
		this.draw(polys, numPolys, 0.5, 0.5, 0.5, 1);


		//gravity - debug
		polys = [];
		//numPolys = this.debug.update(step, polys, gameState.gravity);
		//this.draw(polys, numPolys, 1, 0, 0, 1);


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
		this.draw(polys, numPolys, 1, 0, 0, 1);*/


		this.gameState = gameState;
		this.draw();
	};


	ScreenComponent.prototype.draw = function(polys, numPolys, red, green, blue, alpha) {
		if (!WebGL.useProgram(this.colorProgram)) {
			return;
		}

		var program = this.colorProgram;
		var camera = this.camera;
		var gameState = this.gameState;

		this.camera.update();

		WebGL.beginDraw([0.0, 0.0, 0.0, 1.0]);


		WebGL.bindUniform(program.uniforms.u_camera, this.camera.position);

		this.asteroids.draw(program, gameState.asteroids);
		this.ships.draw(program, gameState.ships);
		// this.asteroids.draw3d(program, camera, gameState.asteroids);

		/*var gl = this.gl;
		var colorLocation = gl.getUniformLocation(window.program, 'u_color');

		gl.uniform4f(colorLocation, red, green, blue, alpha);
		gl.bufferData(gl.ARRAY_BUFFER, new window.Float32Array(polys), gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, numPolys);*/

	};



	ScreenComponent.prototype.render = function() {
		this.baseRender('screen', {});

		var canvas = this.$el.find('canvas')[0];
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

		WebGL.resize(width, height);
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