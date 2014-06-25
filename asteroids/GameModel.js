function GameModel() {
	this.monitors = [];
	this.userInputs = {};

	this.ships = [];
	this.bullets = [];
	this.asteroids = [];
	this.explosions = [];

	this.SW = 1200;
	this.SH = 800;
}

module.exports = GameModel;