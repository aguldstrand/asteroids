define(['monitor/gui/objects/Poly'], function(Poly) {
	function Explosions(pixel, SH, SW) {
		this.pixelPoints = [];
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;


	}

	Explosions.prototype.update = function(step, polys) {

		var numPolys = 0;
		var pixel = this.pixel;
		var piOver180 = Math.PI / 180;
		var pp = {
			p: {}
		};
		var explosions = [];
		if (Math.random() > 0.5) {

			explosions = [{

				size: Math.random() * 250,
				pos: {
					x: 400,
					y: 400
				}
			}];
		}

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

					numPolys += Poly.add(posX, posY, pixel, pixel, polys, false, Poly.TL);
					ppCnt++;

					if (explosionSize > 150) {
						numPolys += Poly.add(posX + 1, posY, pixel, pixel, polys, false, Poly.TL);
						numPolys += Poly.add(posX, posY + 1, pixel, pixel, polys, false, Poly.TL);
						numPolys += Poly.add(posX + 1, posY + 1, pixel, pixel, polys, false, Poly.TL);


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
			numPolys += Poly.add(pp.p.x, pp.p.y, pixel, pixel, polys, false, Poly.TL);


			if (pp.life < 0 || pp.p.y > this.SH) {
				ppLen--;
				this.pixelPoints.splice(p, 1);
			}
		}

		return numPolys;
	};

	return Explosions;
});