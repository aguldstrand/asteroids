
var _tostring = Object.prototype.tostring;



module.exports = {
  isArray: Array.isArray || function(obj) {
    return _tostring.call(obj) === '[object Array]';
  }
};