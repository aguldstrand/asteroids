/**
 * BaseClass mainly for event dispatching to keep it centralized
 *
 * 3 sep 201211:50:35
 *
 * @name BaseModel
 * @author oscjoh
 * @namespace Bifrost.models
 *
 */

define([
	'../Bicore',
	//dependencies
	'../libs/jquery/jqueryWrapper'
], function(Bifrost) {
	function BaseModel(models, params) {
		for (var modelName in models) {
			this[modelName + 'Model'] = models[modelName];
		}

		for (var property in params) {
			this[property] = params[property];
		}

		this.__events = {};
	}

	/* Synchronized events
	BaseModel.prototype.dispatch = function(event) {
		Bifrost.out.event(event);
		//Bifrost.out.event(this, event);
		var context = Bifrost.$(this).trigger(event);
		for(var i = 0; i < lenM;)

	};*/



	BaseModel.prototype.addListener = function(eventName, handler) {

		Bifrost.out.event("adding core listener: " + eventName);
		var events = this.__events;
		var eventObjs = events[eventName] = events[eventName] || [];
		eventObjs.push({
			eventName: eventName,
			handler: handler
		});
	};

	BaseModel.prototype.removeListener = function(eventName, handler) {

		Bifrost.out.event("removing core listener: " + eventName + ' @ ' + this.instanceName);

		var eventObjs = this.__events[eventName];
		if (eventObjs) {
			var len = eventObjs.length;
			for (var i = 0; i < len; i++) {
				var eventObj = eventObjs[i];

				if (eventObj.handler === handler) {
					eventObjs.splice(i, 1);
					i--;
					len--;
				}
			}
		}
	};

	//Async events
	BaseModel.prototype.dispatch = function(eventName, arg) {


		arg = arg || {};
		arg.event = eventName;
		arg.target = this;

		//console.log('core event > ', eventName, arg);

		var eventObjs = this.__events[eventName];
		var len = 0;
		var promises = [];
		var d = null;
		var master = Bifrost.$.Deferred();
		var eventObj = null;
		if (eventObjs) {
			Bifrost.out.event("dispatching event", eventName, arg);
			len = eventObjs.length;
			for (var i = 0; i < len; i++) {
				eventObj = eventObjs[i];
				d = eventObj.handler(arg);
				if (!d) {
					d = Bifrost.$.Deferred();
					d.resolve();
				}
				promises.push(d);
			}

		} else {

			Bifrost.out.event("auto resolving event", eventName);

			d = Bifrost.$.Deferred();
			d.resolve();
			promises.push(d);
		}
		Bifrost.$.when.apply(Bifrost.$, promises).then(function() {
			master.resolve();
		});
		return master;
	};



	Bifrost.BaseModel = BaseModel;

	return Bifrost;
});