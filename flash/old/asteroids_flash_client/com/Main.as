package com 
{
	
	import com.game.Game;
	import com.SKOJdk.Tracker;
	import com.SKOJdk.MemTracker;
	import flash.display.Sprite;	
	import flash.events.Event;
	import com.client.GameClient;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	/**
	 * ...   //// MONITOR
	 * @author oscjoh
	 */
	public class Main extends Sprite
	{
		private var connectToIP:String;
		private var currentData:String;
		private var game:Game;
		
		private var gameClient:GameClient;
		private var tf:TextField;
		private var t:Tracker;
		private var m:MemTracker;
		
		//private var connectCounter:int;
		//private var connectMax:int;
		
		public function Main() {
			
			tf = new TextField();
			addChild(tf);
			tf.type = TextFieldType.INPUT;
			tf.text = "127.0.0.1";
			tf.width = 600;
			tf.defaultTextFormat = new TextFormat(null, 28, 0xFF0000);
			tf.border = true;
			var btn:Sprite = new Sprite();
			btn.graphics.beginFill(0xFF0000);
			btn.graphics.drawRect(0, 0, 50, 50);
			
			btn.x = tf.width + 40;
			addChild(btn);
			btn.buttonMode = true;
			btn.addEventListener(MouseEvent.MOUSE_UP, btnClickHandler);
			
			//init();
		}
		
		private function btnClickHandler(e:MouseEvent):void 
		{
			connectToIP = tf.text;
			init();
		}
		
		private function init():void
		{
			//connectCounter = 0;
			//connectMax = 60;
			
			game = new Game();
			addChild(game);
			
			t = new Tracker();
			addChild(t);
			
			m = new MemTracker();
			addChild(m);
			
			gameClient = new GameClient(connectToIP);
			gameClient.addEventListener(GameClient.CONNECTION_STATE_CHANGED, stateHandler);
		
			
			addEventListener(Event.ENTER_FRAME, loop);
		}
		
		private function stateHandler(e:Event):void 
		{
			Tracker.track(" connection state changed ");
			if (t.visible) {
				t.visible = false;
				m.visible = false;
			}else {
				t.visible = true;
				m.visible = true;
			}
		}
		
		private function loop(e:Event):void 
		{
			game.draw();
			
			//connectCounter++;
			//if (connectCounter % connectMax == 0) {
				//connectCounter = 0;
				//gameClient.connect();
			//}
		}
		

		
	
		
	}
	
}