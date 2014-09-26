var Base = require('./Base');
var Point = require('../Point');
var Asteroid = require('../Asteroid');
var Bullet = require('../Bullet');
var Rocket = require('../Rocket');


function Ships(options) {

	Base.call(this, options);

	this.LwingP = new Point(-20, -20);
	this.RwingP = new Point(-20, 20);
	this.noseP = new Point(40, 0);

	this.shipLayout = [this.LwingP, this.RwingP, this.noseP];
}

Ships.prototype = new Base();

Ships.prototype.log = function(msg) {
	var numShips = this.gameModel.ships.length;
	for (var s = 0; s < numShips; s++) {
		var ship = this.gameModel.ships[s];
		console.log(msg, ship.pos.x, ship.acc.x, ship.vel.x);
	}
};

Ships.prototype.move = function(secs) {

	var numShips = this.gameModel.ships.length;
	var numBulletsInShip = 0;
	var bulletSpeed = 6;
	var maxBulletsPerShips = 10;

	this.speed = 800;

	var LwingP = this.LwingP;
	var RwingP = this.RwingP;
	var noseP = this.noseP;
	var shipLayout = this.shipLayout;
	// MOVE SHIPS (BASED ON USER INPUT)			
	for (var s = 0; s < numShips; s++) {
		var ship = this.gameModel.ships[s];

		ship.resetStuf();

		if (ship.spawnTimer > 0) {
			ship.spawnTimer -= secs;

			continue;
		}


		if (!ship.alive && ship.spawnTimer < 0) {
			ship.reset();
			continue;
		}

		var shipAcc = new Point(0, 0);
		var userInput = this.gameModel.userInputs[ship.id];

		if (userInput.left) {

			if (userInput.up) {
				ship.rot -= 6;
			} else {
				ship.rot -= 6;
			}


			if (ship.rot < 0) {
				ship.rot = 360;
			}
		}
		if (userInput.right) {
			if (userInput.up) {
				ship.rot += 6;
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

		if (userInput.space && ship.bulletTimer >= 0.1) {
			//matrix.identity();
			//matrix.rotate(ship.rot * piOver180);


			var newBullet = new Bullet();
			//var transFormedPoint = matrix.transformPoint(noseP);
			var transFormedPoint = this.rotate(noseP, new Point(), ship.rot * Math.PI / 180);
			newBullet.pos.x = ship.pos.x + transFormedPoint.x;
			newBullet.pos.y = ship.pos.y + transFormedPoint.y;
			newBullet.vel.x = transFormedPoint.x * bulletSpeed;
			newBullet.vel.y = transFormedPoint.y * bulletSpeed;

			newBullet.direction = ship.rot + 90;
			newBullet.maxVel = 500;
			newBullet.friction = 0;
			ship.bullets.push(newBullet);
			ship.bulletTimer = 0;
		}

		//////////////
		// Rocket //
		//////////////
		if (userInput.ctrl && ship.bulletTimer >= 1.0) {
			var rocket = new Rocket(ship);

			ship.rockets.push(rocket);
			ship.bulletTimer = 0;
		}


		ship.bulletTimer += secs;

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



		if (ship.shieldStarter) {
			for (var ss = 0; ss < 8; ss++) {
				var shieldPart = ship.shieldHealth[ss];
				if (shieldPart < 8) {
					shieldPart++;
					ship.shieldHealth[ss] = shieldPart;
					ship.shieldStarter--;
					break;
				}
			}
		}



	}


	Ships.prototype.collide = function(secs) {
		var numShips = this.gameModel.ships.length;
		var numAsteroids = this.gameModel.asteroids.length;
		for (var s = 0; s < numShips; s++) {
			var ship = this.gameModel.ships[s];

			for (var j = 0; j < numAsteroids; j++) {
				var collidable = this.gameModel.asteroids[j];
				var dx = collidable.pos.x - ship.pos.x;
				var dy = collidable.pos.y - ship.pos.y;
				var radi = collidable.diam + ship.diam;



				// var dist = ((dx * dx) + (dy * dy)) - (radi * radi);

				var dist = Math.sqrt(dx * dx + dy * dy) - radi;

				if (dist < -5) {


					//var hasShield = this.shieldCollision(ship);
					ship.handleCollision( /*other*/ );

					if (!ship.alive) {


						this.gameModel.asteroids.splice(j, 1);
						j--;
						numAsteroids--;

						//this.resetShip(ship, collidable);
						var explosionOrigin = new Point((ship.pos.x + collidable.pos.x) / 2, (ship.pos.y + collidable.pos.y) / 2);
						this.createExplosion((collidable.diam || 200) * 5, explosionOrigin);


						/*
					var explosionOrigin = new Point((ship.pos.x + collidable.pos.x) / 2, (ship.pos.y + collidable.pos.y) / 2);
					this.createExplosion(collidable.diam * 5, explosionOrigin);					
					ship.pos = new Point(1000 + Math.random() * 200, 1000 + Math.random() * 200);
					ship.shieldStarter = 64;*/
					} else {
						this.resolveCollision(collidable, ship);

					}
					break;
				}
				// logger.log(dist2);
			}
		}
	};

	Ships.prototype.shieldCollision = function(ship) {
		var hasShield = false;

		for (var x = 0; x < 8; x++) {
			var shieldFragment = ship.shieldHealth[x];
			if (shieldFragment > 0) {
				ship.shieldHealth[x]--;
				hasShield = true;
				break;
			}

		}
		return hasShield;
	};

	Ships.prototype.resetShip = function(ship, collidable) {
		var diam = collidable.diam || 200;
		var explosionOrigin = new Point((ship.pos.x + collidable.pos.x) / 2, (ship.pos.y + collidable.pos.y) / 2);
		this.createExplosion(diam * 5, explosionOrigin);

		ship.pos = new Point(1000 + Math.random() * 200, 1000 + Math.random() * 200);
		ship.shieldStarter = 64;
	};
};

module.exports = Ships;