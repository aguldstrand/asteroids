var Base = require('./Base');

function Bullets(options) {


	Base.call(this, options);
}

Bullets.prototype = new Base();

Bullets.prototype.update = function(secs) {
	var numShips = this.gameModel.ships.length;
	var numAsteroids = this.gameModel.asteroids.length;


	for (var i = 0; i < numShips; i++) {
		var ship = this.gameModel.ships[i];
		var numBullets = ship.bullets.length;
		for (var j = 0; j < numBullets; j++) {
			var bullet = ship.bullets[j];
			for (var k = 0; k < numAsteroids; k++) {
				var collidable = this.gameModel.asteroids[k];



				var dx = collidable.pos.x - bullet.pos.x;
				var dy = collidable.pos.y - bullet.pos.y;
				var radi = collidable.diam;

				var dist = Math.sqrt(dx * dx + dy * dy) - radi;

				if (dist < 10) {

					ship.bullets.splice(j, 1);
					numBullets--;
					j--;

					this.gameModel.asteroids.splice(k, 1);
					numAsteroids--;
					k--;

					this.createExplosion(collidable.diam * 5, collidable.pos);
					break;
				}
			}
		}
	}

};

module.exports = Bullets;