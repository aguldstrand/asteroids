var Base = require('./Base');
var Point = require('../Point');
var Asteroid = require('../Asteroid');


function Ships(options) {

	Base.call(this, options);

	this.LwingP = new Point(-20, -20);
	this.RwingP = new Point(-20, 20);
	this.noseP = new Point(40, 0);

	this.shipLayout = [this.LwingP, this.RwingP, this.noseP];
}

Ships.prototype = new Base();

Ships.prototype.update = function(secs) {

	var numShips = this.gameModel.ships.length;
	var numBulletsInShip = 0;
	var bulletSpeed = 150;
	var maxBulletsPerShips = 10;

	this.speed = 800;

	var LwingP = this.LwingP;
	var RwingP = this.RwingP;
	var noseP = this.noseP;
	var shipLayout = this.shipLayout;
	// MOVE SHIPS (BASED ON USER INPUT)			
	for (var s = 0; s < numShips; s++) {
		var ship = this.gameModel.ships[s];
		var shipAcc = new Point(0, 0);
		var userInput = this.gameModel.userInputs[ship.id];

		if (userInput.left) {

			if (userInput.up) {
				ship.rot -= 1;
			} else {
				ship.rot -= 6;
			}


			if (ship.rot < 0) {
				ship.rot = 360;
			}
		}
		if (userInput.right) {
			if (userInput.up) {
				ship.rot += 1;
			} else {
				ship.rot += 6;
			}

			ship.rot %= 360;
		}


		if (userInput.up) {
			shipAcc.x += (Math.cos(this.degreesToRadians(ship.rot)) * this.speed);
			shipAcc.y += (Math.sin(this.degreesToRadians(ship.rot)) * this.speed);
		} else {

		}

		numBulletsInShip = ship.bullets.length;

		if (userInput.shoot && numBulletsInShip < maxBulletsPerShips) {
			matrix.identity();
			matrix.rotate(ship.rot * piOver180);
			var newBullet = new Bullet();
			var transFormedPoint = matrix.transformPoint(noseP);
			newBullet.pos.x = ship.pos.x + transFormedPoint.x;
			newBullet.pos.y = ship.pos.y + transFormedPoint.y;
			newBullet.vel.x = transFormedPoint.x * bulletSpeed;
			newBullet.vel.y = transFormedPoint.y * bulletSpeed;
			newBullet.direction = ship.rot + 90;
			newBullet.maxVel = 250;
			newBullet.friction = 0;
			ship.bullets.push(newBullet);
			numBulletsInShip++;
		}

		ship.pos.x %= this.SW;
		ship.pos.y %= this.SH;

		if (ship.pos.x < 0) {
			ship.pos.x = this.SW - 1;
		}
		if (ship.pos.y < 0) {
			ship.pos.y = this.SH - 1;
		}

		//var g:Point = gravity[int( int(ship.pos.x / gravityRes) + int(ship.pos.y / gravityRes) * int(SW / gravityRes))];				
		//ship.vel.x += g.x;
		//ship.vel.y += g.y;
		this.applyNewPositions(ship, shipAcc, secs);

		ship.diam = 40;
		var len = this.gameModel.asteroids.length;
		for (var j = 0; j < len; j++) {
			var collidable = this.gameModel.asteroids[j];


			var dx = collidable.pos.x - ship.pos.x;
			var dy = collidable.pos.y - ship.pos.y;
			var radi = collidable.diam + ship.diam;

			// var dist = ((dx * dx) + (dy * dy)) - (radi * radi);

			var dist = Math.sqrt(dx * dx + dy * dy) - radi;

			if (dist < -5) {


				var hasShield = false;
				for (var x = 0; x < 8; x++) {
					var shieldFragment = ship.shieldHealth[x];
					if (shieldFragment > 0) {
						ship.shieldHealth[x]--;
						hasShield = true;
						break;
					}

				}
				if (!hasShield) {
					var explosionOrigin = new Point((ship.pos.x + collidable.pos.x) / 2, (ship.pos.y + collidable.pos.y) / 2);
					this.createExplosion(collidable.diam * 5, explosionOrigin);
					this.gameModel.asteroids.splice(j, 1);
					//ship.pos = new Point(500, 500);
				} else {
					this.resolveCollision(collidable, ship);

				}
				break;
			}
			// logger.log(dist2);
		}



		//ship.pos.x += ship.vel.x*secs + g.x;
		//ship.pos.y += ship.vel.y*secs + g.y;



		for (var mb = 0; mb < numBulletsInShip; mb++) {
			var bullet = ship.bullets[mb];



			if (bullet.pos.x >= this.SW || bullet.pos.x < 0 || bullet.pos.y < 0 || bullet.pos.y >= this.SH) {
				//GameModel.getInstance().bullets.splice(mb, 1);
				ship.bullets.splice(mb, 1);
				numBulletsInShip--;
				//
			} else {
				//var gb:Point = gravity[int( int(bullet.pos.x / gravityRes) + int(bullet.pos.y / gravityRes) * int(SW / gravityRes))];
				//bullet.vel.x += gb.x;
				//bullet.vel.y += gb.y;

				this.applyNewPositions(bullet, new Point(), secs);
				//bullet.pos.x += Math.sin(bullet.direction * piOver180 ) * bulletSpeed * secs + gb.x;
				//bullet.pos.y -= Math.cos(bullet.direction * piOver180 ) * bulletSpeed * secs - gb.y;	
			}
			//
		}



	}
};

module.exports = Ships;