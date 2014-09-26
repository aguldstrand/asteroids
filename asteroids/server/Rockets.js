var Base = require('./Base');
var Point = require('../Point');

function Rockets(options) {



	/*** DEPRECATED ***/



	Base.call(this, options);
}

Rockets.prototype = new Base();

Rockets.prototype.move = function(secs) {

	var ships = this.gameModel.ships;
	var asteroids = this.gameModel.asteroids;

	for (var shipIndex = ships.length; shipIndex--;) {

		var ship = ships[shipIndex];
		var rockets = ship.rockets;

		for (var rocketIndex = rockets.length; rocketIndex--;) {

			var rocket = rockets[rocketIndex];

			var targetId = rocket.targetId;
			if (!targetId) {
				var targets = this.getTargetsInRange(rocket.pos, rocket.scanRadius, ship.id, true);
				targetId = rocket.targetId = (targets[0] || {}).id;
			}

			var direction = new Point();
			if (targetId) {

				var target;
				for (var i = 0; i < ships.length; i++) {
					if (ships[i].id === targetId) {
						target = ships[i];
						break;
					}
				}

				if (target) {
					direction = target.pos.subtract(rocket.pos);
				}
			}

			this.applyNewPositions(rocket, direction, secs);

			if (rocket.pos.x >= this.SW || rocket.pos.x < 0 || rocket.pos.y < 0 || rocket.pos.y >= this.SH) {
				ship.rockets.splice(rocketIndex, 1);
				continue;
			}


			if (this.checkCollisions(rockets, rocketIndex, ships, shipIndex)) {
				continue;
			}
			if (this.checkCollisions(rockets, rocketIndex, asteroids)) {
				continue;
			}

		}
	}

};

module.exports = Rockets;