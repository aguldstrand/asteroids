var Base = require('./Base');

function Explosions(options) {


	Base.call(this, options);
}

Explosions.prototype = new Base();

Explosions.prototype.update = function(secs) {
	var len = this.gameModel.explosions.length;
	for (var a = 0; a < len; a++) {
		var explosion = this.gameModel.explosions[a];

		explosion.size -= 15;
		if (explosion.size < 15) {
			this.gameModel.explosions.splice(a, 1);
			len--;
			a--;
		}
	}
};

module.exports = Explosions;