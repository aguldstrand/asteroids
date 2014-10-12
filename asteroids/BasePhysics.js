var Point = require("./Point");
var GConstants = require("./constants/GConstants");

function BasePhysics() {

	this.SW = GConstants.SW;
	this.SH = GConstants.SH;

	this.friction = 25;
	this.maxVel = 200;
	this.diam = 1;
	this.pos = new Point();
	this.vel = new Point();
	this.acc = new Point();
	this.splice = false;

	this.cid = BasePhysics.cid++;

	this.alive = true;

	this.d_pos = [];
	this.d_vel = [];
	this.d_acc = [];
}

BasePhysics.cid = 0;


BasePhysics.prototype.init = function(parentObject) {
	var transFormedPoint = this.rotate(parentObject.distFromCenter, new Point(), parentObject.rot * Math.PI / 180);
	this.pos.x = parentObject.pos.x + transFormedPoint.x;
	this.pos.y = parentObject.pos.y + transFormedPoint.y;
	this.vel.x = transFormedPoint.x * this.startVel;
	this.vel.y = transFormedPoint.y * this.startVel;

	this.direction = parentObject.rot + 90;
	this.friction = 0;
};


BasePhysics.prototype.handleCollision = function(other) {
	this.alive = false;
	return false;
};

BasePhysics.prototype.checkOffMap = function() {
	var pos = this.pos;
	if (pos.x > this.SW || pos.x < 0 || pos.y > this.SH || pos.y < 0) {
		this.handleOffMap();
	}
};

BasePhysics.prototype.handleOffMap = function() {
	this.splice = true;
};
BasePhysics.prototype.handleOffMapWithWrap = function() {
	var pos = this.pos;
	pos.x %= this.SW;
	pos.y %= this.SH;

	if (pos.x < 0) {
		pos.x = this.SW - 1;
	}
	if (pos.y < 0) {
		pos.y = this.SH - 1;
	}

};


BasePhysics.prototype.rotate = function(p, origin, angle) {
	return new Point(
		Math.cos(angle) * (p.x - origin.x) - Math.sin(angle) * (p.y - origin.y) + origin.x,
		Math.sin(angle) * (p.x - origin.x) + Math.cos(angle) * (p.y - origin.y) + origin.y
	);
};


BasePhysics.prototype.toJSON = function() {
	return {
		pos: this.pos,
		vel: this.vel,
		acc: this.acc
	};
};


module.exports = BasePhysics;