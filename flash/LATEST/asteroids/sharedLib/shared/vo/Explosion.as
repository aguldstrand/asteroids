package shared.vo
{
	import flash.geom.Point;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class Explosion 
	{
		private var _pos:Point;	
		private var _size:int;
		
		public function Explosion() {
			reset();
		}
		
		private function reset():void		{
			pos = new Point(0, 0);			
			size = 20;
		}
						
		public function get pos():Point { return _pos; }
		
		public function set pos(value:Point):void 
		{
			_pos = value;
		}		
		
		public function get size():int { return _size; }
		
		public function set size(value:int):void 
		{
			_size = value;
		}
	}	
}