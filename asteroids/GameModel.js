var gConstants = require('./constants/GConstants');

function GameModel() {
	this.userInputs = {};

	this.ships = [];
	this.asteroids = [];
	this.explosions = [];

	this.SW = gConstants.SW;
	this.SH = gConstants.SH;
	this.gravity = [];
	this.staticGravity = [];
	this.warpFrom = {};
	this.warpTo = {};

	/*for (var i = 0; i < 200000; i++) {
		this.test = [];
		//to overload the data package as a test
		this.test.push(Math.random() + 'aslfkjaslkfhlaskf');
	}*/
}


GameModel.prototype.toJSON = function() {
	return {
		ships: this.ships,
		asteroids: this.asteroids,
		explosions: this.explosions,
		SW: this.SW,
		SH: this.SH,
		//gravity: this.staticGravity,
		warpTo: this.warpTo,
		warpFrom: this.warpFrom


	};
};

module.exports = GameModel;