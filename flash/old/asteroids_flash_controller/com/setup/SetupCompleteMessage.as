package com.setup
{
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class SetupCompleteMessage
	{
		private var _ip:String;
		private var _name:String;
		private var _color:String;
		
		public function SetupCompleteMessage() {
			
		}
		
		public function get ip():String { return _ip; }
		
		public function set ip(value:String):void 
		{
			_ip = value;
		}
		
		public function get name():String { 
			return _name; }
		
		public function set name(value:String):void 
		{
			_name = value;
		}
		
		public function get color():String { return _color; }
		
		public function set color(value:String):void 
		{
			_color = value;
		}
	}
	
}