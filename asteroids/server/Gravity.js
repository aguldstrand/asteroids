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
		pos: new Point(2500, 2500),
		size: 10
	}, -1, new Point(400, 400));
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
				var gravForceSize = Math.pow(1 / Math.max(relativePos.length(), 1), 1.25) * +explosion.size * 9000;

				var _____x = normalizedRelativepos.x * gravForceSize;
				var _____y = normalizedRelativepos.y * gravForceSize;

				xgra += _____x;
				ygra += _____y;



			}

			var gIndex = x + y * xMax;
			var localGravity = gravity[gIndex];



			var staticGravity = this.gameModel.staticGravity[gIndex];

			localGravity.x = xgra + staticGravity.x;
			localGravity.y = ygra + staticGravity.y;
			localGravity.warp = staticGravity.warp;


			/*var d = localGravity.x + "";
			if (d.toLowerCase() === 'nan') {
				console.log('########################');
				console.log(xgra, staticGravity.x);
				console.log('########################');

			}*/



			//trace(int(x + y * SW / gravityRes));
		}

	}
};

Gravity.prototype.createStatic = function(explosion, negative, warp) {



	var gravity = this.gameModel.staticGravity;
	var yMax = parseInt(this.SH / this.gravityRes, 10);
	var xMax = parseInt(this.SW / this.gravityRes, 10);

	var closest = 0;
	var closestGravPoint = null;
	var closestX = 0;
	var closestY = 0;

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
			var gravForceSize = Math.pow(1 / Math.max(relativePos.length(), 1), 1.25) * +explosion.size * 9000;

			var _____x = normalizedRelativepos.x * gravForceSize;
			var _____y = normalizedRelativepos.y * gravForceSize;

			xgra += _____x;
			ygra += _____y;



			var localGravity = gravity[x + y * xMax];


			localGravity.x += xgra * negative;
			localGravity.y += ygra * negative;

			//console.log(Math.abs(__dx) * Math.abs(__dy));
			if (gravForceSize > closest) {
				closest = gravForceSize;
				//closestGravPoint = localGravity;

				closestX = x;
				closestY = y;
			}


		}

	}
	if (warp) {
		//closestGravPoint.warp = warp;

		var range = 1;
		//var start = (closestX + closestY * xMax) - range * 0.5;

		for (var _x = closestX - range; _x < closestX + range; _x++) {
			for (var _y = closestY - range; _y < closestY + range; _y++) {

				var index = _x + _y * xMax;
				closestGravPoint = gravity[index];
				console.log(closestX, closestY, index);
				closestGravPoint.warp = warp;
			}
		}
		/*
		for (var i = start; i < start + range; i++) {
			closestGravPoint = gravity[i];
			closestGravPoint.warp = warp;
		}*/
		/*
		closestGravPoint = gravity[(closestX - 1 + closestY) * xMax];
		closestGravPoint.warp = warp;
		closestGravPoint = gravity[(closestX + 1 + closestY) * xMax];
		console.log('¤¤', (closestX + 1 + closestY) * xMax);
		closestGravPoint.warp = warp;
		closestGravPoint = gravity[(closestX + closestY - 1) * xMax];
		closestGravPoint.warp = warp;
		closestGravPoint = gravity[(closestX + closestY + 1) * xMax];
		closestGravPoint.warp = warp;*/

	}

};

module.exports = Gravity;