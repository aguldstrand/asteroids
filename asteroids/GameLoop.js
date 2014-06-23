function GameLoop(options) {
	this.sendGameState = options.sendGameState;
	this.running = false;
}

GameLoop.prototype.start = function() {
	this.running = true;
	setTimeout(this.step.bind(this));
};

GameLoop.prototype.step = function() {
	if (this.running) {
		// setTimeout should have good enough resolution for a game loop
		// and wont hammer the cpu the same way as setImmediate
		setTimeout(this.step.bind(this));
	}
};

GameLoop.prototype.addPlayer = function(id, options) {};

GameLoop.prototype.removePlayer = function(id) {};

GameLoop.prototype.userInput = function(id, buttonArray) {};

module.exports = GameLoop;