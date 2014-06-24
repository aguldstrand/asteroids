package com.utils
{
	import flash.utils.*;	
	/**
	 * Performance measurements class.
	 * @author oscjoh
	 * 
	 */
	public class Counter 
	{				
		private var startTime:int;
		private var endTime:int;
		
		public function Counter()
		{
			trace(" @ Counter ");		
			startTime = getTimer();
			endTime = getTimer();
		}
		/**
		 * 
		 * @param	msg  optional message to display in trace on function call
		 * trace shows  time in milliseconds from last call and total time elapsed.
		 */	
		public function check(msg:String = "executed in"):String
		{			
			var last:int = endTime;
			endTime = getTimer();
			var msg:String = msg   + "  :  " + (endTime - last) + " (elapsed : " + (endTime - startTime) +")";
			trace(msg);
			return msg;
		}
		
		
		
		public function diff():uint
		{
			var last:int = endTime;
			endTime = getTimer();			
			return endTime - last;
		}
		
		public function getTime():Number
		{
			var last:int = endTime;
			endTime = getTimer();
			return (endTime-startTime);
		}
	}
	
}