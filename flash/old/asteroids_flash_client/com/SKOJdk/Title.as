package SKOJdk
{
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.text.TextFieldAutoSize;	

	/**
	 * ...
	 * @author oscjoh ( @SKOJdk )
	 */
	
	public class Title extends Sprite
	{
		private var tf:TextField;
		private var format:TextFormat;
		private var msg:String;
		private var size:uint;
		private var color:uint;
		private var leftAligned:Boolean;
						
		public function Title(msg:String = "lorem", size:uint = 8, color:uint = 0x000000, leftAligned:Boolean = true):void {
			this.msg = msg;
			this.size = size;
			this.color = color;
			this.leftAligned = leftAligned;		
			init();
		}
		
		private function init():void {
			tf = new TextField();
			tf.selectable = false;
			if (leftAligned) {
				tf.autoSize = TextFieldAutoSize.RIGHT;
			}else{
				tf.autoSize = TextFieldAutoSize.LEFT;
			}
			createFormat();
			tf.defaultTextFormat = format;
			tf.text = msg;
			addChild(tf);		
			draw();
		}		
		
		private function draw():void
		{
			if (!leftAligned) {
				tf.x = -tf.width;
			}else {
				tf.x = 0;
			}			
		}
		
		private function createFormat():void
		{
			format = new TextFormat();
			format.bold = true;
			format.color = color;
			format.size = size;			
		}
		
		public function setText(msg:String):void
		{			
			this.msg = msg;
			tf.text = msg;
			draw();
		}
		
		public function getText():String
		{
			return msg;
		}
		
		public function setTextFormat(format:TextFormat,beginIndex:int = -1,endIndex:int = -1):void
		{			
			this.format = format;
			tf.setTextFormat(format, beginIndex, endIndex);
			if (beginIndex == -1 && endIndex == -1) {
				tf.defaultTextFormat = format;
			}			
			draw();
		}
		
		public function getTextFormat():TextFormat
		{
			return format;
		}
	}	
}