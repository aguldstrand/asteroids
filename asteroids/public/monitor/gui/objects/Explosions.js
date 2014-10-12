define(['hektorskraffs/webgl'], function(WebGL) {
	function Explosions(pixel, SH, SW) {
		this.pixelPoints = [];
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;

		this.expHash = {};
		this.load();

	}


	Explosions.prototype.load = function() {

		this.color = [0.0, 1.0, 1.0, 1];

	};


	Explosions.prototype.draw = function(program, gameModel) {


		/*lineVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
		var vertices = new Array(LINES * 6);

		var milliSeconds = ((time.getHours() * 3600) + (time.getMinutes() * 60) + time.getSeconds() * 1000) + time.getMilliseconds();

		for (j = 0; j < milliSeconds; j++) {
			random.Get();
		}

		// Initialize the lines
		for (var j = 0; j < LINES; j++) {

		}

		leader = Math.round((LINES / 2) + (random.Get() * (LINES / 2)));
		viewer = Math.round((LINES / 2) + (random.Get() * (LINES / 2)));

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		lineVertexPositionBuffer.itemSize = 3;
		lineVertexPositionBuffer.numItems = 2 * LINES;
*/


		var vertices = this.update(gameModel.explosions);

		var vertPol = WebGL.createPolygon(vertices);

		var uniforms = program.uniforms;



		var positionLocation = uniforms.u_position;
		var rotationLocation = uniforms.u_rotation;
		var scaleLocation = uniforms.u_scale;

		var DEG_TO_RAD = Math.PI / 180.0;

		var gl = WebGL.gl;



		WebGL.bindAttribBuffer(vertPol.vertexBuffer, program.attributes.a_position, vertPol.itemSize);

		WebGL.bindUniform(uniforms.u_color, this.color);


		//window.tracker.outFixed(s, epp[s].x + ' ' + epp[s].y + ' ' + epp[s].r);

		gl.uniform2f(positionLocation, 0, 0);
		gl.uniform1f(rotationLocation, 0);
		gl.uniform2f(scaleLocation, 1, 1);


		gl.drawArrays(gl.LINES, 0, vertPol.vertexCount);



	};

	Explosions.prototype.update = function(explosions) {
		var vertices = [];


		var piOver180 = Math.PI / 180;
		var pp = {
			p: {}
		};

		var explosion = null;
		var explosionSize = null;

		for (var i = 0; i < explosions.length; i++) {
			explosion = explosions[i];
			explosionSize = explosion.size;

			if (!this.expHash[explosion.pos.x + '_' + explosion.pos.y]) {
				this.expHash[explosion.pos.x + '_' + explosion.pos.y] = [explosion.size + 120, explosion.pos.x, explosion.pos.y];
			}
			//audioManager.addSound(AudioManager.TYPE_EXPLOSION, explosion.pos, explosion.size);


		}



		for (var key in this.expHash) {

			explosion = {
				pos: {
					x: this.expHash[key][1],
					y: this.expHash[key][2]
				}
			};
			explosionSize = this.expHash[key][0];

			for (var e = 0; e < explosionSize; e++) {



				var radi = Math.random() * explosionSize;
				var radius = Math.random() * 360;



				for (var r = 0; r < radi; r += 6) {

					var randSize = r;
					var posX = (Math.sin(radius * piOver180) * randSize) + explosion.pos.x;
					var posY = (Math.cos(radius * piOver180) * randSize) + explosion.pos.y;



					if (this.pixelPoints.length < 2000) {
						pp = {
							p: {}
						};
						//pp.color = 0xFFFFFF;

						pp.p.x = posX;
						pp.p.y = posY;
						pp.life = Math.random() * 100 + 20;
						pp.drift = Math.random() * 50 - 25;
						pp.fall = Math.random() * 20 - 10;
						this.pixelPoints.push(pp);

					}
				}

			}

			this.expHash[key][0] -= 10;

			if (this.expHash[key][0] < 1) {
				delete this.expHash[key];
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


			vertices.push(pp.p.x, pp.p.y, pp.p.x + pp.drift, pp.p.y + pp.fall);

			if (pp.life < 0) {
				ppLen--;
				this.pixelPoints.splice(p, 1);
			}
		}

		return vertices;


	};

	return Explosions;
});