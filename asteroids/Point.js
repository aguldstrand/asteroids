function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Point.prototype.clone = function() {
	return new Point(this.x, this.y);
};

Point.prototype.length = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

Point.prototype.normalize = function(len) {

	var mag = Math.sqrt(this.x * this.x + this.y * this.y);

	this.x = this.x / mag * len;
	this.y = this.y / mag * len;
};

module.exports = Point;