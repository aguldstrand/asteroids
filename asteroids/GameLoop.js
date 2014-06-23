function GameLoop(options) {
	this.sendGameState = options.sendGameState;
}

GameLoop.prototype.start = function() {};

GameLoop.prototype.addPlayer = function(id, options) {};

module.exports = GameLoop;