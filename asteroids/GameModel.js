function GameModel() {
	this.userInputs = {};

	this.ships = [];
	this.asteroids = [];
	this.explosions = [];

	this.SW = 3000;
	this.SH = 3000;
}

module.exports = GameModel;