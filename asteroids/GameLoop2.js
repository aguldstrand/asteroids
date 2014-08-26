var Point = require('./Point');
var TriangleCheck = require('./TriangleCheck');
var Asteroid = require('./Asteroid');
var Ship = require('./Ship');
var Explosion = require('./Explosion');
var Asteroids = require('./server/Asteroids');
var Ships = require('./server/Ships');
var Explosions = require('./server/Explosions');
var Gravity = require('./server/Gravity');
//var Bullets = require('./server/Bullets');
var Drones = require('./server/Drones');
//var Rockets = require('./server/Rockets');
var Projectiles = require('./server/Projectiles');

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
	//this.bullets = new Bullets(options);
	this.drones = new Drones(options);
	this.rockets = new Projectiles(options,'rockets');
	this.bullets = new Projectiles(options,'bullets');
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
		this.asteroids.createAsteroids(120);
	}


	var secs = step / 1000;

	//this.ships.log('before');
	this.asteroids.update(secs);
	//this.ships.log('post asteroids');
	this.ships.update(secs);
	//this.ships.log('post ships');
	this.explosions.update(secs);
	//this.ships.log('post explosions');
	this.gravity.update(secs);
	//this.ships.log('post gravity');
	this.bullets.update(secs);
	//this.ships.log('post bullets');
	this.drones.update(secs);
	//this.ships.log('post drones');
	this.rockets.update(secs);


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
	ship.color = this.getColor();
	this.gameModel.ships.push(ship);
	this.gameModel.userInputs[id] = {};
	console.log('________________________');
	console.log('player added', ship);
	console.log('________________________');
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


GameLoop.prototype.getColor = (function() {
		var colors = [];

		return function() {
			if (!colors.length) {
				colors = [
					[1,1,1,1], // white
					[0,0.12156862765550613,0.24705882370471954,1], // navy
					[0,0.45490196347236633,0.8509804010391235,1], // blue
					[0.49803921580314636,0.8588235378265381,1,1], // aqua
					[0.2235294133424759,0.800000011920929,0.800000011920929,1], // teal
					[0.239215686917305,0.6000000238418579,0.43921568989753723,1], // olive
					[0.18039216101169586,0.800000011920929,0.250980406999588,1], // green
					[0.003921568859368563,1,0.43921568989753723,1], // lime
					[1,0.8627451062202454,0,1], // yellow
					[1,0.5215686559677124,0.10588235408067703,1], // orange
					[1,0.2549019753932953,0.21176470816135406,1], // red
					[0.5215686559677124,0.0784313753247261,0.29411765933036804,1], // maroon
					[0.9411764740943909,0.07058823853731155,0.7450980544090271,1], // fuchsia
					[0.6941176652908325,0.05098039284348488,0.7882353067398071,1], // purple
					[0.8666666746139526,0.8666666746139526,0.8666666746139526,1], // silver
					[0.6666666865348816,0.6666666865348816,0.6666666865348816,1], // gray
					[0.06666667014360428,0.06666667014360428,0.06666667014360428,1] // black
				];
			}

			var index = parseInt(Math.random() * colors.length, 10);
			return colors.splice(index, 1)[0];
		};
}());

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
