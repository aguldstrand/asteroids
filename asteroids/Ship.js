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

	this.diam = 8;
	this.type = 'ship';

	this.spawnTimer = -1;
	this.shieldHealth = [0, 0, 0, 0, 0, 0, 0, 0];
	this.shieldStarter = 64;
	this.bulletTimer = 0;

	this.distFromCenter = new Point(40, 0);

	BasePhysics.apply(this);

	this.maxVel = 800;

	this.collidePos = null;
}

Ship.prototype = new BasePhysics();



Ship.prototype.handleCollision = function(other) {

	if (other && other.pos) {
		this.collidePos = other.pos;
	}

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
	if (!this.alive) {
		this.spawnTimer = 3;
	}

	return !hasShield;
};


Ship.prototype.resetStuf = function() {
	this.collidePos = null;
};


Ship.prototype.reset = function() {
	this.pos = new Point(1000 + Math.random() * 200, 1000 + Math.random() * 200);
	this.shieldStarter = 64;
	this.alive = true;
};

Ship.prototype.toJSON = function() {
	return {
		alive: this.alive,
		pos: this.pos,
		acc: this.acc,
		id: this.id,
		rot: this.rot,
		bullets: this.bullets,
		rockets: this.rockets,
		drones: this.drones,
		color: this.color,
		shieldHealth: this.shieldHealth,
		collidePos: this.collidePos
	};
};



module.exports = Ship;