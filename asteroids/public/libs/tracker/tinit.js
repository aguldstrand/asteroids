(function() {


	require(['../tracker/Tracker.js', '../tracker/plugins/Redirecter', '../tracker/plugins/Consola'], function(Tracker, Redirecter, Consola) {

		var t = new Tracker({
			plugins: [Redirecter, Consola],
			timeStamp: false,
			alpha: '0.9',
			fps: 50,
			//namespace: 't2',
			fpsExtended: true,
			logs: {
				log: true,
				green: true,
				warn: true,
				fixed: true,
				error: true,
				pink: true
			},
			filter: {
				log: true,
				green: true,
				warn: true,
				error: true,
				fixed: true,
				pink: true
			},
			colorMap: {
				fixed: 'cyan',
				log: 'white',
				warn: 'yellow',
				error: 'red',
				green: '#ADFF2F',
				pink: '#FF69B4'
			}
		});



		window.tracker.pink('pink');
		window.tracker.green('THIS IS GREEN');
		window.tracker.out('green', 'THIS IS GREEN');

		window.tracker.log('logg... (static access)', 'handles', 'multiple', {
			arg: {
				that: 0
			}
		});
		window.tracker.warn('warn...(static access)');

		window.tracker.out('warn', '(dynamic access, single argument only)');
		window.tracker.out('log', '(dynamic access, single argument only)');

		var times = 0;

		var key1 = setInterval(function() {
			window.tracker.fixed('f', 'fixed positioned log:', Math.random());

		}, 100);

		window.tracker.start('TIMER_KEY', true, true);

		var key2 = setInterval(function() {
			window.tracker.log('rolling log:', Math.random());

			times++;
			if (times > 2) {
				clearInterval(key1);
				clearInterval(key2);
				window.tracker.end('TIMER_KEY');
				window.tracker.end('TIMER_KEY', true);
			}
		}, 800);


		setTimeout(function() {
			throw 'forced runtime error';
		}, 2000);


	});

})();