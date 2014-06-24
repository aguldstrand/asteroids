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

		
		private var maxShips:int;
		private var maxBullets:int;
		private var maxAsteroids:int;
		
		private var _numShips:int;
		private var _numAsteroids:int;
		private var _numBullets:int;
		
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

			ships = new Array();
			asteroids = new Array();
			bullets = new Array();
			explosions = new Array();
			
			
			_SW = 1200;
			_SH = 800;
			
			maxShips = 10;
			maxBullets = maxShips * 10;
			maxAsteroids = 30;
			
			createAsteroids();
			createBullets();
			createShips();
		}
		
				// VO CREATION
		private function createAsteroids():void
		{
			asteroids = new Array();
			//for (var i:uint = 0; i < maxAsteroids; i++) {
				//var asteroid:Asteroid = new Asteroid();
				//
				//asteroid.posX = Math.random() * _SW;
				//asteroid.posY = Math.random() * _SH;
				//asteroid.diam = Math.random() * 10 + 10;
				//asteroids.push(asteroid);
			//}			
		}
		
		private function createShips():void
		{
			ships = new Array();
			//for (var i:uint = 0; i < maxShips; i++) {
				//var ship:Ship = new Ship();
				//ship.pos = new Point(Math.random() * _SW, Math.random() * _SH);
				//
				//ship.rot = Math.random() * 360;
				//ship.color = 0xFFFFFF * Math.random();
				//ships.push(ship);
			//}			
		}
		
		private function createBullets():void
		{
			bullets = new Array();
			//for (var i:uint = 0; i < maxBullets; i++) {
				//bullets.push(new Bullet());
			//}
		}

		public function get SW():int { return _SW; }
		
		public function get SH():int { return _SH; }
		

		
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
		
		public function get numShips():int { return _numShips; }
		
		public function set numShips(value:int):void 
		{
			_numShips = value;
		}
		
		public function get numAsteroids():int { return _numAsteroids; }
		
		public function set numAsteroids(value:int):void 
		{
			_numAsteroids = value;
		}
		
		public function get numBullets():int { return _numBullets; }
		
		public function set numBullets(value:int):void 
		{
			_numBullets = value;
		}
		
		public function get explosions():Array { return _explosions; }
		
		public function set explosions(value:Array):void 
		{
			_explosions = value;
		}
		

	}
}