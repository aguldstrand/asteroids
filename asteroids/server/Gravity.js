var Base = require('./Base');
var Point = require('../Point');
var Asteroid = require('../Asteroid');

function Gravity(options) {


	Base.call(this, options);


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
			localGravity.x = xgra;
			localGravity.y = ygra;

			//trace(int(x + y * SW / gravityRes));
		}

	}
};
module.exports = Gravity;