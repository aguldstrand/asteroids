var Point = require('./Point')
var Matrix = require('./Matrix')
var TriangleCheck = require('./TriangleCheck')
var Asteroid = require('./Asteroid')
var Ship = require('./Ship')
var Explosion = require('./Explosion')

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

	this.maxBulletsInGame = 60;

	this.maxBulletsPerShips = 10;

	this.frameCounter = 0;

	this.speed = 350;
	this.friction = .9;
	this.bulletSpeed = 150;
	this.piOver180 = Math.PI / 180;
	this.collideFlags = null;

	this.gravity = null; //: Vector. < Point > ;

	this.gravityRes = null; //: int;
	this.gravityDebug = null; //: Array;

	this.init();
}

GameLoop.prototype.init = function() {
	this.fpsLastTime = process.hrtime();

	this.SW = this.gameModel.SW;
	this.SH = this.gameModel.SH;

	console.log("model", this.gameModel);

	this.collideFlags = [];

	this.LwingP = new Point(-20, -20);
	this.RwingP = new Point(-20, 20);
	this.noseP = new Point(40, 0);

	this.shipLayout = [this.LwingP, this.RwingP, this.noseP];

	this.gravityDebug = [];
	this.gravityRes = 25;
	var gLen = parseInt(this.SW / this.gravityRes, 10) * parseInt(this.SH / this.gravityRes, 10);
	var gravity = this.gravity = [];
	for (var i = 0; i < gLen; i++) {
		gravity[i] = new Point();
	}
}

GameLoop.prototype.degreesToRadians = function(degrees) {
	return degrees * Math.PI / 180;
};

GameLoop.prototype.update = function(step /* milliseconds */ ) {

	this.frameCounter++;
	if (this.frameCounter % 100 === 0) {

		var diff = process.hrtime(this.fpsLastTime);
		this.fpsLastTime = process.hrtime();
		var step = (100 / ((diff[0] * 1e9 + diff[1]) / 1e9)) | 0;

		console.log('fps: ' + step);
	}

	var numExplosions = this.gameModel.explosions.length;
	var numShips = this.gameModel.ships.length;
	var numAsteroids = this.gameModel.asteroids.length;
	var shipAcc = new Point();


	// UPDATE GRAVITY
	//var test:int = Math.min(numAsteroids, 1);
	var numBulletsInShip;
	var gravity = this.gravity;
	var yMax = parseInt(this.SH / this.gravityRes, 10);
	var xMax = parseInt(this.SW / this.gravityRes, 10);
	for (var y = 0; y < yMax; y++) {
		for (var x = 0; x < xMax; x++) {
			var xgra = 0;
			var ygra = 0;

			for (var aaa = 0; aaa < numExplosions; aaa++) {
				var ast = this.gameModel.explosions[aaa];

				// relative pos
				var __dx = x * this.gravityRes - ast.pos.x;
				var __dy = y * this.gravityRes - ast.pos.y;

				// normalize (lent = 1)
				var relativePos = new Point(__dx, __dy);

				var normalizedRelativepos = relativePos.clone();
				normalizedRelativepos.normalize(1);

				// multiply gravity force size
				var gravForceSize = Math.pow(1 / relativePos.length, 1.5) * +ast.size * 50000;

				var _____x = normalizedRelativepos.x * gravForceSize;
				var _____y = normalizedRelativepos.y * gravForceSize;

				xgra += _____x;
				ygra += _____y;
			}

			var localGravity = gravity[x + y * xMax];
			localGravity.x = xgra;
			localGravity.y = ygra;
			//trace(int(x + y * SW / gravityRes));
		}

	}

	var userInputs = this.gameModel.userInputs;
	for (var i in userInputs) {
		if (userInputs.hasOwnProperty(i)) {
			var userInput = userInputs[i];
			userInput.shake = false;
		}
	}

	var matrix = new Matrix();

	//var numBullets:uint = GameModel.getInstance().bullets.length;


	var pa;
	var pb;
	var pc;

	var secs = step / 1000;


	for (var e = 0; e < numExplosions; e++) {
		var explosion = this.gameModel.explosions[e];
		explosion.size--;
		if (explosion.size < 1) {
			this.gameModel.explosions.splice(e, 1);
			numExplosions--;
		}
	}

	// MOVE SHIPS (BASED ON USER INPUT)			
	for (var s = 0; s < numShips; s++) {
		var ship = this.gameModel.ships[s];
		shipAcc = new Point(0, 0);
		var userInput = this.gameModel.userInputs[ship.id];

		if (userInput.left) {

			if (userInput.thrust) {
				ship.rot -= 1;
			} else {
				ship.rot -= 6;
			}


			if (ship.rot < 0) {
				ship.rot = 360;
			}
		}
		if (userInput.right) {
			if (userInput.thrust) {
				ship.rot += 1;
			} else {
				ship.rot += 6;
			}

			ship.rot %= 360;
		}


		if (userInput.thrust) {
			shipAcc.x += (Math.cos(this.degreesToRadians(ship.rot)) * this.speed);
			shipAcc.y += (Math.sin(this.degreesToRadians(ship.rot)) * this.speed);
		} else {

		}

		numBulletsInShip = ship.bullets.length;

		if (userInput.shoot && numBulletsInShip < maxBulletsPerShips) {
			matrix.identity();
			matrix.rotate(ship.rot * piOver180);
			var newBullet = new Bullet();
			var transFormedPoint = matrix.transformPoint(noseP);
			newBullet.pos.x = ship.pos.x + transFormedPoint.x;
			newBullet.pos.y = ship.pos.y + transFormedPoint.y;
			newBullet.vel.x = transFormedPoint.x * bulletSpeed;
			newBullet.vel.y = transFormedPoint.y * bulletSpeed;
			newBullet.direction = ship.rot + 90;
			newBullet.maxVel = 250;
			newBullet.friction = 0;
			ship.bullets.push(newBullet);
			numBulletsInShip++;
		}

		ship.pos.x %= this.SW;
		ship.pos.y %= this.SH;

		if (ship.pos.x < 0) {
			ship.pos.x = this.SW - 1;
		}
		if (ship.pos.y < 0) {
			ship.pos.y = this.SH - 1;
		}

		//var g:Point = gravity[int( int(ship.pos.x / gravityRes) + int(ship.pos.y / gravityRes) * int(SW / gravityRes))];				
		//ship.vel.x += g.x;
		//ship.vel.y += g.y;

		this.applyNewPositions(ship, shipAcc, secs);
		//ship.pos.x += ship.vel.x*secs + g.x;
		//ship.pos.y += ship.vel.y*secs + g.y;



		for (var mb = 0; mb < numBulletsInShip; mb++) {
			var bullet = ship.bullets[mb];



			if (bullet.pos.x >= this.SW || bullet.pos.x < 0 || bullet.pos.y < 0 || bullet.pos.y >= this.SH) {
				//GameModel.getInstance().bullets.splice(mb, 1);
				ship.bullets.splice(mb, 1);
				numBulletsInShip--;
				//
			} else {
				//var gb:Point = gravity[int( int(bullet.pos.x / gravityRes) + int(bullet.pos.y / gravityRes) * int(SW / gravityRes))];
				//bullet.vel.x += gb.x;
				//bullet.vel.y += gb.y;

				this.applyNewPositions(bullet, new Point(), secs);
				//bullet.pos.x += Math.sin(bullet.direction * piOver180 ) * bulletSpeed * secs + gb.x;
				//bullet.pos.y -= Math.cos(bullet.direction * piOver180 ) * bulletSpeed * secs - gb.y;	
			}
			//
		}



	}



	// MOVE ASTEROIDS

	for (var a = 0; a < numAsteroids; a++) {
		var asteroid = this.gameModel.asteroids[a];

		asteroid.pos.x %= this.SW;
		asteroid.pos.y %= this.SH;

		if (asteroid.pos.x < 0) {
			asteroid.pos.x = this.SW - 1;
		}
		if (asteroid.pos.y < 0) {
			asteroid.pos.y = this.SH - 1;
		}

		//var ag:Point = getGravity(asteroid.pos);
		//asteroid.vel.x += ag.x;
		//asteroid.vel.y += ag.y;
		this.applyNewPositions(asteroid, new Point(), secs);


		//asteroid.pos.x += asteroid.vel.x * secs + ag.x;
		//asteroid.pos.y += asteroid.vel.y * secs + ag.y;
		//Tracker.track("ASteroid : " + asteroid.pos.x);
	}


	//MOVE BULLETS      //bullets are now inside ship

	//for (var mb:uint = 0; mb < numBullets; mb++) {
	//var bullet:Bullet = GameModel.getInstance().bullets[mb];
	//bullet.pos.x += Math.sin(bullet.direction * piOver180 )* bulletSpeed * secs;
	//bullet.pos.y -= Math.cos(bullet.direction * piOver180 )* bulletSpeed * secs;				
	//
	//if (bullet.pos.x > SW || bullet.pos.x < 0 || bullet.pos.y < 0 || bullet.pos.y > SH) {
	//GameModel.getInstance().bullets.splice(mb, 1);
	//numBullets--;
	//
	//}
	//
	//}


	//SHIP BULLET COLLISON DETECTION
	var shipLayout = this.shipLayout;
	for (var sbc = 0; sbc < numShips; sbc++) {
		ship = this.gameModel.ships[sbc];

		pa = new Point();
		pa.x = ship.pos.x + shipLayout[0].x;
		pa.y = ship.pos.y + shipLayout[0].y;

		pb = new Point();
		pb.x = ship.pos.x + shipLayout[1].x;
		pb.y = ship.pos.y + shipLayout[1].y;

		pc = new Point();
		pc.x = ship.pos.x + shipLayout[2].x;
		pc.y = ship.pos.y + shipLayout[2].y;

		for (var ssbc = 0; ssbc < numShips; ssbc++) {
			var shipSSBC = this.gameModel.ships[ssbc];
			var numBulletsSSBC = shipSSBC.bullets.length;

			for (var bsc = 0; bsc < numBulletsSSBC; bsc++) {
				//bullet = GameModel.getInstance().bullets[bsc];
				bullet = shipSSBC.bullets[bsc];

				if (TriangleCheck.check(pa, pb, pc, bullet.pos)) {
					numBulletsSSBC--;
					shipSSBC.bullets.splice(bsc, 1);
					shipSSBC.score += 15;
					//GameModel.getInstance().bullets.splice(bsc, 1);
					//numBullets--;
					shipCollision(ship);
				}
			}
		}
	}

	//BULLET ASTEROIDS COLLISION DETECTION
	for (var bac = 0; bac < numAsteroids; bac++) {
		asteroid = this.gameModel.asteroids[bac];


		for (var sbac = 0; sbac < numShips; sbac++) {

			var shipSBAC = this.gameModel.ships[sbac];
			var numBulletsSBAC = shipSBAC.bullets.length;


			for (var abc = 0; abc < numBulletsSBAC; abc++) {
				//bullet = GameModel.getInstance().bullets[abc];
				bullet = shipSBAC.bullets[abc];

				var _dx = bullet.pos.x - asteroid.pos.x;
				var _dy = bullet.pos.y - asteroid.pos.y;

				var _dist = Math.sqrt((_dx * _dx) + (_dy * _dy)) - 0 - asteroid.diam;


				if (_dist < 0) {
					//numBullets--;
					shipSBAC.score += 10;
					numBulletsSBAC--;
					//GameModel.getInstance().bullets.splice(abc, 1);
					shipSBAC.bullets.splice(abc, 1);

					this.gameModel.asteroids.splice(bac, 1);
					numAsteroids += this.removeAsteroid(asteroid);
				}
			}
		}
	}


	//SHIP ON SHIP COLLISION
	if (this.frameCounter % 25 == 0) {
		//Tracker.track(" clearing collide flags ");
		collideFlags = new Array();
	}
	var checkCollision = true;
	for (var ssc = 0; ssc < numShips; ssc++) {
		var shipA = this.gameModel.ships[ssc];
		//var shipA_np:Point = new Point(shipA.pos.x + noseP.x, shipA.pos.y + 
		checkCollision = true;
		for (var coll = 0; coll < collideFlags.length; coll++) {

			if (collideFlags[coll] == ssc) {
				checkCollision = false;
				//Tracker.track(" dont do colllision check ");
			}
		}
		if (checkCollision) {
			for (var ssb = 0; ssb < numShips; ssb++) {
				var shipB = this.gameModel.ships[ssb]



				if (ssc != ssb) { //rough collision detection.
					var __dx = shipA.pos.x - shipB.pos.x;
					var __dy = shipA.pos.y - shipB.pos.y;
					var __dist = Math.sqrt((__dx * __dx) + (__dy * __dy));


					if (__dist < 150) {


						//finer collision detection

						//ship A points
						pa = new Point();
						pa.x = shipA.pos.x + shipLayout[0].x;
						pa.y = shipA.pos.y + shipLayout[0].y;
						pb = new Point();
						pb.x = shipA.pos.x + shipLayout[1].x;
						pb.y = shipA.pos.y + shipLayout[1].y;
						pc = new Point();
						pc.x = shipA.pos.x + shipLayout[2].x;
						pc.y = shipA.pos.y + shipLayout[2].y;

						//ship B points
						var b_pa = new Point();
						b_pa.x = shipB.pos.x + shipLayout[0].x;
						b_pa.y = shipB.pos.y + shipLayout[0].y;
						var b_pb = new Point();
						b_pb.x = shipB.pos.x + shipLayout[1].x;
						b_pb.y = shipB.pos.y + shipLayout[1].y;
						var b_pc = new Point();
						b_pc.x = shipB.pos.x + shipLayout[2].x;
						b_pc.y = shipB.pos.y + shipLayout[2].y;

						if (TriangleCheck.check(pa, pb, pc, b_pa) || TriangleCheck.check(pa, pb, pc, b_pb) || TriangleCheck.check(pa, pb, pc, b_pc)) {

							collideFlags.push(ssb, ssc);
							//Tracker.track(" ship on ship collision " + shipA.name + " : " + shipB.name);

							var temp = shipA.vel;
							shipA.vel = shipB.vel;
							shipB.vel = temp;

							//shipA.pos.x -= 10;
							//shipA.pos.y -= 10;
							//
							//shipB.pos.x += 10;
							//shipB.pos.y += 10;

							//var tempPos:Point = shipA.pos;
							//shipA.pos = shipB.pos;
							//shipB.pos = tempPos;

							shipA.rot += Math.random() * 10 + 10;
							shipB.rot += Math.random() * 15 + 15;
						}
					}
				}
			}
		}
	}



	// SHIP ASTEROIDS COLLISION DETECTION
	for (var sc = 0; sc < numShips; sc++) {

		ship = this.gameModel.ships[sc];
		for (var ac = 0; ac < numAsteroids; ac++) {

			asteroid = this.gameModel.asteroids[ac];


			//loop shiplayout
			for (var sl = 0; sl < 3; sl++) {
				if (numShips > 0) {
					var dx = (ship.pos.x + shipLayout[sl].x) - asteroid.pos.x;
					var dy = (ship.pos.y + shipLayout[sl].y) - asteroid.pos.y;

					var dist = Math.sqrt((dx * dx) + (dy * dy)) - 8 - asteroid.diam;

					if (dist < 0) {

						this.gameModel.asteroids.splice(ac, 1);
						//numAsteroids--;			
						numAsteroids += this.removeAsteroid(asteroid);
						/*
									if (asteroid.diam > 15) {
										for (var na:uint = 0; na < 3; na++) {
											var newAsteroid:Asteroid = new Asteroid();
											newAsteroid.diam = asteroid.diam / 3;
											newAsteroid.pos = asteroid.pos;
											newAsteroid.vel.x = asteroid.vel.x * Math.random() * 2 -1;
											newAsteroid.vel.y = asteroid.vel.y * Math.random() * 2 -1;
											GameModel.getInstance().asteroids.push(newAsteroid);
											numAsteroids++;
										}
									}
									*/

						this.shipCollision(ship);

						//GameModel.getInstance().ships.splice(sc, 1);
						//numShips--;								
						//Tracker.track(" SHIP "+ship.name+" COLLIDED WITH ASTEROID " );
					}
				}
			}
		}
	}
	if (numAsteroids < 1) {
		this.createAsteroids();
	}
}

GameLoop.prototype.applyNewPositions = function(obj /*BasePhysics*/ , acc /*Point*/ , secs /*Number*/ ) {

	var g = this.getGravity(obj.pos);
	console.log(obj.pos, g);

	obj.acc.x = g.x + acc.x;
	obj.acc.y = g.y + acc.y;


	if (obj.vel.length() > 0.1) {
		var frictionP = new Point(-obj.vel.x, -obj.vel.y);
		frictionP.normalize(obj.friction);
		obj.acc.x += frictionP.x;
		obj.acc.y += frictionP.y;
	}

	obj.vel.x += obj.acc.x * secs;
	obj.vel.y += obj.acc.y * secs;

	if (obj.vel.length() > obj.maxVel) {
		obj.vel.normalize(obj.maxVel);
	}



	obj.pos.x += obj.vel.x * secs;
	obj.pos.y += obj.vel.y * secs;
}

GameLoop.prototype.getGravity = function(pos /*Point*/ ) {

	var _x = parseInt(parseInt(pos.x, 10) / this.gravityRes, 10);
	var _y = parseInt(parseInt(pos.y, 10) / this.gravityRes, 10);

	var gravW = parseInt(this.SW / this.gravityRes, 10);

	var index = parseInt(_y * gravW + _x, 10);

	//trace("point x  : " + pos.x);
	//trace("point y  : " + pos.y);
	//trace("_x : " + _x);
	//trace("_y : " + _y);
	//trace("gravW : " + gravW);
	//trace("index: " + index);


	var grav = this.gravity[index];

	return grav;
}

GameLoop.prototype.createAsteroids = function() {
	for (var i = 0; i < 100; i++) {
		var asteroid = new Asteroid();
		asteroid.diam = Math.random() * 20 + 20;
		asteroid.friction = 0;
		asteroid.maxVel = 20;
		asteroid.pos = Math.random() > .5 ? new Point(0, Math.random() * this.SH) : new Point(Math.random() * this.SW, 0);
		asteroid.vel = Math.random() > .5 ? new Point(Math.random() * 5 + 5, Math.random() * 5 + 5) : new Point(Math.random() * -5 - 5, Math.random() * -5 - 5);

		this.gameModel.asteroids.push(asteroid);
	}
}

GameLoop.prototype.removeAsteroid = function(asteroid /*Asteroid*/ ) {

	var ret = -1;

	var pos = new Point(asteroid.pos.x, asteroid.pos.y);
	var size = asteroid.diam;
	this.createExplosion(size, pos);

	if (size > 22) {
		for (var na = 0; na < 3; na++) {
			var newAsteroid = new Asteroid();
			newAsteroid.diam = size / 3;
			newAsteroid.pos = asteroid.pos;
			newAsteroid.friction = 0;
			newAsteroid.maxVel = 30;
			newAsteroid.vel.x = asteroid.vel.x * Math.random() * 1 - asteroid.vel.x * 2;
			newAsteroid.vel.y = asteroid.vel.y * Math.random() * 1 - asteroid.vel.y * 2;
			this.gameModel.asteroids.push(newAsteroid);
			ret++;
		}
	}
	return ret;
};

GameLoop.prototype.shipCollision = function(ship /*Ship*/ ) {
	var pos = new Point(ship.pos.x, ship.pos.y);
	this.createExplosion(20, pos);

	var userInput = this.gameModel.userInputs[ship.id];
	userInput.shake = true;


	ship.pos.x = this.SW * .5;
	ship.pos.y = this.SH * .5;
};

GameLoop.prototype.createExplosion = function(size /*int*/ , pos /*Point*/ ) {
	var explosion = new Explosion();
	explosion.pos = pos;
	explosion.size = size;
	this.gameModel.explosions.push(explosion);
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
	this.gameModel.ships.push(new Ship(id, options));
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

GameLoop.prototype.userInput = function(id, buttonArray) {
	var input = {
		left: buttonArray[2],
		right: buttonArray[1],
		thrust: buttonArray[0]
	};

	this.gameModel.userInputs[id] = input;
};

module.exports = GameLoop;