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


	}

	Ships.prototype.rotate_point = function(point, angle) {
		angle = angle * Math.PI / 180.0;
		return {
			x: Math.cos(angle) * point.x - Math.sin(angle) * point.y,
			y: Math.sin(angle) * point.x + Math.cos(angle) * point.y
		};
	};

	Ships.prototype.update = function(step, polys) {

		var numPolys = 0;

		this.d_rotation += 1;

		this.ds_rotation -= 1.5;
		this.dp_rotation -= 0.5;

		var ships = [{
			rotation: this.d_rotation,
			x: 300,
			y: 300,
			scale: 1,
			shieldHealth: [10, 10, 10, 2, 10, 10, 10, 4]
		}, {
			rotation: this.d_rotation,
			x: 600,
			y: 300,
			scale: 1,
			shieldHealth: [5, 0, 0, 2, 5, 5, 7, 1]
		}];

		var len = ships.length;
		for (var i = 0; i < len; i++) {
			var ship = ships[i];


			//SHIP
			var Lwing = this.rotate_point(this.LwingP, ship.rotation);
			var Lwingi = this.rotate_point(this.LwingPi, ship.rotation);
			var Rwing = this.rotate_point(this.RwingP, ship.rotation);
			var Rwingi = this.rotate_point(this.RwingPi, ship.rotation);
			var Nose = this.rotate_point(this.noseP, ship.rotation);
			var Rear = this.rotate_point(this.rearP, ship.rotation);
			var RearIR = this.rotate_point(this.rearIR, ship.rotation);
			var RearIL = this.rotate_point(this.rearIL, ship.rotation);


			numPolys += Poly.addR(ship.x, ship.y, Lwing.x, Lwing.y, Lwingi.x, Lwingi.y, Nose.x, Nose.y, polys, ship.scale);
			numPolys += Poly.addR(ship.x, ship.y, Rwing.x, Rwing.y, Rwingi.x, Rwingi.y, Nose.x, Nose.y, polys, ship.scale);
			numPolys += Poly.addR(ship.x, ship.y, Rwing.x, Rwing.y, Lwing.x, Lwing.y, Rear.x, Rear.y, polys, ship.scale);
			numPolys += Poly.addR(ship.x, ship.y, Rwing.x, Rwing.y, Lwing.x, Lwing.y, 0, 0, polys, ship.scale);
			numPolys += Poly.addR(ship.x, ship.y, RearIR.x, RearIR.y, RearIL.x, RearIL.y, Nose.x, Nose.y, polys, ship.scale);

			//FUCK

			//SHIELD
			var damageReflection = {};
			for (var j = 0; j < 8; j++) {
				var rs1 = this.rotate_point(this.shieldA1, this.ds_rotation + j * 45);
				var rs2 = this.rotate_point(this.shieldA2, this.ds_rotation + j * 45);

				damageReflection = {
					x: this.shieldA3.x + 10 - ship.shieldHealth[j],
					y: this.shieldA3.y
				};
				var rs3 = this.rotate_point(damageReflection, this.ds_rotation + j * 45);
				numPolys += Poly.addR(ship.x, ship.y, rs1.x, rs1.y, rs2.x, rs2.y, rs3.x, rs3.y, polys, ship.scale);
			}

			//DRONE
			var droneP = this.rotate_point(this.droneP, this.dp_rotation);
			var droneLW = this.rotate_point(this.droneLW, ship.rotation);
			var droneRW = this.rotate_point(this.droneRW, ship.rotation);
			var droneN = this.rotate_point(this.droneN, ship.rotation);
			numPolys += Poly.addR(ship.x + droneP.x, ship.y + droneP.y, droneLW.x, droneLW.y, droneRW.x, droneRW.y, droneN.x, droneN.y, polys, ship.scale);



		}



		return numPolys;


	};



	return Ships;
});