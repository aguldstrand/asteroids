define(function() {
	function Poly() {

	}

	Poly.TL = 1;
	Poly.BL = 2;
	Poly.BR = 3;
	Poly.TR = 4;

	Poly.addR = function(originX, originY, x1, y1, x2, y2, x3, y3, polys, scale) {
		polys.push(
			x1 * scale + originX, y1 * scale + originY,
			x2 * scale + originX, y2 * scale + originY,
			x3 * scale + originX, y3 * scale + originY);
		return 3;
	};

	Poly.add = function(x, y, width, height, polys, rotation, part, originX, originY) {



		if (rotation) {

			originX = originX || x + width * 0.5;
			originY = originY || y + height * 0.5;

			var topleftx = x;
			var toplefty = y;

			var bottomleftx = x;
			var bottomlefty = y + height;

			var toprightx = x + width;
			var toprighty = y;

			var bottomrightx = x + width;
			var bottomrighty = y + height;

			var rot = {};

			rot = Poly.rotate(topleftx, toplefty, originX, originY, rotation);
			topleftx = rot.x;
			toplefty = rot.y;

			rot = Poly.rotate(bottomleftx, bottomlefty, originX, originY, rotation);
			bottomleftx = rot.x;
			bottomlefty = rot.y;

			rot = Poly.rotate(toprightx, toprighty, originX, originY, rotation);
			toprightx = rot.x;
			toprighty = rot.y;

			rot = Poly.rotate(bottomrightx, bottomrighty, originX, originY, rotation);
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

			var x1 = x + 0;
			var x2 = x1 + width;
			var y1 = y + 0;
			var y2 = y1 + height;


			if (part) {
				switch (part) {
					case Poly.TL:
						polys.push(
							x1, y1,
							x2, y1,
							x1, y2);
						break;
					case Poly.TR:
						polys.push(
							x1, y1,
							x2, y1,
							x2, y2);
						break;
					case Poly.BL:
						polys.push(
							x1, y1,
							x1, y2,
							x2, y2);
						break;
					case Poly.BR:
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
	Poly.rotate = function(pointX, pointY, originX, originY, angle) {
		angle = angle * Math.PI / 180.0;
		return {
			x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
			y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
		};
	};


	return Poly;
});