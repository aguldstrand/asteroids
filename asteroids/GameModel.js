function GameModel() {
	this.monitors = [];
	this.userInputs = {}:

	this.ships = [];
	this.bullets = [];
	this.asteroids = [];
	this.explosions = [];

	this.SW = 0;
	this.SH = 0;
}

GameModel.prototype.init = function() {
	this.explosions = [];
	this.monitors = [];
	this.ships = [];
	this.asteroids = [];
	this.bullets = [];
	this.userInputs = {};

	this.SW = 1200;
	this.SH = 800;
}

module.exports = GameModel;