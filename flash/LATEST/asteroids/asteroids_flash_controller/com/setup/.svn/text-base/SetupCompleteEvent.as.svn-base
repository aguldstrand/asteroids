package com.setup
{
	import flash.events.Event;
	import com.setup.SetupCompleteMessage
	/**
	 * ...
	 * @author oscjoh
	 */
	public class SetupCompleteEvent extends flash.events.Event
	{
		
	
		public static const CONTROL_TYPE:String = "SetupCompleteEvent";
		public var message:SetupCompleteMessage;
		

		public function SetupCompleteEvent( message:SetupCompleteMessage,bubbles:Boolean = true, cancelable:Boolean = false ) {
			// bubbles=true, cancelable=false
			super( CONTROL_TYPE, bubbles, cancelable);
			this.message = message;			
			
		}
		
		 override public function clone():Event {
            return new SetupCompleteEvent(message, bubbles, cancelable);
        }		
	}
	
}