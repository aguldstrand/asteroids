define([
	'monitor/gui/objects/Poly',

	'hektorskraffs/webgl'
], function(
	Poly,

	WebGL
) {
	function Asteroids(pixel, screenWidth, screenHeight) {
		this.pixel = pixel;
		this.screenHeight = screenHeight;
		this.screenWidth = screenWidth;
		this.asteroids = [];

		this.p = {
			x: 0,
			y: 0
		};

		this.color = [0.5, 0.5, 0.5, 1];

		this.load();
	}


	Asteroids.prototype.load = function() {
		var vertices = [];
		var x = 0;
		var y = 0;
		var radius = 1.0;
		var rotation = 0.0;
		var point = {
			x: 1,
			y: 0
		};

		Poly.setFocusPoint({
			x: 0,
			y: 0
		});

		for (var i = 0; i < 8; i++) {
			var ap = this.rotate_point(point, (i * 45 - 45) + rotation);
			var rp = this.rotate_point(point, (i * 45) + rotation);

			Poly.addR(x, y, ap.x, ap.y, rp.x, rp.y, 0, 0, vertices, 1);
		}

		this.polygon = WebGL.createPolygon(vertices);
	};


	Asteroids.prototype.rotate_point = function(point, angle) {
		angle = angle * Math.PI / 180.0;
		return {
			x: Math.cos(angle) * point.x - Math.sin(angle) * point.y,
			y: Math.sin(angle) * point.x + Math.cos(angle) * point.y
		};
	};


	Asteroids.prototype.draw = function(program, asteroids) {
		var polygon = this.polygon;
		var uniforms = program.uniforms;

		WebGL.bindAttribBuffer(polygon.vertexBuffer, program.attributes.a_position, polygon.itemSize);
		WebGL.bindUniform(uniforms.u_color, this.color);
		WebGL.bindUniform(uniforms.u_resolution, [WebGL.screenWidth, WebGL.screenHeight]);

		var positionLocation = uniforms.u_position;
		var rotationLocation = uniforms.u_rotation;
		var scaleLocation = uniforms.u_scale;

		var DEG_TO_RAD = Math.PI / 180.0;

		var gl = WebGL.gl;
		var vertexCount = polygon.vertexCount;
		for (var i = asteroids.length; i--;) {
			var asteroid = asteroids[i];
			var pos = asteroid.pos;

			gl.uniform2f(positionLocation, pos.x, pos.y);
			gl.uniform1f(rotationLocation, asteroid.rot * DEG_TO_RAD);
			gl.uniform2f(scaleLocation, asteroid.diam, asteroid.diam);

			gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
		}
	};

	Asteroids.prototype.draw3d = function(program, camera, asteroids) {
		var polygon = this.polygon;
		var uniforms = program.uniforms;

		WebGL.bindAttribBuffer(polygon.vertexBuffer, program.attributes.a_position, polygon.itemSize);

		var DEG_TO_RAD = Math.PI / 180.0;

		var position = vec3.create();
		var world = mat4.create();
		var rotate = mat4.create();
		var translate = mat4.create();
		var wvp = mat4.create();


		var gl = WebGL.gl;
		var vertexCount = polygon.vertexCount;
		for (var i = asteroids.length; i--;) {
			var asteroid = asteroids[i];
			var pos = asteroid.pos;

			vec3.set(position, pos.x, pos.y, 1);

			mat4.identity(world);
			mat4.identity(wvp);

			// mat4.rotateZ(rotate, rotate, asteroid.rot * DEG_TO_RAD);
			mat4.translate(translate, translate, position);

			// mat4.mul(world, translate, rotate);

			mat4.multiply(wvp, translate, camera.viewProjection);

			gl.uniformMatrix4fv(uniforms.u_wvp, false, wvp);

			gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
		}
	};



	return Asteroids;
});