package com.game
{
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import shared.vo.Ship;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class Board extends Sprite 
	{
		private var nameTF:TextField;
		private var scoreTF:TextField;
		
		private var color:uint;
		
		public function Board() {
			
			color = 0xFFFFFF;
			init();
		}
		
		private function init():void
		{
			
			
			nameTF = new TextField();
			scoreTF = new TextField();
			nameTF.autoSize = TextFieldAutoSize.LEFT;
			scoreTF.autoSize = TextFieldAutoSize.LEFT;
			setFormats();
			
			addChild(nameTF);
			addChild(scoreTF);
			scoreTF.y = 25;
			scoreTF.x = 10;
			nameTF.x = 10;
			nameTF.y = 5;
			
		}
		
		private function setFormats():void {
			nameTF.defaultTextFormat = new TextFormat(null, 20, color, true);
			scoreTF.defaultTextFormat = new TextFormat(null, 15, color, true);			
		}
		
		public function update(ship:Ship) {
			
			if (color != ship.color) {
				color = ship.color;
				setFormats();
			}
			

			
			nameTF.text = ship.name;
			scoreTF.text = String(ship.score) + " pts";
			
			var wid:int = Math.max(nameTF.width, scoreTF.width)+30;
			
			this.graphics.clear();
			this.graphics.lineStyle(2, color);
			this.graphics.drawRoundRect(0, 5, wid, 40, 5, 5);
			
			
		}
	}
	
}