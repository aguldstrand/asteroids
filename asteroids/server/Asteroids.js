var Base = require('./Base');
var Point = require('../Point');
var Asteroid = require('../Asteroid');

function Asteroids(options) {


	Base.call(this, options);
}

Asteroids.prototype = new Base();

Asteroids.prototype.update = function(secs) {
	var len = this.gameModel.asteroids.length;
	for (var a = 0; a < len; a++) {
		var asteroid = this.gameModel.asteroids[a];

		//asteroid.pos.x %= this.SW;
		//asteroid.pos.y %= this.SH;

		if (asteroid.pos.x > this.SW) {
			asteroid.pos.x = 0;
		}
		if (asteroid.pos.y > this.SH) {
			asteroid.pos.y = 0;
		}

		if (asteroid.pos.x < 0) {
			asteroid.pos.x = this.SW - 1;
		}
		if (asteroid.pos.y < 0) {
			asteroid.pos.y = this.SH - 1;
		}
		asteroid.rot += asteroid.rotVelocity;

		asteroid.rot %= 360;
		if (asteroid.rot < 0) {
			asteroid.rot = 360;
		}



		//var ag:Point = getGravity(asteroid.pos);
		//asteroid.vel.x += ag.x;
		//asteroid.vel.y += ag.y;
		//asteroid.vel.x = 10;
		this.applyNewPositions(asteroid, new Point(0, 0), secs);



		for (var j = 0; j < len; j++) {
			var collidable = this.gameModel.asteroids[j];
			if (j != a) {

				var dx = collidable.pos.x - asteroid.pos.x;
				var dy = collidable.pos.y - asteroid.pos.y;
				var radi = collidable.diam + asteroid.diam;

				// var dist = ((dx * dx) + (dy * dy)) - (radi * radi);

				var dist = Math.sqrt(dx * dx + dy * dy) - radi;

				if (dist < 1) {

					this.resolveCollision(collidable, asteroid);

				}
				// logger.log(dist2);
			}

		}

		//asteroid.pos.x += asteroid.vel.x * secs + ag.x;
		//asteroid.pos.y += asteroid.vel.y * secs + ag.y;
		//Tracker.track("ASteroid : " + asteroid.pos.x);
	}
};
Asteroids.prototype.createAsteroids = function(num) {
	num = num || 100;
	for (var i = 0; i < num; i++) {
		var asteroid = new Asteroid();
		asteroid.diam = Math.random() * 20 + 20;
		asteroid.friction = 0;
		asteroid.maxVel = 200;
		asteroid.pos = Math.random() > 0.5 ? new Point(Math.random() * this.SW, Math.random() * this.SH) : new Point(Math.random() * this.SW, Math.random() * this.SH);
		asteroid.vel = Math.random() > 0.5 ? new Point(Math.random() * 5 + 5, Math.random() * 5 + 5) : new Point(Math.random() * -5 - 5, Math.random() * -5 - 5);

		this.gameModel.asteroids.push(asteroid);
	}
};
module.exports = Asteroids;