package com.game
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.utils.Dictionary;
	import flash.text.TextFieldAutoSize;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class TitleFactory 
	{
		private var titles:Dictionary;
		private var _textSize:int;
		public function TitleFactory() {
			titles = new Dictionary();
		}
		
		public function getTitle(_name:String, color:uint):Bitmap {
			if (titles[_name] != null) {
				return titles[_name];
			}else {
				
				titles[_name] = createTitle(_name, color);
				return titles[_name];
			}
		}
		
		private function createTitle(_name:String, color:uint):Bitmap
		{
			var title:Sprite = new Sprite();
			
			var tf:TextField = new TextField();
			tf.defaultTextFormat = new TextFormat(null, textSize,color,true);
			tf.text = _name;
		
			tf.autoSize = TextFieldAutoSize.LEFT;
			//tf.textColor = color;
			title.addChild(tf);
			
			var bmd:BitmapData = new BitmapData(title.width, title.height, true, 0x00000000);
			var bmp:Bitmap = new Bitmap(bmd);
			bmd.draw(title);
			return bmp;
		}
		
		public function removeTitle(name:String) {
			delete titles[name];
		}
		
		public function get textSize():int { return _textSize; }
		
		public function set textSize(value:int):void 
		{
			_textSize = value;
		}
	}
	
}