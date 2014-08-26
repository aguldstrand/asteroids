var BasePhysics = require("./BasePhysics");
var Drone = require("./Drone");
var Point = require("./Point");

function Ship(id, options) {
	this.id = id;
	this.name = options.name || "AVAILABLE";
	this.color = options.color || 'FF0000';
	this.rot = 0;
	this.bullets = [];
	this.rockets = [];
	this.drones = [new Drone(), new Drone()];
	this.score = 0;

	this.spawnTimer = -1;
	this.shieldHealth = [0, 0, 0, 0, 0, 0, 0, 0];
	this.shieldStarter = 64;
	this.bulletTimer = 0;

	this.distFromCenter = new Point(40, 0);

	BasePhysics.apply(this);

	this.maxVel = 500;
}

Ship.prototype = new BasePhysics();


Ship.prototype.handleCollision = function(other) {
	var hasShield = false;
	for (var x = 0; x < 8; x++) {
		var shieldFragment = this.shieldHealth[x];
		if (shieldFragment > 0) {
			this.shieldHealth[x]--;
			hasShield = true;
			break;
		}
	}
	
	this.alive = hasShield;
	
	return !hasShield;	
};

Ship.prototype.reset = function (){
		this.pos = new Point(1000 + Math.random() * 200, 1000 + Math.random() * 200);
		this.shieldStarter = 64;
		this.alive = true;
};




module.exports = Ship;