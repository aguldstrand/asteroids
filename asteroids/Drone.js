var BasePhysics = require("./BasePhysics");

function Drone() {
	BasePhysics.apply(this);

	this.rot = 0;
	this.maxVel = 1500;
}

Drone.prototype = new BasePhysics();

module.exports = Drone;