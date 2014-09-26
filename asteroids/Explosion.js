var Point = require('./Point');

function Explosion() {
	this.pos = new Point();
	this.size = 0;
	this.type = 'explosion';
}

module.exports = Explosion;