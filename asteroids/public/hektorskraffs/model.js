define([], function() {

    /**
     * Class for models
     *
     * @param {String} url      Url to model
     * @param {String} name     Identifier for model
     */
    function Model(url, name){
        this.url = url;
        this.name = name;
        this.loaded = false;

        this.vertices   = null;
        this.texcoords  = null;
        this.normals    = null;
        this.indices    = null;
        this.tangents   = null;
        this.bitangents = null;

        this.vertexBuffer       = null;
        this.texcoordBuffer     = null;
        this.normalBuffer       = null;
        this.indexBuffer        = null;
        this.tangentBuffer      = null;
        this.bitangentBuffer    = null;
    }

    return Model;
});