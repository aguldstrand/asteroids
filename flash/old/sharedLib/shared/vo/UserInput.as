package shared.vo
{
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class UserInput 
	{
		private var _left:Boolean;
		private var _right:Boolean;
		private var _thrust:Boolean;
		private var _shoot:Boolean;		
		private var _name:String;
		private var _color:uint;	
		private var _ip:String;
		private var _shake:Boolean;
		
		public function UserInput(){}
		
		public function get left():Boolean { return _left; }
		
		public function set left(value:Boolean):void 
		{
			_left = value;
		}
		
		public function get right():Boolean { return _right; }
		
		public function set right(value:Boolean):void 
		{
			_right = value;
		}
		
		public function get thrust():Boolean { return _thrust; }
		
		public function set thrust(value:Boolean):void 
		{
			_thrust = value;
		}
		
		public function get shoot():Boolean { return _shoot; }
		
		public function set shoot(value:Boolean):void 
		{
			_shoot = value;
		}
		
		public function get name():String { return _name; }
		
		public function set name(value:String):void 
		{
			_name = value;
		}
		
		public function get color():uint { return _color; }
		
		public function set color(value:uint):void 
		{
			_color = value;
		}
		
		public function get ip():String { return _ip; }
		
		public function set ip(value:String):void 
		{
			_ip = value;
		}
		
		public function get shake():Boolean { return _shake; }
		
		public function set shake(value:Boolean):void 
		{
			_shake = value;
		}
	}
	
}