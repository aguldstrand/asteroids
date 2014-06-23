define(['../Bicore',
	//dependencies
	'../libs/jquery/jqueryWrapper'
], function(
	Bifrost
) {

	function ScrollUtil(options) {}

	var ___isMobile;
	// events listened to that cause scroll
	var ___eventListenerString = 'scroll mousedown wheel DOMMouseScroll mousewheel keyup touchstart';
	// which elements are targeted for animation and listeners
	var ___elementString = 'html, body';
	var ___hasBound = false;

	function isMobile() {

		if (typeof ___isMobile === 'undefined') {
			___isMobile = !! ((Bifrost || {}).userAgent || {}).mobileAgent;
		}
		return ___isMobile;
	}

	function iOS5FixedPositionBugfix() {
		if (isMobile()) {
			var elem = document.documentElement;
			// setting a padding top on document element will force repaint, but not show any visual effect
			elem.style.paddingTop = '1px';
			setTimeout(function() {
				elem.style.paddingTop = '0';
			}, 0);
		}
	}

	function bindScrollListener() {
		if (!___hasBound) {
			Bifrost.$(___elementString).bind(___eventListenerString, scrollListener);
			___hasBound = true;
		}
	}

	function unbindScrollListener() {
		Bifrost.$(___elementString).unbind(___eventListenerString, scrollListener);
	}

	function scrollListener(event) {
		if (isMobile()) {
			// if mobile, see if there are any touch
			var touches = event.touches || event.originalEvent.touches || event.originalEvent.changedTouces;
			if (touches && touches.length) {
				Bifrost.$(___elementString).stop();
			}
		} else {
			// check if the scroll event was caused by user interaction
			if (event.which > 0 || event.type === 'mousedown' || event.type === 'mousewheel') {
				Bifrost.$(___elementString).stop();
			}
		}
	}

	/*
	ScrollUtil.scrollTo = function(top, animationSpeed) {
		animationSpeed = animationSpeed || 0;
		if (animationSpeed !== 0) {

			// allow user to interupt animation by scrolling themselves
			bindScrollListener();

			Bifrost.$(___elementString).animate({
				scrollTop: top
			}, animationSpeed).promise()
				.always(function() {
					iOS5FixedPositionBugfix();
					// unbindScrollListener();
				});

		} else {
			var left = window.pageXOffset || document.documentElement.scrollLeft;
			window.scrollTo(left, top);

			iOS5FixedPositionBugfix();
		}
	};*/


	ScrollUtil.scrollTo = function(to, duration) {

		var d = Bifrost.$.Deferred();

		var fallBackTime = 30;

		var startPos = Bifrost.$(window).scrollTop();
		var endPos = to;
		var diff = endPos - startPos;

		var durationMS = duration * 1000;
		var startTime = new Date().getTime();

		function update(t) {

			var currentTime = new Date().getTime() - startTime;
			var normalizedTime = currentTime / durationMS;

			var pos = (0.5 - Math.cos(normalizedTime * Math.PI) / 2) * diff + startPos;

			if (currentTime > durationMS) {
				window.scrollTo(0, endPos);
				d.resolve();
			} else {
				window.scrollTo(0, pos);
				tick(update);
			}
		}

		function tick(cb) {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(cb);
			} else {
				setTimeout(cb, fallBackTime);
			}
		}

		tick(update);

		return d;
	};

	ScrollUtil.fixScrollPosIos = function() {
		iOS5FixedPositionBugfix();
	};

	Bifrost.ScrollUtil = ScrollUtil;
	return Bifrost;

});