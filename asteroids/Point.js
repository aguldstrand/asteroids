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
	//console.log('normalize A', len, this.x, this.y);
	var mag = Math.sqrt(this.x * this.x + this.y * this.y);
	if (mag !== 0) {
		this.x = this.x / mag;
		this.y = this.y / mag;
	}
	this.x *= len;
	this.y *= len;
	//console.log('normalize B', len, this.x, this.y, mag);
	return this;
};

Point.prototype.truncate = function(maxLen) {
	var mag = Math.sqrt(this.x * this.x + this.y * this.y);

	if (mag > maxLen) {
		this.x = this.x / mag * maxLen;
		this.y = this.y / mag * maxLen;
	}

	return this;
};

Point.prototype.subtract = function(v) {
	return new Point(this.x - v.x, this.y - v.y);
};

Point.prototype.multiply = function(multip) {
	return new Point(this.x * multip, this.y * multip);
};
Point.prototype.length = function() {
	return Math.sqrt(this.lengthSquared);
};
Point.prototype.add = function(v) {
	return new Point(this.x + v.x, this.y + v.y);
};
Point.prototype.clone = function() {
	return new Point(this.x, this.y);
};
Point.prototype.degreesTo = function(v) {
	var dx = this.x - v.x;
	var dy = this.y - v.y;
	var angle = Math.atan2(dy, dx); // radians
	return angle * (180 / Math.PI); // degrees
};
Point.prototype.distance = function(v) {
	var x = this.x - v.x;
	var y = this.y - v.y;
	return Math.sqrt(x * x + y * y);
};
Point.prototype.equals = function(toCompare) {
	return this.x == toCompare.x && this.y == toCompare.y;
};
Point.prototype.interpolate = function(v, f) {
	return new Point((this.x + v.x) * f, (this.y + v.y) * f);
};
Point.prototype.length = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};
/*
Point.prototype.normalize = function(thickness) {
	var l = this.length();
	this.x = this.x / l; // * thickness;
	this.y = this.y / l; // * thickness;
	return this;
};
*/
Point.prototype.orbit = function(origin, arcWidth, arcHeight, degrees) {
	var radians = degrees * (Math.PI / 180);
	this.x = origin.x + arcWidth * Math.cos(radians);
	this.y = origin.y + arcHeight * Math.sin(radians);
};
Point.prototype.offset = function(dx, dy) {
	this.x += dx;
	this.y += dy;
};


Point.interpolate = function(pt1, pt2, f) {
	return new Point((pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f);
};
Point.polar = function(len, angle) {
	return new Point(len * Math.sin(angle), len * Math.cos(angle));
};
Point.distance = function(pt1, pt2) {
	var x = pt1.x - pt2.x;
	var y = pt1.y - pt2.y;
	return Math.sqrt(x * x + y * y);
};
Point.prototype.dot = function(v) {

	return this.x * v.x + this.y * v.y;

};
module.exports = Point;