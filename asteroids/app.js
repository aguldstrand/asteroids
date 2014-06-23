var express = require('express.io');
var app = express();
app.http().io();
app.use(express.static('./public'));


var GameLoop = require('./GameLoop');
var gameLoop = new GameLoop({
	sendGameState: function(state) {
		app.io.room('monitor').broadcast('monitor:game-state', state);
	}
});

gameLoop.start();

app.io.route('monitor', {
	connect: function(req) {
		req.io.join('monitor');
	}
});

app.io.route('controller', {
	connect: function(req) {
		console.log(req.data.name);
		gameLoop.addPlayer(req.socket.id, req.data);
	},
	input: function(req) {
		gameLoop.userInput(req.socket.id, req.data);
	},
	disconnect: function(req) {
		gameLoop.removePlayer(req.socket.id);
	}
});

var port = 3000;
app.listen(port);
console.log("Server started on port " + port);