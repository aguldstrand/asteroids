var Asteroid = require('../Asteroid');
var Explosion = require('../Explosion');
var Point = require('../Point');

function Base(options) {

	if (options) {

		console.log(this.gameModel);
		this.gravity = options.gravity;
		this.gameModel = options.gm;
		this.gravityRes = options.gravityRes;
		this.SW = options.SW;
		this.SH = options.SH;

	}
}

Base.prototype.degreesToRadians = function(degrees) {
	return degrees * Math.PI / 180;
};

Base.prototype.applyNewPositions = function(obj /*BasePhysics*/ , acc /*Point*/ , secs /*Number*/ ) {

	var g = this.getGravity(obj.pos);


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
		obj.vel.normalize(obj.maxVel);
	}



	obj.pos.x += obj.vel.x * secs;
	obj.pos.y += obj.vel.y * secs;



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

};
Base.prototype.getGravity = function(pos /*Point*/ ) {



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


	var gravity = this.gravity[index];

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
module.exports = Base;