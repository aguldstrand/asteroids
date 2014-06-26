var BasePhysics = require("./BasePhysics");

function Asteroid() {
	this.diam = 0;

	BasePhysics.apply(this);
}

Asteroid.prototype = new BasePhysics();

module.exports = Asteroid;