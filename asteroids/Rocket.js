var BasePhysics = require("./BasePhysics");
var Point = require("./Point");

function Rocket(parentObject) {
	this.startVel = 50;
	this.maxVel = 700;
	this.diam = 0;
	this.rot = 0;
	this.scanRadius = 1000;

	this.targetId = null;

	BasePhysics.apply(this);

	this.init(parentObject);
}

Rocket.prototype = new BasePhysics();

module.exports = Rocket;