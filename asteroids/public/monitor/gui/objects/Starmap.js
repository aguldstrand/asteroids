define(['monitor/gui/objects/Poly'], function(Poly) {
	function Starmap(pixel, SW, SH, starSize, offSet) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;
		this.starmap = [];

		this.starSize = starSize;
		this.offSet = offSet;

		this.starHeights = this.SH / this.starSize;

		for (var i = 0; i < this.starHeights; i++) {
			this.starmap.push(parseInt((this.SW * 2) * Math.random(), 10));
		}
	}

	Starmap.prototype.update = function(step, polys, focusPoint) {
		//this.starmap.shift();
		//this.starmap.push(parseInt(this.SW * Math.random(), 10));

		var offsetX = focusPoint.x * this.offSet;
		var offsetY = focusPoint.y * this.offSet;



		var pixel = this.pixel;
		var numPolys = 0;
		for (var i = 0; i < this.starHeights; i++) {
			numPolys += Poly.addS(this.starmap[i], i * this.starSize * 2, this.starSize, this.starSize, polys, false, Poly.TL, offsetX, offsetY);
		}

		return numPolys;


	};



	return Starmap;
});