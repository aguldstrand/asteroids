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
		var vertices = [
			-20, -20,
			-18, -18,
			40, 0,
			-20, 20,
			-18, 18,
			40, 0,
			-20, 20,
			-20, -20,
			-28, 0,
			-20, 20,
			-20, -20,
			0, 0,
			-15, 1,
			-15, -1,
			40, 0
		];
		this.shipPolygon = WebGL.createPolygon(vertices);


		var droneVertices = [
			0.0, 0.0,
			1.5, 0.5,
			0.0, 1.0
		];
		this.dronePolygon = WebGL.createPolygon(droneVertices);


		var bulletVertices = [
			0.0, 0.0,
			1.0, 0.5,
			0.0, 1.0
		];
		this.bulletPolygon = WebGL.createPolygon(bulletVertices);
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

			//ROCKETS
			var numRockets = ship.rockets.length;
			for (b = 0; b < numRockets; b++) {
				var rocket = ship.rockets[b];
				numPolys += Poly.addR(rocket.pos.x, rocket.pos.y, -3, -3, 2, 2, rocket.vel.x * 0.1, rocket.vel.y * 0.1, polys, 1);
			}
		}



		return numPolys;
	};


	Ships.prototype.draw = function(program, ships) {
		var polygon = this.shipPolygon;
		var uniforms = program.uniforms;


		var positionLocation = uniforms.u_position;
		var rotationLocation = uniforms.u_rotation;
		var scaleLocation = uniforms.u_scale;

		var DEG_TO_RAD = Math.PI / 180.0;

		var gl = WebGL.gl;
		var vertexCount = polygon.vertexCount;
		for (var i = ships.length; i--; ) {
			var ship = ships[i];
			var pos = ship.pos;

			WebGL.bindAttribBuffer(polygon.vertexBuffer, program.attributes.a_position, polygon.itemSize);
			WebGL.bindUniform(uniforms.u_color, ship.color);

			gl.uniform2f(positionLocation, pos.x, pos.y);
			gl.uniform1f(rotationLocation, ship.rot * DEG_TO_RAD);
			gl.uniform1f(scaleLocation, 1.0);

			gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

			// Drones
			WebGL.bindAttribBuffer(this.dronePolygon.vertexBuffer, program.attributes.a_position, this.dronePolygon.itemSize);
			for (var j = ship.drones.length; j--; ) {
				var drone = ship.drones[j];

				gl.uniform2f(positionLocation, drone.pos.x, drone.pos.y);
				gl.uniform1f(rotationLocation, drone.rot * DEG_TO_RAD);
				gl.uniform1f(scaleLocation, 10.0);

				gl.drawArrays(gl.TRIANGLES, 0, this.dronePolygon.vertexCount);
			}			


			// Bullets
			WebGL.bindAttribBuffer(this.bulletPolygon.vertexBuffer, program.attributes.a_position, this.bulletPolygon.itemSize);
			for (j = ship.bullets.length; j--; ) {
				var bullet = ship.bullets[j];

				gl.uniform2f(positionLocation, bullet.pos.x, bullet.pos.y);
				gl.uniform1f(rotationLocation, Math.tan(bullet.vel.x, bullet.vel.y));
				gl.uniform1f(scaleLocation, 10.0);

				gl.drawArrays(gl.TRIANGLES, 0, this.bulletPolygon.vertexCount);
			}

			// Rockets
			WebGL.bindAttribBuffer(this.bulletPolygon.vertexBuffer, program.attributes.a_position, this.bulletPolygon.itemSize);
			for (j = ship.rockets.length; j--; ) {
				var rocket = ship.rockets[j];

				gl.uniform2f(positionLocation, rocket.pos.x, rocket.pos.y);
				gl.uniform1f(rotationLocation, rocket.rot * DEG_TO_RAD);
				gl.uniform1f(scaleLocation, 10.0);

				gl.drawArrays(gl.TRIANGLES, 0, this.bulletPolygon.vertexCount);
			}
		}
	};


	return Ships;
});