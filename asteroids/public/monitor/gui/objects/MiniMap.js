define(['hektorskraffs/webgl'], function(WebGL) {
	function MiniMap(pixel, SW, SH) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;

		this.load();

	}


	MiniMap.prototype.load = function() {

		var vertices = [
			0.0, 0.0,
			1.0, 0.5,
			0.0, 1.0
		];
		this.shipColor = [1, 0.0, 0.0, 1];
		this.activeShipColor = [0.0, 1.0, 0.0, 1];
		this.asteroidColor = [0.5, 0.5, 0.5, 1];
		this.polygon = WebGL.createPolygon(vertices);
	};


	MiniMap.prototype.draw = function(program, gameModel, focusPoint, id) {



		var uniforms = program.uniforms;



		var positionLocation = uniforms.u_position;
		var rotationLocation = uniforms.u_rotation;
		var scaleLocation = uniforms.u_scale;

		var DEG_TO_RAD = Math.PI / 180.0;

		var gl = WebGL.gl;

		var scale = 0.05;
		var numShips = gameModel.ships.length;

		for (var i = 0; i < numShips; i++) {
			var ship = gameModel.ships[i];

			WebGL.bindAttribBuffer(this.polygon.vertexBuffer, program.attributes.a_position, this.polygon.itemSize);
			if (ship.id === id) {
				WebGL.bindUniform(uniforms.u_color, this.activeShipColor);
			} else {
				WebGL.bindUniform(uniforms.u_color, this.shipColor);
			}


			//window.tracker.outFixed(s, epp[s].x + ' ' + epp[s].y + ' ' + epp[s].r);

			gl.uniform2f(positionLocation, focusPoint.x + ship.pos.x * scale, focusPoint.y + ship.pos.y * scale);

			gl.uniform1f(rotationLocation, ship.rot * DEG_TO_RAD);


			gl.uniform2f(scaleLocation, 10, 10);

			gl.drawArrays(gl.TRIANGLES, 0, this.polygon.vertexCount);


		}



		var numAsteroids = gameModel.asteroids.length;
		for (var j = 0; j < numAsteroids; j++) {
			var asteroid = gameModel.asteroids[j];

			WebGL.bindAttribBuffer(this.polygon.vertexBuffer, program.attributes.a_position, this.polygon.itemSize);
			WebGL.bindUniform(uniforms.u_color, this.asteroidColor);

			//window.tracker.outFixed(s, epp[s].x + ' ' + epp[s].y + ' ' + epp[s].r);

			gl.uniform2f(positionLocation, focusPoint.x + asteroid.pos.x * scale, focusPoint.y + asteroid.pos.y * scale);

			gl.uniform1f(rotationLocation, 0);


			gl.uniform2f(scaleLocation, 3, 3);

			gl.drawArrays(gl.TRIANGLES, 0, this.polygon.vertexCount);

		}


	};



	return MiniMap;
});