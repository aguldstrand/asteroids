var Base = require('./Base');
var Point = require('../Point');

function Projectile(options, type) {

	this.type = type;

	Base.call(this, options);
}

Projectile.prototype = new Base();

Projectile.prototype.update = function(secs) {
	
	var ships = this.gameModel.ships;
	var asteroids = this.gameModel.asteroids;

	for (var shipIndex = ships.length; shipIndex--; ) {

		var ship = ships[shipIndex];
		var projectiles = ship[this.type];

		for (var projectileIndex = projectiles.length; projectileIndex--; ) {

			var projectile = projectiles[projectileIndex];

			var targetId = projectile.targetId;
			if (targetId !== undefined) {
				var targets = this.getTargetsInRange(projectile.pos, projectile.scanRadius, ship.id, true);
				targetId = projectile.targetId = (targets[0] || {}).id;
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
					direction = projectile.direction = target.pos.subtract(projectile.pos);
				}
			}

				this.applyNewPositions(projectile, direction, secs);


			if (projectile.pos.x >= this.SW || projectile.pos.x < 0 || projectile.pos.y < 0 || projectile.pos.y >= this.SH) {
				ship[this.type].splice(projectileIndex, 1);
				continue;
			}

		

			if (this.checkCollisions(projectiles, projectileIndex, ships, shipIndex)) {
				continue;
			}
			if (this.checkCollisions(projectiles, projectileIndex, asteroids)) {
				continue;
			}

		}
	}

};

module.exports = Projectile;