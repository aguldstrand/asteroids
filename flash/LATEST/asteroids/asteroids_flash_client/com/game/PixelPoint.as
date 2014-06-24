package com.game
{
	import flash.geom.Point;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class PixelPoint 
	{
		private var _p:Point;
		private var _color:uint;
		private var _fall:int;
		private var _drift:int; 
		private var _life:int;
		public function PixelPoint(){_p = new Point()}
		
		public function get p():Point { return _p; }
		
		public function set p(value:Point):void 
		{
			_p = value;
		}
		
		public function get color():uint { return _color; }
		
		public function set color(value:uint):void 
		{
			_color = value;
		}
		
		public function get fall():int { return _fall; }
		
		public function set fall(value:int):void 
		{
			_fall = value;
		}
		
		public function get drift():int { return _drift; }
		
		public function set drift(value:int):void 
		{
			_drift = value;
		}
		
		public function get life():int { return _life; }
		
		public function set life(value:int):void 
		{
			_life = value;
		}
		
	}
	
}