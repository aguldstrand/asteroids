define([], function() {
	function Bifrost() {}

	Bifrost.prototype.addHandlebars = function(hb) {
		//this.BaseComponent.___handlebars = hb;
		this.Handlebars = hb;
	};
	Bifrost.prototype.setNamespace = function(ns) {
		//this.BaseComponent.NAMESPACE = ns;
		this.NAMESPACE = ns;
	};
	return new Bifrost();
});