/**
 * Author: hekwal
 *
 * Currenlty only supports routes in form {foo}/{bar}
 * NOT any optional such as {foo}/:bar: or other ways to specify paths  ( foo/{bar} , {foo}/:bar*: )
 */
define(['../Bicore'], function(Bifrost) {
	var Router = {
		/*******************
		 * Public
		 *******************/
		/**
		 * Add a route to match
		 * @param {String}   pattern Pattern for route to match
		 * @param {Function} fn      Callback for route
		 */
		addRoute: function(pattern, fn) {
			var route = new Route(pattern, fn);
			_routes.push(route);
		},
		/**
		 * Parses a request and activates corresponding route if found
		 * ? should we notify (current)old route that it changed ?
		 * @param  {String} request  Route request to match
		 */
		parse: function(request) {
			request = request || '';

			// see if we already are matched with request
			if (request === _last) {
				return; // perhaps we want to match it again
			}

			// find matching routes
			var matches = _getMatches(request);

			// if we have any matches
			var len = matches.length;
			if (len) {
				this._last = request;

				// ( notify previous route ? )

				// go through all matched routes
				var i = 0;
				while (i < len) {
					var match = matches[i++];

					// dispatch routes callback
					match.route.dispatch(match.params);
				}
			} else {
				// some action when no routes are matching
			}
		},

		setRouteWithoutParse: function(request) {
			this._last = request;
		}
	};

	/*****
	 * Vars
	 *****/
	var _last;
	var _routes = [];

	/**
	 * Compiled regex
	 */
	var _Regex = {
		// removes "/" in the start and end of a string
		SSE: /^\/|\/$/g,

		// translate {foo} into regex accepting any character except "/"
		RR: {
			rgx: /\{([^\}]+)\}/g,
			res: '([^\\/]+)'
		}
	};


	/*****************
	 * Private
	 *****************/
	/**
	 * Compiles a pattern into regex
	 * @param  {String} pattern
	 * @return {RegExp}
	 */
	function _compilePattern(pattern) {
		pattern = pattern || '';

		// strip slashes before and after in pattern
		pattern = pattern.replace(_Regex.SSE, '');

		// replace {foo} with ([^\/]+)
		pattern = pattern.replace(_Regex.RR.rgx, _Regex.RR.res);

		// allow slash before
		pattern = '\\/?' + pattern;

		// allow slash after
		pattern += '\\/?';

		return new RegExp('^' + pattern + '$');
	}

	/**
	 * Get routes that match the request
	 * and fetch params from request
	 * @param  {String} request  Request to match
	 * @return {Array}           Returns an array with objects containing route + params
	 */
	function _getMatches(request) {
		var res = [];
		var len = _routes.length;
		for (var i = 0; i < len; ++i) {
			var route = _routes[i];

			// match more then one route?
			if (route.match(request)) {
				res.push({
					route: route,
					params: route.getParams(request)
				});
			}
		}
		return res;
	}



	/**
	 * Route
	 * @param {String}   pattern   Pattern for route to match
	 * @param {Function} callback  Callback for route
	 */
	function Route(pattern, callback) {
		// Compile a regex to match with
		this._rgx = _compilePattern(pattern);
		// Callback function
		this._fn = callback;
		// this._callback = callback;
	}

	/******
	 * Public
	 ******/
	var p = Route.prototype;
	p.match = function(request) {
		// match with our regex
		request = request || '';
		var res = this._rgx.test(request);
		return res;
	};
	p.getParams = function(request) {
		// fetch params from the request according to our own matching pattern
		var vals = this._rgx.exec(request);
		if (vals) {
			vals.shift();
		}
		return vals;
	};
	/**
	 * Apply callback function for route
	 * @param  {Array} params  Array with params from request
	 */
	p.dispatch = function(params) {
		// context in apply?
		this._fn.apply(null, params);
		// this._callback.apply(null, params);
	};

	Bifrost.Router = Router;

	return Bifrost;
});