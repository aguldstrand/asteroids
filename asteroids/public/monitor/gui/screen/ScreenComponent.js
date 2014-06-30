define([
	'Bifrost',
	'monitor/gui/objects/Poly',
	'monitor/gui/objects/Starmap',
	'monitor/gui/objects/Ships',
	'monitor/gui/objects/Asteroids',
	'monitor/gui/objects/Debug',

	'monitor/gui/objects/Explosions'
], function(
	Bifrost,
	Poly,
	Starmap,
	Ships,
	Asteroids,
	Debug,
	Explosions) {

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

		this.starmap = new Starmap(this.pixel, this.SW, this.SH);
		this.explosions = new Explosions(this.pixel, this.SW, this.SH);
		this.ships = new Ships(this.pixel, this.SW, this.SH);
		this.asteroids = new Asteroids(this.pixel, this.SW, this.SH);
		this.debug = new Debug(this.pixel, this.SW, this.SH);
	};


	ScreenComponent.prototype.init = function() {
		// Get A WebGL context
		var canvas = this.canvas;
		var gl = canvas.getContext('webgl');
		window.gl = gl;
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
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
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
			focusPoint.x = gameState.ships[0].pos.x - this.SW * 0.5;
			focusPoint.y = gameState.ships[0].pos.y - this.SH * 0.5;
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


		Poly.setFocusPoint(focusPoint);

		//CLEAR
		polys = [];
		numPolys = Poly.addS(0, 0, this.SW * this.pixel, this.SH * this.pixel, polys);
		this.draw(polys, numPolys, 0, 0, 0, 1);

		//STARMAP
		polys = [];
		numPolys = this.starmap.update(step, polys, focusPoint);
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

		//FPS BAR
		polys = [];
		numPolys = Poly.add(500, 5, step * 10, 4, polys);
		this.draw(polys, numPolys, 1, 0, 0, 1);



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

		this.setup();
		this.init();

	};

	return ScreenComponent;
});