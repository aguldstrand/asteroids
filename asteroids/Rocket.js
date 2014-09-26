var BasePhysics = require("./BasePhysics");
var Point = require("./Point");

function Rocket(parentObject) {
	this.startVel = 50;
	this.maxVel = 700;
	this.diam = 1;
	this.rot = 0;
	this.scanRadius = 1000;
	this.type = 'rocket';
	this.targetId = null;

	BasePhysics.apply(this);

	this.init(parentObject);
}

Rocket.prototype = new BasePhysics();

module.exports = Rocket;