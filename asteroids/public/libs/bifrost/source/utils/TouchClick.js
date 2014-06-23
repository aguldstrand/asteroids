define([
	'../Bicore',
	//dependencies
	'../libs/jquery/jqueryWrapper'
], function(Bifrost) {
	var TouchClick = {
		startX: null,
		startY: null,
		target: null,
		moveDist: 10,

		attachTrigger: function(selector) {
			if (!TouchClick.Ghost.init()) {
				return;
			}

			var $selector = Bifrost.$(selector);
			$selector.bind('touchstart', TouchClick.onStart);
		},

		onStart: function(event) {
			if (TouchClick.target) { // if we get a touchstart-event when we already have one we reset
				TouchClick.reset();
			}

			var touches = event.originalEvent.touches;
			if (TouchClick.target || touches.length > 1) { // don't do anything if there's multiple fingers (pinch zoom or whatnot)
				return;
			}
			var touch = touches[0];

			TouchClick.startX = touch.pageX;
			TouchClick.startY = touch.pageY;
			TouchClick.target = event.target;

			Bifrost.$(TouchClick.target).on('touchmove', TouchClick.onMove);
			Bifrost.$(TouchClick.target).on('touchend', TouchClick.onEnd);
			Bifrost.$(TouchClick.target).on('touchcancel', TouchClick.onCancel);
		},

		onMove: function(event) {
			var target = event.target;
			var maxDist = TouchClick.moveDist;
			var touch = event.originalEvent.touches[0];
			var abs = Math.abs;
			var deltaX = abs(touch.pageX - TouchClick.startX);
			var deltaY = abs(touch.pageY - TouchClick.startY);
			if (target !== TouchClick.target || deltaX > maxDist || deltaY > maxDist) {
				TouchClick.reset();
			}
		},

		onCancel: function() {
			TouchClick.reset();
		},

		reset: function() {
			Bifrost.$(TouchClick.target).off('touchmove', TouchClick.onMove);
			Bifrost.$(TouchClick.target).off('touchend', TouchClick.onEnd);
			Bifrost.$(TouchClick.target).off('touchcancel', TouchClick.onCancel);
			TouchClick.target = null;
		},

		onEnd: function(event) {
			var touch = event.originalEvent.changedTouches[0];
			var x = touch.pageX - window.pageXOffset;
			var y = touch.pageY - window.pageYOffset;

			var target = document.elementFromPoint(x, y) || event.target;

			if (target !== TouchClick.target) {
				return;
			}

			TouchClick.reset();

			Bifrost.$(target).trigger('click', event);
			TouchClick.Ghost.prevent(touch.pageX, touch.pageY);
		},

		destroy: function() {

		},

		Ghost: {
			coords: [],
			popWait: 2500,
			// the click event might not be fired at the same position as we fired
			dist: 10,
			inited: false,
			root: null,

			init: function() {
				if (!TouchClick.Ghost.inited) {
					var doc = window.document;

					if (!doc) {
						return false;
					}
					var root = doc.body;

					if (!root || !root.addEventListener) {
						return false;
					}

					root.addEventListener('click', TouchClick.Ghost.onClick, true);
					this.root = root;

					TouchClick.Ghost.inited = true;
				}
				return true;
			},

			destroy: function() {
				if (this.root) {
					this.root.removeEventListener('click', TouchClick.Ghost.onClick, true);
				}
			},

			pop: function() {
				TouchClick.Ghost.coords.splice(0, 2);
			},

			onClick: function(event) {
				var coords = TouchClick.Ghost.coords;
				var abs = Math.abs;
				var pX = event.pageX;
				var pY = event.pageY;
				var dist = TouchClick.Ghost.dist;
				for (var i = 0, l = coords.length; i < l; i += 2) {
					var x = coords[i];
					var y = coords[i + 1];
					if (abs(pX - x) < dist || abs(pY - y) < dist) {
						event.stopPropagation();
						event.preventDefault();
					}
				}
			},

			prevent: function(x, y) {
				TouchClick.Ghost.coords.push(x, y);
				window.setTimeout(TouchClick.Ghost.pop, TouchClick.Ghost.popWait);
			}
		}
	};
	Bifrost.TouchClick = TouchClick;
	return Bifrost;
});