define([
  'Bifrost',

  'glmatrix'
], function(
  Bifrost,

  glmatrix
) {

  // Import
  var vec2 = glmatrix.vec2;
  

  function Camera() {
    this.targetPosition = vec2.create();
    this.position = vec2.create();

    this.halfResolution = vec2.create();
  }


  Camera.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;

    // vec2.set(this.halfResolution, width / 2, height / 2);
    vec2.set(this.halfResolution, 0, 0);
  };


  Camera.prototype.setTargetPosition = function(x, y) {
    vec2.set(this.targetPosition, x, y);
  };



  Camera.prototype.update = function() {
    vec2.subtract(this.position, this.targetPosition, this.halfResolution);
  };


  return Camera;

});