var Base = require('./Base');
var Point = require('../Point');
var Bullet = require('../Bullet');

function Drones(options) {
	Base.call(this, options);

	this.droneRange = 100; // px
	this.rotationSpeed = 90; // 90°/s
	this.maxAcceleration = 9000; // 900px/s²
}

Drones.prototype = new Base();

Drones.prototype.update = function(secs) {

	var gameModel = this.gameModel;
	var ships = gameModel.ships;

	var TARGET_CLOSEST = 1;
	var TARGET_POWERFUL = 2;

	var numShips = ships.length;
	for (var i = 0; i < numShips; i++) {
		var ship = ships[i];

		var j;

		var targets = this.getTargetsInRange(ship.pos, this.droneRange, ship.id);

		var numTargets = targets.length;
		if (false && numTargets) { // diable targeting until basic following works

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
				strategy = TARGET_POWERFUL;
			} else {
				// If we dont have a single powerful target then shoot the closest one.
				strategy = TARGET_CLOSEST;
			}


			var drones = ship.drones;
			var numDrones = drones.length;
			for (j = 0; j < numDrones; j++) {
				var drone = drones[j];

				drone.pos.x = drone.pos.x || ship.pos.x;
				drone.pos.y = drone.pos.y || ship.pos.y;
				drone.vel.x = drone.vel.x || ship.vel.x;
				drone.vel.y = drone.vel.y || 0;
				drone.acc.x = drone.acc.x || 0;
				drone.acc.y = drone.acc.y || 0;

				var target = null;

				if (strategy === TARGET_CLOSEST) {
					for (var k = 0; k < numTargets; k++) {
						var candidateTarget = targets[k];
						if (!target || candidateTarget.distance < target.distance) {
							target = candidateTarget;
						}
					}
				} else if (strategy === TARGET_POWERFUL) {
					target = maxHealth;
				}

				// Target selected!
				// * rotate to face it
				var droneAngle = drone.rot;
				var angleToTarget = Math.atan2(
					drone.pos.y - target.pos.y,
					drone.pos.x - target.pos.x);

				var angleDelta = droneAngle - angleToTarget;
				var angleToTarget = Math.abs(angleDelta);
				if (angleToTarget > 5) {
					var direction = angleDelta > 0 ? 1 : -1;
					drone.rot += secs * direction * this.rotationSpeed;
				}

				// * accelerate
				if (angleToTarget < 45) {
					drone.acc.x += (Math.cos(this.degreesToRadians(ship.rot)) * this.speed);
					drone.acc.y += (Math.sin(this.degreesToRadians(ship.rot)) * this.speed);
				}

				// * fire if facing the target and within firing range
				if (angleToTarget <= 5) {

				}

				// debug
				var angle = Math.random() * Math.PI * 2;
				drone.pos.x = ship.pos.x + Math.cos(angle) * this.droneRange;
				drone.pos.y = ship.pos.y + Math.sin(angle) * this.droneRange;

				this.applyNewPositions(drone, drone.acc, secs);
			}
		} else {

			// No targets found, circle the ship
			// How to do this?

			var drones = ship.drones;
			var numDrones = drones.length;
			for (j = 0; j < numDrones; j++) {
				var drone = drones[j];

				drone.pos.x = drone.pos.x || ship.pos.x;
				drone.pos.y = drone.pos.y || ship.pos.y;
				drone.vel.x = drone.vel.x || ship.vel.x;
				drone.vel.y = drone.vel.y || 0;
				drone.acc.x = 0;
				drone.acc.y = 0;

				var dest = ship.pos.add(ship.vel.multiply(-1).normalize(100));

				/*
				drone.acc = dest.subtract(drone.pos);
				if (drone.acc.length() > this.maxAcceleration) {
					drone.acc = drone.acc.normalize(this.maxAcceleration);
				}
				*/

				drone.vel = follow(ship, drone, ship.vel.length() + 100, 100);

				drone.rot = this.radiansToDegrees(Math.atan2(drone.vel.y, drone.vel.x));

				this.applyNewPositions(drone, drone.acc, secs);
			}
		}
	}
};

function follow(target, subject, maxVel, breakingDistance) {
	var dest = target.pos.add(target.vel.multiply(-1).normalize(100)); // 100px behind the target
	var direction = dest.subtract(subject.pos);
	var distance = direction.length();

	console.log(distance);

	var result;

	if (distance < 5) { // match speed if close enough
		result = direction.normalize(target.vel.length());
	} else if (distance < 50) { // start to decrease speed
		var targetSpeed = target.vel.length();
		result = direction.normalize(((maxVel - targetSpeed) * direction.length() / 50) + targetSpeed);
	} else {
		result = direction.normalize(maxVel);
	}

	return result;
}

module.exports = Drones;