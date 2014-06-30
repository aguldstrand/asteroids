define([
	'monitor/gui/objects/Poly',

	'hektorskraffs/webgl'
], function(
	Poly,

	WebGL
) {
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

		this.color = [0, 1, 0, 1];

		this.load();
	}

	Ships.prototype.load = function() {
		var vertices = [];

		var x = 0;
		var y = 0;
		var rotation = 0;

		var Lwing = this.rotate_point(this.LwingP, rotation);
		var Lwingi = this.rotate_point(this.LwingPi, rotation);
		var Rwing = this.rotate_point(this.RwingP, rotation);
		var Rwingi = this.rotate_point(this.RwingPi, rotation);
		var Nose = this.rotate_point(this.noseP, rotation);
		var Rear = this.rotate_point(this.rearP, rotation);
		var RearIR = this.rotate_point(this.rearIR, rotation);
		var RearIL = this.rotate_point(this.rearIL, rotation);

		Poly.addR(x, y, Lwing.x, Lwing.y, Lwingi.x, Lwingi.y, Nose.x, Nose.y, vertices, 1);
		Poly.addR(x, y, Rwing.x, Rwing.y, Rwingi.x, Rwingi.y, Nose.x, Nose.y, vertices, 1);
		Poly.addR(x, y, Rwing.x, Rwing.y, Lwing.x, Lwing.y, Rear.x, Rear.y, vertices, 1);
		Poly.addR(x, y, Rwing.x, Rwing.y, Lwing.x, Lwing.y, 0, 0, vertices, 1);
		Poly.addR(x, y, RearIR.x, RearIR.y, RearIL.x, RearIL.y, Nose.x, Nose.y, vertices, 1);

		// Poly.addR(x, y, 0, 0, 2, 2, ship.vel.x, ship.vel.y, polys, 1);


		this.shipPolygon = WebGL.createPolygon(vertices);
	};




	Ships.prototype.rotate_point = function(point, angle) {
		angle = angle * Math.PI / 180.0;
		return {
			x: Math.cos(angle) * point.x - Math.sin(angle) * point.y,
			y: Math.sin(angle) * point.x + Math.cos(angle) * point.y
		};
	};

	Ships.prototype.update = function(step, polys, ships) {

		var numPolys = 0;

		this.d_rotation += 1;

		this.ds_rotation -= 1.5;
		this.dp_rotation -= 0.5;


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

			window.tracker.outFixed('ship' + i, ship.pos.x + ':' + ship.pos.y);

			//SHIP
			var Lwing = this.rotate_point(this.LwingP, ship.rot);
			var Lwingi = this.rotate_point(this.LwingPi, ship.rot);
			var Rwing = this.rotate_point(this.RwingP, ship.rot);
			var Rwingi = this.rotate_point(this.RwingPi, ship.rot);
			var Nose = this.rotate_point(this.noseP, ship.rot);
			var Rear = this.rotate_point(this.rearP, ship.rot);
			var RearIR = this.rotate_point(this.rearIR, ship.rot);
			var RearIL = this.rotate_point(this.rearIL, ship.rot);


			numPolys += Poly.addR(ship.pos.x, ship.pos.y, Lwing.x, Lwing.y, Lwingi.x, Lwingi.y, Nose.x, Nose.y, polys, 1);
			numPolys += Poly.addR(ship.pos.x, ship.pos.y, Rwing.x, Rwing.y, Rwingi.x, Rwingi.y, Nose.x, Nose.y, polys, 1);
			numPolys += Poly.addR(ship.pos.x, ship.pos.y, Rwing.x, Rwing.y, Lwing.x, Lwing.y, Rear.x, Rear.y, polys, 1);
			numPolys += Poly.addR(ship.pos.x, ship.pos.y, Rwing.x, Rwing.y, Lwing.x, Lwing.y, 0, 0, polys, 1);
			numPolys += Poly.addR(ship.pos.x, ship.pos.y, RearIR.x, RearIR.y, RearIL.x, RearIL.y, Nose.x, Nose.y, polys, 1);

			numPolys += Poly.addR(ship.pos.x, ship.pos.y, 0, 0, 2, 2, ship.vel.x, ship.vel.y, polys, 1);

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

				numPolys += Poly.addR(drone.pos.x, drone.pos.y, 0, 0, 2, 2, drone.vel.x, drone.vel.y, polys, 1);
			}


			//BULLETS
			var numBullets = ship.bullets.length;
			for (var b = 0; b < numBullets; b++) {
				var bullet = ship.bullets[b];
				numPolys += Poly.addR(bullet.pos.x, bullet.pos.y, 0, 0, 2, 2, bullet.vel.x * 0.1, bullet.vel.y * 0.1, polys, 1);
				//numPolys += Poly.add(bullet.pos.x, bullet.pos.y, 20, 20, polys);
				//window.tracker.outFixed('bullet' + b, bullet.vel.x + ':' + bullet.vel.y);
			}
		}



		return numPolys;
	};


	Ships.prototype.draw = function(program, ships) {
		var polygon = this.shipPolygon;
		var uniforms = program.uniforms;

		WebGL.bindAttribBuffer(polygon.vertexBuffer, program.attributes.a_position, polygon.itemSize);
		WebGL.bindUniform(uniforms.u_color, this.color);

		var positionLocation = uniforms.u_position;
		var rotationLocation = uniforms.u_rotation;
		var scaleLocation = uniforms.u_scale;

		var DEG_TO_RAD = Math.PI / 180.0;

		var gl = WebGL.gl;
		var vertexCount = polygon.vertexCount;
		for (var i = ships.length; i--; ) {
			var ship = ships[i];
			var pos = ship.pos;

			gl.uniform2f(positionLocation, pos.x, pos.y);
			gl.uniform1f(rotationLocation, ship.rot * DEG_TO_RAD);
			gl.uniform1f(scaleLocation, 1.0);

			gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
		}
	};



	return Ships;
});