define(['monitor/gui/objects/Poly'], function(Poly) {
	function Starmap(pixel, SW, SH) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;
		this.starmap = [];
		for (var i = 0; i < this.SH; i++) {
			this.starmap.push(parseInt(this.SW * Math.random(), 10));
		}
	}

	Starmap.prototype.update = function(step, polys) {
		this.starmap.shift();
		this.starmap.push(parseInt(this.SW * Math.random(), 10));

		var pixel = this.pixel;
		var numPolys = 0;
		for (var i = 0; i < this.SH; i++) {
			numPolys += Poly.add(this.starmap[i], i, pixel, pixel, polys, false, Poly.TL);
		}

		return numPolys;


	};



	return Starmap;
});