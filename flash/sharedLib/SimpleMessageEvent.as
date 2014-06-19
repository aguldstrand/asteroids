package 
{
	import flash.events.Event;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class SimpleMessageEvent extends flash.events.Event
	{
		
	
		public static const CONTROL_TYPE:String = "SimpleMessageEvent";
		public var message:String;
		public var ip:String;

		public function SimpleMessageEvent( message:String,ip:String,bubbles:Boolean = true, cancelable:Boolean = false ) {
			// bubbles=true, cancelable=false
			super( CONTROL_TYPE, bubbles, cancelable);
			this.message = message;			
			this.ip = ip;
		}
		
		 override public function clone():Event {
            return new SimpleMessageEvent(message, ip, bubbles, cancelable);
        }		
	}
	
}

