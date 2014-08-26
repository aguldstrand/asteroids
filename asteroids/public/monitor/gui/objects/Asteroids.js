define([
	'monitor/gui/objects/Poly',

	'hektorskraffs/webgl',
	'hektorskraffs/webgl-util'
], function(
	Poly,

	WebGL,
	Util
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


		Util.init(WebGL);
		Util.resize(window.innerWidth, window.innerHeight);
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

		var positionLocation = uniforms.u_position;
		var rotationLocation = uniforms.u_rotation;
		var scaleLocation = uniforms.u_scale;

		var DEG_TO_RAD = Math.PI / 180.0;

		var gl = WebGL.gl;
		var vertexCount = polygon.vertexCount;
		for (var i = asteroids.length; i--; ) {
			var asteroid = asteroids[i];
			var pos = asteroid.pos;

			gl.uniform2f(positionLocation, pos.x, pos.y);
			gl.uniform1f(rotationLocation, asteroid.rot * DEG_TO_RAD);
			gl.uniform1f(scaleLocation, asteroid.diam);

			gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
		}



		Util.drawRectangleColor(program, [0.0, 0.0], [400.0], [0, 255, 0, 1]);
	};



	return Asteroids;
});