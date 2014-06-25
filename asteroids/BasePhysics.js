var Point = require("./Point");

function BasePhysics() {
	this.friction = 25;
	this.maxVel = 200;
	this.pos = new Point();
	this.vel = new Point();
	this.acc = new Point();
}

module.exports = BasePhysics;