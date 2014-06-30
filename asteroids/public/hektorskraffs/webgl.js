define([], function() {

    // saved in scope for quick access
    var gl = null;

    var WebGL = {
        screenWidth: null,
        screenHeight: null,

        clearColor: [0.0, 0.0, 0.0, 1.0],


        init: function(canvas) {
            var options = {
                antialias: true
            };

            this.canvas = canvas;
            WebGL.gl = gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);

            if (!gl) {
                // Browser doesn't support webgl
                return false;
            }

            WebGL.resize();

            // Set clear color to use
            gl.clearColor(WebGL.clearColor[0], WebGL.clearColor[1], WebGL.clearColor[2], WebGL.clearColor[3]);

            // Enable depth test
            WebGL.setDepth();

            return true;
        },

        resize: function(width, height, canvas) {
            canvas = canvas || WebGL.canvas;
            width = width || WebGL.screenWidth || canvas.width;
            height = height || WebGL.screenHeight || canvas.height;

            WebGL.screenWidth = canvas.width = width;
            WebGL.screenHeight = canvas.height = height;

            this.screenRenderTarget = {
                framebuffer: null,
                width: width,
                height: height
            };

            gl.viewport(0, 0, width, height);
        },

        setBlend: function() {
            gl.enable(gl.BLEND);
            gl.disable(gl.DEPTH_TEST);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        },
        setDepth: function() {
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
            gl.depthFunc(gl.LEQUAL);
        },


        ///////////////////////
        // Program / Shaders //
        ///////////////////////
        enableProgram: function(program, attributes) {
            gl.useProgram(program);

            attributes = attributes || program.attributes;
            for (var attr in attributes) {
                gl.enableVertexAttribArray(program.attributes[attr]);
            }
        },
        useProgram: function(program) {
            if (!program.loaded)
                return false;

            WebGL.enableProgram(program);

            return true;
        },
        loadProgram: function(vsUrl, fsUrl, attributes, uniforms, callback) {
            var program = gl.createProgram();
            program.loaded = false;

            program.vertexShader = WebGL.loadShader(vsUrl, 'vertex', onshaderload);
            program.fragmentShader = WebGL.loadShader(fsUrl, 'fragment', onshaderload);

            function onshaderload() {
                if (!program.vertexShader.loaded || !program.fragmentShader.loaded)
                    return;

                gl.attachShader(program, program.vertexShader);
                gl.attachShader(program, program.fragmentShader);
                gl.linkProgram(program);

                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    throw "Could not initialize shader: " + vsUrl + ', ' + fsUrl;
                }

                gl.useProgram(program);

                var i;
                program.attributes = {};
                for (i = 0; i < attributes.length; ++i) {
                    program.attributes[attributes[i]] = gl.getAttribLocation(program, attributes[i]);
                }
                program.uniforms = {};
                for (i = 0; i < uniforms.length; ++i) {
                    program.uniforms[uniforms[i]] = gl.getUniformLocation(program, uniforms[i]);
                }

                program.loaded = true;
                if (callback)
                    callback(program);
            }

            return program;
        },
        loadShader: function(url, type, callback) {
            var shader;
            if (type == 'vertex') {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else if (type == 'fragment') {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else {
                throw 'Invalid shader type';
            }
            shader.loaded = false;

            var xhr = new XMLHttpRequest();
            xhr.onload = function(e) {
                var str = xhr.responseText;

                gl.shaderSource(shader, str);
                gl.compileShader(shader);

                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    alert(url + '\n' + gl.getShaderInfoLog(shader));
                    return null;
                }

                shader.loaded = true;
                callback(shader);
            };
            xhr.onerror = function(e) {

            };

            xhr.open('GET', url);
            xhr.send();

            return shader;
        },



        ///////////
        // Other //
        ///////////
        createRenderTarget: function(width, height) {
            var framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

            var frametexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, frametexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.generateMipmap(gl.TEXTURE_2D);

            var depthbuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frametexture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthbuffer);

            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            return {
                framebuffer: framebuffer,
                frametexture: frametexture,
                depthbuffer: depthbuffer,
                width: width,
                height: height
            };
        },


        //////////
        // Draw //
        //////////
        beginDraw: function(color) {
            if (color) {
                gl.clearColor(color[0], color[1], color[2], color[3]);
            }

            // Clear buffer
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        },

        bindAttribBuffer: function(buffer, attribPointer, itemSize) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(attribPointer, itemSize, gl.FLOAT, false, 0, 0);
        },
        bindIndexBuffer: function(buffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        },
        bindUniform: function(uniformPointer, array, type) {
            if (!array.length)
                array = [array];

            type = type || 'f';

            switch (array.length) {
                case 1:
                    gl['uniform1' + type](uniformPointer, array[0]);
                    break;
                case 2:
                    gl['uniform2' + type](uniformPointer, array[0], array[1]);
                    break;
                case 3:
                    gl['uniform3' + type](uniformPointer, array[0], array[1], array[2]);
                    break;
                case 4:
                    gl['uniform4' + type](uniformPointer, array[0], array[1], array[2], array[3]);
                    break;
                case 16:
                    gl.uniformMatrix4fv(uniformPointer, false, array);
                    break;
            }
        },
        bindTexture: function(uniformPointer, texture, index) {
            index = index || 0;
            gl.activeTexture(gl['TEXTURE' + (index)]);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(uniformPointer, index);
        },

        setRenderTarget: function(renderTarget) {
            renderTarget = renderTarget || this.screenRenderTarget;

            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget.framebuffer);
            gl.viewport(0, 0, renderTarget.width, renderTarget.height);
        },

        getTextureFromRenderTarget: function(renderTarget) {
          gl.bindTexture(gl.TEXTURE_2D, renderTarget.frametexture);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.bindTexture(gl.TEXTURE_2D, null);
        },

        drawIndexed: function(num_items) {
            gl.drawElements(gl.TRIANGLES, num_items, gl.UNSIGNED_SHORT, 0);
        },
        drawVertices: function(num_items) {
            gl.drawArrays(gl.TRIANGLES, 0, num_items);
        },

        drawModel: function(program, model, attributes, uniforms, textures) {
            if (!model.loaded || !program.loaded)
                return;

            for (var a in attributes) {
                WebGL.bindAttribBuffer(model[attributes[a]], program.attributes[a]);
            }

            for (var u in uniforms) {
                WebGL.bindUniform(program.uniforms[u], uniforms[u]);
            }

            var i = 0;
            for (var t in textures) {
                if (!textures[t].loaded)
                    return;

                WebGL.bindTexture(program.uniforms[t], textures[t], i++);
            }

            if (model.indexBuffer) {
                WebGL.bindIndexBuffer(model.indexBuffer);
                WebGL.drawIndexed(model.indexBuffer.numItems);
            }
        },





        // Utils
        createPolygon: function(positionVertices) {
          var polygon = {};

          var vertexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionVertices), gl.STATIC_DRAW);

          polygon.vertexBuffer = vertexBuffer;
          polygon.itemSize = 2;
          polygon.vertexCount = positionVertices.length / polygon.itemSize;

          return polygon;
        }
    };

    return WebGL;
});