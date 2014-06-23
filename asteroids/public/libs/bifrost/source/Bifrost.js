/**
 * @name Bifrost
 * @author oscjoh
 * @namespace Bifrost
 */


define(
	[
		'./Bicore',
		'./utils/Log',
		'./components/BaseComponent',
		'./commands/BaseCommand',
		'./commands/BaseSubCommand',
		'./commands/MultiCommand',
		'./constants/UILockLevels',
		'./controllers/BaseAsyncController',
		'./libs/jquery/jqueryWrapper',
		'./libs/touchSwipe/jquery.touchSwipe',
		'./models/ApplicationModel',
		'./models/BaseModel',
		'./utils/BaseApp',
		'./utils/ScrollUtil',
		'./utils/Router',
		'./utils/NavigationUtil'
	],
	function(Bicore) {
		var easing = Bicore.$.easing;
		easing.easeOutQuart = function(x, t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		};
		easing.easeOutCubic = function(x, t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
		};
		easing.easeOutQuad = function(x, t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		};
		easing.easeOutSine = function(x, t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		};
		easing.easeOutExpo = function(x, t, b, c, d) {
			return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		};
		easing.easeOutCirc = function(x, t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
		};
		return Bicore;
	});