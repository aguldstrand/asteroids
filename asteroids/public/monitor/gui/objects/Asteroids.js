define(['monitor/gui/objects/Poly'], function(Poly) {
	function Asteroids(pixel, SW, SH) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;
		this.asteroids = [];

		this.p = {
			x: 0,
			y: 0
		};

	}
	Asteroids.prototype.rotate_point = function(point, angle) {
		angle = angle * Math.PI / 180.0;
		return {
			x: Math.cos(angle) * point.x - Math.sin(angle) * point.y,
			y: Math.sin(angle) * point.x + Math.cos(angle) * point.y
		};
	};
	Asteroids.prototype.update = function(step, polys, asteroids) {
		var numPolys = 0;
		var pixel = this.pixel;
		var len = asteroids.length;
		for (var i = 0; i < len; i++) {
			var asteroid = asteroids[i];

			this.p.x = asteroid.diam;



			for (var j = 0; j < 8; j++) {



				var ap = this.rotate_point(this.p, j * 45 - 45);

				var rp = this.rotate_point(this.p, j * 45);
				//ap.x = ap.x + Math.random() * asteroid.diam;
				//rp.x = rp.x + Math.random() * asteroid.diam;


				numPolys += Poly.addR(asteroid.pos.x, asteroid.pos.y, ap.x, ap.y, rp.x, rp.y, /*(Math.random() - 0.5) * asteroid.diam, (Math.random() - 0.5) * asteroid.diam*/ 0, 0, polys, 1);
			}
		}


		return numPolys;
	};



	return Asteroids;
});