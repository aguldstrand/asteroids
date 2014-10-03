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


		this.dp_rotation = 0;
		this.ds_rotation = 0;
		this.d_rotation = 0;

		this.color = [0, 1, 0, 1];

		this.load();
	}

	Ships.prototype.load = function() {



		var ship1 = WebGL.createPolygon([-20, -20, -18, -18, 40, 0]);
		var ship2 = WebGL.createPolygon([-20, 20, -18, 18, 40, 0]);
		var ship3 = WebGL.createPolygon([-20, 20, -20, -20, -28, 0]);
		var ship4 = WebGL.createPolygon([-20, 20, -20, -20, 0, 0]);
		var ship5 = WebGL.createPolygon([-15, 1, -15, -1, 40, 0]);



		this.shipPolygons = [ship1, ship2, ship3, ship4, ship5];

		var shieldFragVertices = [-0, -15, -0, 15, 5, 0];
		this.shieldPolygon = WebGL.createPolygon(shieldFragVertices);

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



	Ships.prototype.draw = function(program, ships) {

		this.ds_rotation -= 1.5;

		var polygon = this.shipPolygon;
		var uniforms = program.uniforms;



		var positionLocation = uniforms.u_position;
		var rotationLocation = uniforms.u_rotation;
		var scaleLocation = uniforms.u_scale;

		var DEG_TO_RAD = Math.PI / 180.0;

		var gl = WebGL.gl;

		for (var i = ships.length; i--;) {
			var ship = ships[i];

			var epp = this.___gfxCandy(ship);

			var pos = ship.pos;

			for (var s = 0; s < 5; s++) {
				var shipPart = this.shipPolygons[s];


				WebGL.bindAttribBuffer(shipPart.vertexBuffer, program.attributes.a_position, shipPart.itemSize);
				WebGL.bindUniform(uniforms.u_color, ship.color);

				//window.tracker.outFixed(s, epp[s].x + ' ' + epp[s].y + ' ' + epp[s].r);

				gl.uniform2f(positionLocation, pos.x + epp[s].x, pos.y + epp[s].y);
				gl.uniform1f(rotationLocation, (ship.rot + epp[s].r) * DEG_TO_RAD);
				gl.uniform2f(scaleLocation, 1.0, 1.0);

				gl.drawArrays(gl.TRIANGLES, 0, shipPart.vertexCount);

			}
			//SHIELD
			WebGL.bindAttribBuffer(this.shieldPolygon.vertexBuffer, program.attributes.a_position, this.shieldPolygon.itemSize);
			var damageReflection = {};
			for (var j = 0; j < 8; j++) {
				var shieldHealth = ship.shieldHealth[j];
				if (shieldHealth > 0) {

					var shieldFragRotation = (this.ds_rotation + j * 45) * DEG_TO_RAD;
					gl.uniform1f(rotationLocation, shieldFragRotation);

					gl.uniform2f(positionLocation, pos.x + Math.cos(shieldFragRotation) * 45, pos.y + Math.sin(shieldFragRotation) * 45);

					gl.uniform2f(scaleLocation, 1.0, shieldHealth / 8);

					gl.drawArrays(gl.TRIANGLES, 0, this.shieldPolygon.vertexCount);


				}
			}



			// Drones
			WebGL.bindAttribBuffer(this.dronePolygon.vertexBuffer, program.attributes.a_position, this.dronePolygon.itemSize);
			for (j = ship.drones.length; j--;) {
				var drone = ship.drones[j];

				gl.uniform2f(positionLocation, drone.pos.x, drone.pos.y);
				gl.uniform1f(rotationLocation, drone.rot * DEG_TO_RAD);
				gl.uniform2f(scaleLocation, 10.0, 10.0);

				gl.drawArrays(gl.TRIANGLES, 0, this.dronePolygon.vertexCount);
			}


			// Bullets
			WebGL.bindAttribBuffer(this.bulletPolygon.vertexBuffer, program.attributes.a_position, this.bulletPolygon.itemSize);
			for (j = ship.bullets.length; j--;) {
				var bullet = ship.bullets[j];

				gl.uniform2f(positionLocation, bullet.pos.x, bullet.pos.y);
				gl.uniform1f(rotationLocation, Math.atan2(-bullet.vel.y, -bullet.vel.x) - Math.PI);
				gl.uniform2f(scaleLocation, Math.sqrt(bullet.vel.x * bullet.vel.x + bullet.vel.y * bullet.vel.y) * 0.1, 2.0);

				gl.drawArrays(gl.TRIANGLES, 0, this.bulletPolygon.vertexCount);
			}

			// Rockets
			WebGL.bindAttribBuffer(this.bulletPolygon.vertexBuffer, program.attributes.a_position, this.bulletPolygon.itemSize);
			for (j = ship.rockets.length; j--;) {
				var rocket = ship.rockets[j];

				gl.uniform2f(positionLocation, rocket.pos.x, rocket.pos.y);
				gl.uniform1f(rotationLocation, rocket.rot * DEG_TO_RAD);
				gl.uniform2f(scaleLocation, 10.0, 10.0);

				gl.drawArrays(gl.TRIANGLES, 0, this.bulletPolygon.vertexCount);
			}
		}
	};



	/// GFX CANDY


	Ships.prototype.___gfxCandy = function(ship) {
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
		return epp;
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
			};
		}
		return epp;
	};


	return Ships;
});