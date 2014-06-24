package shared.vo
{
	import flash.geom.Point;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class Bullet extends BasePhysics
	{
		//private var _pos:Point;
		//private var _vel:Point;
		private var _direction:Number;

		
		public function Bullet() {
			super();
			reset();
		}
		
		private function reset():void
		{
			//pos = new Point(0, 0);			
			//vel = new Point(0, 0);
			_direction = 0;
		}
		
		

		
		//public function get pos():Point { return _pos; }
		//
		//public function set pos(value:Point):void 
		//{
			//_pos = value;
		//}
		//
		//public function get vel():Point { return _vel; }
		//
		//public function set vel(value:Point):void 
		//{
			//_vel = value;
		//}
		
		public function get direction():Number { return _direction; }
		
		public function set direction(value:Number):void 
		{
			_direction = value;
		}
		
	}
	
}