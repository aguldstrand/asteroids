(function() {
	require.config({
		waitSeconds: 0,
		catchError: {
			define: false
		},
		baseUrl: '../public',

		packages: [{
			name: 'Bifrost',
			location: 'libs/bifrost/source',
			main: 'Bifrost'
		}],
		paths: {
			// 'Bifrost': 'libs/bifrost/dist/Bifrost.min',
			'handlebars': 'libs/bifrost/dist/handlebars.runtime',

			'hb': 'libs/bifrost/dist/hb'

		}
	});


	require(['Bifrost', 'handlebars', 'monitor/App'], function(Bifrost, handlebars, MonitorApp) {

		window.Bifrost = Bifrost;



		Bifrost.addHandlebars(handlebars);
		Bifrost.setNamespace('Asteroids');
		window.Asteroids = {};

		window.Asteroids.templates = {
			'main': function() {
				return '<div id="screen"></div>';
			},
			'screen': function() {
				return '<canvas></canvas>';
			}
		};

		function getParameterByName(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
			var results = regex.exec(window.location.search);
			return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

		function ieUserAgent() {
			// Get the user agent string
			var ua = navigator.userAgent;
			var ret = {
				isIE: false,
				version: -1
			};


			// Detect whether or not the browser is IE
			var ieRegex = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
			if (ieRegex.exec(ua) === null) {
				ret.isIE = false;
				return ret;
			}
			ret.isIE = true;
			ret.version = parseFloat(RegExp.$1);
			return ret;

		}



		//Bifrost.out.setLogElements(['vis-log-1', 'vis-log-2', 'vis-log-3', 'vis-log-4', 'vis-log-5', 'vis-log-6']);

		var bifrostLogFilter = getParameterByName('filter').split(',');


		Bifrost.out.setFilter(bifrostLogFilter);



		var levels = getParameterByName('levels').split(',');
		var filter = {};

		for (var i = 0; i < levels.length; i++) {
			filter[levels[i]] = true;
		}



		if (window.tracker) {

			window.tracker.setup({
				minimized: !(getParameterByName('debug') === 'true'),
				//filter: filter,
				targetId: 'tracker-sel'
			});
		}



		new MonitorApp({});

	});
})();