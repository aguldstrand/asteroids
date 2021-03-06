var Asteroid = require('../Asteroid');
var Explosion = require('../Explosion');
var Point = require('../Point');

function Base(options) {

	if (options) {

		this.gravity = options.gravity;
		this.gameModel = options.gm;
		this.gravityRes = options.gravityRes;
		this.SW = options.SW;
		this.SH = options.SH;
		this.grid = options.grid;

	}
}

Base.prototype.degreesToRadians = function(degrees) {
	return degrees * Math.PI / 180;
};

Base.prototype.radiansToDegrees = function(degrees) {
	return degrees * 180 / Math.PI;
};

Base.prototype.applyNewPositions = function(obj /*BasePhysics*/ , acc /*Point*/ , secs /*Number*/ , behaviour) {

	obj.checkOffMap();
	if (obj.splice) {
		return;
	}

	var g = this.getGravity(obj.pos);

	if (g.warp) {
		obj.pos.x = g.warp.x + (Math.random() - 0.5) * 50;
		obj.pos.y = g.warp.y + (Math.random() - 0.5) * 50;
		g = this.getGravity(obj.pos);

	}



	obj.acc.x = g.x + acc.x;
	obj.acc.y = g.y + acc.y;



	if (obj.vel.length() > 0.1) {
		var frictionP = new Point(-obj.vel.x, -obj.vel.y);
		frictionP.normalize(obj.friction);
		obj.acc.x += frictionP.x;
		obj.acc.y += frictionP.y;

	}

	obj.vel.x += obj.acc.x * secs;
	obj.vel.y += obj.acc.y * secs;



	if (obj.vel.length() > obj.maxVel) {
		//this fucks up something with ship velocity...
		// obj.vel.normalize(obj.maxVel * secs); // Velocity should not be scaled to frame time
		obj.vel.normalize(obj.maxVel);


	}

	obj.pos.x += obj.vel.x * secs;
	obj.pos.y += obj.vel.y * secs;


	obj.checkOffMap();


};

Base.prototype.___log = function(log, name, obj) {
	if (log) {
		console.log(name, obj.pos.x, obj.pos.y, obj.vel.x, obj.vel.y, obj.acc.x, obj.acc.y);
	}
};


Base.prototype.resolveCollision = function(ballA, ballB) {

	// get the mtd
	var delta = (ballA.pos.subtract(ballB.pos));
	var d = delta.length();
	// minimum translation distance to push balls apart after intersecting
	var mtd = delta.multiply(((ballA.diam + ballB.diam) - d) / d);

	// resolve intersection --
	// inverse mass quantities
	var im1 = ballB.diam * ballB.diam * Math.PI; // / getMass(); //these
	// seems to be reversed
	// ?
	var im2 = ballA.diam * ballA.diam * Math.PI; // / ball.getMass();

	// push-pull them apart based off their mass
	ballA.pos = ballA.pos.add(mtd.multiply(im1 / (im1 + im2)));
	ballB.pos = ballB.pos.subtract(mtd.multiply(im2 / (im1 + im2)));

	// impact speed
	var v = (ballA.vel.subtract(ballB.vel));
	var vn = v.dot(mtd.normalize());

	// sphere intersecting but moving away from each other already
	if (vn > 0)
		return;

	// collision impulse
	var i = (-(1 + .1) * vn) / (im1 + im2);
	var impulse = mtd.multiply(i);

	// change in momentum
	ballA.vel = ballA.vel.add(impulse.multiply(im1));
	ballB.vel = ballB.vel.subtract(impulse.multiply(im2));



	if (ballA.pos.x > this.SW) {
		ballA.pos.x = 0;
	}
	if (ballA.pos.y > this.SH) {
		ballA.pos.y = 0;
	}

	if (ballA.pos.x < 0) {
		ballA.pos.x = this.SW - 1;
	}
	if (ballA.pos.y < 0) {
		ballA.pos.y = this.SH - 1;
	}
	if (ballB.pos.x > this.SW) {
		ballB.pos.x = 0;
	}
	if (ballB.pos.y > this.SH) {
		ballB.pos.y = 0;
	}

	if (ballB.pos.x < 0) {
		ballB.pos.x = this.SW - 1;
	}
	if (ballB.pos.y < 0) {
		ballB.pos.y = this.SH - 1;
	}
};

Base.prototype.getGravity = function(pos /*Point*/ , log) {
	var _x = parseInt(parseInt(pos.x, 10) / this.gravityRes, 10);
	var _y = parseInt(parseInt(pos.y, 10) / this.gravityRes, 10);

	var gravW = parseInt(this.SW / this.gravityRes, 10);

	var index = parseInt(_y * gravW + _x, 10);

	//trace("point x  : " + pos.x);
	//trace("point y  : " + pos.y);
	//trace("_x : " + _x);
	//trace("_y : " + _y);
	//trace("gravW : " + gravW);
	//trace("index: " + index);


	if (index < 0) {

		console.log('=====================================');
		console.log('g index out of bounds', index);
		index = 0;
	} else if (index >= this.gravity.length) {

		console.log('=====================================');
		console.log('g index out of bounds', index);
		index = this.gravity.length - 1;
	}

	var gravity = this.gravity[index];


	if (!gravity || log) {
		console.log('================================================');
		console.log(pos.x, pos.y);
		console.log(_x, _y);
		console.log(gravW);
		console.log(index, this.gravity.length);
		console.log(gravity);

		console.log('================================================');



	}

	return gravity;
};

Base.prototype.createExplosion = function(size /*int*/ , pos /*Point*/ ) {
	var explosion = new Explosion();
	explosion.pos = pos;
	explosion.size = size;
	this.gameModel.explosions.push(explosion);
};

Base.prototype.removeAsteroid = function(asteroid /*Asteroid*/ ) {

	var ret = -1;

	var pos = new Point(asteroid.pos.x, asteroid.pos.y);
	var size = asteroid.diam;
	this.createExplosion(size, pos);

	if (size > 22) {
		for (var na = 0; na < 3; na++) {
			var newAsteroid = new Asteroid();
			newAsteroid.diam = size / 3;
			newAsteroid.pos = asteroid.pos;
			newAsteroid.friction = 0;
			newAsteroid.maxVel = 30;
			newAsteroid.vel.x = asteroid.vel.x * Math.random() * 1 - asteroid.vel.x * 2;
			newAsteroid.vel.y = asteroid.vel.y * Math.random() * 1 - asteroid.vel.y * 2;
			this.gameModel.asteroids.push(newAsteroid);
			ret++;
		}
	}
	return ret;
};

Base.prototype.createExplosion = function(size /*int*/ , pos /*Point*/ ) {
	var explosion = new Explosion();
	explosion.pos = pos;
	explosion.size = size;
	this.gameModel.explosions.push(explosion);
};

Base.prototype.rotate = function(p, origin, angle) {
	//angle = angle * Math.PI / 180.0;
	return new Point(
		Math.cos(angle) * (p.x - origin.x) - Math.sin(angle) * (p.y - origin.y) + origin.x,
		Math.sin(angle) * (p.x - origin.x) + Math.cos(angle) * (p.y - origin.y) + origin.y
	);
};

Base.prototype.getTargetsInRange = function(pos, radius, playerId, onlyShips) {

	// This should be optimised with a lookup grid or quad tree or similar

	// Targets can be of any type, but should have a:
	// * pos property so that it can be pursued
	// * health property so that it can be prioritized
	// * distance property that is updated every time this function is run. Ony used as a cache of the distance calculation.
	var targets = [];
	var j;
	var i;
	var radiusSquared = radius * radius;

	// Find ships
	var ships = this.gameModel.ships;
	var numShips = ships.length;
	for (i = 0; i < numShips; i++) {
		var ship = ships[i];
		if (ship.id === playerId) {
			continue;
		}

		var shipPos = ship.pos;

		var dx = pos.x - shipPos.x;
		var dy = pos.y - shipPos.y;
		var distanceSquared = dx * dx + dy * dy;

		if (radiusSquared >= distanceSquared) {
			ship.distance = Math.sqrt(distanceSquared);
			targets.push(ship);
		}


		if (!onlyShips) {

			// Find drones
			var drones = ship.drones;
			var numDrones = drones.length;
			for (j = 0; j < numDrones; j++) {
				var drone = drones[i];
				if (!drone) {
					continue;
				}

				var dronePos = drone.pos;

				dx = pos.x - dronePos.x;
				dy = pos.y - dronePos.y;
				distanceSquared = dx * dx + dy * dy;

				if (radiusSquared >= distanceSquared) {
					drone.distance = Math.sqrt(distanceSquared);
					targets.push(drone);
				}

			}

		}
	}


	if (!onlyShips) {
		// Find asteroids
		var asteroids = this.gameModel.asteroids;
		var numAsteroids = asteroids.length;
		for (var i = 0; i < numAsteroids; i++) {
			var asteroid = asteroids[i];

			var asteroidPos = asteroid.pos;

			var dx = pos.x - asteroidPos.x;
			var dy = pos.y - asteroidPos.y;
			var distanceSquared = dx * dx + dy * dy;

			if (radiusSquared >= distanceSquared) {
				asteroid.distance = Math.sqrt(distanceSquared);
				targets.push(asteroid);
			}

		}
	}

	return targets;
};



// Collision checks
Base.prototype.checkCollisions = function(sourceList, sourceIndex, targetList, excludeTargetIndex) {
	var source = sourceList[sourceIndex];

	for (var i = targetList.length; i--;) {
		if (i === excludeTargetIndex) {
			continue;
		}

		var target = targetList[i];

		var dx = target.pos.x - source.pos.x;
		var dy = target.pos.y - source.pos.y;
		var radi = target.diam + source.diam;

		var dist = (dx * dx + dy * dy) - (radi * radi);

		if (dist < 10) {

			if (target.handleCollision(source)) {
				this.createExplosion(target.diam * 5, target.pos);
			}

			if (source.handleCollision(target)) {
				this.createExplosion(source.diam * 5, source.pos);
			}

			if (!target.alive) {
				targetList.splice(i, 1);
			}

			if (!source.alive) {
				sourceList.splice(sourceIndex, 1);
				return true; // 'source dead'
			}
		}
	}

	return false; // 'still alive'
};


Base.prototype.checkCollisionsMK2 = function(item, collidables, behaviour, options) {


	for (var i = collidables.length; i--;) {

		var target = collidables[i];

		if (target.cid === item.cid) {
			continue;
		}


		var dx = target.pos.x - item.pos.x;
		var dy = target.pos.y - item.pos.y;
		var radi = target.diam + item.diam;

		var dist = (dx * dx + dy * dy) - (radi * radi);

		if (dist < 10) {

			/*if (target.handleCollision(item)) {
				//this.createExplosion(target.diam * 5, target.pos);
			}

			if (item.handleCollision(target)) {
				//this.createExplosion(item.diam * 5, item.pos);
			}*/

			behaviour(item, collidables, i, options);


			/*
			if (!target.alive) {
				targetList.splice(i, 1);
			}

			if (!item.alive) {
				sourceList.splice(sourceIndex, 1);
				return true; // 'source dead'
			}*/
		}
	}

	return false; // 'still alive'
};



Base.prototype.getClosestInRange = function(lists, pos, radius, excludes) {
	var pow = Math.pow;
	var radiusSq = radius * radius;

	excludes = Util.isArray(excludes) ? excludes : [excludes];

	function distSq(posA, posB) {
		return pow(posA.x - posB.x, 2) + pow(posA.y - posB.y, 2);
	}

	function closest(list, pos, radius, excludes) {
		var minDistance = Infinity;
		var minObject = null;

		for (var i = 0; i < lists.length; i++) {
			var object = lists[i];
			if (Util.isArray(object)) {
				var res = this.getClosestInRange(object, pos, radius, excludes);
				if (res && res.distance < minDistance) {
					return res;
				}
			} else {
				if (excludes.indexOf(object) || !object.pos) {
					continue;
				}

				var dist = distSq(object.pos, pos);
				if (dist < minDistance) {
					minDistance = dist;
					minObject = object;
				}
			}
		}

		return minObject;
	}


	return closest(lists, pos, radiusSq, excludes);
};



module.exports = Base;