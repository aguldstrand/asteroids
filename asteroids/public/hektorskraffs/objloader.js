define([], function() {

    var ObjLoader = {
        supported_model_formats: {
            'obj': true,
            'fbx': false,
            'dae': false
        }
    };

    /**
     * { LOAD IMAGE }
     * Load an image, not setting it up as texture
     * @param  {String}     src         Url to image
     * @param  {Function}   done        Callback for success
     * @param  {Function}   error       Callback for error
     * @return {Image}                  Return the new image object
     */
    ObjLoader.loadImage = function(src, done, error){
        var img = new Image();
        img.loaded = false;
        img.onload = function(){
            img.loaded = true;
            if(done)
                done(img);
        };
        img.onerror = function(){
            // Something went wrong call error callback with msg and arguments
            if(error)
                error('Could not load image', arguments);
        };

        img.src = src;
        return img;
    };

    /**
     * { LOAD TEXTURE }
     * [loadTexture description]
     * @param  {String}     src   Url to image
     * @param  {Function}   done  Callback when loaded
     * @param  {Function}   error Callback for if anything goes wrong
     * @return {GLTexture}        Returns a new GLTexture which will be loaded with data
     */
    ObjLoader.loadTexture = function(gl, src, done, error){
        // Create webgl texture
        var texture = gl.createTexture();
        texture.loaded = false;

        ObjLoader.loadImage(src, function(image){
            ObjLoader.bindImageToTexture(gl, texture, image);
            texture.loaded = true;

            if(done)
                done(texture);
        }, error);

        return texture;
    };

    /**
     * { BIND IMAGE TO TEXTURE }
     * Setup a webgl texture from a loaded image
     * @param  {Texture2D}  texture     Texture, must be created before called
     * @param  {Image}      img         Image, must be loaded
     */
    ObjLoader.bindImageToTexture = function(gl, texture, img){
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    /**
     * { LOAD MODEL }
     * Load a model if it's not already loaded
     *
     * @param  {String}     url         url to model
     * @param  {Function}   done        callback for done
     * @param  {Function}   error       callback for error
     * @param  {Function}   progress    callback for progress update
     */
    ObjLoader.loadModel = function(gl, url, done, error, progress){
        var model;

        var ext = util.getExtension(url);
        if(!ObjLoader.supported_model_formats[ext]){
            // File format is not supported
            if(error)
                error('File format not supported');
            return;
        }

        model = new Model(url);

        var xhr = new XMLHttpRequest();
        xhr.onprogress = function(e){
            if(onprogress)
                progress(e);
        };
        xhr.onerror = function(e){
            if(error)
                error(e);
        };
        xhr.onload = function(e){
            if(xhr.readyState != 4 || xhr.status != 200){
                if(error)
                    error("Couldn't fetch model {status="+xhr.status+"}");
                return;
            }

            var file_data = xhr.responseText;

            // Depending on file format handle the data different
            switch(ext){
                case 'obj': ObjLoader.handleObj(gl, file_data, model); break;
            }

            // When the model is loaded and setup
            // model itself will call the done callback on all who is bound
            if(done)
                done(model);
        };

        xhr.open(
            'GET',
            url);
        xhr.send();

        return model;
    };


    /**
     * { HANDLE OBJ }
     * Reads .obj data from string and stores in model
     * @param  {String} data    data in .obj format
     * @param  {Model}  model   model which will be used to store data
     * @return {Model}          returns the loaded model
     */
    ObjLoader.handleObj = function(gl, data, model){
        var i, j, vertexIndex, texIndex, normalIndex;
        var obj = {};

        obj.vertices   = [];
        obj.normaldata = [];
        obj.normals    = [];
        obj.texdata    = [];
        obj.texcoords  = [];
        obj.indices    = [];
        obj.faces      = [];
        obj.vertexBuffer   = null;
        obj.texcoordBuffer = null;
        obj.normalBuffer   = null;
        obj.indexBuffer    = null;
        obj.smooth = null;

        /* Loop through all data */
        for(i = 0; i  < data.length; ++i){
            if(data[i] == '#') {
                while(data[++i] != '\n')
                    ;
                continue;
            }

            var c = data[i];

            var d = '';
            switch(data[i]){

                /* VERTEX */
                case 'v':
                    i++;
                    /* TEXTURE */
                    if(data[i] == 't') {
                        while(++i < data.length){
                            if(data[i] == ' ' || data[i] == '\n'){
                                if(d.length > 0)
                                    obj.texdata.push(parseFloat(d));
                                d = '';

                                if(data[i] == '\n')
                                    break;
                            }
                            else {
                                d += data[i];
                            }
                        }
                    }
                    /* NORMAL */
                    else if(data[i] == 'n'){
                        while(data[++i] != '\n' && i < data.length){
                            if(data[i] == ' '){
                                if(d.length > 0)
                                    obj.normaldata.push(parseFloat(d));
                                d = '';
                            }
                            else
                                d += data[i];
                        }
                        if(d.length > 0)
                            obj.normaldata.push(parseFloat(d));
                    }
                    /* POSITION */
                    else {
                        while(data[++i] != '\n' && i < data.length){
                            if(data[i] == ' '){
                                if(d.length > 0)
                                    obj.vertices.push(parseFloat(d));
                                d = '';
                            }
                            else
                                d += data[i];
                        }
                        if(d.length > 0)
                            obj.vertices.push(parseFloat(d));
                    }

                break;

                /* SMOOTH */
                case 's':
                    i++;
                    while(data[i] == ' ')
                        ++i;
                    if(data[i] == '0' || (data[i] == 'o' && data[i+1] == 'f' && data[i+2] == 'f')){
                        obj.smooth = false;
                        i += 3;
                    }
                    else if(data[i] == '1'){
                        obj.smooth = true;
                    }
                break;


                /* FACE */
                case 'f':
                    var f = [];
                    var face = {
                        vertices: [],
                        texcoords: [],
                        normals: []
                    };
                    var v = [], vi=0;
                    while(++i < data.length){

                        /* Space character, add information */
                        if(data[i] == ' ' || data[i] == '\n'){
                            if(v[0]){
                                face.vertices.push(parseInt(v[0], 10)-1);
                            }
                            if(v[1]){
                                face.texcoords.push(parseInt(v[1], 10)-1);
                            }
                            if(v[2]){
                                face.normals.push(parseInt(v[2], 10)-1);
                            }
                            if(data[i] == '\n')
                                break;

                            v = [];
                            vi=0;
                        }

                        /* New type */
                        else if(data[i] == '/')
                            ++vi;

                        /* Value */
                        else {
                            if(!v[vi])v[vi] = '';
                            v[vi] += data[i];
                        }
                    }
                    // ADD THE FACE
                    if(face.vertices.length > 0)
                        obj.faces.push(face);
                break;


                /* UNIMPLEMENTED */
                default:
                    while(data[i] != '\n' && i < data.length)
                        ++i;
                break;
            }
        }


        /* SMOOTH */
        if( obj.smooth ){
            var temp = {};
            temp.vertices = [];
            temp.texcoords = [];
            temp.normals = [];
            temp.indices = [];
            var indexI = 0;

            for(i = 0; i < obj.faces.length; ++i){
                for(j = 0; j < obj.faces[ i ].vertices.length; ++j ) {
                    vertexIndex = obj.faces[ i ].vertices[ j ];
                    temp.vertices.push(obj.vertices[vertexIndex * 3]);
                    temp.vertices.push(obj.vertices[vertexIndex * 3 + 1]);
                    temp.vertices.push(obj.vertices[vertexIndex * 3 + 2]);
                }
                for(j = 0; j < obj.faces[ i ].texcoords.length; ++j) {
                    texIndex = obj.faces[ i ].texcoords[ j ];
                    temp.texcoords.push(obj.texdata[texIndex * 2]);
                    temp.texcoords.push(obj.texdata[texIndex * 2 + 1]);
                }
                for(j = 0; j < obj.faces[ i ].normals.length; ++j ) {
                    normalIndex = obj.faces[ i ].normals[ j ];
                    temp.normals.push(obj.normaldata[normalIndex * 3]);
                    temp.normals.push(obj.normaldata[normalIndex * 3 + 1]);
                    temp.normals.push(obj.normaldata[normalIndex * 3 + 2]);
                }



                for(j = 0; j < obj.faces[i].vertices.length-2; ++j) {
                    temp.indices.push(indexI);
                    temp.indices.push(indexI + j + 1);
                    temp.indices.push(indexI + j + 2);
                }
                indexI += obj.faces[i].vertices.length;
            }

            obj.vertices = temp.vertices;
            obj.texcoords = temp.texcoords;
            obj.normals = temp.normals;
            obj.indices = temp.indices;
        }
        /* NONE-SMOOTH OBJECT ( FLAT ) */
        else {
            var holder = {
                vertices:  [],
                normals:   [],
                indices:   [],
                texcoords: []
            };

            var index=0;
            for(i = 0; i < obj.faces.length; ++i){
                /* ASSERTION */
                if(obj.faces[i].vertices.length < 3){
                    alert('Assertion failed: \nLess than 3 vertices in face.');
                    continue;
                }

                // CREATE THE NEW VERTICES
                for(j = 0; j < obj.faces[i].vertices.length; ++j){
                    // ADD A NEW VERTEX POSITION
                    vertexIndex = obj.faces[ i ].vertices[ j ];
                    holder.vertices[ index * 3 ] = obj.vertices[ vertexIndex * 3 ];
                    holder.vertices[ index * 3 + 1 ] = obj.vertices[ vertexIndex * 3 + 1 ];
                    holder.vertices[ index * 3 + 2 ] = obj.vertices[ vertexIndex * 3 + 2 ];

                    // ADD A NEW VERTEX TEXCOORD
                    texIndex = obj.faces[ i ].texcoords[ j ];
                    if( texIndex !== undefined ) {
                        holder.texcoords[ index * 2 ]     = obj.texdata[ texIndex * 2 ];
                        holder.texcoords[ index * 2 + 1 ] = obj.texdata[ texIndex * 2  + 1];
                    }

                    // ADD A NEW VERTEX NORMAL
                    normalIndex = obj.faces[ i ].normals[ j ];
                    if( normalIndex !== undefined ) {
                        holder.normals[ index * 3 ] = obj.normaldata[ normalIndex * 3 ];
                        holder.normals[ index * 3 + 1 ] = obj.normaldata[ normalIndex * 3 + 1 ];
                        holder.normals[ index * 3 + 2 ] = obj.normaldata[ normalIndex * 3 + 2 ];
                    }

                    ++index;
                }

                // CREATE THE TRIANGLE INDICES
                var startIndex = index - obj.faces[i].vertices.length;
                for(j = 0; j < obj.faces[i].vertices.length - 2; ++j){
                    holder.indices.push( startIndex );
                    holder.indices.push( startIndex + j + 1 );
                    holder.indices.push( startIndex + j + 2 );
                }
            }

            obj.vertices  = holder.vertices;
            obj.texcoords = holder.texcoords;
            obj.normals   = holder.normals;
            obj.indices   = holder.indices;
        }


        // Setup model from data in temp holder obj
        model.vertices  = obj.vertices;
        model.texcoords = obj.texcoords;
        model.normals   = obj.normals;
        model.indices   = obj.indices;

        ObjLoader.calculateTangent(model);
        ObjLoader.calculateBitangents(model);

        /* CREATE BUFFERS */
            /* VERTEX */
        model.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
        model.vertexBuffer.itemSize = 3;
        model.vertexBuffer.numItems = model.vertices.length / model.vertexBuffer.itemSize;

            /* TEXTURE */
        if( model.texcoords.length > 0 ) {
            model.texcoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, model.texcoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.texcoords), gl.STATIC_DRAW);
            model.texcoordBuffer.itemSize = 2;
            model.texcoordBuffer.numItems = model.texcoords.length / model.texcoordBuffer.itemSize;
        }
            /* NORMAL */
        if( model.normals.length > 0 ) {
            model.normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
            model.normalBuffer.itemSize = 3;
            model.normalBuffer.numItems = model.normals.length / model.normalBuffer.itemSize;
        }

            /* TANGENT */
        if( model.tangents.length > 0 ) {
            model.tangentBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, model.tangentBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.tangents), gl.STATIC_DRAW);
            model.tangentBuffer.itemSize = 3;
            model.tangentBuffer.numItems = model.tangents.length / model.tangentBuffer.itemSize;
        }

            /* BITANGENT */
        // if( model.bitangents.length > 0 ) {
        //     model.bitangentBuffer = gl.createBuffer();
        //     gl.bindBuffer(gl.ARRAY_BUFFER, model.bitangentBuffer);
        //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.bitangents), gl.STATIC_DRAW);
        //     model.bitangentBuffer.itemSize = 3;
        //     model.bitangentBuffer.numItems = model.bitangents.length / model.bitangentBuffer.itemSize;
        // }

            /* INDEX */
        model.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
        model.indexBuffer.itemSize = 1;
        model.indexBuffer.numItems = model.indices.length / model.indexBuffer.itemSize;


        model.loaded = true;
        // Return model when done
        return model;
    };

    /**
     * Calculate bitangents for a mesh
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    ObjLoader.calculateBitangents = function(model){
        if(!model.bitangents)
            model.bitangents = new Array(model.tangents.length);

        for(var a = 0; a < model.indices.length / 3; a++){
            var i1 = model.indices[a*3];
            var i2 = model.indices[a*3+1];
            var i3 = model.indices[a*3+2];

            var t1  = [ model.tangents[i1*3], model.tangents[i1*3+1], model.tangents[i1*3+2] ];
            var t2  = [ model.tangents[i2*3], model.tangents[i2*3+1], model.tangents[i2*3+2] ];
            var t3  = [ model.tangents[i3*3], model.tangents[i3*3+1], model.tangents[i3*3+2] ];

            var n1  = [ model.normals[i1*3], model.normals[i1*3+1], model.normals[i1*3+2] ];
            var n2  = [ model.normals[i2*3], model.normals[i2*3+1], model.normals[i2*3+2] ];
            var n3  = [ model.normals[i3*3], model.normals[i3*3+1], model.normals[i3*3+2] ];

            var b = [0, 0, 0];
            vec3.cross(b, [t1, t2, t3], [n1, n2, n3]);
        }
    };

    /**
     * Calculate tangents for a mesh
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    ObjLoader.calculateTangent = function(model){
        // Vector3D *tan1 = new Vector3D[vertexCount * 2];
        // Vector3D *tan2 = tan1 + vertexCount;
        var tan1 = new Array(model.vertices.length);
        // var tan2 = new Array(model.vertices.length);

        for(var a = 0; a < model.vertices.length; a++){
            tan1[a] = 0;
        }

        if(!model.tangents)
            model.tangents = new Array(model.vertices.length);


        /**
         * Loop through all triangles
         */
        for (a = 0; a < model.indices.length; a+=3)
        {
            var i1 = model.indices[a];
            var i2 = model.indices[a+1];
            var i3 = model.indices[a+2];


            var v1  = [ model.vertices[i1*3], model.vertices[i1*3+1], model.vertices[i1*3+2] ];
            var v2  = [ model.vertices[i2*3], model.vertices[i2*3+1], model.vertices[i2*3+2] ];
            var v3  = [ model.vertices[i3*3], model.vertices[i3*3+1], model.vertices[i3*3+2] ];


            var w1 = [ model.texcoords[i1*2], model.texcoords[i1*2+1] ];
            var w2 = [ model.texcoords[i2*2], model.texcoords[i2*2+1] ];
            var w3 = [ model.texcoords[i3*2], model.texcoords[i3*2+1] ];

            ////////////
            // FLOATS //
            ////////////
            var x1 = v2[0] - v1[0];
            var x2 = v3[0] - v1[0];
            var y1 = v2[1] - v1[1];
            var y2 = v3[1] - v1[1];
            var z1 = v2[2] - v1[2];
            var z2 = v3[2] - v1[2];

            var s1 = w2[0] - w1[0];
            var s2 = w3[0] - w1[0];
            var t1 = w2[1] - w1[1];
            var t2 = w3[1] - w1[1];

            // FLOAT
            var div = (s1 * t2 - s2 * t1);
            var r = 1.0 / (div === 0)? 1 : div;

            var sdir = [(t2 * x1 - t1 * x2) * r,
                        (t2 * y1 - t1 * y2) * r,
                        (t2 * z1 - t1 * z2) * r];

            var tdir = [(s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r,
                    (s1 * z2 - s2 * z1) * r];

            tan1[i1*3+0] += sdir[0];
            tan1[i1*3+1] += sdir[1];
            tan1[i1*3+2] += sdir[2];

            tan1[i2*3+0] += sdir[0];
            tan1[i2*3+1] += sdir[1];
            tan1[i2*3+2] += sdir[2];

            tan1[i3*3+0] += sdir[0];
            tan1[i3*3+1] += sdir[1];
            tan1[i3*3+2] += sdir[2];
        }


        for(a = 0; a < model.vertices.length; a+=3){
            var n = [ model.normals[a], model.normals[a+1], model.normals[a+2] ];
            var t = [ tan1[a], tan1[a+1], tan1[a+2] ];

            var d = vec3.dot(n, t);
            vec3.scale(n, n, d);
            var mt = vec3.create();
            vec3.subtract(mt, t, n);
            vec3.normalize(mt, mt);
            model.tangents[a] = mt[0];
            model.tangents[a+1] = mt[1];
            model.tangents[a+2] = mt[2];
        }
    };

    return ObjLoader;
});