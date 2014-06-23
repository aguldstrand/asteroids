define(['../Bicore'], function(Bifrost) {

	Bifrost.UILockLevels = {
		NONE: 0,
		POPUP: 1,
		TOOLTIP: 2,
		ALERT: 3,
		APPLICATION: 4,
		FORCE: 999999
	};
	return Bifrost;
});