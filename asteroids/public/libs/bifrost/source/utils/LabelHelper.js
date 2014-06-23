/**
 * @name LabelHelper
 * @author oscjoh
 * @namespace Bifrost.utils.LabelHelper
 */
define(['../Bicore'], function(Bifrost) {

	function LabelHelper() {}

	LabelHelper.getLabel = function(label, settings, placeholder, isLabel) {

		if (Bifrost.debug) {

			/* code to detect unused labels */
			/* will not pickup dynamic usage and stuf like settings/choice */

			if (!Bifrost.debug.labelHash) {
				Bifrost.debug.labelHash = {};

				for (var key1 in settings) {
					if (settings.hasOwnProperty(key1)) {
						if (typeof(settings[key1]) === 'string') {
							Bifrost.debug.labelHash[key1] = settings[key1];

						}
					}
				}

				Bifrost.debug.labelInfo = function() {
					var cnt = 0;
					for (var key2 in Bifrost.debug.labelHash) {
						if (Bifrost.debug.labelHash.hasOwnProperty(key2)) {
							cnt++;
						}
					}
					return {
						cnt: cnt,
						hash: Bifrost.debug.labelHash
					};
				};
			}
			delete Bifrost.debug.labelHash[label + ''];
		}

		var value;
		if (isLabel === false) {
			value = label;
		} else {
			value = (settings.label && settings.label[label]) || "missing: " + label;

			if (!settings[label]) {
				Bifrost.out.label('missing: ' + label);
			}
		}

		/*
		if (Bifrost.debug) {
			return label;
		}
		*/

		if (placeholder) {

			var regex = new RegExp("\\{([a-zA-Z0-9]*)\\}", 'gi');

			while (true) {
				var match = regex.exec(value);
				if (!match) {
					break;
				}

				var key = match[1];

				value = value.replace('{' + key + '}', placeholder[key]);
			}

		}

		return value;
	};
	Bifrost.LabelHelper = LabelHelper;
	return Bifrost;
});