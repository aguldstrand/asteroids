var BasePhysics = require("./BasePhysics");

function Drone() {
	BasePhysics.apply(this);

	this.rot = 0;
	this.maxVel = 1500;
	this.bulletTimer = 0;
}

Drone.prototype = new BasePhysics();

module.exports = Drone;