var BasePhysics = require("./BasePhysics");
var Drone = require("./Drone");

function Ship(id, options) {
	this.id = id;
	this.name = options.name || "AVAILABLE";
	this.color = options.color || 'FF0000';
	this.rot = 0;
	this.bullets = [];
	this.drones = [new Drone(), new Drone()];
	this.score = 0;

	this.spawnTimer = -1;
	this.shieldHealth = [1, 2, 3, 4, 0, 6, 7, 8];

	BasePhysics.apply(this);

	this.maxVel = 500;
}

Ship.prototype = new BasePhysics();

module.exports = Ship;