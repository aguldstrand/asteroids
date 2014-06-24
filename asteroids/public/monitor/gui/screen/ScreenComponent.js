define(['Bifrost'], function(Bifrost) {

	function ScreenComponent(options) {
		if (options) {
			Bifrost.BaseComponent.call(this, options);

			this.canvas = null;
			this.SW = 0;
			this.SH = 0;
			this.pixel = 1;

			this.sx = 0;
			this.sy = 0;

			this.WW = 0;
			this.WH = 0;
			this.WX = 0;

			this.TL = 1;
			this.BL = 2;
			this.BR = 3;
			this.TR = 4;
			this.pixelPoints = [];
			this.___starMap = [];
		}
	}

	ScreenComponent.prototype = new Bifrost.BaseComponent();


	ScreenComponent.prototype.___createStarMap = function() {

		console.log('apa');
		for (var i = 0; i < this.SH; i++) {
			this.___starMap.push(parseInt(this.SW * Math.random(), 10));
		}
	};
	ScreenComponent.prototype.___updateStarMap = function() {
		this.___starMap.shift();
		this.___starMap.push(parseInt(this.SW * Math.random(), 10));
	};

	ScreenComponent.prototype.setup = function() {
		this.___createStarMap();
	};

	ScreenComponent.prototype.update = function() {
		this.___updateStarMap();
	};


	ScreenComponent.prototype.init = function() {
		// Get A WebGL context
		var canvas = this.canvas;
		var gl = canvas.getContext("webgl");
		//var gl = getWebGLContext(canvas);
		if (!gl) {
			console.error('no GL');
			return;
		}
		this.gl = gl;

		// setup GLSL program
		var vertexShader = window.createShaderFromScriptElement(gl, "2d-vertex-shader");
		var fragmentShader = window.createShaderFromScriptElement(gl, "2d-fragment-shader");
		window.program = window.createProgram(gl, [vertexShader, fragmentShader]);
		gl.useProgram(window.program);

		// look up where the vertex data needs to go.
		var positionLocation = gl.getAttribLocation(window.program, "a_position");

		// lookup uniforms
		var resolutionLocation = gl.getUniformLocation(window.program, "u_resolution");
		var colorLocation = gl.getUniformLocation(window.program, "u_color");

		// set the resolution
		gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

		// Create a buffer.
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	};

	ScreenComponent.prototype.clear = function() {
		var gl = this.gl;
		var pixel = this.pixel;
		var colorLocation = gl.getUniformLocation(window.program, "u_color");
		var polys = [];
		var polysAdded = 0;

		polys = [];
		gl.uniform4f(colorLocation, 0, 0, 0, 1);
		polysAdded = this.addPolys(0, 0, this.SW * pixel, this.SH * pixel, polys);
		gl.bufferData(gl.ARRAY_BUFFER, new window.Float32Array(polys), gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, polysAdded);


	};

	ScreenComponent.prototype.draw = function(step) {
		this.clear();
		this.update();

		var gl = this.gl;
		var pixel = this.pixel;
		var colorLocation = gl.getUniformLocation(window.program, "u_color");

		var polys = [];
		var numPolys = 0;



		polys = [];
		numPolys = 0;


		for (var i = 0; i < this.SH; i++) {

			numPolys += this.addPolys(this.___starMap[i], i, pixel, pixel, polys, false, this.TL);
		}

		gl.uniform4f(colorLocation, 255, 255, 255, 1);
		gl.bufferData(gl.ARRAY_BUFFER, new window.Float32Array(polys), gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, numPolys);



		polys = [];
		numPolys = this.drawBigExplosions(polys);
		gl.uniform4f(colorLocation, 255, 0, 0, 1);
		gl.bufferData(gl.ARRAY_BUFFER, new window.Float32Array(polys), gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, numPolys);



		var numStatPolys = 0;
		polys = [];
		numStatPolys += this.addPolys(500, 5, step * 10, 4, polys);



		gl.uniform4f(colorLocation, 1, 0, 0, 1);
		gl.bufferData(gl.ARRAY_BUFFER, new window.Float32Array(polys), gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, numStatPolys);



	};


	ScreenComponent.prototype.drawExplosions = function(polys) {
		var numPolys = 0;
		var pixel = this.pixel;
		var piOver180 = Math.PI / 180;
		var explosions = [{
			size: 50,
			pos: {
				x: 100,
				y: 100
			}
		}, {
			size: 250,
			pos: {
				x: 400,
				y: 400
			}
		}];

		for (var i = 0; i < explosions.length; i++) {
			var explosion = explosions[i];
			var explosionSize = explosion.size;



			for (var e = 0; e < explosionSize; e++) {
				var radius = Math.random() * 360;
				var randSize = Math.random() * explosionSize * 0.3;
				var posX = (Math.sin(radius * piOver180) * randSize) + explosion.pos.x;
				var posY = (Math.cos(radius * piOver180) * randSize) + explosion.pos.y;

				numPolys += this.addPolys(posX, posY, pixel, pixel, polys);


				if (explosionSize > 150) {
					numPolys += this.addPolys(posX + 1, posY, pixel, pixel, polys);
					numPolys += this.addPolys(posX, posY + 1, pixel, pixel, polys);
					numPolys += this.addPolys(posX + 1, posY + 1, pixel, pixel, polys);
				}
			}
		}

		return numPolys;

	};

	ScreenComponent.prototype.drawBigExplosions = function(polys) {
		var numPolys = 0;
		var pixel = this.pixel;
		var piOver180 = Math.PI / 180;
		var pp = {
			p: {}
		};
		var explosions = [];
		//if (Math.random() > 0.5) {

		explosions = [{
			size: Math.random() * 250,
			pos: {
				x: 400,
				y: 400
			}
		}];
		//}

		var ppCnt = 0;
		for (var i = 0; i < explosions.length; i++) {
			var explosion = explosions[i];
			var explosionSize = explosion.size;

			//audioManager.addSound(AudioManager.TYPE_EXPLOSION, explosion.pos, explosion.size);

			for (var e = 0; e < explosionSize; e++) {

				var radi = Math.random() * explosionSize;
				var radius = Math.random() * 360;

				for (var r = 0; r < radi; r += 6) {

					var randSize = r;
					var posX = (Math.sin(radius * piOver180) * randSize) + explosion.pos.x;
					var posY = (Math.cos(radius * piOver180) * randSize) + explosion.pos.y;

					numPolys += this.addPolys(posX, posY, pixel, pixel, polys, false, this.TL);
					ppCnt++;

					if (explosionSize > 150) {
						numPolys += this.addPolys(posX + 1, posY, pixel, pixel, polys, false, this.TL);
						numPolys += this.addPolys(posX, posY + 1, pixel, pixel, polys, false, this.TL);
						numPolys += this.addPolys(posX + 1, posY + 1, pixel, pixel, polys, false, this.TL);


						if (ppCnt > 1) {
							ppCnt = 0;
							if (this.pixelPoints.length < 4000) {
								pp = {
									p: {}
								};
								//pp.color = 0xFFFFFF;
								pp.p.x = posX;
								pp.p.y = posY;
								pp.life = Math.random() * 100 + 20;
								pp.drift = Math.random() * 10 - 5;
								pp.fall = Math.random() * 3 + 2;
								this.pixelPoints.push(pp);
							}
						}
					}
				}

			}
		}


		/*if (numExplosions > 0) {
			GAME_BMP.x = Math.random() > .5 ? numExplosions : -numExplosions;
			GAME_BMP.y = Math.random() > .5 ? numExplosions : -numExplosions;
		} else {
			GAME_BMP.x = 0;
			GAME_BMP.y = 0;
		}*/

		var ppLen = this.pixelPoints.length;



		for (var p = 0; p < ppLen; p++) {

			pp = this.pixelPoints[p];
			pp.p.y += pp.fall;
			pp.p.x += pp.drift;

			pp.life--;

			if (pp.drift < 0) {
				pp.drift++;
			} else if (pp.drift > 0) {
				pp.drift--;
			}

			//pp.color -= .00001;
			numPolys += this.addPolys(pp.p.x, pp.p.y, pixel, pixel, polys, false, this.TL);


			if (pp.life < 0 || pp.p.y > this.SH) {
				ppLen--;
				this.pixelPoints.splice(p, 1);
			}
		}

		return numPolys;
	};



	ScreenComponent.prototype.addPolys = function(x, y, width, height, polys, rotation, part) {



		if (rotation) {

			var originX = x + width * 0.5;
			var originY = y + height * 0.5;

			var topleftx = x;
			var toplefty = y;

			var bottomleftx = x;
			var bottomlefty = y + height;

			var toprightx = x + width;
			var toprighty = y;

			var bottomrightx = x + width;
			var bottomrighty = y + height;

			var rot = {};

			rot = this.rotate(topleftx, toplefty, originX, originY, rotation);
			topleftx = rot.x;
			toplefty = rot.y;

			rot = this.rotate(bottomleftx, bottomlefty, originX, originY, rotation);
			bottomleftx = rot.x;
			bottomlefty = rot.y;

			rot = this.rotate(toprightx, toprighty, originX, originY, rotation);
			toprightx = rot.x;
			toprighty = rot.y;

			rot = this.rotate(bottomrightx, bottomrighty, originX, originY, rotation);
			bottomrightx = rot.x;
			bottomrighty = rot.y;



			polys.push(
				topleftx, toplefty,
				toprightx, toprighty,
				bottomleftx, bottomlefty,
				bottomleftx, bottomlefty,
				bottomrightx, bottomrighty,
				toprightx, toprighty);
			return 6;
		} else {

			var x1 = x + this.sx;
			var x2 = x1 + width;
			var y1 = y + this.sy;
			var y2 = y1 + height;


			if (part) {
				switch (part) {
					case this.TL:
						polys.push(
							x1, y1,
							x2, y1,
							x1, y2);
						break;
					case this.TR:
						polys.push(
							x1, y1,
							x2, y1,
							x2, y2);
						break;
					case this.BL:
						polys.push(
							x1, y1,
							x1, y2,
							x2, y2);
						break;
					case this.BR:
						polys.push(
							x1, y2,
							x2, y1,
							x2, y2);
						break;
				}


				return 3;
			} else {


				polys.push(
					x1, y1,
					x2, y1,
					x1, y2,
					x1, y2,
					x2, y1,
					x2, y2);


				return 6;
			}
		}



	};
	ScreenComponent.prototype.rotate = function(pointX, pointY, originX, originY, angle) {
		angle = angle * Math.PI / 180.0;
		return {
			x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
			y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
		};
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
		this.clear();
		this.draw();
	};

	return ScreenComponent;
});