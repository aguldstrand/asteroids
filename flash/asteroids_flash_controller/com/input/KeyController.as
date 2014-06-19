package com.input
{
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import com.model.Model;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class KeyController 
	{
		private var stageCB:Stage;
		
		private static var LEFT:int = 37;
		private static var RIGHT:int = 39;
		private static var FORWARD:int = 38;
		private static var FIRE:int = 32;
		
		public function KeyController(stageCB:Stage) {
			
			this.stageCB = stageCB;
			init();
		}
		
		private function init():void
		{
			
			stageCB.addEventListener(KeyboardEvent.KEY_DOWN, keyDownHandler);
			stageCB.addEventListener(KeyboardEvent.KEY_UP, keyUpHandler);
		}
		
		private function keyDownHandler(e:KeyboardEvent):void 
		{
			//trace(e.keyCode);
			
			switch(e.keyCode) {
				case LEFT:
					Model.getInstance().userInput.left = true;
					
				break;
				case RIGHT:
					Model.getInstance().userInput.right = true;
				break;
				case FORWARD:
					Model.getInstance().userInput.thrust = true;
				break;
				case FIRE:
					Model.getInstance().userInput.shoot = true;
				break;
			}
		}
		
		private function keyUpHandler(e:KeyboardEvent):void 
		{
			switch(e.keyCode) {
				case LEFT:
					Model.getInstance().userInput.left = false;					
				break;
				case RIGHT:
					Model.getInstance().userInput.right = false;
				break;
				case FORWARD:
					Model.getInstance().userInput.thrust = false;
				break;
				case FIRE:
					Model.getInstance().userInput.shoot = false;
				break;
			}
		}
	}
	
}