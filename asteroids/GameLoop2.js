var Point = require('./Point');
var TriangleCheck = require('./TriangleCheck');
var Asteroid = require('./Asteroid');
var Ship = require('./Ship');
var Explosion = require('./Explosion');
var Asteroids = require('./server/Asteroids');
var Ships = require('./server/Ships');
var Explosions = require('./server/Explosions');
var Gravity = require('./server/Gravity');

function GameLoop(options) {
	this.gameModel = options.gameModel;
	this.sendGameState = options.sendGameState;

	this.running = false;


	this.frameCounter = 0;

	this.c = null; //:Counter;
	this.SW = 0; //:int;
	this.SH = 0; //: int;

	this.LwingP = null; //: Point;
	this.RwingP = null; //: Point;
	this.noseP = null; //: Point;

	this.shipLayout = null; //: Vector. < Point > ;

	this.gravity = null; //: Vector. < Point > ;

	this.gravityRes = null; //: int;



	this.init();
}

GameLoop.prototype.init = function() {
	this.fpsLastTime = process.hrtime();

	this.SW = this.gameModel.SW;
	this.SH = this.gameModel.SH;



	this.LwingP = new Point(-20, -20);
	this.RwingP = new Point(-20, 20);
	this.noseP = new Point(40, 0);

	this.shipLayout = [this.LwingP, this.RwingP, this.noseP];

	this.gravityDebug = [];
	this.gravityRes = 50;
	var gLen = parseInt(this.SW / this.gravityRes, 10) * parseInt(this.SH / this.gravityRes, 10);
	var gravity = this.gravity = [];
	for (var i = 0; i < gLen; i++) {
		gravity[i] = new Point();
	}
	this.gameModel.gravity = gravity;

	var options = {
		gm: this.gameModel,
		gravity: this.gravity,
		gravityRes: this.gravityRes,
		SW: this.SW,
		SH: this.SH
	};
	this.asteroids = new Asteroids(options);
	this.ships = new Ships(options);
	this.explosions = new Explosions(options);
	this.gravity = new Gravity(options);
};

GameLoop.prototype.degreesToRadians = function(degrees) {
	return degrees * Math.PI / 180;
};

GameLoop.prototype.update = function(step /* milliseconds */ ) {

	this.frameCounter++;
	if (this.frameCounter % 100 === 0) {

		var diff = process.hrtime(this.fpsLastTime);
		this.fpsLastTime = process.hrtime();
		var _step = (100 / ((diff[0] * 1e9 + diff[1]) / 1e9)) | 0;

		console.log('fps: ' + _step);
	}

	var numExplosions = this.gameModel.explosions.length;
	var numShips = this.gameModel.ships.length;
	var numAsteroids = this.gameModel.asteroids.length;
	var shipAcc = new Point();



	if (numAsteroids === 0) {
		this.asteroids.createAsteroids(32);
	}


	var secs = step / 1000;


	this.asteroids.update(secs);
	this.ships.update(secs);
	this.explosions.update(secs);
	this.gravity.update(secs);


};



GameLoop.prototype.start = function() {
	this.running = true;
	this.lastStep = process.hrtime();

	setTimeout(this.step.bind(this));
};

GameLoop.prototype.step = function() {
	if (this.running) {
		// Will cause a slight drift but shoud be good enough
		var diff = process.hrtime(this.lastStep);
		this.lastStep = process.hrtime();

		var step = (diff[0] * 1e9 + diff[1]) / 1000000;
		this.update(step);

		// var a = process.hrtime();
		this.sendGameState(this.gameModel);
		// var b = process.hrtime(a);
		// console.log((diff[0] * 1e9 + diff[1]) / 1e9);

		// setTimeout should have good enough resolution for a game loop
		// and wont hammer the cpu the same way as setImmediate
		setTimeout(this.step.bind(this));
	}
};


GameLoop.prototype.addPlayer = function(id, options) {
	var ship = new Ship(id, options);
	ship.pos.x = this.SW * 0.5;
	ship.pos.y = this.SH * 0.5;
	this.gameModel.ships.push(ship);
	this.gameModel.userInputs[id] = {};
};

GameLoop.prototype.removePlayer = function(id) {
	var ships = this.gameModel.ships;
	for (var i = 0; i < ships.length; i++) {
		var ship = ships[i];
		if (ship.id === id) {
			ships.splice(i, 1);
		}
	}
	this.gameModel.userInputs[id] = null;
};

GameLoop.prototype.userInput = function(id, input) {

	/*var input = {
		left: buttonArray[2],
		right: buttonArray[1],
		thrust: buttonArray[0]
	};*/

	//console.log(input);

	this.gameModel.userInputs[id] = input;
};

module.exports = GameLoop;