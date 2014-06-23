(function() {
	require.config({
		waitSeconds: 0,
		catchError: {
			define: false
		},
		baseUrl: 'app',


		packages: [{
			name: 'Bifrost',
			location: '../../source',
			main: 'Bifrost'
		}],
		paths: {
			//"Bifrost": '../../dist/Bifrost.min',
			"handlebars": "../../dist/handlebars.runtime",
			"hb": '../../dist/hb',
			'ui': 'ui'
		}
	});
	var manifest = window.manifest;

	require(['Bifrost', 'ui/MainComponent', 'handlebars', 'ui/Model'], function(Bifrost, App, handlebars, Model) {

		Bifrost.addHandlebars(handlebars);

		var app = {
			models: {
				settings: {},
				model: new Model()
			}
		};

		window.apa = Bifrost;

		var Mapp = new App({
			$el: Bifrost.$('#' + manifest.page_outputElementId),
			coreEvents: [],
			instanceName: 'main',
			app: app,
			parent: 'root'
		});
		Mapp.render();

	});
})();