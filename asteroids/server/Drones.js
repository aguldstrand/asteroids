var Base = require('./Base');
var Point = require('../Point');
var Bullet = require('../Bullet');

function Drones(options) {
	Base.call(this, options);

	this.droneRange = 100;
}

Drones.prototype = new Base();

Drones.prototype.update = function(secs) {

	var gameModel = this.gameModel;
	var ships = gameModel.ships;

	var TARGET_CLOSEST = 1;
	var TARGET_POWEFUL = 2;

	var numShips = ships.length;
	for (var i = 0; i < numShips; i++) {
		var ship = ships[i];

		var j;

		var targets = this.getTargetsInRange(ship.pos, this.droneRange, ship.id);

		var numTargets = targets.length;
		if (numTargets) {

			var maxHealth = 0;
			var secondMaxHealth = 0;

			for (j = 0; j < numTargets; j++) {
				var target = targets[j];

				if (!maxHealth || target.health > maxHealth.health || (target.maxHealth === maxHealth.health && target.distance < maxHealth.distance)) {
					secondMaxHealth = maxHealth;
					maxHealth = target;
				}
			}

			var strategy;

			// If we have a single powerful target within range, then all drones should target it
			if (maxHealth > secondMaxHealth * 2) {
				strategy = TARGET_POWEFUL;
			} else {
				// If we dont have a single powerful target then shoot the closest one.
				strategy = TARGET_CLOSEST;
			}


			var drones = ship.drones;
			var numDrones = drones.length;
			for (j = 0; j < numDrones; j++) {
				var drone = drones[i];

				var target = null;

				if (strategy === TARGET_CLOSEST) {
					for (j = 0; j < numTargets; j++) {
						var candidateTarget = targets[j];
						if (!target || candidateTarget.distance < target.distance) {
							target = candidateTarget;
						}
					}
				} else if (strategy === TARGET_POWEFUL) {
					target = maxHealth;
				}

				// Target selected!
				// * rotate to face it
				// * accelerate
				// * fire if facing the target and within firing range

				this.applyNewPositions(drone, drone.acc, secs);

			}
		} else {

			// No targets found, circle the ship

			// How to do this?

		}
	}

};

module.exports = Drones;