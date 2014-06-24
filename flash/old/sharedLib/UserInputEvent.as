package 
{
	import flash.events.Event;
	import shared.vo.UserInput;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class UserInputEvent extends flash.events.Event
	{
		
	
		public static const CONTROL_TYPE:String = "UserInputEvent";
		public var message:UserInput;
		public var ip:String;

		public function UserInputEvent( message:UserInput,ip:String,bubbles:Boolean = true, cancelable:Boolean = false ) {
			// bubbles=true, cancelable=false
			super( CONTROL_TYPE, bubbles, cancelable);
			this.message = message;			
			this.ip = ip;
		}
		
		 override public function clone():Event {
            return new UserInputEvent(message, ip, bubbles, cancelable);
        }		
	}
	
}
