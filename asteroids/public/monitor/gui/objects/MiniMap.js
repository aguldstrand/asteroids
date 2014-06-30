define(['monitor/gui/objects/Poly'], function(Poly) {
	function Starmap(pixel, SW, SH) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;



	}

	Starmap.prototype.updateShips = function(step, polys, gameModel) {
		var numPolys = 0;



		var numShips = gameModel.ships.length;
		for (var i = 0; i < numShips; i++) {
			var ship = gameModel.ships[i];
			numPolys += Poly.addS(0, 0, 5, 5, polys, false, false, ship.pos.x * 0.05, ship.pos.y * 0.05);
		}

		return numPolys;

	};

	Starmap.prototype.updateAsteroids = function(step, polys, gameModel) {
		var numPolys = 0;

		var numAsteroids = gameModel.asteroids.length;
		for (var j = 0; j < numAsteroids; j++) {
			var asteroids = gameModel.asteroids[j];
			numPolys += Poly.addS(0, 0, 2, 2, polys, false, false, asteroids.pos.x * 0.05, asteroids.pos.y * 0.05);
		}
		return numPolys;
	};



	return Starmap;
});