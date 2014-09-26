var BasePhysics = require("./BasePhysics");
var Point = require("./Point");

function Bullet() {
	this.diam = 1;
	this.rot = 0;
	this.type = 'bullet';
	BasePhysics.apply(this);
}

Bullet.prototype = new BasePhysics();

module.exports = Bullet;