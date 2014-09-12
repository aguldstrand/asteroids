function GameModel() {
	this.userInputs = {};

	this.ships = [];
	this.asteroids = [];
	this.explosions = [];

	this.SW = 3000;
	this.SH = 3000;
	this.gravity = [];


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
		SH: this.SH

	};
};

module.exports = GameModel;