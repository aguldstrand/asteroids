function GameModel() {
	this.userInputs = {};

	this.ships = [];
	this.bullets = [];
	this.asteroids = [];
	this.explosions = [];

	this.SW = 1000;
	this.SH = 1000;
}

module.exports = GameModel;