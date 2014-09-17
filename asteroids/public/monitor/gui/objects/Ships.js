define(['monitor/gui/objects/Poly'], function(Poly) {
	function Ships(pixel, SW, SH) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;

		this.LwingP = {
			x: -20,
			y: -20
		};
		this.LwingPi = {
			x: -18,
			y: -18
		};
		this.RwingP = {
			x: -20,
			y: 20
		};
		this.RwingPi = {
			x: -18,
			y: 18
		};
		this.noseP = {
			x: 40,
			y: 0
		};
		this.rearP = {
			x: -28,
			y: 0
		};

		this.rearIL = {
			x: -15,
			y: -1
		};
		this.rearIR = {
			x: -15,
			y: 1
		};


		this.shieldA1 = {
			x: -45,
			y: -15
		};
		this.shieldA2 = {
			x: -45,
			y: 15
		};
		this.shieldA3 = {
			x: -55,
			y: 0
		};


		this.droneP = {
			x: -65,
			y: 0
		};
		this.droneLW = {
			x: -5,
			y: -5
		};

		this.droneRW = {
			x: -5,
			y: 5
		};

		this.droneN = {
			x: 10,
			y: 0
		};


		this.dp_rotation = 0;
		this.ds_rotation = 0;
		this.d_rotation = 0;


		this.epp = [{
			x: 0,
			y: 0
		}, {
			x: 0,
			y: 0
		}, {
			x: 0,
			y: 0
		}, {
			x: 0,
			y: 0
		}, {
			x: 0,
			y: 0
		}];

		this.localHash = {};
	}

	Ships.prototype.rotate_point = function(point, angle) {
		angle = angle * Math.PI / 180.0;
		return {
			x: Math.cos(angle) * point.x - Math.sin(angle) * point.y,
			y: Math.sin(angle) * point.x + Math.cos(angle) * point.y
		};
	};

	Ships.prototype.___eppAnimation = function(epp) {
		var len = epp.length;
		for (var e = 0; e < len; e++) {
			epp[e].x += epp[e].vx;
			epp[e].y += epp[e].vy;

			epp[e].r += epp[e].rv;

			epp[e].vx *= 0.97;
			epp[e].vy *= 0.97;
			epp[e].rv *= 0.995;
		}
	};
	Ships.prototype.___eppStart = function(epp) {
		var evel = 19;
		var len = epp.length;
		for (var e = 0; e < len; e++) {
			epp[e] = {
				x: 0,
				y: 0,
				vx: (Math.random() - 0.5) * evel * (Math.random() - 0.5) * 2,
				vy: (Math.random() - 0.5) * evel * (Math.random() - 0.5) * 2,
				r: parseInt(Math.random() * 360, 10),
				rv: parseInt((Math.random() - 0.5) * 5, 10)
			};
		}
	};

	Ships.prototype.___eppResetAnimation = function(epp) {
		var evel = 19;
		var len = epp.length;

		var fullReset = false;
		for (var e = 0; e < len; e++) {
			fullReset = false;

			epp[e].x *= 0.95;
			epp[e].y *= 0.95;
			epp[e].r *= 0.95;

			if (Math.abs(epp[e].x) < 2) {
				epp[e].x = 0;
				if (Math.abs(epp[e].y) < 2) {
					epp[e].y = 0;
					if (Math.abs(epp[e].r) < 2) {
						epp[e].r = 0;
						fullReset = true;
					}

				}
			}


		}
		return fullReset;
	};

	Ships.prototype.___eppReset = function(epp) {
		var evel = 19;
		var len = 5;


		for (var e = 0; e < len; e++) {
			epp[e] = {
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				r: 0,
				rv: 0
			}
		};
		return epp;
	};

	Ships.prototype.update = function(step, polys, ships, playerShip, isPlayer) {

		var numPolys = 0;

		this.d_rotation += 1;

		this.ds_rotation -= 1.5;
		this.dp_rotation -= 0.5;


		/*
		var epp = this.epp;
		var e = 0;
		var evel = 19;
		if (epp.length === 0) {
			for (e = 0; e < 5; e++) {
				epp.push({
					x: 0,
					y: 0,
					vx: (Math.random() - .5) * evel * (Math.random() - .5) * 2,
					vy: (Math.random() - .5) * evel * (Math.random() - .5) * 2,
					r: parseInt(Math.random() * 360, 10),
					rv: parseInt((Math.random() - .5) * 5, 10)
				});
			}
		} else {
			for (e = 0; e < 5; e++) {
				epp[e].x += epp[e].vx;
				epp[e].y += epp[e].vy;

				epp[e].r += epp[e].rv;

				epp[e].vx *= 0.97;
				epp[e].vy *= 0.97;
				epp[e].rv *= 0.995;
			}
		}*/

		/*
		{
      "id": "y6vkaWVMX3W0nwyJYLWo",
      "name": "apap",
      "color": "FF0000",
      "rot": 0,
      "bullets": [],
      "score": 0,
      "spawnTimer": -1,
      "friction": 25,
      "maxVel": 200,
      "pos": {
        "x": 0,
        "y": 0
      },
      "vel": {
        "x": 0,
        "y": 0
      },
      "acc": {
        "x": 0,
        "y": 0
      }
    }*/

		var len = ships.length;
		for (var i = 0; i < len; i++) {
			var ship = ships[i];



			if (ship && ship.id === playerShip.id && !isPlayer) {
				continue;
			}

			if (ship && ship.id !== playerShip.id && isPlayer) {
				continue;
			}



			if (!this.localHash[ship.id]) {
				this.localHash[ship.id] = {
					epp: this.___eppReset([]),
					eppStarted: false
				};
			}

			var localHash = this.localHash[ship.id];
			var epp = localHash.epp;

			if (!ship.alive) {
				if (!localHash.eppStarted) {
					this.___eppStart(epp);
					localHash.eppStarted = true;
				}
				this.___eppAnimation(epp);
			} else {
				if (localHash.eppStarted) {
					if (this.___eppResetAnimation(epp)) {
						localHash.eppStarted = false;
						this.___eppReset(epp);
					}
				}
			}



			//window.tracker.outFixed('ship' + i, ship.pos.x + ':' + ship.pos.y);

			//SHIP
			var Lwing = this.rotate_point(this.LwingP, ship.rot + epp[0].r);
			var Lwingi = this.rotate_point(this.LwingPi, ship.rot + epp[0].r);
			var Rwing = this.rotate_point(this.RwingP, ship.rot + epp[1].r);
			var Rwingi = this.rotate_point(this.RwingPi, ship.rot + epp[1].r);
			var Nose = this.rotate_point(this.noseP, ship.rot + epp[2].r);
			var Rear = this.rotate_point(this.rearP, ship.rot + epp[3].r);
			var RearIR = this.rotate_point(this.rearIR, ship.rot + epp[3].r);
			var RearIL = this.rotate_point(this.rearIL, ship.rot + epp[3].r);


			numPolys += Poly.addR(ship.pos.x + epp[0].x, ship.pos.y + epp[0].y, Lwing.x, Lwing.y, Lwingi.x, Lwingi.y, Nose.x, Nose.y, polys, 1);
			numPolys += Poly.addR(ship.pos.x + epp[1].x, ship.pos.y + epp[1].y, Rwing.x, Rwing.y, Rwingi.x, Rwingi.y, Nose.x, Nose.y, polys, 1);
			numPolys += Poly.addR(ship.pos.x + epp[2].x, ship.pos.y + epp[2].y, Rwing.x, Rwing.y, Lwing.x, Lwing.y, Rear.x, Rear.y, polys, 1);
			numPolys += Poly.addR(ship.pos.x + epp[3].x, ship.pos.y + epp[3].y, Rwing.x, Rwing.y, Lwing.x, Lwing.y, 0, 0, polys, 1);
			numPolys += Poly.addR(ship.pos.x + epp[4].x, ship.pos.y + epp[4].y, RearIR.x, RearIR.y, RearIL.x, RearIL.y, Nose.x, Nose.y, polys, 1);

			//numPolys += Poly.addR(ship.pos.x, ship.pos.y, 0, 0, 2, 2, ship.vel.x, ship.vel.y, polys, 1);

			var j;

			//SHIELD
			var damageReflection = {};
			for (j = 0; j < 8; j++) {
				var shieldHealth = ship.shieldHealth[j];
				if (shieldHealth > 0) {
					var rs1 = this.rotate_point(this.shieldA1, this.ds_rotation + j * 45);
					var rs2 = this.rotate_point(this.shieldA2, this.ds_rotation + j * 45);

					damageReflection = {
						x: this.shieldA3.x + 10 - shieldHealth,
						y: this.shieldA3.y
					};
					var rs3 = this.rotate_point(damageReflection, this.ds_rotation + j * 45);
					numPolys += Poly.addR(ship.pos.x, ship.pos.y, rs1.x, rs1.y, rs2.x, rs2.y, rs3.x, rs3.y, polys, 1);
				}
			}

			//DRONE
			var drones = ship.drones;
			var numDrones = drones.length;
			for (j = 0; j < numDrones; j++) {
				var drone = drones[j];

				var droneP = this.rotate_point(this.droneP, this.dp_rotation);
				var droneLW = this.rotate_point(this.droneLW, drone.rot);
				var droneRW = this.rotate_point(this.droneRW, drone.rot);
				var droneN = this.rotate_point(this.droneN, drone.rot);
				numPolys += Poly.addR(drone.pos.x, drone.pos.y, droneLW.x, droneLW.y, droneRW.x, droneRW.y, droneN.x, droneN.y, polys, 1);

				//numPolys += Poly.addR(drone.pos.x, drone.pos.y, 0, 0, 2, 2, drone.vel.x, drone.vel.y, polys, 1);
			}


			//BULLETS
			var numBullets = ship.bullets.length;
			for (var b = 0; b < numBullets; b++) {
				var bullet = ship.bullets[b];
				numPolys += Poly.addR(bullet.pos.x, bullet.pos.y, 0, 0, 2, 2, bullet.vel.x * 0.1, bullet.vel.y * 0.1, polys, 1);
				//numPolys += Poly.add(bullet.pos.x, bullet.pos.y, 20, 20, polys);
				//window.tracker.outFixed('bullet' + b, bullet.vel.x + ':' + bullet.vel.y);
			}

			//BULLETS
			var numRockets = ship.rockets.length;
			for (b = 0; b < numRockets; b++) {
				var rocket = ship.rockets[b];
				numPolys += Poly.addR(rocket.pos.x, rocket.pos.y, -3, -3, 2, 2, rocket.vel.x * 0.1, rocket.vel.y * 0.1, polys, 1);
			}
		}



		return numPolys;


	};



	return Ships;
});