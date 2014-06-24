package com.game
{
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class GameDistortion extends Sprite
	{
		private var SH:int;
		private var SW:int;
		private var resDivider:int;
		
		private var vertices:Vector.<Number>;
		private var indices:Vector.<int>;
		private var uvtData:Vector.<Number>;
		
		
		private var bmdW:uint;
		private var bmdH:uint;
		private var imgX:uint;
		private var imgY:uint;
		private var res:uint;
		private var hStep:Number;
		private var vStep:Number;
		
		private var container:Sprite;
		
		public function GameDistortion() {
			
		}
		
		public function setup(SW:int, SH:int, resDivider:int) {
			this.SW = SW;
			this.SH = SH;
			this.resDivider = resDivider;
			
			
			container = new Sprite();
			addChild(container);
			 
			 
			 bmdW = SW/resDivider;
			 bmdH = SH/resDivider;
			 imgX = 0;
			 imgY = 0;			 
			 res = 18;
			 
			hStep=bmdW/res;			
			vStep = bmdH / res;
			createDefaultVectors();
			trace("VLEN : " + vertices.length);
		}
		
		private function createDefaultVectors():void {
			
			vertices= new Vector.<Number>();
			indices = new Vector.<int>();
			uvtData = new Vector.<Number>();
			
			var x:uint;			
			var y:uint;
			
			for(x=0;x<res;x++){							 			
				for (y = 0; y < res; y++) {					
	
					vertices.push(x * hStep, y * vStep);
					uvtData.push(x / res, y / res);					
					
					var topLeft:int = x + y * res;
					var topRight:int = x + y * res + 1;
					var bottomLeft:int = x + y * res + res;
					var bottomRight:int = x + y * res + res + 1;
					
					if( y < res-1 && x < res -1){
						indices.push(bottomLeft,topLeft,topRight);
						indices.push(bottomLeft,bottomRight,topRight);
					}				
				}							
			}
			
		}
		
		public function distort(pos:int, value:int):void {
			vertices[pos] += value;
		}
		
		public function draw(from:BitmapData):void {
			
			
			/*
			var center:Number = vertices[vertices.length * .5] ;
			var vLen:uint = vertices.length;
			for (var v:uint = 0; v < vLen; v += 2) {
				
				var m:Number = (v / 2) % res;
				var mx:Number = Math.floor(v / 2 / res );
				
				if(m > 0 && m < res-1 && mx > 0 && mx < res-1){
				
				var _x:Number = vertices[v];
				var _y:Number = vertices[v + 1];
				
				
				
				var dx:Number = bmdW * .5 - _x;
				var dy:Number = bmdH * .5 - _y;
				
				var dist:Number = Math.sqrt(dx * dx + dy * dy);
				
				
				var xng:Number = dist / bmdW * Math.PI;
				var yng:Number = dist / bmdH * Math.PI;
				
				//trace(dy * dy);
				
				vertices[v] += Math.cos(xng)*-33;
				vertices[v + 1] += Math.cos(yng) * -33;
				}				
			}
			*/
			
			
			
			debugBMD(from);
			
			container.graphics.clear();
			container.graphics.beginBitmapFill(from);			
			container.graphics.drawTriangles(vertices,indices,uvtData);
			container.graphics.endFill();	
			
			createDefaultVectors();
		}
		
		private function debugBMD(bmd:BitmapData):void
		{
			//_bmd.floodFill(0, 0, 0x000000);			
			
			var h:uint = 0;
			var i:uint = 0;
			var step:int = SW / res;
			for ( h = 0; h < SH; h+=step){
				for (i = 0 ; i < SW; i++) {
					bmd.setPixel(i,h, 0x000CCC);
					
				}
			}	
			
			for ( h = 0; h < SW; h+=step){
				for (i = 0 ; i < SH; i++) {
					bmd.setPixel(h,i, 0x000CCC);
					
				}
			}				
			
		}
	}
	
}