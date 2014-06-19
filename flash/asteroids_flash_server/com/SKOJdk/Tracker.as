package com.SKOJdk 
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.text.TextField;
	import flash.text.TextFormat;
	/**
	 * ...
	 * @author oscjoh ( @SKOJdk )
	 */	
	 
	 /**
	 import SKOJdk.Tracker;
	 var t:Tracker = new Tracker();
			t.setup();  (optional)
			addChild(t); 			
			Tracker.track(" show this message ");
			Tracker.trackProperty(" shows this message on line 2" , 2); 
	  **/
	public  class Tracker extends Sprite 
	{
		private static var staticFields:Array;
		private static var dynamicFields:Array;		
		private static var staticTFs:Array;
		private static var dynamicTFs:Array;
	
		private static var container:Sprite;		
		private static var staticContainer:Sprite;
		private static var dynamicContainer:Sprite;		
		private static var SbackPlate:Sprite;
		private static var DbackPlate:Sprite;
		
		private static var backPlateAlpha:Number;
		
		private static var DYNAMIC:int = 0;
		private static var STATIC:int = 1;
		private static var maxDynamic:int = 10;
		private static var maxStatic:int = 15;
		private static var outMode:int;
		
		private static var isInitialized:Boolean = false;
	
		private static var dynamicTextColor:uint;
		private static var staticTextColor:uint;
		private static var backPlateColor:uint;
		
		private static var xMargin:int = 10;
		
		public static var MODE_TRACK:int = 0;		
		public static var MODE_TRACE_ALL:int = 1;
		public static var MODE_TRACE:int = 2;
		public static var MODE_SILENT:int = 3;		
		
		public  function Tracker(){	
			this.addEventListener(Event.ADDED_TO_STAGE, addedToStageHandler);			
		}
		
		/*
		 * public functions --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		 */ 		
		 
		 /**
		  *   setup ( optional , but must be run before addet to stage if it should be run )
		  * @param	_outMode  0 - 3,  public static vars exist
		  * @param	_maxDynamic , maxdynamic fields (default 10)
		  * @param	_maxStatic , maxstatic fields  (default 15)
		  * @param	_dynamicTextColor   ...
		  * @param	_staticTextColor	...	
		  * @param	_backPlateColor	...	
		  * @param	_backPlateAlpha	...
		  */
		public function setup(_outMode:int = 0,_maxDynamic:int = 10, _maxStatic:int = 15, _dynamicTextColor:uint =0xFFFFFF, _staticTextColor:uint = 0xFFFF00, _backPlateColor:uint = 0x000000,_backPlateAlpha:Number = .75):void{
			if (!isInitialized) {
				this.removeEventListener(Event.ADDED_TO_STAGE, addedToStageHandler);
				outMode = _outMode;
				container = new Sprite();				
				
				dynamicTextColor = _dynamicTextColor;
				staticTextColor = _staticTextColor;
				backPlateColor = _backPlateColor;
				backPlateAlpha = _backPlateAlpha;

				staticFields = new Array();
				dynamicFields = new Array();
				staticTFs = new Array();
				dynamicTFs = new Array();
				
				addChild(container);
				
				staticContainer = new Sprite();
				dynamicContainer = new Sprite();
				SbackPlate = new Sprite();			
				DbackPlate = new Sprite();
				
				container.addChild(SbackPlate);
				container.addChild(DbackPlate);
				
				container.addChild(staticContainer);
				container.addChild(dynamicContainer);
				
				drawBG(SbackPlate);
				drawBG(DbackPlate);
				
				maxDynamic = _maxDynamic;
				maxStatic = _maxStatic;
				
				isInitialized = true;
				
				validateOutMode();
				//track(" Tracker 1.1. ");				
			}else {				
				trace(" ERROR @ Tracker. ");
				trace (" SETUP must be run before added to stage");
			}
		}
		

		/**
		 * 
		 * @param	msg  (what will be printed )
		 */
		public static function track(msg:*):void{
			if (isInitialized) {			
				switch(outMode) {
					case MODE_TRACK:
						var s:String = String(msg);
						dynamicFields.push(s);
						if (dynamicFields.length > maxDynamic) {
							dynamicFields.shift();
						}						
						draw();	
					break;
					case MODE_SILENT:
						//do nothing
					break;
					
					case MODE_TRACE:
					case MODE_TRACE_ALL:
						trace("Tracker.track(): " + msg);
					break;				
				}						
			}else {
				trace(" ERROR: Tracker not initialized: " + msg);				
			}			
		}
		
		/**
		 * 
		 * @param	msg  (what will be printed ) 
		 * @param	id  (id is the line nbr beginning at the top )
		 */
		public static function trackProperty(msg:*, id:int = -1):void{
			if (isInitialized) {
				switch(outMode) {
					case MODE_TRACK:
						var s:String = String(msg);
						if(id <= maxStatic ){
							staticFields[id] = s;				
							if (id == -1) {
								track(" AN ID MUST BE SUPPLIED ");
							}else{
								draw(id);
							}
						}else {							
							track("ERROR, ID TO HIGH @ "  +id + " MAX : " +maxStatic + " /////" +  msg + " / ");							
						}				
					break;
					
					case MODE_TRACE:
					case MODE_SILENT:
					//do nothing
					break;
					
					case MODE_TRACE_ALL:
						trace("Tracker.trackProperty():" + msg);
					break;									
				}					
			}else {
				trace(" ERROR: not initialized: " + msg);				
			}
		}
		
		/**
		 *  clears the Tracker and old ID's and fields
		 */		
		public static function clear():void{
			staticFields = [];
			dynamicFields = [];
			
			for (var i:uint = 0; i < staticTFs.length; i++) {
				staticContainer.removeChild(staticTFs[i]);
			}
			for (var k:uint = 0; k < dynamicTFs.length; k++) {
				dynamicContainer.removeChild(dynamicTFs[k]);
			}
			staticTFs = [];
			dynamicTFs = [];
			
			DbackPlate.width = dynamicContainer.width+xMargin*2;
			DbackPlate.height = dynamicContainer.height;
				
			SbackPlate.width = staticContainer.width+xMargin*2;
			SbackPlate.height = staticContainer.height;
		}
		
		
		/**
		 * 
		 * @param	_outMode ( 0-3  , outmode exist as public static vars )
		 */
		public function changeOutMode(_outMode:int):void{
			outMode = _outMode;
			validateOutMode();
		}
		
		/*
		 * private functions -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
		 */ 
		
		private static function validateOutMode():void{
			switch(outMode) {
				case MODE_SILENT:
					container.visible = false;
					break;
				case MODE_TRACE:
				case MODE_TRACE_ALL:
				case MODE_TRACK:
					container.visible = true;
					break;
				default:					
					outMode = MODE_TRACK;
					track(" outMode is INVALID: FALLING BACK TO DEFAULT: MODE_TRACK ");
					break;
			}			
		}
		
		/**
		 * 
		 * @param	id  :  if id is -1 , dynamic fields will be updated, otherwise static field with the id supplied will be updated
		 */
		private static function draw(id:int = -1):void{			
			var len:uint ;
			var tf:TextField;

			if (id == -1) {
				len = dynamicFields.length;
				if (len > dynamicTFs.length) createTF(DYNAMIC);
							
				for (var i:uint = 0; i < len; i++) {
					tf = dynamicTFs[i];
					tf.text = dynamicFields[i];
				}
				DbackPlate.width = dynamicContainer.width+xMargin*2;
				DbackPlate.height = dynamicContainer.height;
			}
			else{
				len = staticFields.length;
				var sLen:uint = staticTFs.length;
				if (len > sLen) {
					for (var k:uint = sLen; k < len; k++){
						createTF(STATIC);						
					}
				}
				tf = staticTFs[id];
				tf.text = String(staticFields[id]);								
				
				SbackPlate.width = staticContainer.width+xMargin*2;
				SbackPlate.height = staticContainer.height;
			}
			staticContainer.x = SbackPlate.x = 0;
			staticContainer.y = SbackPlate.y = 0;	
				
			dynamicContainer.x = DbackPlate.x =  0;
			dynamicContainer.y = DbackPlate.y = staticContainer.height+staticContainer.y;	
		}
		
		
		/**
		 * 
		 * @param	type :  creates a new textfield of the supplied type
		 */
		private static function createTF(type:int):void{
			var tf:TextField = new TextField();
			tf.selectable = false;
			tf.autoSize =  "left";
			
			tf.x = xMargin;
			switch(type) {
				
				case DYNAMIC:
					tf.defaultTextFormat = new TextFormat(null, 14, dynamicTextColor, true);
					tf.y = dynamicTFs.length * 20;
					dynamicTFs.push(tf);
					dynamicContainer.addChild(tf);
					DbackPlate.visible = true;
					break;
					
				case STATIC:
					tf.defaultTextFormat = new TextFormat(null, 14, staticTextColor, true);				
					tf.y = staticTFs.length * 20;
					staticTFs.push(tf);
					staticContainer.addChild(tf);
					SbackPlate.visible = true;
					break;
			}			
		}		
		
		private function addedToStageHandler(e:Event):void{
			if(!isInitialized){
				setup();
			}
		}
		
		/**
		 * 
		 * @param	s :  creates the backplate
		 */
		private static function drawBG(s:Sprite):void{
			s.graphics.beginFill(backPlateColor, backPlateAlpha);
			s.graphics.drawRect(0, 0, 10, 10);
			s.graphics.endFill();
			s.visible = false;
		}
	}	
}