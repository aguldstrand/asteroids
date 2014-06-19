package com
{
	import flash.display.Sprite;

	import com.SKOJdk.Tracker;
	import com.model.GameModel;
	import com.engine.GameEngine;
	import flash.events.Event;
	import com.service.GameService;
	import shared.vo.Asteroid;
	import shared.vo.Bullet;
	import shared.vo.Ship;
	import shared.vo.UserInput;
	import com.SKOJdk.MemTracker;
	import com.utils.Counter;
	import flash.net.NetworkInfo;
	/**
	 * ... ///////SERVER
	 * @author oscjoh
	 */
	public class Main extends Sprite 
	{
	
		private var c:Counter;
		private var ca:Counter;
		private var gameService:GameService;
		
		private var statusPosted:Boolean = true;
		
		//private var kickTimer:uint = 100;
		//private var kickCounter:uint = 0;
		
		public function Main() {
			init();
		}
		
		private function init():void	{
			c = new Counter();
			ca = new Counter();
			gameService = new GameService();
			
			GameModel.getInstance();
			GameEngine.getInstance();
			
			addChild(GameEngine.getInstance());
			
			var t:Tracker = new Tracker();
			//t.setup(Tracker.MODE_TRACE_ALL);
			addChild(t);			
			
			addEventListener(Event.ENTER_FRAME, loop);			
			
			var m:MemTracker = new MemTracker();
			addChild(m);
			
			showIp();
			
			//testing();
			
			Tracker.track(" SERVER READY ");
		}
		
		private function showIp():void
		{
			var netInterfaces = NetworkInfo.networkInfo.findInterfaces();
			var addresses = netInterfaces[0].addresses;
			var userIp = addresses[0].address;
			
			Tracker.trackProperty("LOCAL IP : " +userIp, 8);
			Tracker.track(" looking up IP : " + userIp);
		}
		
		private function testing():void
		{
			
			for (var i:uint = 0; i < 2; i++) {

							var asteroid:Asteroid = new Asteroid();
			asteroid.diam = Math.random() * 20 + 20;
			asteroid.pos.x = Math.random() * 300;
			asteroid.pos.y = Math.random() * 300;
			asteroid.vel.x = Math.random() * 40;
			asteroid.vel.y = Math.random() * 40;
			GameModel.getInstance().asteroids.push(asteroid);
				
				
			var userInput:UserInput = new UserInput();
			userInput.thrust = true;
			//userInput.left = Math.random() > .5 ? true : false;

			
			userInput.name = "APA" + i;
			GameModel.getInstance().userInputs["APA"+i] = userInput;
			
			//for ( var s:String in GameModel.getInstance().userInputs) {
				//Tracker.track( GameModel.getInstance().userInputs[s].name);
			//}
			
			
			var ship:Ship = new Ship();
			ship.name = "APA"+i;
			ship.pos.x = Math.random()*1200;
			ship.pos.y = Math.random() * 800;
			ship.color = Math.random() * 0xFFFFFF;
			//ship.rot = Math.random()*180;
			//ship.vel.x =0;
			//ship.vel.y = 0;	
			
			if ( i == 0) {
				ship.rot = 0;
				ship.pos.x = 1100;
				ship.pos.y = 400;
				
			}
			if ( i == 1) {
				ship.rot = 180;
				ship.pos.x = 100;
				ship.pos.y = 400;				
				
				
			}
			
			GameModel.getInstance().ships.push(ship);
				

			
			//var bullet:Bullet = new Bullet();
			//bullet.color = ship.color;
			//bullet.pos.x = Math.random() * 1200;
			//bullet.pos.y = Math.random() * 800;
			//bullet.vel.x = Math.random() * 100;
			//bullet.vel.y = Math.random() * 100;
			//bullet.direction = Math.random() * 360;
			//GameModel.getInstance().bullets.push(bullet);
			}
			
			Tracker.track(" SERVER TEST SETUP COMPLETE ");
		}
		
		private function loop(e:Event):void 
		{
			ca.diff();
			
			var step:uint = c.diff();
		
				GameEngine.getInstance().update(step);
				
				gameService.sendComplexMessage();
				gameService.sendControllerMessages();
				
				var userInputs:int = 0;
				for ( var s:String in GameModel.getInstance().userInputs) {
					userInputs ++;
				}
				
			Tracker.trackProperty("MONITORS : " + GameModel.getInstance().monitors.length,0);
			Tracker.trackProperty("PLAYERS : " + userInputs,1);
			Tracker.trackProperty("STEP (ms) : " + step, 2);			
			Tracker.trackProperty("__________________________________________ ",3);
			Tracker.trackProperty("SHIPS: " + GameModel.getInstance().ships.length, 4);
			
			var bullets:int = 0;
			for (var b:uint = 0; b < GameModel.getInstance().ships.length; b++) {
				bullets += GameModel.getInstance().ships[b].bullets.length;
			}
			
			
			
			Tracker.trackProperty("BULLETS : " + bullets,5);
			Tracker.trackProperty("ASTEROIDS : " + GameModel.getInstance().asteroids.length,6);
			Tracker.trackProperty("EXPLOSIONS : " + GameModel.getInstance().explosions.length,7);
			
			
			//if (GameModel.getInstance().bullets.length < 20) {
				//GameModel.getInstance().userInputs["APA0"].shoot = true;
			//}else {
				//GameModel.getInstance().userInputs["APA0"].shoot = false;
			//}
			
			Tracker.trackProperty("logic executed in " + ca.diff() + " ms", 9);		
		}
	}
	
}