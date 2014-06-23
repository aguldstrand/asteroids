define(['Bifrost'], function(Bifrost) {
	function Model() {


		Bifrost.BaseModel.call(this);


		setInterval(Bifrost.$.proxy(function() {


			this.tick();

		}, this), 50);

		this.TICK = "TICK";


	}



	Model.prototype = new Bifrost.BaseModel();


	Model.prototype.tick = function() {
		this.dispatch(this.TICK);
	};

	return Model;
});