define(['monitor/gui/objects/Poly'], function(Poly) {
	function Starmap(pixel, SW, SH) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;



	}

	Starmap.prototype.update = function(step, polys, gameModel) {
		var numPolys = 0;

		var numShips = gameModel.ships.length;
		for (var i = 0; i < numShips; i++) {
			var ship = gameModel.ships[i];
			numPolys += Poly.addS(ship.pos.x * 0.05, ship.pos.y * 0.05, 2, 2, polys, false, Poly.TL);
		}

		return numPolys;


	};



	return Starmap;
});