package shared.vo
{
	import flash.geom.Point;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class BasePhysics 
	{
		private var _pos:Point;
		private var _vel:Point;
		private var _acc:Point;
		private var _friction:Number;
		private var _maxVel:int;
		
		public function BasePhysics() {
			_friction = 25;
			_maxVel = 150;
			pos = new Point();
			vel = new Point();
			acc = new Point();
		}
		
		public function get pos():Point { return _pos; }
		
		public function set pos(value:Point):void 
		{
			_pos = value;
		}
		
		public function get vel():Point { return _vel; }
		
		public function set vel(value:Point):void 
		{
			_vel = value;
		}
		
		public function get acc():Point { return _acc; }
		
		public function set acc(value:Point):void 
		{
			_acc = value;
		}
		
		public function get friction():Number { return _friction; }
		
		public function set friction(value:Number):void 
		{
			_friction = value;
		}
		
		public function get maxVel():int { return _maxVel; }
		
		public function set maxVel(value:int):void 
		{
			_maxVel = value;
		}
	}
	
}