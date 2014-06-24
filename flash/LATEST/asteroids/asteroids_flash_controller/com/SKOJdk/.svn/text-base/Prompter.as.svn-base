package com.SKOJdk{
	
	import flash.display.MovieClip;
	import flash.text.TextField;
    import flash.text.TextFieldAutoSize;
	import caurina.transitions.*; 
	import flash.text.TextFieldAutoSize;
	import flash.display.Sprite;  
    import flash.text.TextFieldType;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
	
	
	public class Prompter extends MovieClip	 
	{
		// this class is a trace window which traces variables with the 'track' keyword. 
		// This enables trace functionality outside the flash debugplayer
		
		
		private var mCb:Object;
		
		private var show:Boolean;
		private var _tf:TextField;
		private var holder:MovieClip;
		private static var created:Boolean = false;
		private var heightInt:int;
		private var bgSquare:Sprite;
		
		private var __alpha:Number;
		
		private static var INITIALIZATION_ALLOWED:Boolean = true;		
		private static var INSTANCE:Prompter;
		
		public function Prompter():void
		{
			super();
			if (!Prompter.INITIALIZATION_ALLOWED) 
			{
				throw new Error("error :: init failed: use Prompter.getInstance() instead of new");
			}else {				
				
			}				
		}
		
		public static function getInstance():Prompter		{
			if(!Prompter.INSTANCE)
			{
				Prompter.INSTANCE = new Prompter();
				Prompter.INITIALIZATION_ALLOWED = false;
			}
			return Prompter.INSTANCE;
		}
		
		
		
		
		
		
		public function setup(ground:Object,  run:int = 1,colorStr:String = "0xFFFFFF", _heightInt:int = 380 ,_alpha:Number = .5):void		
		{
			
			mCb = ground;			
			trace(" @ < Prompter() *GUI @@@!> ");
			
			var str:String = "";
			show = true;
			
			__alpha = _alpha;
			
			// creates the textfield which is the backbone in the Prompter.
			if (!created)
			{
				keyDown();			

				holder = new MovieClip();					
				ground.addChild(holder);
				bg();					
				
				_tf = new TextField();
				
				_tf.x = 10;
				_tf.y = 0;
				
				_tf.selectable = false;

				_tf.width = 450;
				_tf.height = 200;				
				
				_tf.antiAliasType = "advanced";
				//_tf.textColor = 0x00FF00; 
				_tf.textColor = uint(colorStr); 
				_tf.multiline = true;
				_tf.autoSize = "left";
				 _tf.htmlText = "";
				
				 heightInt = _heightInt;
				 //_tf.embedFonts = true;
				holder.addChild(_tf);
				_tf.alpha = __alpha;
				prompt(" -- *GUI enabled $$ version 2.^69");
				prompt(" ------------------------------------------");					
					
				reAlign();

				if (run > 0 )
				{
					show = true;
				}
				else        
				{
					// if disabled the params that is sent to prompter will be traced instead.
					trace(" -- *GUI disabled (running silent in trace)");
					trace(" ----------------------------------------------------");					
					holder.visible = false;
				}
			}
			else
			{
				// failsafe check if multiple prompter classes are initiated
				prompt(" ERROR!!! prompter allready created (prompter)");
				trace(" ERROR!!! prompter allready created (trace)");
			}
			created = true;			
		}
		
		// realigning the trace window on stage resize
		public function reAlign():void
		{			
			holder.x = mCb.stage.stageWidth - (holder.width+35);			
		}
		
		//spits out new data in the trace window
		public function prompt(str:String):void
		{		
			
			if (show)
			{
				_tf.htmlText =  _tf.htmlText + str;				
				//_tf.appendText("<br>"+str);	
				if (holder.y + _tf.height > heightInt)
				{
					var _distance:int = (_tf.height + _tf.y) -heightInt;
					Tweener.addTween(_tf, { y:_tf.y - _distance , time:.5, transition:"easeInOutQuint",onComplete:adjust} ) ;	
					 function adjust():void
					{
						bgSquare.height = _tf.height +_tf.y;
					}
					
				}
				bgSquare.width = _tf.width+20;
				bgSquare.height = _tf.height +_tf.y;
			}
			else
			{
				trace(str);
			}
			
			reAlign();
		}
		
		// creates the greyish background on the tracewindow
		private function bg():void
		{				 
			var square:Sprite = new Sprite();
			holder.addChild(square);
			square.graphics.beginFill(0x000000);
			square.graphics.drawRect(0,0,100,100);
			square.graphics.endFill();
			square.alpha = __alpha;
			bgSquare = square;			
		}
		
		//Hide / Unhide based on keyDown events with  PAGEUP and PAGEDOWN
		private function keyDown():void
		{			
			//var scope = this;				
			mCb.stage.addEventListener(KeyboardEvent.KEY_DOWN, keyDownHandler);					

			function keyDownHandler(event:KeyboardEvent):void {					 
				 if (event.keyCode == Keyboard.PAGE_DOWN)
				 {					 
					 holder.visible = true;
					 show = true;
				 }
				 if (event.keyCode == Keyboard.PAGE_UP)
				 {
					 holder.visible = false;
					 show = false;
				 }
			}		
		}
		// hides instantly 
		// useful when you want to hide it at runtime or on loaded XML for example
		public function hideNow():void
		{
			holder.visible = false;
			show = false;
		}
		
		// show instantly 
		// useful when you want to show it at runtime or on loaded XML for example
		public function showNow():void
		{
			holder.visible = true;
			show = true;
		}
		
		
		//when forcedown is called the tracewindow will rolldown even if it is set to OFF
		//useful when runtime errors occurs.
		public function forceDown():void
		{			
			holder.visible = true;
			show = true;
			
			Tweener.addTween(holder, { alpha:0 , time:40, transition:"linear",onComplete:fix} ) ;	
			 function fix():void
			{
				holder.visible = false;
				show = false;			
				holder.alpha = 1;
			}
			
		}
	}
}