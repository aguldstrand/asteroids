define(['../Bicore'], function(Bifrost) {

	function NavigationUtil() {}

	NavigationUtil.getActiveNavigationPath = function(origin) {
		var component = null;
		var c;
		for (var key in origin.components) {
			if (origin.components.hasOwnProperty(key)) {
				c = origin.components[key];
				if (c.isActive) {
					component = c;
					break;
				}
			}
		}

		if (component) {
			return NavigationUtil.getActiveNavigationPath(component);
		} else {
			var names = [];

			for (c = origin; c; c = c.parent) {
				if (c.isNavigationFragment) {
					var fullName = c.getFullName();

					names.push(fullName);
				}
			}

			names.reverse();

			return names;
		}
	};

	NavigationUtil.getNavigationPathFromName = function(root, name) {
		return NavigationUtil.getNavigationPathFromFullName(root, NavigationUtil.getFullNameFromNavigationName(root, name));
	};

	NavigationUtil.getNavigationPathFromFullName = function(root, fullName) {

		var pieces = fullName.split('-');
		var len = pieces.length;
		var i;
		var path = [];

		var component = root;
		for (i = 1; i < len; i++) {
			component = component.components[pieces[i]];

			if (component && component.isNavigationFragment) {
				path.push(component.getFullName());
			}
		}

		return path;
	};

	NavigationUtil.getFullNavigationName = function(root, component) {
		var fragments = NavigationUtil.getActiveNavigationPath(component);

		return NavigationUtil.getFragmentsFromFullName(root, fragments[fragments.length - 1]);
	};

	NavigationUtil.getFragmentsFromFullName = function(root, fullName) {
		var pieces = fullName.split('-');
		var len = pieces.length;
		var i;
		var path = [];

		var component = root;
		for (i = 1; i < len; i++) {
			component = component.components[pieces[i]];

			if (component && component.isNavigationFragment) {
				path.push(component.instanceName);
			}
		}

		return path.join('-');
	};

	NavigationUtil.getNavigationName = function(component) {

		var names = [];

		for (; component; component = component.parent) {
			if (component.isNavigationFragment) {
				names.push(component.instanceName);
			}
		}

		names.reverse();

		return names.join('-');
	};

	NavigationUtil.getFullNameFromNavigationName = function(root, navigationName) {
		var component = NavigationUtil.getComponentFromNavigationName(root, navigationName);
		return component ? component.getFullName() : null;
	};

	NavigationUtil.getFullNamesFromNavigationName = function(root, navigationName) {
		var components = NavigationUtil.getComponentsFromNavigationName(root, navigationName);
		if (!components) {
			return 'illegal path';
		}
		var len = components.length;
		var fullNames = [];
		for (var i = 0; i < len; i++) {
			fullNames.push(components[i].getFullName());
		}
		return fullNames;
	};

	NavigationUtil.getComponentFromNavigationName = function(root, navigationName) {

		var pieces = navigationName.split('-');

		var component = root;
		var len = pieces.length;
		for (var i = 0; i < len; i++) {

			component = NavigationUtil.___findFragment(component, pieces[i]);
			if (!component) {
				return null;
			}
		}

		return component;
	};

	NavigationUtil.getComponentsFromNavigationName = function(root, navigationName) {

		var pieces = navigationName.split('-');

		var component = root;
		var components = [];
		var len = pieces.length;
		for (var i = 0; i < len; i++) {

			component = NavigationUtil.___findFragment(component, pieces[i]);
			if (!component) {
				return null;
			} else {
				components.push(component);
			}
		}


		return components;
	};

	NavigationUtil.___findFragment = function(component, name) {
		for (var key in component.components) {
			if (component.components.hasOwnProperty(key)) {

				var c = component.components[key];
				if (!c) {
					return null;
				}
				if (c.isNavigationFragment && c.instanceName === name) {
					return c;
				}

				if (!c.isNavigationFragment) {
					var inner = NavigationUtil.___findFragment(c, name);
					if (inner) {
						return inner;
					}
				}

			}
		}

		return null;
	};

	NavigationUtil.getFullComponentTree = function(root) {

		function recurse(component) {
			var outp = {};
			for (var key in component.components) {
				if (component.components.hasOwnProperty(key)) {
					outp[key] = recurse(component.components[key]);
				}
			}
			return outp;
		}

		return {
			rootComponent: recurse(root)
		};
	};

	Bifrost.NavigationUtil = NavigationUtil;

	return Bifrost;
});