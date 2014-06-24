package 
{
	import flash.events.Event;
	import shared.vo.UserInput;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class UserConnectEvent extends flash.events.Event
	{
		
	
		public static const CONTROL_TYPE:String = "UserConnectEvent";
		public var message:String;
		public var name:String;
		public var ip:String;

		public function UserConnectEvent( message:String,name:String,ip:String,bubbles:Boolean = true, cancelable:Boolean = false ) {
			// bubbles=true, cancelable=false
			super( CONTROL_TYPE, bubbles, cancelable);
			this.message = message;
			this.name = name;
			this.ip = ip;
			
		}
		
		 override public function clone():Event {
            return new UserConnectEvent(message, name,ip, bubbles, cancelable);
        }		
	}
	
}
