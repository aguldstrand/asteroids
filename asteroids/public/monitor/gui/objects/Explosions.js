define(['monitor/gui/objects/Poly'], function(Poly) {
	function Explosions(pixel, SH, SW) {
		this.pixelPoints = [];
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;

		this.expHash = {};
	}

	Explosions.prototype.update = function(step, polys, explosions) {

		var numPolys = 0;
		var pixel = this.pixel;
		var piOver180 = Math.PI / 180;
		var pp = {
			p: {}
		};

		var explosion = null;
		var explosionSize = null;
		var ppCnt = 0;
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



					numPolys += Poly.add(posX, posY, pixel, pixel, polys, false, Poly.TL);
					ppCnt++;

					if (explosionSize > 150) {
						numPolys += Poly.add(posX + 2, posY, pixel, pixel, polys, false, Poly.TL);
						numPolys += Poly.add(posX, posY + 2, pixel, pixel, polys, false, Poly.TL);
						numPolys += Poly.add(posX + 2, posY + 2, pixel, pixel, polys, false, Poly.TL);


						if (ppCnt > 1) {
							ppCnt = 0;
							if (this.pixelPoints.length < 6000) {
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

			//pp.color -= .00001;
			numPolys += Poly.add(pp.p.x, pp.p.y, pixel, pixel, polys, false, Poly.TL);


			if (pp.life < 0) {
				ppLen--;
				this.pixelPoints.splice(p, 1);
			}
		}

		return numPolys;
	};

	return Explosions;
});