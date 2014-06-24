define([], function() {

    var gl = null;
    var WEBGL = {
        canvas: null,
        ctxStr: 'webgl',
        running: false,
        w: 0,
        h: 0,
        gl: null,
        experimental: false,
        clear_color: [0.0, 0.0, 0.0, 1.0],
        last_program: null
    };

    /**
     * { INIT }
     * Initializes WebGL
     * @param  {Canvas} canvas  Canvas used for rendering WebGL
     * @return {Boolean}        return value specifies if init went well
     */
    WEBGL.init = function(canvas){
        var opt = {
            antialias: true
        };
        this.canvas = canvas;
        WEBGL.gl = gl = canvas.getContext(WEBGL.ctxStr, opt);
        if(!gl){
            WEBGL.ctxStr = 'experimental-webgl';
            WEBGL.gl = gl = canvas.getContext(WEBGL.ctxStr, opt);

            if(!gl){
                // Browser doesn't support webgl
                return false;
            }

            WEBGL.experimental = true;
        }

        WEBGL.resize(canvas);

        // Set clear color to use
        gl.clearColor(WEBGL.clear_color[0], WEBGL.clear_color[1], WEBGL.clear_color[2], WEBGL.clear_color[3]);

        // Enable depth test
        WEBGL.setDepth();

        return true;
    };
    WEBGL.reInit = function(opt){
        gl = WEBGL.canvas.getContext(WEBGL.ctxStr, opt);
        WEBGL.resize();
    };

    WEBGL.setBlend = function(){
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    };
    WEBGL.setDepth = function(){
        gl.enable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        gl.depthFunc(gl.LEQUAL);
    };

    /**
     * { RESIZE }
     * Resizes the canvas and sets values
     * Also sets up the viewport for gl
     * @param  {Canvas} canvas  Canvas to resize
     * @param  {Number} width   Width
     * @param  {Number} height  Height
     */
    WEBGL.resize = function(canvas, width, height){
        canvas = canvas || WEBGL.canvas;
        width   = width  || canvas.width;
        height  = height || canvas.height;

        WEBGL.w = canvas.width = width;
        WEBGL.h = canvas.height = height;

        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };

    /**
     * { BEGIN DRAW }
     * Called first when drawing a new frame.
     * Clears buffers and sets viewport
     */
    WEBGL.beginDraw = function(){
        // Clear buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.COLOR_DEPTH_BIT);
    };


    /**
     * { ENABLE PROGRAM }
     * Enable a WebGL-program
     * @param  {Program}    program     Program to enable
     * @param  {Array}      attributes  Specific attributes to enable, if not submitted all is enabled
     */
    WEBGL.enableProgram = function(program, attributes){
        gl.useProgram(program);

        attributes = attributes || program.attributes;
        for(var attr in attributes){
            gl.enableVertexAttribArray(program.attributes[ attr ]);
        }
    };

    /**
     * { USE PROGRAM }
     * Use program, return False if program not loaded
     * @param  {Program}    program
     * @return {Boolean}    False if not loaded, True if everything ok
     */
    WEBGL.useProgram = function(program){
        if(!program.loaded)
            return false;

        // if(program === WEBGL.last_program)
        //     return true;

        WEBGL.enableProgram(program);

        WEBGL.last_program = program;

        return true;
    };

    /**
     * { LOAD PROGRAM }
     * Initialize a WebGL-program
     * @param  {String}     vsUrl       Url to vertex shader
     * @param  {String}     fsUrl       Url to fragment shader
     * @param  {Array}      attributes  Array of attributes to attach on program
     * @param  {Array}      uniforms    Array of uniforms to attach on program
     * @param  {Function}   callback    Callback for when the program is loaded
     * @return {Program}                Returns the program, *Note* that it's not loaded yet
     */
    WEBGL.loadProgram = function(vsUrl, fsUrl, attributes, uniforms, callback){
        var program = gl.createProgram();
        program.loaded = false;

        program.vertexShader    = WEBGL.loadShader(vsUrl, 'vertex', onshaderload);
        program.fragmentShader  = WEBGL.loadShader(fsUrl, 'fragment', onshaderload);

        function onshaderload(){
            if(!program.vertexShader.loaded || !program.fragmentShader.loaded)
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
            for(i = 0; i < attributes.length; ++i){
                program.attributes[ attributes[ i ] ] = gl.getAttribLocation( program, attributes[ i ] );
            }
            program.uniforms = {};
            for(i = 0; i < uniforms.length; ++i){
                program.uniforms[ uniforms[ i ] ] = gl.getUniformLocation( program, uniforms[ i ] );
            }

            program.loaded = true;
            if(callback)
                callback(program);
        }

        return program;
    };

    /**
     * { LOAD SHADER }
     * Load a shader from url
     * @param  {String}   url       Url to shader
     * @param  {Function} callback  callback for when it's loaded
     * @return {Shader}             [description]
     */
    WEBGL.loadShader = function(url, type, callback){
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
        xhr.onload = function(e){
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

        xhr.open('GET', url);
        xhr.send();

        return shader;
    };

    /**
     * { BIND ATTRIB BUFFER }
     * Binds a buffer and sets its vertexAttribPointer
     * @param  {Buffer}         buffer        Buffer to bind
     * @param  {AttribLocation} attribPointer Pointer to location in shader where its bound
     */
    WEBGL.bindAttribBuffer = function(buffer, attribPointer){
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attribPointer, buffer.itemSize, gl.FLOAT, false, 0, 0);
    };

    /**
     * { BIND INDEX BUFFER }
     * Binds a index bufer to use
     * @param  {IndexBuffer} buffer
     */
    WEBGL.bindIndexBuffer = function(buffer){
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    };

    /**
     * { BIND UNIFORM }
     * Utility function to call for setting a uniform
     * Can be used for most uniform vals
     * @param  {String} uniformPointer  Location for uniform in shader
     * @param  {Array}  array           Array of values to set
     */
    WEBGL.bindUniform = function(uniformPointer, array, type){
        if(!array.length)
            array = [array];

        // for (var i = 2; i < arguments.length; ++i) {
        //     array.push(arguments[i]);
        // }
        type = type || 'f';

        switch(array.length){
            case 1:     gl['uniform1'+type](uniformPointer, array[0]); break;
            case 2:     gl['uniform2'+type](uniformPointer, array[0], array[1]); break;
            case 3:     gl['uniform3'+type](uniformPointer, array[0], array[1], array[2]); break;
            case 4:     gl['uniform4'+type](uniformPointer, array[0], array[1], array[2], array[3]); break;
            case 16:    gl.uniformMatrix4fv(uniformPointer, false, array); break;
        }
    };

    /**
     * { BIND TEXTURE }
     * Bind a texture to use in shader
     * @param  {UniformLocation}    uniformPointer  Location in shader
     * @param  {Texture}            texture         Texture
     * @param  {Number}             index           Index of texture to set
     */
    WEBGL.bindTexture = function(uniformPointer, texture, index){
        index = index || 0;
        gl.activeTexture(gl['TEXTURE'+(index)]);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uniformPointer, index);
    };

    /**
     * { DRAW INDEXED }
     * Draw triangles with index buffer
     * @param  {Number} num_items Number of indices to draw
     */
    WEBGL.drawIndexed = function(num_items){
        gl.drawElements(gl.TRIANGLES, num_items, gl.UNSIGNED_SHORT, 0);
    };

    /**
     * { DRAW MODEL }
     * Utility function to draw models. Simply returns if anything isn't done loading
     * @param  {Program}    program
     * @param  {Model}      model
     * @param  {Object}     attributes      An object where keys are attribLocation and value is name of buffer in model
     * @param  {Object}     uniforms        An object where keys are attriblocation and value is the value
     * @param  {Object}     textures        An object where keys are attriblocation and value is texture
     */
    WEBGL.drawModel = function(program, model, attributes, uniforms, textures) {
        if(!model.loaded || !program.loaded)
            return;

        for(var a in attributes){
            WEBGL.bindAttribBuffer(model[attributes[a]], program.attributes[a]);
        }

        for(var u in uniforms){
            WEBGL.bindUniform(program.uniforms[u], uniforms[u]);
        }

        var i=0;
        for(var t in textures){
            if(!textures[t].loaded)
                return;

            WEBGL.bindTexture(program.uniforms[t], textures[t], i++);
        }

        if(model.indexBuffer){
            WEBGL.bindIndexBuffer(model.indexBuffer);
            WEBGL.drawIndexed(model.indexBuffer.numItems);
        }
    };

    return WEBGL;
});