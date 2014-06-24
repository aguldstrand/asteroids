package com
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.text.TextField;
	import com.setup.SetupScreen;
	import com.setup.SetupCompleteEvent;
	import com.setup.SetupCompleteMessage;
	import com.service.ControllerService;
	import com.input.KeyController;
	import com.SKOJdk.Tracker;
	import com.model.Model;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class Main extends Sprite
	{
		private var setupScreen:SetupScreen;		
		private var controllerService:ControllerService;
		private var keyController:KeyController;
		private var model:Model;
		private var t:Tracker;
		
		public function Main() {
			init();
		}
		
		private function init():void
		{
			t = new Tracker();
			t.setup(Tracker.MODE_SILENT);
			Model.getInstance();
			setupScreen = new SetupScreen();
			addChild(setupScreen);
			
			setupScreen.addEventListener(SetupCompleteEvent.CONTROL_TYPE, setupCompleteHandler);
			
			controllerService = new ControllerService();
			
			addChild(t);
			
			
			
			
			
		}
		
		private function loop(e:Event):void 
		{
			controllerService.send();
			Tracker.trackProperty(Model.getInstance().userInput.left ,0);
			Tracker.trackProperty(Model.getInstance().userInput.right ,1);
			Tracker.trackProperty(Model.getInstance().userInput.thrust ,2);
		}
		
		private function setupCompleteHandler(e:SetupCompleteEvent):void 
		{
		
			Model.getInstance().userInput.ip = e.message.ip;
			Model.getInstance().userInput.color = uint(e.message.color);
			Model.getInstance().userInput.name = e.message.name;
			removeChild(setupScreen);
			
			
			Tracker.track(Model.getInstance().userInput.ip );
			Tracker.track(Model.getInstance().userInput.color );
			Tracker.track(Model.getInstance().userInput.name );
			
			keyController = new KeyController(stage);
			addEventListener(Event.ENTER_FRAME, loop);
		}
	}
	
}