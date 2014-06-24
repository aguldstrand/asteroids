package com.ui.window
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.BlurFilter;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class Window extends Sprite
	{
		private var container:Sprite;		
		private var container_BMP:Bitmap;
		private var container_BMD:BitmapData;	
		private var animationSpeed:Number = .05;
		
		public function Window() {
			
			super();
			init();
		}
		
		private function init():void	{
			container = new Sprite();



			container_BMP = new Bitmap();			
			
			addChild(container);
			addChild(container_BMP);
			container.visible = false;
			container_BMP.visible = false;
		}
		
	
		
		private function drawToBmd():void {
			//container.visible = true;

			container.x = container.width * -.5;
			container.y = container.height * -.5;
			
			container_BMD = new BitmapData(container.width, container.height, true, 0x00000000);
			container_BMP.bitmapData = container_BMD;
			container_BMD.draw(container);		
			
			container_BMP.x = container_BMP.width * -.5;
			container_BMP.y = container_BMP.height * -.5;
			
			//container.visible = false;			
		}
		
		public function open() {			
			animate(.7, 1, animationSpeed);
		}
		
		private function animate(from:Number, to:Number, step:Number):void	{		
			
			drawToBmd();			
			
			container.visible = false;
			container_BMP.visible = true;
			addEventListener(Event.ENTER_FRAME, loop);
			
			var counter:int = 0;		
			
			var window:Object = this;
			
			window.scaleX = window.scaleY = from;
			
			var open:Boolean = from > to ? false : true;			

			function loop(e:Event) {
				window.scaleX = window.scaleY = from;
				window.alpha = from * from * from * from * from * from;
				container_BMP.filters = [new BlurFilter(10 - window.alpha * 10 , 10 - window.alpha * 10, 1)];
				
				
				if (open && from > to) {
					clear();
				}else if( !open && from < to){
					clear();
				}
				from += step;
			}
			
			function clear():void {
				removeEventListener(Event.ENTER_FRAME, loop);					
				if(open){
					container.visible = true;				
				}
				container_BMP.visible = false;

			}
		}
		
		public function close() {
			animate(1, .7, -animationSpeed);
		}
		
		public function addContent(value:DisplayObject) {
			container.addChild(value);			
		}
	}
}