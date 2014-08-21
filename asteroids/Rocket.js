var BasePhysics = require("./BasePhysics");
var Point = require("./Point");

function Rocket(parentObject) {
	this.startVel = 50;
	this.maxVel = 100;
	this.diam = 0;
	this.rot = 0;
	this.scanRadius = 100;

	this.target = null;

	BasePhysics.apply(this);

	this.init(parentObject);
}

Rocket.prototype = new BasePhysics();

module.exports = Rocket;