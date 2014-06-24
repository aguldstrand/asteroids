define([
	'Bifrost',
	'monitor/gui/objects/Poly',
	'monitor/gui/objects/Starmap',
	'monitor/gui/objects/Ships',

	'monitor/gui/objects/Explosions'
], function(
	Bifrost,
	Poly,
	Starmap,
	Ships,
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



	ScreenComponent.prototype.update = function(step) {


		var polys = [];
		var numPolys = 0;

		//CLEAR
		polys = [];
		numPolys = Poly.add(0, 0, this.SW * this.pixel, this.SH * this.pixel, polys);
		this.draw(polys, numPolys, 0, 0, 0, 1);

		//STARMAP
		polys = [];
		numPolys = this.starmap.update(step, polys);
		this.draw(polys, numPolys, 1, 1, 0, 1);

		//EXPLOSIONS
		polys = [];
		numPolys = this.explosions.update(step, polys);
		this.draw(polys, numPolys, 1, 1, 0, 1);

		//SHIPS
		polys = [];
		numPolys = this.ships.update(step, polys);
		this.draw(polys, numPolys, 0, 1, 0, 1);



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

		canvas.width = 800 - 20;
		canvas.height = 800 - 40;

		//this.pixel = (canvas.width + canvas.height) * 0.0025;

		this.SW = parseInt(canvas.width / this.pixel, 10);
		this.SH = parseInt(canvas.height / this.pixel, 10);


		this.WW = this.SW * 5;
		this.WH = this.SH;
		this.canvas = canvas;

		this.setup();
		this.init();

	};

	return ScreenComponent;
});