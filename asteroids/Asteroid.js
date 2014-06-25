var BasePhysics = require("./BasePhysics");

function Asteroid() {
	this.diam = 0;
}

Asteroid.prototype = new BasePhysics();

module.exports = Asteroid;