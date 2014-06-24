package 
{
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class ComplexMessage 
	{
		private var _ships:Array;
		private var _asteroids:Array;
		private var _bullets:Array;
		private var _explosions:Array;
		
		public function ComplexMessage() {
			_ships = new Array();
			_asteroids = new Array();
			_bullets = new Array();
			_explosions = new Array();
		}
		
		public function get bullets():Array { return _bullets; }
		
		public function set bullets(value:Array):void 
		{
			_bullets = value;
		}
		
		public function get asteroids():Array { return _asteroids; }
		
		public function set asteroids(value:Array):void 
		{
			_asteroids = value;
		}
		
		public function get ships():Array { return _ships; }
		
		public function set ships(value:Array):void 
		{
			_ships = value;
		}
		
		public function get explosions():Array { return _explosions; }
		
		public function set explosions(value:Array):void 
		{
			_explosions = value;
		}
	}
	
}