package 
{
	import flash.events.Event;
	import ComplexMessage;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class ComplexMessageEvent extends flash.events.Event
	{
		
	
		public static const CONTROL_TYPE:String = "ComplexMessageEvent";
		public var message:ComplexMessage;
		public var ip:String;

		public function ComplexMessageEvent( message:ComplexMessage,ip:String, bubbles:Boolean = true, cancelable:Boolean = false ) {
			// bubbles=true, cancelable=false
			super( CONTROL_TYPE, bubbles, cancelable);
			this.message = message;			
			this.ip = ip;
		}
		
		 override public function clone():Event {
            return new ComplexMessageEvent(message,ip,  bubbles, cancelable);
        }		
	}
	
}