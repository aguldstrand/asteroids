function GameModel() {
	this.userInputs = {};

	this.ships = [];
	this.asteroids = [];
	this.explosions = [];

	this.SW = 3000;
	this.SH = 3000;
}


GameModel.prototype.toJSON = function() {
	return {
		ships: this.ships,
		asteroids: this.asteroids,
		explosions: this.explosions,
		SW: this.SW,
		SH: this.SH
	};
};

module.exports = GameModel;