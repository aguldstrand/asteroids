var Point = require('./Point');

function TriangleCheck() {}

TriangleCheck.check = function(t1, t2, t3, point) {
	var invDenom;
	var u;
	var v;
	var dot00;
	var dot01;
	var dot02;
	var dot11;
	var dot12;
	var v0 = [0, 0];
	var v1 = [0, 0];
	var v2 = [0, 0];

	// Compute vectors
	v0[0] = t3.x - t1.x;
	v1[0] = t2.x - t1.x;
	v2[0] = point.x - t1.x;
	v0[1] = t3.y - t1.y;
	v1[1] = t2.y - t1.y;
	v2[1] = point.y - t1.y;

	// Compute dot products
	dot00 = TriangleCheck.dot(v0, v0);
	dot01 = TriangleCheck.dot(v0, v1);
	dot02 = TriangleCheck.dot(v0, v2);
	dot11 = TriangleCheck.dot(v1, v1);
	dot12 = TriangleCheck.dot(v1, v2);

	// Compute barycentric coordinates
	invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
	u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	// Check if point is in triangle
	return (u > 0) && (v > 0) && (u + v < 1);
}

TriangleCheck.dot = function(vect1, vect2) {
	return (vect1[0] * vect2[0] + vect1[1] * vect2[1]);
}

module.exports = TriangleCheck;