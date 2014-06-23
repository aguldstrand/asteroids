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


// See http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Point.html
function Point(x, y) {
	if (typeof x === 'undefined') {
		x = 0;
		y = 0;
	}

	this.x = (Number)(x);
	this.y = (Number)(y);

	return this;
}

Point.prototype.add = function(p) {
	var result = new Point((this.x + p.x), (this.y + p.y));
	return result;
};

Point.prototype.subtract = function(p) {
	var result = new Point((this.x - p.x), (this.y - p.y));
	return result;
};

Point.prototype.dot = function(p) {
	var result = ((this.x * p.x) + (this.y * p.y));
	return result;
};

Point.prototype.cross = function(p) {
	var result = ((this.x * p.y) - (this.y * p.x));
	return result;
};

Point.prototype.clone = function() {
	return new Point(this.x, this.y);
};