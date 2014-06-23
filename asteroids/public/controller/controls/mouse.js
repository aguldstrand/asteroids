define([
  'Bifrost',

  'controller/controls/controls'
], function(
  Bifrost,

  Controls
) {


  function Mouse(){
    // vars
    this.x = -1;
    this.y = -1;
    this.pressedDuration = {
      'left': 0.0,
      'right': 0.0,
      'middle': 0.0
    };

    this.init();
  }

  Mouse.prototype = new Controls();
  Mouse.prototype.constructor = Mouse;


  Mouse.prototype.init = function() {
    this.bindEvents();
  };

  Mouse.prototype.bindEvents = function() {
    var $ = Bifrost.$;

    this.$window = $(window);

    this.$window
      .on('mouseup', $.proxy(this.mouseup, this))
      .on('mousedown', $.proxy(this.mousedown, this))
      .on('mousemove', $.proxy(this.mousemove, this))
      .on('contextmenu', $.proxy(this.contextmenu, this));
  };


  Mouse.prototype.mousedown = function(event) {
    event.preventDefault();

    var btn = BUTTONS[event.button];
    this.___keyDown(btn);

    this.x = event.pageX;
    this.y = event.pageY;
  };
  Mouse.prototype.mouseup = function(event) {
    event.preventDefault();

    var btn = BUTTONS[event.button];
    this.___keyUp(btn);

    this.x = event.pageX;
    this.y = event.pageY;
  };
  Mouse.prototype.mousemove = function(event) {
    event.preventDefault();

    this.x = event.pageX;
    this.y = event.pageY;
  };
  Mouse.prototype.contextmenu = function(event) {
    event.preventDefault();
  };


  ///////////////
  // Constants //
  ///////////////
  var BUTTONS = {
    '0': 'left',
    '1': 'middle',
    '2': 'right'
  };


  return Mouse;
});