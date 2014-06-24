package com.SKOJdk
{
	import flash.display.MovieClip;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
	import flash.events.Event;
	import flash.system.System;
	import flash.display.Sprite;
	import flash.display.Shape;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.utils.getTimer;
	
	///
	import com.SKOJdk.Chart;
	/**
	 *
	 * @author oscjoh
	 *  
	 */
	
	
	public class MemoryChart extends Sprite
	{
		private var fpsChart:Chart;
		private var fpsChartMini:Chart;
		private var memChart:Chart;
		private var memChartMini:Chart;
		
		private var last:uint = getTimer();
        private var ticks:uint = 0;
		
		private var stageReference:Object;	 
		private var frameMC:MovieClip;
		
		private var textFps:TextField;
		private var textFpsMin:TextField;
		private var textBig:TextField;
		private var bigFormat:TextFormat = new TextFormat();
		private var textSmall:TextField;
		private var textFpsAvg:TextField;
		private var smallFormat:TextFormat = new TextFormat();

		
		private var currentFPS:Number;
		
		
		private var padding:int = 20;
		private var updateInterval = 1;
		private var updateIntervalMini = 5;
		private var graphW:int = 150;
		private var graphH:int = 50;
		
		
		private var maxMem:Number = 0;
		private var minFps:Number = 200;
		
		//private var averageHolder:int = 0;
		//private var averageCounter:int = 0;
		//private var averageValue:Number = 0;
		
		private var memContainer:MovieClip;
		private var fpsContainer:MovieClip;
		private var container:MovieClip;
		
		private var frameCounter:int = 0;
		private var frameCounterMini:int = 0;
		
		private var showMem:Boolean = true;
		private var showFps:Boolean = true;
		private var showCharts:Boolean = true;
		private var collectDataAllTheTime:Boolean = true;
		
		private var staticFrameRate:int = 0;
		private var loopRunning:Boolean = false;
		
		public function MemoryChart(_stageRef:Object)
		{
			trace(" <-- MEMORYCHART ");
			
			stageReference = _stageRef;
			memContainer = new MovieClip();
			fpsContainer = new MovieClip();
			container = new MovieClip();
			
			staticFrameRate = stageReference.stage.frameRate;
			
			
			
			
		}
		
		public function create(_visible:Boolean = true,_collectDataAllTheTime:Boolean = true,_updateInterval:int = 1, _xpos:int = 0, _chartW:int = 150, _chartH:int = 50, _showMem:Boolean = true,_showFps:Boolean = true, _showCharts:Boolean = true ):void
		{
			keyDown();
			container.visible = _visible;
			collectDataAllTheTime = _collectDataAllTheTime;
			updateInterval = _updateInterval;
			container.x = _xpos;
			graphH = _chartH;
			graphW = _chartW;
			showMem = _showMem;
			showCharts = _showCharts;
			showFps = _showFps;
			
			if(showMem){
				setupMem();
			}
			if(_showFps){
				setupFPS();
			}
			createTextFields();
			container.addChild(memContainer);
			container.addChild(fpsContainer);
			if(collectDataAllTheTime){
				this.addEventListener(Event.ENTER_FRAME, update);
				loopRunning = true;
			}
			stageReference.addChild(container);
		}
		
		
		private function keyDown():void
		{
			    			
				stageReference.stage.addEventListener(KeyboardEvent.KEY_DOWN, keyDownHandler);
				stageReference.stage.addEventListener(KeyboardEvent.KEY_UP, keyUpHandler);
			

			 function keyDownHandler(event:KeyboardEvent):void {				 
				
				 
				 if (event.keyCode == Keyboard.HOME)
				 {	
					 if (!collectDataAllTheTime) {
						 this.removeEventListener(Event.ENTER_FRAME, update);
					 }
					 container.visible = false;					 
				 }
			}

			function keyUpHandler(event:KeyboardEvent):void {
				if (event.keyCode == Keyboard.END)
				 {
					 if (!collectDataAllTheTime) {
						 this.addEventListener(Event.ENTER_FRAME, update);
					 }
					 container.visible = true;					 
				 }
			}
		}
		
		
		private function createTextFields():void
		{
			textBig = new TextField();
			textSmall = new TextField();
			textFpsAvg = new TextField();			
			textFps = new TextField();
			textFpsMin = new TextField();
			
			textFps.x = padding+graphW+10;		
			textFps.y = padding;
			
			textFpsAvg.x = textFps.x;
			textFpsAvg.y = padding+22;
			
			textFpsMin.x = textFps.x;		
			textFpsMin.y = padding + 36;
			

							
			bigFormat.color = 0xFFFFFF;
			bigFormat.size = 20;		
			
			smallFormat.size = 13;
			smallFormat.color = 0xFFFFFF;
			
				
			textBig.antiAliasType = "normal";			
			textBig.autoSize = "left";			
			
			 textBig.x = padding+graphW+10;		
			 textBig.y = padding;		
			 textSmall.x = padding+graphW+10;
			 textSmall.y = padding + 20;
			 
			 memContainer.addChild(textBig);
			 memContainer.addChild(textSmall);
			 
			 fpsContainer.addChild(textFps);
			 fpsContainer.addChild(textFpsMin);
			 fpsContainer.addChild(textFpsAvg);
			 
			textBig.selectable = false;		
			textSmall.selectable = false;
			textFpsAvg.selectable = false;
			textFps.selectable = false;
			textFpsMin.selectable = false;
			
			textBig.defaultTextFormat = bigFormat;
			textSmall.defaultTextFormat = smallFormat;
			textFps.defaultTextFormat = bigFormat;
			textFpsMin.defaultTextFormat = smallFormat;
			textFpsAvg.defaultTextFormat = smallFormat;
			
		}
		private function setupFPS():void
		{
			
			var baseRect:Shape = new Shape();
			baseRect.graphics.beginFill(0x000000);
			baseRect.graphics.drawRoundRect(padding-5,padding-4,graphW+120,graphH+10,3,3);
			baseRect.graphics.endFill();
			baseRect.alpha = .6;
			
			
			var newRectFrame:Shape = new Shape();
			newRectFrame.graphics.beginFill(0x000000);
			newRectFrame.graphics.drawRect(padding-1,padding-1,graphW+2,graphH+2);
			newRectFrame.graphics.endFill();
			newRectFrame.alpha = .6;
			
			var newRect:Shape = new Shape();
			newRect.graphics.beginFill(0xF666666);
			newRect.graphics.drawRect(padding,padding,graphW,graphH);
			newRect.graphics.endFill();
			newRect.alpha = .6;
			

			
			fpsContainer.addChild(baseRect);	
			fpsContainer.addChild(newRectFrame);
			fpsContainer.addChild(newRect);
			
			var chartContainer:MovieClip = new MovieClip();
			
			fpsContainer.addChild(chartContainer);	
			
			chartContainer.x = padding;
			chartContainer.y = padding + graphH;
			chartContainer.scaleY = -1; //caused of the flipped values ( ?) 
			chartContainer.alpha = .3;
			fpsChart = new Chart(chartContainer, staticFrameRate, graphH, graphW);
			fpsChartMini = new Chart(chartContainer, staticFrameRate, graphH*.5, graphW);
			
			

			
			
			fpsContainer.x = memContainer.width + 20 ;
		}
		
		
		
		
		
		private function setupMem():void
		{
			//var square:MovieClip = new MovieClip();
			
			
			var baseRect:Shape = new Shape();
			baseRect.graphics.beginFill(0x000000);
			baseRect.graphics.drawRoundRect(padding-5,padding-4,graphW+120,graphH+10,3,3);
			baseRect.graphics.endFill();
			baseRect.alpha = .6;
			
			
			var newRectFrame:Shape = new Shape();
			newRectFrame.graphics.beginFill(0x000000);
			newRectFrame.graphics.drawRect(padding-1,padding-1,graphW+2,graphH+2);
			newRectFrame.graphics.endFill();
			newRectFrame.alpha = .6;
			
			var newRect:Shape = new Shape();
			newRect.graphics.beginFill(0xF666666);
			newRect.graphics.drawRect(padding,padding,graphW,graphH);
			newRect.graphics.endFill();
			newRect.alpha = .6;
			

	
			
			
			memContainer.addChild(baseRect);
			memContainer.addChild(newRectFrame);
			memContainer.addChild(newRect);
			
			
			
			var chartContainer:MovieClip = new MovieClip();
			
			memContainer.addChild(chartContainer);	
			
			chartContainer.x = padding;
			chartContainer.y = padding+ graphH;
			chartContainer.scaleY = -1; //caused of the flipped values ( ?) 
			chartContainer.alpha = .3;
			memChart = new Chart(chartContainer, staticFrameRate, graphH, graphW);
			memChartMini = new Chart(chartContainer, staticFrameRate, graphH*.5, graphW);
			

			
			
		}
		
		
		
		private function updateFpsTexts(_fps:Number):void
		{
			//trace(_fps);
			
			textFps.text = "FPS : " + _fps;
			
			
			if (_fps < minFps)
			{
				minFps = _fps;
				textFpsMin.text = "MIN : " + minFps + "  (" + staticFrameRate +")";
				
			}
			textFpsAvg.text = String("AVG : " + fpsChartMini.getAverage());
			
		}
		
		private function updateMemTexts():void
		{
			//textBig.text = String(System.totalMemory);
			var memRaw:Number = System.totalMemory / 1024 / 1024;
			var mem:Number = Number((memRaw).toFixed( 2 ));	
			
			textBig.text = "MB : " + mem ;
			
			//textBig.text = String(( System.totalMemory / 1024 / 1024 ).toFixed( 2 )) + " MB ";
			if (mem > maxMem)
			{
				maxMem = mem;
				textSmall.text = String("MAX : " + maxMem);
				
			}

		}
		
		private function updateFps():void
		{
			ticks++;
            var now:uint = getTimer();
            var delta:uint = now - last;
            if (delta >= 200) {
                //trace(ticks / delta * 1000+" ticks:"+ticks+" delta:"+delta);
                var fps:Number = ticks / delta * 1000;
                //tf.text = fps.toFixed(1) + " fps";
				
				currentFPS = Number(fps.toFixed(1) );
				updateFpsTexts(Number(fps.toFixed(1) ));
                ticks = 0;
                last = now;
            }
		}
		
		private function update(e:Event):void
		{		
			//averageHolder += currentFPS;
			//if (averageCounter > (staticFrameRate*50))
			//{
				//averageValue = averageHolder / averageCounter;
				//trace(" averageValue  " + averageValue );
				//averageHolder = 0;
				//averageCounter = 0;
			//}
			//averageCounter++;
			

			if(showMem){
				updateMemTexts();
			}
			if(showFps){
				updateFps();
			}
			if (frameCounter > updateInterval && showCharts)
			{
				if (showMem) {
					var mem:Number = Number(( System.totalMemory / 1024 / 1024 ).toFixed( 2 )) * 15;
					
					memChart.update(mem);
					
					if (frameCounterMini > updateIntervalMini)
					{
						memChartMini.update(mem);
						
					}
					
				}
				if (showFps)
				{
					
					fpsChart.update(currentFPS);
					
					if (frameCounterMini > updateIntervalMini)
					{
						fpsChartMini.update(currentFPS);
						
					}
				}
				if (frameCounterMini > updateIntervalMini)
				{
					frameCounterMini = 0;
				}
				
				frameCounter = 0;
				frameCounterMini++;
			}
			frameCounter++;
			
		}
	}
	
}