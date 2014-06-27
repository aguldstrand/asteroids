var game = new function() {

	var scope = this;
	var canvas = null;
	var ctx = null;
	var SC_W = 100;
	var SC_H = 100;
	var targetStep = 16;
	var label = null;

	var lastStep = 0;
	var currentStep = 0;
	var step = 0;
	var mouseX = 0;
	var mouseY = 0;
	var mouseXDown = 0;
	var mouseYDown = 0;
	var mouseDown = false;
	var gravityX = 0;
	var gravityY = .1002;
	var friction = .8;
	var ball = {};
	var balls = [];
	var divBalls = [];
	var numBalls = 100;
	var selectedBall = -1;

	var useCanvas = false;

	var ballContainerDiv;
	var switchButton;

	var Vector2 = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};
	Vector2.prototype.lengthSquared = function() {
		return this.x * this.x + this.y * this.y;
	};
	Vector2.prototype.length = function() {
		return Math.sqrt(this.lengthSquared);
	};
	Vector2.prototype.add = function(v) {
		return new Vector2(this.x + v.x, this.y + v.y);
	};
	Vector2.prototype.clone = function() {
		return new Vector2(this.x, this.y);
	};
	Vector2.prototype.degreesTo = function(v) {
		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var angle = Math.atan2(dy, dx); // radians
		return angle * (180 / Math.PI); // degrees
	};
	Vector2.prototype.distance = function(v) {
		var x = this.x - v.x;
		var y = this.y - v.y;
		return Math.sqrt(x * x + y * y);
	};
	Vector2.prototype.equals = function(toCompare) {
		return this.x == toCompare.x && this.y == toCompare.y;
	};
	Vector2.prototype.interpolate = function(v, f) {
		return new Vector2((this.x + v.x) * f, (this.y + v.y) * f);
	};
	Vector2.prototype.length = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};
	Vector2.prototype.normalize = function(thickness) {
		var l = this.length();
		this.x = this.x / l; // * thickness;
		this.y = this.y / l; // * thickness;
		return this;
	};
	Vector2.prototype.orbit = function(origin, arcWidth, arcHeight, degrees) {
		var radians = degrees * (Math.PI / 180);
		this.x = origin.x + arcWidth * Math.cos(radians);
		this.y = origin.y + arcHeight * Math.sin(radians);
	};
	Vector2.prototype.offset = function(dx, dy) {
		this.x += dx;
		this.y += dy;
	};
	Vector2.prototype.subtract = function(v) {
		return new Vector2(this.x - v.x, this.y - v.y);
	};
	Vector2.prototype.toString = function() {
		return "(x=" + this.x + ", y=" + this.y + ")";
	};
	Vector2.prototype.multiply = function(multip) {
		return new Vector2(this.x * multip, this.y * multip);
	};

	Vector2.interpolate = function(pt1, pt2, f) {
		return new Vector2((pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f);
	};
	Vector2.polar = function(len, angle) {
		return new Vector2(len * Math.sin(angle), len * Math.cos(angle));
	};
	Vector2.distance = function(pt1, pt2) {
		var x = pt1.x - pt2.x;
		var y = pt1.y - pt2.y;
		return Math.sqrt(x * x + y * y);
	};
	Vector2.prototype.dot = function(v) {

		return this.x * v.x + this.y * v.y;

	};

	this.initialize = function() {

		logger.log("initialize()");

		label = $('#label');
		canvas = document.getElementById('Canvas2D');
		ctx = canvas.getContext('2d');
		SC_W = window.innerWidth;
		SC_H = window.innerHeight;

		ballContainerDiv = $('#ballContainerDiv');
		switchButton = $('#switch');

		logger.log(SC_W + " : " + SC_H);

		canvas.width = SC_W;
		canvas.height = SC_H;

		logger.log(numBalls + " objects");

		for (var i = 0; i < numBalls; i++) {

			ball = {};

			ball.pos = new Vector2(Math.floor(Math.random() * SC_W), Math
				.floor(Math.random() * SC_H) - 300);
			ball.vel = new Vector2(Math.random() * -.5, Math.random() * -.5);

			ball.radius = Math.random() * 10 + 10;

			if (i < 1) {
				ball.radius = 75;
			}
			ball.immune = false;

			var color = {};
			color.r = Math.floor(Math.random() * 255);
			color.g = Math.floor(Math.random() * 255);
			color.b = Math.floor(Math.random() * 255);

			ball.color = color;

			balls.push(ball);

			var div = $(
				'<div/>', {
					id: 'ball' + i,
					text: "Div",
					css: {
						"position": "absolute",
						"top": "0",
						"left": "0",
						"border-radius": ball.radius,
						"width": ball.radius * 2,
						"height": ball.radius * 2,
						"background": "rgb(" + color.r + "," + color.g + "," + color.b + ")"
					}
				}).appendTo(ballContainerDiv);

			divBalls.push(div);

		}

		this.addEventListeners();


		var msg = useCanvas ? "USING CANVAS" : "USING DOM 3d";
		logger.log("________________");
		logger.log(msg);
	};

	this.loop = function() {

		lastStep = currentStep;
		currentStep = new Date().getTime();
		step = currentStep - lastStep;

		label.html("FPS : " + Math.floor(1000 / step) + " / " + Math.floor(1000 / targetStep));

		scope.update(step);
		scope.render();
	};

	this.render = function() {

		if (useCanvas) {
			var red = 50; // Math.floor(255 * Math.random());
			var green = 2;
			var blue = 2;
			var alpha = 1;

			ctx.fillStyle = "rgba(" + red + "," + green + ", " + blue + ", " + alpha + ")"; // all but alpha must be INTEGERS
			ctx.fillRect(0, 0, SC_W, SC_H);

			for (var i = 0; i < numBalls; i++) {
				ball = balls[i];

				red = ball.color.r;
				green = ball.color.g;
				blue = ball.color.b;

				ctx.beginPath();
				ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, 2 * Math.PI,
					false);
				ctx.fillStyle = "rgba(" + red + "," + green + ", " + blue + ", " + .8 + ")";
				ctx.fill();

				// ctx.strokeStyle = "white";
				// ctx.stroke();

			}

			if (selectedBall != -1) {
				var theBall = balls[selectedBall];
				ctx.beginPath();
				ctx.lineWidth = 2;
				ctx.strokeStyle = "white";
				ctx.moveTo(mouseX, mouseY);
				ctx.lineTo(theBall.pos.x, theBall.pos.y);
				ctx.stroke();
				ctx.closePath();
			}
		} else {

			for (var j = 0; j < numBalls; j++) {
				var ball = balls[j];
				var div = divBalls[j];
				/*
				 * div.css({ "top" : ball.pos.y - ball.radius, "left" :
				 * ball.pos.x - ball.radius });
				 */
				div.css({
					"-webkit-transform": "translate3d(" + (ball.pos.x - ball.radius) + "px , " + (ball.pos.y - ball.radius) + "px ,0)"
				});

			}
		}

	};

	this.update = function(step) {
		step = 22;
		var ballA;
		var ballB;

		if (mouseDown && selectedBall != -1) {
			selectedBall = -1;
			mouseDown = false;
		}

		for (var i = 0; i < numBalls; i++) {
			ballA = balls[i];
			ballA.immune = false;

			ballA.vel.y += gravityY;
			ballA.vel.x += gravityX;

			if (mouseDown && selectedBall < 0) {
				if (mouseXDown > ballA.pos.x - ballA.radius && mouseXDown < ballA.pos.x + ballA.radius && mouseYDown > ballA.pos.y - ballA.radius && mouseYDown < ballA.pos.y + ballA.radius) {

					selectedBall = i;
					logger.log("selected: " + selectedBall);
					mouseDown = false;

				} else {
					selectedBall = -1;
				}
			}

			if (selectedBall == i) {

				ballA.vel.x = 0;
				ballA.vel.y = 0;

				ballA.vel.x -= (ballA.pos.x - mouseX) / (step * 3);
				ballA.vel.y -= (ballA.pos.y - mouseY) / (step * 3);

			}

			ballA.pos.x += ballA.vel.x * step;
			ballA.pos.y += ballA.vel.y * step;

			if (ballA.pos.x + ballA.radius > SC_W) {
				ballA.vel.x = -ballA.vel.x * friction;
				ballA.pos.x = SC_W - ballA.radius;
			}
			if (ballA.pos.x - ballA.radius < 0) {
				ballA.vel.x = -ballA.vel.x * friction;
				ballA.pos.x = ballA.radius;
			}

			if (ballA.pos.y + ballA.radius > SC_H) {
				ballA.vel.y = -ballA.vel.y * friction;
				ballA.vel.x *= friction;
				ballA.pos.y = SC_H - ballA.radius;
			}

			if (ballA.pos.y < 0) {
				ballA.vel.y = -ballA.vel.y * friction;
				ballA.pos.y = 1;
			}

			for (var j = 0; j < numBalls; j++) {
				ballB = balls[j];
				if (j != i && !ballA.immune && !ballB.immune) {

					var dx = ballA.pos.x - ballB.pos.x;
					var dy = ballA.pos.y - ballB.pos.y;
					var radi = ballA.radius + ballB.radius;

					// var dist = ((dx * dx) + (dy * dy)) - (radi * radi);

					var dist = Math.sqrt(dx * dx + dy * dy) - radi;

					if (dist < 1) {

						scope.resolveCollision(ballA, ballB);

					}
					// logger.log(dist2);
				}

			}

		}

	};

	this.resolveCollision = function(ballA, ballB) {
		// get the mtd
		var delta = (ballA.pos.subtract(ballB.pos));
		var d = delta.length();
		// minimum translation distance to push balls apart after intersecting
		var mtd = delta.multiply(((ballA.radius + ballB.radius) - d) / d);

		// resolve intersection --
		// inverse mass quantities
		var im1 = ballB.radius * ballB.radius * Math.PI; // / getMass(); //these
		// seems to be reversed
		// ?
		var im2 = ballA.radius * ballA.radius * Math.PI; // / ball.getMass();

		// push-pull them apart based off their mass
		ballA.pos = ballA.pos.add(mtd.multiply(im1 / (im1 + im2)));
		ballB.pos = ballB.pos.subtract(mtd.multiply(im2 / (im1 + im2)));

		// impact speed
		var v = (ballA.vel.subtract(ballB.vel));
		var vn = v.dot(mtd.normalize());

		// sphere intersecting but moving away from each other already
		if (vn > 0)
			return;

		// collision impulse
		var i = (-(1 + .1) * vn) / (im1 + im2);
		var impulse = mtd.multiply(i);

		// change in momentum
		ballA.vel = ballA.vel.add(impulse.multiply(im1));
		ballB.vel = ballB.vel.subtract(impulse.multiply(im2));

	}

	this.getMousePos = function(body, evt) {
		// get canvas position
		var obj = body;
		var top = 0;
		var left = 0;

		while (obj && obj.tagName != 'BODY') {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
		}

		// return relative mouse position
		var mouseX = evt.clientX - left + window.pageXOffset;
		var mouseY = evt.clientY - top + window.pageYOffset;
		return {
			x: mouseX,
			y: mouseY
		};
	};

	this.tilt = function(x, y) {

		if (x) {

			gravityX = x * .001;
		}
		if (y) {
			gravityY = y * .001;
		}
	};

	this.addEventListeners = function() {

		logger.log("addEventListeners() ");

		if (window.DeviceOrientationEvent) {
			window.addEventListener("deviceorientation", function() {

				scope.tilt(event.gamma, event.beta);
			}, true);
		} else if (window.DeviceMotionEvent) {
			window.addEventListener('devicemotion', function() {
				scope
					.tilt([event.acceleration.x * 2,
						event.acceleration.y * 2
					]);
			}, true);
		} else {
			window.addEventListener("MozOrientation", function() {
				scope.tilt([orientation.x * 50, orientation.y * 50]);
			}, true);
		}

		document.body.addEventListener('mousedown', function(evt) {
			mouseDown = true;

			var mousePos = scope.getMousePos(document.body, evt);
			mouseXDown = mousePos.x;
			mouseYDown = mousePos.y;

		}, false);

		document.body.addEventListener('mouseup', function(evt) {
			mouseDown = false;

		}, false);

		document.body.addEventListener('mousemove', function(evt) {
			// var mousePos = scope.getMousePos(document.body, evt);
			mouseX = evt.clientX;
			mouseY = evt.clientY;

		}, false);

		switchButton.click(function() {
			useCanvas = !useCanvas;

			if (useCanvas) {
				ballContainerDiv.hide();
				$(canvas).show();
				logger.log("USING CANVAS");
			} else {
				ballContainerDiv.show();
				$(canvas).hide();
				logger.log("USING DOM 3d");
			}

		});

		/*
		 * frontDiv.addEventListener('mousedown', function(evt) { mouseDown =
		 * true; logger.log("mousedown"); var mousePos =
		 * scope.getMousePos(canvas, evt); mouseXDown = mousePos.x; mouseYDown =
		 * mousePos.y; }, false);
		 *
		 * frontDiv.addEventListener('mouseup', function(evt) { mouseDown =
		 * false;
		 *
		 * logger.log("mouseup"); }, false);
		 *
		 * canvas.addEventListener('mousemove', function(evt) { var mousePos =
		 * scope.getMousePos(canvas, evt); mouseX = mousePos.x; mouseY =
		 * mousePos.y; }, false);
		 */

		setInterval(function() {
			scope.loop();
		}, targetStep);
	};
};