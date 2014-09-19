define(['monitor/gui/objects/Poly'], function(Poly) {
	function Debug(pixel, SW, SH) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;


		this.p = {
			x: 0,
			y: 0
		};

	}
	Debug.prototype.rotate_point = function(point, angle) {
		angle = angle * Math.PI / 180.0;
		return {
			x: Math.cos(angle) * point.x - Math.sin(angle) * point.y,
			y: Math.sin(angle) * point.x + Math.cos(angle) * point.y
		};
	};
	Debug.prototype.update = function(step, polys, gravity, focusPoint) {
		var numPolys = 0;
		//var pixel = this.pixel;

		var gravityRes = 50;



		var yMax = parseInt(3000 / gravityRes, 10);
		var xMax = parseInt(3000 / gravityRes, 10);
		var offset = 10;
		for (var y = 0; y < yMax; y++) {
			for (var x = 0; x < xMax; x++) {

				var g = gravity[x + y * xMax];


				if (Math.abs(g.x) > 15 || Math.abs(g.y) > 15) {

					numPolys += Poly.addR(x * gravityRes, y * gravityRes, 0, 0, 2, 2, g.x * 0.1, g.y * 0.1 + 4, polys, 1);

					if (g.warp) {
						numPolys += Poly.addR(x * gravityRes + 5, y * gravityRes + 5, 0, 0, 2, 2, g.x * 0.3 - 4, g.y * 0.3 + -4, polys, 1);
					}
				}
				//numPolys += Poly.addR(x * gravityRes, y * gravityRes, 0, 0, 2, 2, 0, 2, polys, 1);
			}
		}
		//numPolys += Poly.addR(100, 100, 0, 0, 11, 11, 0, 100, polys, 1);
		//numPolys += Poly.add(100, 100, 100, 100, polys);

		return numPolys;
	};



	return Debug;
});