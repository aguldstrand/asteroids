define(['glmatrix'], function(glMatrix) {
	var vec2 = glMatrix.vec2;


	var Utils = {
		WebGL: null,

		_rectangle: null,

		init: function(WebGL) {
			this.WebGL = WebGL;

			this.initRectangleBuffer();
			this.initCircleBuffer();
		},

		resize: function() {
			this.resolution = vec2.fromValues(this.WebGL.screenWidth, this.WebGL.screenHeight);
			// this.resolution = vec2.fromValues(512, 512);
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


		initCircleBuffer: function() {
			if (this._circle) {
				return;
			}
			var gl = this.WebGL.gl;

			var angleCount = 64;
			var delta = (Math.PI * 2) / angleCount;

			var angle = 0.0;
			var vertices = [];
			for (var i = 0; i < angleCount; i++) {
				vertices.push(0.0, 0.0); // center
				vertices.push(Math.cos(angle), Math.sin(angle));
				angle += delta;
				vertices.push(Math.cos(angle), Math.sin(angle));
			}


			var vertexPositions = new Float32Array(vertices);

			var vertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);

			var circle = this._circle = {
				vertexPositions: {
					buffer: vertexBuffer,
					size: 2
				}
			};

			circle.vertexCount = vertexPositions.length / circle.vertexPositions.size;
		},


		//////////
		// Draw //
		//////////
		drawRectangleColor: function(program, position, scale, color, resolution) {
			var WebGL = this.WebGL;

			if (!WebGL.useProgram(program)) {
				return;
			}

			var rect = this._rectangle;
			var attributes = program.attributes;
			var uniforms = program.uniforms;

			WebGL.bindAttribBuffer(rect.vertexPositions.buffer, attributes.a_position, rect.vertexPositions.size);
			// WebGL.bindAttribBuffer(rect.vertexColors.buffer, attributes.a_color, rect.vertexColors.size);

			WebGL.bindUniform(uniforms.u_position, position);
			WebGL.bindUniform(uniforms.u_scale, scale);
			WebGL.bindUniform(uniforms.u_resolution, resolution || this.resolution);

			WebGL.bindUniform(uniforms.u_color, color);

			WebGL.drawVertices(rect.vertexCount);
		},

		drawRectangleTexture: function(program, position, scale, texture, resolution) {
			var WebGL = this.WebGL;

			if (!WebGL.useProgram(program) || (texture && texture.loaded === false)) {
				return;
			}

			var rect = this._rectangle;
			var attributes = program.attributes;
			var uniforms = program.uniforms;

			WebGL.bindAttribBuffer(rect.vertexPositions.buffer, attributes.a_position, rect.vertexPositions.size);
			WebGL.bindAttribBuffer(rect.vertexTexcoords.buffer, attributes.a_texcoord, rect.vertexTexcoords.size);

			WebGL.bindUniform(uniforms.u_position, position);
			WebGL.bindUniform(uniforms.u_scale, scale);
			WebGL.bindUniform(uniforms.u_resolution, resolution || this.resolution);

			if (texture) {
				if (texture.length) {
					for (var i = 0; i < texture.length; i++) {
						WebGL.bindTexture(uniforms['u_texture' + (i + 1)], texture[i], i);
					}
				} else {
					WebGL.bindTexture(uniforms.u_texture, texture);
				}
			}

			WebGL.drawVertices(rect.vertexCount);
		},

		drawCircleColor: function(program, position, scale, color, resolution) {
			var WebGL = this.WebGL;

			if (!WebGL.useProgram(program)) {
				return;
			}

			var circle = this._circle;
			var attributes = program.attributes;
			var uniforms = program.uniforms;

			WebGL.bindAttribBuffer(circle.vertexPositions.buffer, attributes.a_position, circle.vertexPositions.size);

			WebGL.bindUniform(uniforms.u_position, position);
			WebGL.bindUniform(uniforms.u_scale, scale);
			WebGL.bindUniform(uniforms.u_resolution, resolution || this.resolution);

			WebGL.bindUniform(uniforms.u_color, color);

			WebGL.drawVertices(circle.vertexCount);
		},


		drawTextureColor: function(program, position, scale, texture, color, resolution) {
			var WebGL = this.WebGL;

			if (!WebGL.useProgram(program) || (texture && texture.loaded === false)) {
				return;
			}

			var rect = this._rectangle;
			var attributes = program.attributes;
			var uniforms = program.uniforms;

			WebGL.bindAttribBuffer(rect.vertexPositions.buffer, attributes.a_position, rect.vertexPositions.size);
			WebGL.bindAttribBuffer(rect.vertexTexcoords.buffer, attributes.a_texcoord, rect.vertexTexcoords.size);

			WebGL.bindUniform(uniforms.u_position, position);
			WebGL.bindUniform(uniforms.u_scale, scale);
			WebGL.bindUniform(uniforms.u_resolution, resolution || this.resolution);

			WebGL.bindUniform(uniforms.u_color, color);
			WebGL.bindTexture(uniforms.u_texture, texture);

			WebGL.drawVertices(rect.vertexCount);
		},


		fillArray: function(array, size, value) {
			var res = [];
			res.push.apply(res, array)
			for (var i = Math.max(size - array.length, 0); i--;) {
				res.push(value || 0.0);
			}
			return res;
		},

		flattenArray: function(array) {
			var res = [];
			for (var i = array.length; i--;) {
				var a = array[i];
				if (a.length) {
					for (var j = a.length; j--;) {
						res.push(a[j]);
					}
				} else {
					res.push(a);
				}
			}

			return res;
		},

		isLoaded: function() {
			for (var i = arguments.length; i--;) {
				if (arguments[i] && !arguments[i].loaded) {
					return false;
				}
			}
			return true;
		},


		getGaussianKernelMatrix: function(size, sigma) {
			var pow = Math.pow,
				PI = Math.PI,
				exp = Math.exp;
			var sigmasq = pow(sigma, 2);
			var mean = parseInt(size / 2, 10);
			var x, y, i, sum = 0.0;

			var kernel = Array(size);
			for (x = size; x--;) {
				kernel[x] = Array(size);
				for (y = size; y--;) {
					sum += kernel[x][y] = (1 / (2 * PI * sigmasq)) * exp(-(pow(x - mean, 2) + pow(y - mean, 2)) / (2 * sigmasq));
				}
			}

			// normalize
			for (x = size; x--;) {
				for (y = size; y--;) {
					kernel[x][y] /= sum;
					// kernel[x][y] *= 3.0;
				}
			}

			return kernel;
		},

		get1DGaussianKernel: function(size, sigma) {
			var matrix = this.getGaussianKernelMatrix(size, sigma);
			var row = Array(size);
			var mean = parseInt(size / 2, 10);

			for (var i = size; i--;) {
				row[i] = matrix[i][mean];
			}

			return row;
		},


		renderTextureIntoTarget: function(program, renderTarget, texture) {
			var WebGL = this.WebGL;
			var res = vec2.fromValues(renderTarget.width, renderTarget.height)

			WebGL.setRenderTarget(renderTarget);
			WebGL.beginDraw([0.0, 0.0, 0.0, 1.0]);
			Utils.drawRectangleTexture(program, vec2.fromValues(0, 0), res, texture, res);
			WebGL.getTextureFromRenderTarget(renderTarget);
		},


		kernelMapTextureIntoTarget: function(program, renderTarget, texture, kernel) {
			var WebGL = this.WebGL;

			WebGL.setRenderTarget(renderTarget);
			WebGL.beginDraw([0.0, 0.0, 0.0, 1.0]);


			var rect = Utils._rectangle;
			var position = vec2.fromValues(0, 0);
			var resolution = vec2.fromValues(renderTarget.width, renderTarget.height)
			var scale = vec2.clone(resolution);
			var textureResolution = resolution;

			var kernelsize = Math.sqrt(kernel.length);
			var kernel = Utils.fillArray(kernel, 121);

			WebGL.useProgram(program);

			// attributes
			WebGL.bindAttribBuffer(rect.vertexPositions.buffer, program.attributes.a_position, rect.vertexPositions.size);
			WebGL.bindAttribBuffer(rect.vertexTexcoords.buffer, program.attributes.a_texcoord, rect.vertexTexcoords.size);

			// vert uniforms
			WebGL.bindUniform(program.uniforms.u_position, position);
			WebGL.bindUniform(program.uniforms.u_scale, scale);
			WebGL.bindUniform(program.uniforms.u_resolution, resolution);

			// frag uniforms
			WebGL.bindTexture(program.uniforms.u_texture, texture);
			WebGL.bindUniform(program.uniforms.u_textureresolution, textureResolution);
			WebGL.bindUniform(program.uniforms.u_kernelsize, kernelsize, 'i');
			WebGL.gl.uniform1fv(program.uniforms.u_kernel, new Float32Array(kernel));

			WebGL.drawVertices(rect.vertexCount);

			WebGL.getTextureFromRenderTarget(renderTarget);
		},


		blurTextureIntoTarget: function(program, renderTarget, texture, direction) {
			var WebGL = this.WebGL;
			var attributes = program.attributes;
			var uniforms = program.uniforms;

			WebGL.setRenderTarget(renderTarget);
			WebGL.beginDraw([0.0, 0.0, 0.0, 1.0]);


			var rect = Utils._rectangle;
			var position = vec2.fromValues(0, 0);
			var resolution = vec2.fromValues(renderTarget.width, renderTarget.height)
			var scale = vec2.clone(resolution);
			var textureResolution = resolution;


			WebGL.useProgram(program);

			// attributes
			WebGL.bindAttribBuffer(rect.vertexPositions.buffer, attributes.a_position, rect.vertexPositions.size);
			WebGL.bindAttribBuffer(rect.vertexTexcoords.buffer, attributes.a_texcoord, rect.vertexTexcoords.size);

			// vert uniforms
			WebGL.bindUniform(uniforms.u_position, position);
			WebGL.bindUniform(uniforms.u_scale, scale);
			WebGL.bindUniform(uniforms.u_resolution, resolution);

			// frag uniforms
			WebGL.bindTexture(uniforms.u_texture, texture);
			WebGL.bindUniform(uniforms.u_textureresolution, textureResolution);
			WebGL.bindUniform(uniforms.u_direction, direction);

			WebGL.drawVertices(rect.vertexCount);

			WebGL.getTextureFromRenderTarget(renderTarget);
		}
	};

	return Utils;
});