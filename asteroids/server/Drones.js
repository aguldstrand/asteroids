var Base = require('./Base');
var Point = require('../Point');
var Bullet = require('../Bullet');

function Drones(options) {
	Base.call(this, options);

	this.droneRange = 300; // px
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

		ship.pos.x %= this.SW;
		ship.pos.y %= this.SH;
		var targets = this.getTargetsInRange(ship.pos, this.droneRange, ship.id);

		var numTargets = targets.length;
		if (numTargets) { // diable targeting until basic following works

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

				drone.pos.x = drone.pos.x || ship.pos.x + 10;
				drone.pos.y = drone.pos.y || ship.pos.y + 10;
				drone.vel.x = drone.vel.x || 0;
				drone.vel.y = drone.vel.y || 0;
				drone.acc.x = 0;
				drone.acc.y = 0;

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

				if (target) {
					// Target selected!
					drone.pos.x = drone.pos.x || ship.pos.x + 10;
					drone.pos.y = drone.pos.y || ship.pos.y + 10;
					drone.vel.x = drone.vel.x || 0;
					drone.vel.y = drone.vel.y || 0;
					drone.acc.x = 0;
					drone.acc.y = 0;

					drone.vel = pursue(target, drone, 100, 100);

					if (ship.pos.subtract(drone.pos).length() < this.droneRange && drone.bulletTimer >= 0.75) {
						var bulletSpeed = 6;

						var newBullet = new Bullet();
						//var transFormedPoint = matrix.transformPoint(noseP);
						var transFormedPoint = this.rotate(new Point(40, 0), new Point(), drone.rot * Math.PI / 180);
						newBullet.pos.x = drone.pos.x + transFormedPoint.x;
						newBullet.pos.y = drone.pos.y + transFormedPoint.y;
						newBullet.vel.x = transFormedPoint.x * bulletSpeed;
						newBullet.vel.y = transFormedPoint.y * bulletSpeed;

						newBullet.direction = drone.rot + 90;
						newBullet.maxVel = 500;
						newBullet.friction = 0;
						ship.bullets.push(newBullet);
						drone.bulletTimer = 0;
					}
					drone.bulletTimer += secs;
				}


				drone.rot = this.radiansToDegrees(Math.atan2(drone.vel.y, drone.vel.x));

				drone.pos.x %= this.SW;
				drone.pos.y %= this.SH;

				if (drone.pos.x < 0) {
					drone.pos.x = this.SW - 1;
				}
				if (drone.pos.y < 0) {
					drone.pos.y = this.SH - 1;
				}
				this.applyNewPositions(drone, drone.acc, secs);
				drone.pos.x %= this.SW;
				drone.pos.y %= this.SH;

			}
		} else {

			// No targets found, follow the ship
			// How to do this?

			var drones = ship.drones;
			var numDrones = drones.length;
			for (j = 0; j < numDrones; j++) {
				var drone = drones[j];

				drone.pos.x = drone.pos.x || ship.pos.x + 10;
				drone.pos.y = drone.pos.y || ship.pos.y + 10;
				drone.vel.x = drone.vel.x || 0;
				drone.vel.y = drone.vel.y || 0;
				drone.acc.x = 0;
				drone.acc.y = 0;

				drone.vel = follow(ship, drone, ship.vel.length() + 100, 100);

				drone.rot = this.radiansToDegrees(Math.atan2(drone.vel.y, drone.vel.x));

				drone.pos.x %= this.SW;
				drone.pos.y %= this.SH;
				if (drone.pos.x < 0) {
					drone.pos.x = this.SW - 1;
				}
				if (drone.pos.y < 0) {
					drone.pos.y = this.SH - 1;
				}
				this.applyNewPositions(drone, drone.acc, secs);
				drone.pos.x %= this.SW;
				drone.pos.y %= this.SH;
			}
		}
	}
};

function follow(target, subject, maxVel, breakingDistance) {
	var dest = target.pos.add(target.vel.multiply(-1).normalize(100)); // 100px behind the target
	var direction = dest.subtract(subject.pos);
	var distance = direction.length();

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

function pursue(target, subject, maxVel, breakingDistance) {
	var dest = target.pos.add(target.vel.normalize(100)); // 100px behind the target
	var direction = dest.subtract(subject.pos);
	var distance = direction.length();

	var result;

	if (distance < 5) { // match speed if close enough
		result = direction.normalize(target.vel.length());
		/*} else if (distance < 50) { // start to decrease speed
		var targetSpeed = target.vel.length();
		result = direction.normalize(((maxVel - targetSpeed) * direction.length() / 50) + targetSpeed);
		*/
	} else {
		result = direction.normalize(maxVel);
	}

	return result;
}

module.exports = Drones;