define(['monitor/gui/objects/Poly',
	'hektorskraffs/webgl'
], function(Poly, WebGL) {
	function Debug(pixel, SW, SH) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;



		this.load();

	}


	Debug.prototype.load = function() {

		var gravityBeamVertices = [
			0.0, 0.0,
			1.0, 0.5,
			0.0, 1.0
		];
		this.color = [1, 0.0, 1.0, 1];
		this.gravityBeamVertices = WebGL.createPolygon(gravityBeamVertices);
	};


	Debug.prototype.draw = function(program, gravity) {


		var uniforms = program.uniforms;



		var positionLocation = uniforms.u_position;
		var rotationLocation = uniforms.u_rotation;
		var scaleLocation = uniforms.u_scale;

		//var DEG_TO_RAD = Math.PI / 180.0;

		var gl = WebGL.gl;



		var gravityRes = 50;


		/*WebGL.bindAttribBuffer(this.gravityBeamVertices.vertexBuffer, program.attributes.a_position, this.gravityBeamVertices.itemSize);
		WebGL.bindUniform(uniforms.u_color, [0, 0, 0, 0.01]);

		

		gl.uniform2f(positionLocation, 0, 0);
		gl.uniform1f(rotationLocation, 0);
		gl.uniform2f(scaleLocation, 100000, 100000);

		gl.drawArrays(gl.TRIANGLES, 0, this.gravityBeamVertices.vertexCount);*/



		var yMax = parseInt(3000 / gravityRes, 10);
		var xMax = parseInt(3000 / gravityRes, 10);

		for (var y = 0; y < yMax; y++) {
			for (var x = 0; x < xMax; x++) {

				var g = gravity[x + y * xMax];


				if (Math.abs(g.x) > 25 || Math.abs(g.y) > 25) {

					WebGL.bindAttribBuffer(this.gravityBeamVertices.vertexBuffer, program.attributes.a_position, this.gravityBeamVertices.itemSize);
					WebGL.bindUniform(uniforms.u_color, this.color);

					//window.tracker.outFixed(s, epp[s].x + ' ' + epp[s].y + ' ' + epp[s].r);
					var scale = Math.sqrt(g.x * g.x + g.y * g.y);
					gl.uniform2f(positionLocation, x * gravityRes, y * gravityRes);
					gl.uniform1f(rotationLocation, Math.atan2(-g.y, -g.x) - Math.PI);
					gl.uniform2f(scaleLocation, scale, scale * 0.01);

					gl.drawArrays(gl.TRIANGLES, 0, this.gravityBeamVertices.vertexCount);

					if (g.warp) {

					}
				}
				//numPolys += Poly.addR(x * gravityRes, y * gravityRes, 0, 0, 2, 2, 0, 2, polys, 1);
			}
		}
	};



	return Debug;
});