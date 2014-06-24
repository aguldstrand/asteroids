package com.model
{
	import flash.geom.Point;
	import flash.utils.Dictionary;
	import shared.vo.Asteroid;
	import shared.vo.Bullet;
	import shared.vo.Ship;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class GameModel
	{
		private var _monitors:Array;
		private var _userInputs:Dictionary;
		

		
		private var _ships:Array;
		private var _bullets:Array;
		private var _asteroids:Array;
		private var _explosions:Array;
		
		private var _SW:int;
		private var _SH:int;
		
		private static var instance:GameModel;
		private static var allowInstantiation:Boolean;
		
		public function GameModel() {
		   if (!allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use GameModel.getInstance() instead of new.");			
          }
		  init();
		}
		public static function getInstance():GameModel {
         if (instance == null) {
            allowInstantiation = true;
            instance = new GameModel();
			
            allowInstantiation = false;
          }		  
		  return instance;
       }    
		
		private function init():void
		{
			explosions = new Array();
			monitors = new Array();
			ships = new Array();
			asteroids = new Array();
			bullets = new Array();
			userInputs = new Dictionary(true);						
			
			_SW = 1200;
			_SH = 800;			
		}

		public function get SW():int { return _SW; }
		
		public function get SH():int { return _SH; }
		
		public function get userInputs():Dictionary { return _userInputs; }
		
		public function set userInputs(value:Dictionary):void 
		{
			_userInputs = value;
		}
		
		public function get ships():Array { return _ships; }
		
		public function set ships(value:Array):void 
		{
			_ships = value;
		}
		
		public function get bullets():Array { return _bullets; }
		
		public function set bullets(value:Array):void 
		{
			_bullets = value;
		}
		
		public function get asteroids():Array { return _asteroids; }
		
		public function set asteroids(value:Array):void 
		{
			_asteroids = value;
		}
		
		private function set SW(value:int):void 
		{
			_SW = value;
		}
		
		private function set SH(value:int):void 
		{
			_SH = value;
		}
		
		
		public function get monitors():Array { return _monitors; }
		
		public function set monitors(value:Array):void 
		{
			_monitors = value;
		}
		
		public function get explosions():Array { return _explosions; }
		
		public function set explosions(value:Array):void 
		{
			_explosions = value;
		}


	}
}