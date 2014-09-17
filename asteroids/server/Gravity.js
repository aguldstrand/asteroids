var Base = require('./Base');
var Point = require('../Point');
var Asteroid = require('../Asteroid');

function Gravity(options) {


	Base.call(this, options);

	this.createStatic({
		pos: new Point(400, 400),
		size: 10
	}, 1);


	this.createStatic({
		pos: new Point(2600, 2600),
		size: 10
	}, -1);
}

Gravity.prototype = new Base();
Gravity.prototype.update = function(secs) {
	var gravity = this.gravity;
	var yMax = parseInt(this.SH / this.gravityRes, 10);
	var xMax = parseInt(this.SW / this.gravityRes, 10);
	var numExplosions = this.gameModel.explosions.length;
	for (var y = 0; y < yMax; y++) {
		for (var x = 0; x < xMax; x++) {
			var xgra = 0;
			var ygra = 0;

			for (var aaa = 0; aaa < numExplosions; aaa++) {
				var explosion = this.gameModel.explosions[aaa];

				// relative pos
				var __dx = x * this.gravityRes - explosion.pos.x;
				var __dy = y * this.gravityRes - explosion.pos.y;

				// normalize (lent = 1)
				var relativePos = new Point(__dx, __dy);

				var normalizedRelativepos = relativePos.clone();
				normalizedRelativepos.normalize(1);

				// multiply gravity force size
				var gravForceSize = Math.pow(1 / relativePos.length(), 1.25) * +explosion.size * 9000;

				var _____x = normalizedRelativepos.x * gravForceSize;
				var _____y = normalizedRelativepos.y * gravForceSize;

				xgra += _____x;
				ygra += _____y;

			}

			var localGravity = gravity[x + y * xMax];
			var staticGravity = this.gameModel.staticGravity[x + y * xMax];

			localGravity.x = xgra + staticGravity.x;
			localGravity.y = ygra + staticGravity.y;

			//trace(int(x + y * SW / gravityRes));
		}

	}
};

Gravity.prototype.createStatic = function(explosion, negative) {



	var gravity = this.gameModel.staticGravity;
	var yMax = parseInt(this.SH / this.gravityRes, 10);
	var xMax = parseInt(this.SW / this.gravityRes, 10);

	for (var y = 0; y < yMax; y++) {
		for (var x = 0; x < xMax; x++) {
			var xgra = 0;
			var ygra = 0;



			// relative pos
			var __dx = x * this.gravityRes - explosion.pos.x;
			var __dy = y * this.gravityRes - explosion.pos.y;

			// normalize (lent = 1)
			var relativePos = new Point(__dx, __dy);

			var normalizedRelativepos = relativePos.clone();
			normalizedRelativepos.normalize(1);

			// multiply gravity force size
			var gravForceSize = Math.pow(1 / relativePos.length(), 1.25) * +explosion.size * 9000;

			var _____x = normalizedRelativepos.x * gravForceSize;
			var _____y = normalizedRelativepos.y * gravForceSize;

			xgra += _____x;
			ygra += _____y;



			var localGravity = gravity[x + y * xMax];


			localGravity.x += xgra * negative;
			localGravity.y += ygra * negative;

			//trace(int(x + y * SW / gravityRes));
		}

	}
};

module.exports = Gravity;