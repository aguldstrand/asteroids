/****************************

 FlxJS
 http://github.com/petewarden/flxjs

 This is a collection of 2D geometry classes implementing the Flex3 interface, originally
 created to help me port OpenHeatMap from Flash to Javascript/HTML5.
 
 I tried to emulate the Adobe classes as closely as possible, so their documentation
 is the best place to start. Here are the links for the three classes I've implemented:
 http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Matrix.html
 http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Point.html
 http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Rectangle.html
 Not all of the functions are implemented, just the ones I needed for my code. If you do
 need to implement any of the missing ones, I'm happy to accept updates from github forks.

 Licensed under the 2-clause (ie no advertising requirement) BSD license,
 making it easy to reuse for commercial or GPL projects:
 
 (c) Pete Warden <pete@petewarden.com> http://petewarden.typepad.com/ Aug 19th 2011
 
 Redistribution and use in source and binary forms, with or without modification, are
 permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this 
      list of conditions and the following disclaimer.
   2. Redistributions in binary form must reproduce the above copyright notice, this 
      list of conditions and the following disclaimer in the documentation and/or 
      other materials provided with the distribution.
   3. The name of the author may not be used to endorse or promote products derived 
      from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR 
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
OF SUCH DAMAGE.

*****************************/

define(['utils/Point'], function(Point) {


	function Matrix(a, b, c, d, tx, ty) {
		if (typeof a === 'undefined') {
			a = 1;
			b = 0;
			c = 0;
			d = 1;
			tx = 0;
			ty = 0;
		}

		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.tx = tx;
		this.ty = ty;

		return this;
	}

	Matrix.prototype.identity = function() {
		this.a = 1;
		this.b = 0;
		this.c = 0;
		this.d = 1;
		this.tx = 0;
		this.ty = 0;

	};

	Matrix.prototype.transformPoint = function(p) {
		var result = new Point(
			(p.x * this.a) + (p.y * this.c) + this.tx, (p.x * this.b) + (p.y * this.d) + this.ty
		);

		return result;
	};

	Matrix.prototype.translate = function(x, y) {
		this.tx += x;
		this.ty += y;

		return this;
	};

	Matrix.prototype.scale = function(x, y) {

		var scaleMatrix = new Matrix(x, 0, 0, y, 0, 0);
		this.concat(scaleMatrix);

		return this;
	};

	Matrix.prototype.concat = function(m) {

		this.copy(new Matrix(
			(this.a * m.a) + (this.b * m.c), (this.a * m.b) + (this.b * m.d), (this.c * m.a) + (this.d * m.c), (this.c * m.b) + (this.d * m.d), (this.tx * m.a) + (this.ty * m.c) + m.tx, (this.tx * m.b) + (this.ty * m.d) + m.ty
		));

		return this;
	};

	Matrix.prototype.invert = function() {

		var adbc = ((this.a * this.d) - (this.b * this.c));

		this.copy(new Matrix(
			(this.d / adbc), (-this.b / adbc), (-this.c / adbc), (this.a / adbc), (((this.c * this.ty) - (this.d * this.tx)) / adbc), -(((this.a * this.ty) - (this.b * this.tx)) / adbc)
		));

		return this;
	};

	Matrix.prototype.clone = function() {

		var result = new Matrix(
			this.a, this.b,
			this.c, this.d,
			this.tx, this.ty
		);

		return result;
	};

	Matrix.prototype.zoomAroundPoint = function(center, zoomFactor) {
		var translateToOrigin = new Matrix();
		translateToOrigin.translate(-center.x, -center.y);

		var scale = new Matrix();
		scale.scale(zoomFactor, zoomFactor);

		var translateFromOrigin = new Matrix();
		translateFromOrigin.translate(center.x, center.y);

		var zoom = new Matrix();
		zoom.concat(translateToOrigin);
		zoom.concat(scale);
		zoom.concat(translateFromOrigin);

		this.concat(zoom);
		return this;
	};

	Matrix.prototype.copy = function(m) {
		this.a = m.a;
		this.b = m.b;
		this.c = m.c;
		this.d = m.d;
		this.tx = m.tx;
		this.ty = m.ty;

		return this;
	};



	return Matrix;
});