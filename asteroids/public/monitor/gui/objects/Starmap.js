define(['monitor/gui/objects/Poly'], function(Poly) {
	function Starmap(pixel, SW, SH) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;
		this.starmap = [];



		for (var i = 0; i < this.SH; i++) {
			this.starmap.push(parseInt((this.SW * 2) * Math.random(), 10));
		}
	}

	Starmap.prototype.update = function(step, polys, focusPoint) {
		//this.starmap.shift();
		//this.starmap.push(parseInt(this.SW * Math.random(), 10));

		var offsetX = focusPoint.x * -0.5;
		var offsetY = focusPoint.y * -0.5;



		var pixel = this.pixel;
		var numPolys = 0;
		for (var i = 0; i < this.SH; i++) {
			numPolys += Poly.addS(this.starmap[i], i * 2, pixel, pixel, polys, false, Poly.TL, offsetX, offsetY);
		}

		return numPolys;


	};



	return Starmap;
});