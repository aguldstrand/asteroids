function Grid(options) {


	this.grid = [];
	this.resolution = options.resolution || 10;
	this.SW = options.SW;
	this.SH = options.SH;

	this.types = options.types || [];


	this.SWR = this.SW / this.resolution;
	this.SHR = this.SH / this.resolution;

	this.ALL_TYPES = 'all';
	this.types.push(this.ALL_TYPES);

	this.___initialize();
}

Grid.prototype.___initialize = function() {

	var grid = this.grid;
	var resolution = this.resolution;

	var types = this.types;
	var tLen = types.length;

	for (var x = 0; x < resolution; x++) {
		var yArr = [];
		grid.push(yArr);

		for (var y = 0; y < resolution; y++) {

			var cell = {};

			for (var t = 0; t < tLen; t++) {
				cell[types[t]] = [];
			}

			yArr.push(cell);
		}
	}

};

Grid.prototype.reset = function() {
	var grid = this.grid;
	var resolution = this.resolution;

	var types = this.types;
	var tLen = types.length;

	for (var x = 0; x < resolution; x++) {

		for (var y = 0; y < resolution; y++) {
			var cell = grid[x][y];

			for (var t = 0; t < tLen; t++) {
				//cell[types[t]] = [];
				cell[types[t]].length = 0;
			}
		}
	}

};

Grid.prototype.add = function(type, items) {
	var maxResolution = this.resolution - 1;
	var len = items.length;

	var bounds = [
		1, 1, 1, -1, -1, -1, -1, 1,
	];

	for (var i = 0; i < len; i++) {
		var item = items[i];



		var x = Math.min(parseInt(item.pos.x / this.SWR, 10), maxResolution);
		var y = Math.min(parseInt(item.pos.y / this.SHR, 10), maxResolution);



		this.grid[x][y][type].push(item);
		this.grid[x][y][this.ALL_TYPES].push(item);



		//add neighbors
		for (var b = 0; b < 8; b += 2) {
			var _x = Math.min(parseInt((item.pos.x + item.diam * bounds[b]) / this.SWR, 10), maxResolution);
			var _y = Math.min(parseInt((item.pos.y + item.diam * bounds[b + 1]) / this.SWR, 10), maxResolution);

			//try {

			if (_x !== x && _y !== y) {


				this.grid[_x][_y][type].push(item);
				this.grid[_x][_y][this.ALL_TYPES].push(item);

			} else if (_x !== x) {

				this.grid[_x][y][type].push(item);
				this.grid[_x][y][this.ALL_TYPES].push(item);

			} else if (_y !== y) {

				this.grid[x][_y][type].push(item);
				this.grid[x][_y][this.ALL_TYPES].push(item);
			}

			//} catch (e) {
			//	console.log(_x, _y, item.pos.x, item.pos.y);
			//}

		}
	}
};

Grid.prototype.getType = function(type, item) {

	var x = parseInt(item.pos.x / this.SWR, 10);
	var y = parseInt(item.pos.y / this.SHR, 10);

	if (item.pos.x > 3000 || item.pos.x < 0 || item.pos.y < 0 || item.pos.y > 3000) {
		console.log(item);
		throw 'fuck';
	}


	return this.grid[x][y][type];
};

Grid.prototype.getTypes = function(types, item) {

	var x = parseInt(item.pos.x / this.SWR, 10);
	var y = parseInt(item.pos.y / this.SHR, 10);

	var ret = [];

	var len = types.length;
	for (var i = 0; i < len; i++) {
		ret.concat(this.grid[x][y][types[i]]);
	}


	return ret;
};

Grid.prototype.getAll = function(item) {

	var x = parseInt(item.pos.x / this.SWR, 10);
	var y = parseInt(item.pos.y / this.SHR, 10);

	return this.grid[x][y][this.ALL_TYPES];
};


module.exports = Grid;