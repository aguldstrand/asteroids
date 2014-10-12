var BasePhysics = require("./BasePhysics");
var Point = require("./Point");

function Asteroid() {
	this.diam = 0;
	this.rot = 0;
	this.rotVelocity = Math.random() - 0.5;
	this.type = 'asteroid';

	BasePhysics.apply(this);

	this.vel = new Point((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15);
	this.acc = new Point((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15);
}

Asteroid.prototype = new BasePhysics();
Asteroid.prototype.handleCollision = function(other) {
	this.alive = false;
	return true;
};

Asteroid.prototype.handleOffMap = function() {
	this.handleOffMapWithWrap();
};


Asteroid.prototype.toJSON = function() {
	return {
		pos: this.pos,
		diam: this.diam,
		rot: this.rot
	};
};
module.exports = Asteroid;