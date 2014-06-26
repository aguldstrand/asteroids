function GameModel() {
	this.userInputs = {};

	this.ships = [];
	this.bullets = [];
	this.asteroids = [];
	this.explosions = [];

	this.SW = 10000;
	this.SH = 10000;
}

module.exports = GameModel;