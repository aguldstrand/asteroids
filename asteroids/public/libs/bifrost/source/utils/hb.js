define([], function() {
	var buildMap = {};

	return {
		load: function(name, parentRequire, onload, config) {
			if (buildMap[name]) {
				onload(buildMap[name]);
				return;
			}
			parentRequire([name], function(raw) {
				buildMap[name] = name;
				onload(buildMap[name]);
			});
		}
	};
});