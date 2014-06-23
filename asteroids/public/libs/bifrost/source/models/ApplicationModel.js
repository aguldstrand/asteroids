/**
 * @name ApplicationModel
 * @author oscjoh
 * @namespace Bifrost.models
 */
define([
	'../Bicore',
	//dependencies
	'./BaseModel',
	'../constants/UILockLevels'
], function(Bifrost) {

	function ApplicationModel() {
		Bifrost.BaseModel.apply(this, arguments);

		this.__coreLock = 0;


		this.__uiLockLevels = [];
		for (var key in Bifrost.UILockLevels) {
			this.__uiLockLevels.push(0);
		}


		this.__uiLock = 0;
		this.__uiLockLevel = 0;

		this.___supressOtherDialogs = false;


		this.__uiLockVisible = false;
		this.__uiIsFirstLock = true;
	}

	ApplicationModel.prototype = new Bifrost.BaseModel();

	ApplicationModel.prototype.LOCK_UPDATED = "bifrost.models.applicationModel.LOCK_UPDATED";
	ApplicationModel.prototype.SHOW_LOCK = "bifrost.models.applicationModel.SHOW_LOCK";
	ApplicationModel.prototype.APP_STARTED = "bifrost.models.applicationModel.APP_STARTED";
	ApplicationModel.prototype.SUPRESS_UPDATED = "bifrost.models.applicationModel.SUPRESS_UPDATED";

	ApplicationModel.prototype.setCoreLock = function(lock) {

		if (lock) {
			this.__coreLock++;
		} else {
			this.__coreLock--;
		}

		//Bifrost.out.info("CORE LOCK : ", this.__coreLock, "lock", lock);
		//Bifrost.isCoreLocked = this.getCoreLock();
	};

	ApplicationModel.prototype.getCoreLock = function() {
		return this.__coreLock !== 0;
	};

	ApplicationModel.prototype.showUILock = function() {
		var previousLock = this.__uiLockVisible;
		//Bifrost.out.error(this.SHOW_LOCK)
		this.__uiLockVisible = true;
		if (!previousLock) {
			this.dispatch(this.SHOW_LOCK);
		}
	};

	ApplicationModel.prototype.getUILockVisible = function() {
		return this.__uiLockVisible;
	};

	ApplicationModel.prototype.getUILock = function() {
		//return this.__uiLock !== 0;
		return this.__getUILockLevel() !== 0;
	};
	ApplicationModel.prototype.getUILockLevel = function() {
		//return this.__uiLockLevel;
		return this.__getUILockLevel();
	};


	ApplicationModel.prototype.getSupressOtherDialogs = function() {
		return this.___supressOtherDialogs;
	};

	ApplicationModel.prototype.setSupressOtherDialogs = function(value) {
		this.___supressOtherDialogs = value;
		this.dispatch(this.SUPRESS_UPDATED);
	};


	ApplicationModel.prototype.__getUILockLevel = function() {
		var len = this.__uiLockLevels.length;
		var ret = 0;
		for (var i = 0; i < len; i++) {
			if (this.__uiLockLevels[i] > 0) {
				ret = i;
			}
		}
		return ret;
	};

	ApplicationModel.prototype.__getUILocks = function() {
		var len = this.__uiLockLevels.length;
		var ret = 0;
		for (var i = 0; i < len; i++) {
			ret += this.__uiLockLevels[i];
		}
		return ret;
	};
	ApplicationModel.prototype.setUILock = function(lock, level) {
		//console.error('LOCK_STATE_CHANGE', lock, level, this.__getUILocks());
		if (level === Bifrost.UILockLevels.NONE) {
			return;
		}

		var doTrigger = false;

		var oldLevel = this.__getUILockLevel();


		if (lock) {

			this.__uiLockLevels[level]++;

			//this.__uiLock++;
			if (this.__getUILocks() === Bifrost.UILockLevels.POPUP) {
				doTrigger = true;
				this.showUILock(); // MAKE LOCK VISIBLE ALL THE TIME
			}
		} else {
			//this.__uiLock--;
			this.__uiLockLevels[level]--;

			if (this.__getUILocks() === 0) {
				//this.__uiLockLevel = 0;
				doTrigger = true;
				this.__uiLockVisible = false;
			}
		}

		//Bifrost.out.error("LOCK : "+ lock + ", input level: " + level + " this.__uiLock: "+this.__getUILocks()+ " level: "+ this.__getUILockLevel());

		if (oldLevel === Bifrost.UILockLevels.APPLICATION && this.__getUILockLevel() > Bifrost.UILockLevels.APPLICATION || oldLevel > Bifrost.UILockLevels.APPLICATION && this.__getUILockLevel() === Bifrost.UILockLevels.APPLICATION) {
			doTrigger = true; //needed for when going from or to application lock as that triggers the spinner on/off
		}


		//if (doTrigger) {
		//Bifrost.out.error(this.LOCK_UPDATED);
		this.dispatch(this.LOCK_UPDATED);
		//}

		if (!lock && this.__uiIsFirstLock && this.__uiLockLevels[Bifrost.UILockLevels.APPLICATION] === 0) {
			//if(!lock && this.__uiIsFirstLock && !this.getUILock()) {
			this.__uiIsFirstLock = false;
			this.dispatch(this.APP_STARTED);
		}

		Bifrost.isUILocked = this.getUILock();


		Bifrost.out.info("LOCKS : ", "popup: " + this.__uiLockLevels[Bifrost.UILockLevels.POPUP], "tooltip: " + this.__uiLockLevels[Bifrost.UILockLevels.TOOLTIP], "alert: " + this.__uiLockLevels[Bifrost.UILockLevels.ALERT], "APP: " + this.__uiLockLevels[Bifrost.UILockLevels.APPLICATION]);


	};

	Bifrost.ApplicationModel = new ApplicationModel();

	return Bifrost;
});