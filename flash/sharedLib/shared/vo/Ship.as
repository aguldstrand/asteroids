package shared.vo
{
	import flash.geom.Point;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class Ship extends BasePhysics
	{
		private var _name:String;
		private var _color:uint;	
		private var _rot:int;		
		private var _bullets:Array;
		private var _score:uint;		
		private var _spawnTimer:int;
		public function Ship() {
			super();
			reset();
		}
		
		public function reset():void
		{
			_name = "AVAILABLE";
			_color = 0xFF0000;
			_rot = 0;
			_bullets = new Array();
			_score = 0;
			_spawnTimer = -1;
	
		}
		
		public function get name():String { return _name; }
		
		public function set name(value:String):void 
		{
			_name = value;
		}
		

		
		public function get rot():int { return _rot; }
		
		public function set rot(value:int):void 
		{
			_rot = value;
		}
		

		
		public function get color():uint { return _color; }
		
		public function set color(value:uint):void 
		{
			_color = value;
		}
		

		
		public function get bullets():Array { return _bullets; }
		
		public function set bullets(value:Array):void 
		{
			_bullets = value;
		}
		
		public function get score():uint { return _score; }
		
		public function set score(value:uint):void 
		{
			_score = value;
		}
		

		
		public function get spawnTimer():int { return _spawnTimer; }
		
		public function set spawnTimer(value:int):void 
		{
			_spawnTimer = value;
		}
		

	}
	
}