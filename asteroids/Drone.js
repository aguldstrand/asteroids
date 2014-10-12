var BasePhysics = require("./BasePhysics");

function Drone() {
	BasePhysics.apply(this);
	this.type = 'drone';
	this.rot = 0;
	this.maxVel = 1500;
	this.bulletTimer = 0;
}

Drone.prototype = new BasePhysics();

Drone.prototype.toJSON = function() {
	return {
		rot: this.rot,
		pos: this.pos
	};
};

Drone.prototype.handleOffMap = function() {
	this.handleOffMapWithWrap();
};

module.exports = Drone;