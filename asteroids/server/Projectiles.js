var Base = require('./Base');
var Point = require('../Point');

function Projectile(options, type) {

	this.type = type;

	Base.call(this, options);
}

Projectile.prototype = new Base();

Projectile.prototype.move = function(secs) {

	var ships = this.gameModel.ships;
	var asteroids = this.gameModel.asteroids;

	for (var shipIndex = ships.length; shipIndex--;) {

		var ship = ships[shipIndex];
		var projectiles = ship[this.type];

		for (var projectileIndex = projectiles.length; projectileIndex--;) {

			var projectile = projectiles[projectileIndex];


			//only for rockets
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


			/*
			if (this.checkCollisions(projectiles, projectileIndex, ships, shipIndex)) {
				continue;
			}
			if (this.checkCollisions(projectiles, projectileIndex, asteroids)) {
				continue;
			}*/

		}
	}

};

Projectile.prototype.collide = function() {

	/*var ships = this.gameModel.ships;
	var asteroids = this.gameModel.asteroids;

	for (var shipIndex = ships.length; shipIndex--;) {

		var ship = ships[shipIndex];
		var projectiles = ship[this.type];

		for (var projectileIndex = projectiles.length; projectileIndex--;) {


			if (this.checkCollisions(projectiles, projectileIndex, ships, shipIndex)) {
				continue;
			}
			if (this.checkCollisions(projectiles, projectileIndex, asteroids)) {
				continue;
			}

		}
	}*/
	var that = this;
	var shipCollision = function(item, collidables, i, options) {
		options.projectiles.splice(options.projectileIndex, 1);
		var ship = collidables[i];
		if (ship.handleCollision(item)) {
			that.createExplosion(ship.diam * 5, ship.pos);
		}
	};
	var asteroidCollision = function(item, collidables, i, options) {
		var asteroid = collidables[i];
		that.createExplosion(asteroid.diam * 5, asteroid.pos);
		collidables.splice(i, 1);
		options.projectiles.splice(options.projectileIndex, 1);

	};


	var ships = this.gameModel.ships;
	var asteroids = this.gameModel.asteroids;

	for (var shipIndex = ships.length; shipIndex--;) {

		var ship = ships[shipIndex];
		var projectiles = ship[this.type];


		for (var projectileIndex = projectiles.length; projectileIndex--;) {

			var projectile = projectiles[projectileIndex];
			var shipsInGrid = this.grid.getType('ship', projectile);
			var asteroidsInGrid = this.grid.getType('asteroid', projectile);

			this.checkCollisionsMK2(projectile, shipsInGrid, shipCollision, {
				projectiles: projectiles,
				projectileIndex: projectileIndex
			});
			this.checkCollisionsMK2(projectile, asteroidsInGrid, asteroidCollision, {
				projectiles: projectiles,
				projectileIndex: projectileIndex,
				asteroids: asteroids //must splice from the "real" asteroids list

			});
		}
	}
};

module.exports = Projectile;