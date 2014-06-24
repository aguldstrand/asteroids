package shared.vo
{
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class EndPoint
	{
		private var _ip:String;
		private var _port:int;
		
		public function EndPoint() {
			
		}
		
		public function get port():int { return _port; }
		
		public function set port(value:int):void 
		{
			_port = value;
		}
		
		public function get ip():String { return _ip; }
		
		public function set ip(value:String):void 
		{
			_ip = value;
		}
	}
	
}