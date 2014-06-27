var express = require('express.io');
var app = express();
app.http().io();
app.use(express.static('./public'));


var GameLoop = require('./GameLoop2');
var GameModel = require('./GameModel');

var gameLoop = new GameLoop({
	gameModel: new GameModel(),
	sendGameState: function(state) {
		app.io.broadcast('monitor:game-state', state);
	}
});

gameLoop.start();

app.io.route('monitor', {
	connect: function(req) {
		console.log('Monitor connected - ' + req.socket.id);
		req.io.join('monitor');
	},
	disconnect: function(req) {
		console.log('Monitor disconnected - ' + req.socket.id);
	}
});

app.io.route('controller', {
	connect: function(req) {
		console.log('Controller connected - ' + req.socket.id + ':' + req.data.name);
		gameLoop.addPlayer(req.socket.id, req.data);
	},
	input: function(req) {
		//console.log('user input - ' + req.socket.id + ':' + req.data);
		gameLoop.userInput(req.socket.id, req.data);
	},
	disconnect: function(req) {
		console.log('Controller disconnected - ' + req.socket.id);
		gameLoop.removePlayer(req.socket.id);
	}
});

var port = 3000;
app.listen(port);
console.log("Server started on port " + port);