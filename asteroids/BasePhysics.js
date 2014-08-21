var Point = require("./Point");

function BasePhysics() {
	this.friction = 25;
	this.maxVel = 200;
	this.pos = new Point();
	this.vel = new Point();
	this.acc = new Point();

	this.alive = true;
}


BasePhysics.prototype.init = function(parentObject) {
	var transFormedPoint = this.rotate(parentObject.distFromCenter, new Point(), parentObject.rot * Math.PI / 180);
	this.pos.x = parentObject.pos.x + transFormedPoint.x;
	this.pos.y = parentObject.pos.y + transFormedPoint.y;
	this.vel.x = transFormedPoint.x * this.startVel;
	this.vel.y = transFormedPoint.y * this.startVel;

	this.direction = parentObject.rot + 90;
	this.friction = 0;
};


BasePhysics.prototype.handleCollision = function() {
	this.alive = false;
	return false;
};


BasePhysics.prototype.rotate = function(p, origin, angle) {
	return new Point(
		Math.cos(angle) * (p.x - origin.x) - Math.sin(angle) * (p.y - origin.y) + origin.x,
		Math.sin(angle) * (p.x - origin.x) + Math.cos(angle) * (p.y - origin.y) + origin.y
	);
};

module.exports = BasePhysics;