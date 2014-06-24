package com.setup 
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import com.setup.SetupCompleteEvent;
	import com.setup.SetupCompleteMessage;
	import com.SKOJdk.Tracker;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class SetupScreen extends Sprite 
	{
		private var color_tf:TextField;
		private var name_tf:TextField;
		private var ip_tf:TextField;
		
		private static var default_color:String = "0xFFFF00";
		private static var default_name:String = "player";
		private static var default_ip:String = "127.0.0.1";
		public static var SETUP_COMPLETE:String = "com.setup.setup_complete";
		
		public function SetupScreen() {
			init();
		}
		
		private function init():void
		{
			initTFs();
			initBtn();
		}
		
		private function initBtn():void
		{
			var s:Sprite = new Sprite();
			s.graphics.beginFill(0xFF0000);
			s.graphics.drawRect(0, 0, 50, 50);
			s.graphics.endFill();
			s.x = 300;
			s.y = 50;
			s.buttonMode = true;
			addChild(s);
			
			s.addEventListener(MouseEvent.MOUSE_UP, btnClickHandler);
		}
		
		private function btnClickHandler(e:MouseEvent):void 
		{
			Tracker.track(" btnClickHandler ");
			
			var setupCompleteMessage:SetupCompleteMessage = new SetupCompleteMessage();
			setupCompleteMessage.ip = ip_tf.text;
			setupCompleteMessage.name = name_tf.text;
			setupCompleteMessage.color = color_tf.text;		
			
			dispatchEvent(new SetupCompleteEvent(setupCompleteMessage));
		}
		
		private function initTFs():void
		{
			color_tf = new TextField();
			name_tf = new TextField();
			ip_tf = new TextField();
			
			color_tf.border = true;
			name_tf.border = true;
			ip_tf.border = true;
			
			color_tf.height = 30;
			name_tf.height = 30;
			ip_tf.height = 30;
			
			color_tf.width = 250;
			name_tf.width = 250;
			ip_tf.width = 250;
			
			color_tf.type = TextFieldType.INPUT;
			name_tf.type = TextFieldType.INPUT;
			ip_tf.type = TextFieldType.INPUT;
			
			color_tf.x = 10;
			name_tf.x = 10;
			ip_tf.x = 10;
			
			color_tf.y = 10;
			name_tf.y = 60;
			ip_tf.y = 110;			
			
			color_tf.text = default_color;
			name_tf.text = default_name;
			ip_tf.text = default_ip;
			
			addChild(color_tf);
			addChild(name_tf);
			addChild(ip_tf);
		}
	}
	
}