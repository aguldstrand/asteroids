define(['monitor/gui/objects/Poly',
	'hektorskraffs/webgl',
	'./ParticleSystem',
	'./RParticleSystem'
], function(Poly, WebGL, ParticleSystem, RParticleSystem) {
	function Debug(pixel, SW, SH) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;



		this.load();

		this.ps = new ParticleSystem(2400);
		this.rps = new RParticleSystem(2400);

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


	Debug.prototype.draw = function(program, gameModel) {


		//this.___polygonMode(program, gameModel);
		this.___particleMode(program, gameModel);
	};
	Debug.prototype.___polygonMode = function(program, gameModel) {

		var gravity = gameModel.gravity;

		var uniforms = program.uniforms;

		var positionLocation = uniforms.u_position;
		var rotationLocation = uniforms.u_rotation;
		var scaleLocation = uniforms.u_scale;

		var gl = WebGL.gl;

		var gravityRes = 50;

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

	Debug.prototype.___particleMode = function(program, gameModel) {

		//window.tracker.outFixed('ps', this.ps.pool[0]);
		var vertices = [];


		this.ps.add(150, gameModel.warpTo, {
			x: 5,
			y: 5
		}, 100);

		vertices = vertices.concat(this.ps.update(1));
		//vertices = this.ps.update(1);


		this.rps.add(25, gameModel.warpFrom, 5, 100);

		vertices = vertices.concat(this.rps.update(1));


		this.ps.draw(program, vertices);

		/*
		var vertPol = WebGL.createPolygon(vertices);

		var uniforms = program.uniforms;

		var positionLocation = uniforms.u_position;
		var rotationLocation = uniforms.u_rotation;
		var scaleLocation = uniforms.u_scale;



		var gl = WebGL.gl;



		WebGL.bindAttribBuffer(vertPol.vertexBuffer, program.attributes.a_position, vertPol.itemSize);

		WebGL.bindUniform(uniforms.u_color, this.color);

		//window.tracker.outFixed(s, epp[s].x + ' ' + epp[s].y + ' ' + epp[s].r);

		gl.uniform2f(positionLocation, 0, 0);
		gl.uniform1f(rotationLocation, 0);
		gl.uniform2f(scaleLocation, 1, 1);


		gl.drawArrays(gl.LINES, 0, vertPol.vertexCount);*/
	};



	return Debug;
});