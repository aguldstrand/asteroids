var Base = require('./Base');

function RocketManager(options) {


	Base.call(this, options);
}

RocketManager.prototype = new Base();

RocketManager.prototype.update = function(secs) {
	
	var ships = this.gameModel.ships;
	var asteroids = this.gameModel.asteroids;

	for (var shipIndex = ships.length; shipIndex >= 0; shipIndex--) {

		var ship = ships[i];
		var rockets = ship.rockets;

		for (var rocketIndex = rockets.length; rocketIndex >= 0; rocketIndex--) {

			var rocket = rockets[rocketIndex];

			var target = rocket.target;
			if (!target) {
				var targets = this.getTargetsInRange(rocket.pos, rocket.scanRadius, ship.id);
				target = rocket.target = targets[0];
			}

			var direction = new Point();
			if (target) {
				direction = target.pos.subtract(rocket.pos);
			}
			
			this.applyNewPositions(rocket, direction, secs);


			if (this.checkCollisions(rockets, rocketIndex, ships, shipIndex)) {
				continue;
			}
			if (this.checkCollisions(rockets, rocketIndex, asteroids)) {
				continue;
			}

		}
	}

};

module.exports = RocketManager;