package com.SKOJdk
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.display.Shape;
	
	/**
	 * ...
	 * @author oscar johansson @ SKOJdk 
	 */
	public class Chart extends Sprite 
	{
		private var datalines:Sprite;		
		private var graphH:int = 0;
		private var graphW:int = 0;
		private var staticFrameRate:int = 0;
		private var stageRef:Object;		
		private var graphData:Vector.<int>;
		
		public function Chart(_stageRef:Object,_staticFrameRate:int, _graphH:int,_graphW:int):void
		{			
			stageRef = _stageRef;
			graphH = _graphH;
			graphW = _graphW;
			staticFrameRate = _staticFrameRate;			
			init();						
		}
		
		private function init():void
		{			
			graphData = new Vector.<int>();		
			
			
			for (var i:int = 0; i < graphW; i++)
			{				
				graphData.push(0);
			}			
			
			datalines = new Sprite();
			
			stageRef.addChild(datalines);
		}
		/*
		*  
		*	add a value for the next pixel in the graph.		
		* 
		*/
		public function update(_fps:int):void
		{
			datalines.graphics.clear();
			datalines.graphics.lineStyle(1);
			datalines.graphics.moveTo(0, 0);
			datalines.graphics.beginFill(0xFFFFFF,1);
			
			for (var i:int = 0; i < graphW; i++)
			{				
				var _value:int = (graphH / staticFrameRate) *  graphData[i];
				datalines.graphics.lineTo(i, _value );		
			}
			
			datalines.graphics.lineTo(graphW,  0 );
			datalines.graphics.lineTo(0,  0 );
			datalines.graphics.endFill();
					
			graphData.push(_fps);
			graphData.shift();					
							
			if (datalines.height > (graphH-5))
			{					
				datalines.height = graphH-5;
			}		
		}
		
		/*
		*  
		*	Get average Value of graph.
		* 	Returns a number with one decimal
		* 
		*/
		public function getAverage():Number
		{			
			var average:Number = 0;
			var count:int = 0;
			for (var i:int = 0; i < graphW; i++)
			{
				var graphValue:int = graphData[i];
				if(graphValue != 0){
					average += graphData[i];
					count++;
				}
			}		
			average = (int(average / count * 10)/10);
			return average;			
		}
	}
	
}