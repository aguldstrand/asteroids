var BasePhysics = require("./BasePhysics");
var Point = require("./Point");

function Bullet() {
	this.diam = 0;
	this.rot = 0;
	BasePhysics.apply(this);
}

Bullet.prototype = new BasePhysics();

module.exports = Bullet;