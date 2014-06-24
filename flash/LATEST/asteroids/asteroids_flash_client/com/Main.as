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
	
	import com.ui.window.Window;
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
		private var container:Sprite;
		private var gameContainer:Sprite;
		private var window:Window;
		
		//private var connectCounter:int;
		//private var connectMax:int;
		
		public function Main() {
			
			gameContainer = new Sprite();
			addChild(gameContainer);
			
			container = new Sprite();
			addChild(container);
			
			
			
			var form:Sprite = new Sprite();
			
			
			
			tf = new TextField();
			form.addChild(tf);
			tf.defaultTextFormat = new TextFormat(null, 48, 0xFF0000);
			tf.type = TextFieldType.INPUT;
			tf.text = "127.0.0.1";
			tf.width = 600;
			tf.x = 10;
			tf.y = 10;
			
			
			tf.border = true;
			var btn:Sprite = new Sprite();
			btn.graphics.beginFill(0xFF0000);
			btn.graphics.drawRect(0, 0, 50, 50);
			btn.y = 10;
			btn.x = tf.width + 40;
			form.addChild(btn);
			btn.buttonMode = true;
			btn.addEventListener(MouseEvent.MOUSE_UP, btnClickHandler);
			
						
			form.graphics.beginFill(0xFFFFFF);
			form.graphics.drawRoundRect(0, 0, form.width+20, form.height+20, 8, 8);
			
			window = new Window();		
			
			container.addChild(window);
			window.addContent(form);
			window.x = 600;
			window.y = 400;
			trace(window.width);
			window.open(); 
			
			//init();
		}
		
		private function btnClickHandler(e:MouseEvent):void 
		{
			window.close();
			connectToIP = tf.text;
			init();
		}
		
		private function init():void
		{
			//connectCounter = 0;
			//connectMax = 60;
			
			game = new Game();
			gameContainer.addChild(game);
			
			t = new Tracker();
			gameContainer.addChild(t);
			
			m = new MemTracker();
			gameContainer.addChild(m);
			
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