define(['monitor/gui/objects/Poly',
	'hektorskraffs/webgl'
], function(Poly, WebGL) {
	function StarGrid(pixel, SW, SH) {
		this.pixel = pixel;
		this.SH = SH;
		this.SW = SW;



		this.load();

	}


	StarGrid.prototype.load = function() {
		var scale = 40;
		var xlen = this.SW / scale;
		var ylen = this.SH / scale;

		var verts = [];
		for (var x = 0; x < xlen; x++) {
			verts.push(x * scale, 0, x * scale, this.SH);
		}

		for (var y = 0; y < ylen; y++) {
			verts.push(0, y * scale, this.SW, y * scale);
		}
		this.vertPol = WebGL.createPolygon(verts);
		this.color = [0.1, 0.3, 0.1, 1];

	};

	StarGrid.prototype.genereateGrid = function() {


	};


	StarGrid.prototype.draw = function(program) {


		var vertPol = this.vertPol;
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
		gl.uniform2f(scaleLocation, 10, 10);


		gl.drawArrays(gl.LINES, 0, vertPol.vertexCount);
	};



	return StarGrid;
});