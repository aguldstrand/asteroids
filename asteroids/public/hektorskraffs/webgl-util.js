define([], function() {

	var Utils = {
		WebGL: null,

		_rectangle: null,

		init: function(WebGL) {
			this.WebGL = WebGL;

			this.initRectangleBuffer();
		},

		resize: function() {
			this.resolution = [this.WebGL.screenWidth, this.WebGL.screenHeight];
		},

		initRectangleBuffer: function() {
			if (this._rectangle) {
				return;
			}

			var gl = this.WebGL.gl;

			var vertexPositions = new Float32Array([
				0.0, 0.0,
				1.0, 0.0,
				0.0, 1.0,
				0.0, 1.0,
				1.0, 0.0,
				1.0, 1.0
			]);

			var vertexColors = new Float32Array([
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0
			]);

			var vertexTexcoords = new Float32Array([
				0.0, 0.0,
				1.0, 0.0,
				0.0, 1.0,
				0.0, 1.0,
				1.0, 0.0,
				1.0, 1.0
			]);

			var vertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);

			var colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);

			var texcoordBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, vertexTexcoords, gl.STATIC_DRAW);

			var rect = this._rectangle = {
				vertexPositions: {
					buffer: vertexBuffer,
					size: 2
				},
				vertexColors: {
					buffer: colorBuffer,
					size: 4
				},
				vertexTexcoords: {
					buffer: texcoordBuffer,
					size: 2
				}
			};

			rect.vertexCount = vertexPositions.length / rect.vertexPositions.size;
		},



		//////////
		// Draw //
		//////////
		drawRectangleColor: function(program, position, scale, color) {
			var WebGL = this.WebGL;

			if (!WebGL.useProgram(program)) {
				return;
			}

			var rect = this._rectangle;
			var attributes = program.attributes;
			var uniforms = program.uniforms;

			WebGL.bindAttribBuffer(rect.vertexPositions.buffer, attributes.a_position, rect.vertexPositions.size);
			WebGL.bindAttribBuffer(rect.vertexColors.buffer, attributes.a_color, rect.vertexColors.size);

			WebGL.bindUniform(uniforms.u_position, position);
			WebGL.bindUniform(uniforms.u_scale, scale);
			WebGL.bindUniform(uniforms.u_resolution, this.resolution);

			WebGL.bindUniform(uniforms.u_color, color);

			WebGL.drawVertices(rect.vertexCount);
		},

		drawRectangleTexture: function(program, position, scale, texture) {
			var WebGL = this.WebGL;

			if (!WebGL.useProgram(program) || texture.loaded === false) {
				return;
			}

			var rect = this._rectangle;
			var attributes = program.attributes;
			var uniforms = program.uniforms;

			WebGL.bindAttribBuffer(rect.vertexPositions.buffer, attributes.a_position, rect.vertexPositions.size);
			WebGL.bindAttribBuffer(rect.vertexTexcoords.buffer, attributes.a_texcoord, rect.vertexTexcoords.size);

			WebGL.bindUniform(uniforms.u_position, position);
			WebGL.bindUniform(uniforms.u_scale, scale);
			WebGL.bindUniform(uniforms.u_resolution, this.resolution);

			WebGL.bindTexture(uniforms.u_texture, texture);

			WebGL.drawVertices(rect.vertexCount);
		}
	};

	return Utils;
});