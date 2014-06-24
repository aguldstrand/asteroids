package com.engine
{
	import com.greensock.easing.Expo;
	import com.lbi.vecmath.Vector3;
	import com.model.GameModel;
	import flash.display.Sprite;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.text.TextField;
	import shared.vo.Asteroid;
	import shared.vo.BasePhysics;
	import shared.vo.Bullet;
	import shared.vo.Explosion;
	import shared.vo.Ship;
	import shared.vo.UserInput;
	import com.service.GameService;
	import com.SKOJdk.Tracker;
	import com.utils.Counter;
	import com.engine.TriangleCheck;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class GameEngine extends Sprite
	{
		private static var instance:GameEngine;
		private static var allowInstantiation:Boolean;
		private var c:Counter;
		private var SW:int;
		private var SH:int;

		private var LwingP:Point;
		private var RwingP:Point;
		private var noseP:Point;
		
		private var shiplLayout:Vector.<Point>;
		
		
		
		private var maxBulletsInGame:int = 60;
		
		private var maxBulletsPerShips:int = 10;
		
		private var frameCounter:int = 0;
		
		private var speed:Number =350;
		private var friction:Number = .9;
		private var bulletSpeed:uint = 210;
		private var piOver180:Number = Math.PI/180;
		private var collideFlags:Array;
		
		private var gravity:Vector.<Point>;
		
		private var gravityRes:int;
		private var gravityDebug:Array;
		
		
		public function GameEngine() {
		   if (!allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use GameEngine.getInstance() instead of new.");			
          }
		  init();
		}

		public static function getInstance():GameEngine {
         if (instance == null) {
            allowInstantiation = true;
            instance = new GameEngine();
			
            allowInstantiation = false;
          }
         return instance;
       }    
	   
	   		
		private function init():void
		{
			c = new Counter();
			SW = GameModel.getInstance().SW;
			SH = GameModel.getInstance().SH;
			
			collideFlags = new Array();
			
			LwingP = new Point( -20, -20);
			RwingP = new Point( -20, 20);
			noseP = new Point(40, 0);
			
			shiplLayout = new Vector.<Point>(3);
			shiplLayout[0] = LwingP;
			shiplLayout[1] = RwingP;
			shiplLayout[2] = noseP;
			
			gravityDebug = new Array();
			gravityRes = 25;
			var gLen:uint = int(SW / gravityRes) * int(SH / gravityRes);
			this.gravity = new Vector.<Point>(gLen);
			for (var i:int = 0; i < gLen;  i++) 
			{
				gravity[i] = new Point();

			}
		}
		
		private function degreesToRadians(degrees:Number) : Number
		{
			return degrees * Math.PI / 180;
		}
		
		public function update(step:int):void {
			
			frameCounter++;
			
			
			var numExplosions:uint = GameModel.getInstance().explosions.length;
			var numShips:uint = GameModel.getInstance().ships.length;
			var numAsteroids:uint = GameModel.getInstance().asteroids.length;
			var shipAcc:Point = new Point();
		
			
			
			//var test:int = Math.min(numAsteroids, 1);
			var numBulletsInShip:int;
			this.graphics.clear();
			this.graphics.beginFill(0x000000);
			this.graphics.drawRect(0, 0, SW, SH);
			this.graphics.endFill();
			this.graphics.lineStyle(2, 0xFF0000);
			for (var y:int = 0; y < int(SH / gravityRes); y++) 
			{
				for (var x:int = 0; x < int(SW / gravityRes); x++) 
				{
					var xgra:Number = 0;
					var ygra:Number = 0;
					
					for (var aaa:uint = 0; aaa < numExplosions; aaa++) {
						var ast:Explosion = GameModel.getInstance().explosions[aaa];
												
							// relative pos
							var __dx:Number = x * gravityRes - ast.pos.x;
							var __dy:Number = y * gravityRes - ast.pos.y; 
							
							// normalize (lent = 1)
							var relativePos:Point = new Point(__dx, __dy);
							
							var normalizedRelativepos:Point = relativePos.clone();
							normalizedRelativepos.normalize(1);
							
							
							var relativePosLen:Number = relativePos.length;
							if (relativePosLen == 0) {
								relativePosLen = .001;
							}
							
							// multiply gravity force size
							var gravForceSize:Number = Math.pow(1 / relativePosLen, 1.5) * +ast.size*50000;
							
							var _____x:Number = normalizedRelativepos.x * gravForceSize;
							var _____y:Number = normalizedRelativepos.y * gravForceSize;
														
							xgra += _____x;
							ygra += _____y;													
					}
					/*
					var max:int =1500;
					if (xgra > max) {
						xgra = max;
					}
					if (xgra < -max) {
						xgra = -max;
					}
					if (ygra > max) {
						ygra = max;
					}
					if ( ygra < -max) {
						ygra = -max;
					}
					*/
					
					this.graphics.moveTo(x * gravityRes, y * gravityRes);
					this.graphics.lineTo(x * gravityRes + xgra*.03, y * gravityRes + ygra*.03);
					
					
					gravity[int(x + y * SW / gravityRes)].x = xgra;
					gravity[int(x + y * SW / gravityRes)].y = ygra;
					//trace(int(x + y * SW / gravityRes));
					//gravityDebug[int(x + y * SW / gravityRes)].text = "X : " + Math.round( xgra) + " Y: " + Math.round(ygra);
				}
				
			}
			
			
			for (var i:String in GameModel.getInstance().userInputs) {			
				var userInput:UserInput = GameModel.getInstance().userInputs[i];
				userInput.shake = false;
			}
			
			var matrix:Matrix = new Matrix();
			
			//var numBullets:uint = GameModel.getInstance().bullets.length;

			
			var pa:Point;
			var pb:Point;
			var pc:Point;
			
			var secs:Number =  step / 1000;
			
			
			for (var e:uint = 0; e < numExplosions; e++) {
				var explosion:Explosion = GameModel.getInstance().explosions[e];
				explosion.size--;
				if (explosion.size < 1) {
					GameModel.getInstance().explosions.splice(e, 1);
					numExplosions--;
				}
			}

			// MOVE SHIPS (BASED ON USER INPUT)			
			for (var s:uint = 0; s < numShips; s++) {
				var ship:Ship = GameModel.getInstance().ships[s];
				shipAcc = new Point(0, 0);
				var userInput:UserInput = GameModel.getInstance().userInputs[ship.name];
				
				if (userInput.left) {
					
					if (userInput.thrust) {
						ship.rot-= 1;
					}else {
						ship.rot-= 6;
					}
					
					
					if (ship.rot < 0) {
						ship.rot = 360;
					}
				}
				if (userInput.right) {
					if (userInput.thrust) {
						ship.rot += 1;
					}else {
						ship.rot+= 6;
					}
					
					ship.rot %= 360;
				}
				
				
				if (userInput.thrust ) {
					shipAcc.x += (Math.cos(degreesToRadians(ship.rot)) * speed);
					shipAcc.y += (Math.sin(degreesToRadians(ship.rot)) * speed);					
				}else {
						
				}				
				
				numBulletsInShip = ship.bullets.length;
				
				if (userInput.shoot &&  numBulletsInShip < maxBulletsPerShips) {					
					matrix.identity();
					matrix.rotate(ship.rot*piOver180);					
					var newBullet:Bullet = new Bullet();
					var transFormedPoint:Point = matrix.transformPoint(noseP);
					newBullet.pos.x = ship.pos.x + transFormedPoint.x;
					newBullet.pos.y = ship.pos.y + transFormedPoint.y;
					newBullet.vel.x = transFormedPoint.x * bulletSpeed;
					newBullet.vel.y = transFormedPoint.y * bulletSpeed;
					newBullet.direction = ship.rot + 90;
					newBullet.maxVel = 250;
					newBullet.friction = 0;
					ship.bullets.push(newBullet);
					numBulletsInShip++;
				}
				
				ship.pos.x %= SW;
				ship.pos.y %= SH;
				
				if (ship.pos.x < 0) {
					ship.pos.x = SW-1;
				}
				if (ship.pos.y < 0) {
					ship.pos.y = SH-1;
				}
				
				//var g:Point = gravity[int( int(ship.pos.x / gravityRes) + int(ship.pos.y / gravityRes) * int(SW / gravityRes))];				
				//ship.vel.x += g.x;
				//ship.vel.y += g.y;
				
				applyNewPositions(ship, shipAcc, secs);
				//ship.pos.x += ship.vel.x*secs + g.x;
				//ship.pos.y += ship.vel.y*secs + g.y;
				
				
				
				for (var mb:uint = 0; mb < numBulletsInShip; mb++) {
					var bullet:Bullet = ship.bullets[mb];
					
			
				
					if (bullet.pos.x >= SW || bullet.pos.x < 0 || bullet.pos.y < 0 || bullet.pos.y >= SH) {
						//GameModel.getInstance().bullets.splice(mb, 1);
						ship.bullets.splice(mb, 1);
						numBulletsInShip--;
										//
					}else {
						//var gb:Point = gravity[int( int(bullet.pos.x / gravityRes) + int(bullet.pos.y / gravityRes) * int(SW / gravityRes))];
						//bullet.vel.x += gb.x;
						//bullet.vel.y += gb.y;
						
						applyNewPositions(bullet,new Point(), secs);
						//bullet.pos.x += Math.sin(bullet.direction * piOver180 ) * bulletSpeed * secs + gb.x;
						//bullet.pos.y -= Math.cos(bullet.direction * piOver180 ) * bulletSpeed * secs - gb.y;	
					}
					//
				}
		
				
				
				
				
			}

			
						
			
			
			// MOVE ASTEROIDS
			
			for (var a:uint = 0; a < numAsteroids; a++) {
				var asteroid:Asteroid = GameModel.getInstance().asteroids[a];
				

				
				asteroid.pos.x %= SW;
				asteroid.pos.y %= SH;
				
				if (asteroid.pos.x < 0) {
					asteroid.pos.x = SW-1;
				}
				if (asteroid.pos.y < 0) {
					asteroid.pos.y = SH-1;
				}

				
				//var ag:Point = getGravity(asteroid.pos);
				//asteroid.vel.x += ag.x;
				//asteroid.vel.y += ag.y;
				applyNewPositions(asteroid,new Point(), secs);
				
				
				//asteroid.pos.x += asteroid.vel.x * secs + ag.x;
				//asteroid.pos.y += asteroid.vel.y * secs + ag.y;
				//Tracker.track("ASteroid : " + asteroid.pos.x);
			}
			
			
			//MOVE BULLETS      //bullets are now inside ship
			
			//for (var mb:uint = 0; mb < numBullets; mb++) {
				//var bullet:Bullet = GameModel.getInstance().bullets[mb];
				//bullet.pos.x += Math.sin(bullet.direction * piOver180 )* bulletSpeed * secs;
				//bullet.pos.y -= Math.cos(bullet.direction * piOver180 )* bulletSpeed * secs;				
				//
				//if (bullet.pos.x > SW || bullet.pos.x < 0 || bullet.pos.y < 0 || bullet.pos.y > SH) {
					//GameModel.getInstance().bullets.splice(mb, 1);
					//numBullets--;
									//
				//}
				//
			//}
			
			
			//SHIP BULLET COLLISON DETECTION
			for (var sbc:uint = 0; sbc < numShips; sbc ++) {
				ship = GameModel.getInstance().ships[sbc];
				
				pa = new Point();
				pa.x = ship.pos.x + shiplLayout[0].x;
				pa.y = ship.pos.y + shiplLayout[0].y;

				pb = new Point();
				pb.x = ship.pos.x + shiplLayout[1].x;
				pb.y = ship.pos.y + shiplLayout[1].y;

				pc = new Point();
				pc.x = ship.pos.x + shiplLayout[2].x;
				pc.y = ship.pos.y + shiplLayout[2].y;
				
				for (var ssbc:uint = 0; ssbc < numShips; ssbc++){
					var shipSSBC:Ship = GameModel.getInstance().ships[ssbc];
					var numBulletsSSBC:int = shipSSBC.bullets.length;
					
					for ( var bsc:uint = 0; bsc < numBulletsSSBC; bsc++) {
						//bullet = GameModel.getInstance().bullets[bsc];
						bullet = shipSSBC.bullets[bsc];
						
						if (TriangleCheck.check(pa, pb, pc, bullet.pos)) {						
							numBulletsSSBC--;
							shipSSBC.bullets.splice(bsc, 1);
							shipSSBC.score += 15;
							//GameModel.getInstance().bullets.splice(bsc, 1);
							//numBullets--;
							shipCollision(ship);
						}				
					}
				}
			}
			
			//BULLET ASTEROIDS COLLISION DETECTION
			for ( var bac:uint = 0; bac < numAsteroids; bac++) {
				asteroid = GameModel.getInstance().asteroids[bac];
				
				
				for (var sbac:uint = 0; sbac < numShips; sbac++){

					var shipSBAC:Ship = GameModel.getInstance().ships[sbac];
					var numBulletsSBAC:int = shipSBAC.bullets.length;
					
					
					for (var abc:uint = 0; abc < numBulletsSBAC; abc++) {
							//bullet = GameModel.getInstance().bullets[abc];
							bullet = shipSBAC.bullets[abc];
							
							var _dx:Number = bullet.pos.x - asteroid.pos.x;
							var _dy:Number = bullet.pos.y - asteroid.pos.y; 
									
							var _dist:Number = Math.sqrt((_dx * _dx) + (_dy * _dy)) - 0 - asteroid.diam;						
					
							
							if (_dist < 0) {
								//numBullets--;
								shipSBAC.score += 10;
								numBulletsSBAC--;
								//GameModel.getInstance().bullets.splice(abc, 1);
								shipSBAC.bullets.splice(abc, 1);
								
								GameModel.getInstance().asteroids.splice(bac, 1);
								numAsteroids += removeAsteroid(asteroid);
							}					
					}				
				}
			}
			
			
			//SHIP ON SHIP COLLISION
			if (frameCounter % 25 == 0) {
				//Tracker.track(" clearing collide flags ");
				collideFlags = new Array();
			}
			var checkCollision:Boolean = true;		
			for (var ssc:uint = 0; ssc < numShips; ssc++) {
				var shipA:Ship = GameModel.getInstance().ships[ssc];
				//var shipA_np:Point = new Point(shipA.pos.x + noseP.x, shipA.pos.y + 
				checkCollision = true;
				for (var coll:uint = 0; coll < collideFlags.length; coll++) {
					
					if (collideFlags[coll] == ssc) {
						checkCollision = false;
						//Tracker.track(" dont do colllision check ");
					}
				}
				if(checkCollision){
					for (var ssb:uint = 0; ssb < numShips; ssb++) {
						var shipB:Ship = GameModel.getInstance().ships[ssb]
						
						
						
						if(ssc != ssb){  //rough collision detection.
							var __dx:Number = shipA.pos.x - shipB.pos.x;
							var __dy:Number = shipA.pos.y - shipB.pos.y; 									
							var __dist:Number = Math.sqrt((__dx * __dx) + (__dy * __dy)) ;										
							
							
							if (__dist < 150) {
								
								
								//finer collision detection
								
								//ship A points
								pa = new Point();
								pa.x = shipA.pos.x + shiplLayout[0].x;
								pa.y = shipA.pos.y + shiplLayout[0].y;
								pb = new Point();
								pb.x = shipA.pos.x + shiplLayout[1].x;
								pb.y = shipA.pos.y + shiplLayout[1].y;
								pc = new Point();
								pc.x = shipA.pos.x + shiplLayout[2].x;
								pc.y = shipA.pos.y + shiplLayout[2].y;
								
								//ship B points
								var b_pa:Point = new Point();
								b_pa.x = shipB.pos.x + shiplLayout[0].x;
								b_pa.y = shipB.pos.y + shiplLayout[0].y;
								var b_pb:Point = new Point();
								b_pb.x = shipB.pos.x + shiplLayout[1].x;
								b_pb.y = shipB.pos.y + shiplLayout[1].y;
								var b_pc:Point = new Point();
								b_pc.x = shipB.pos.x + shiplLayout[2].x;
								b_pc.y = shipB.pos.y + shiplLayout[2].y;
								
								if (TriangleCheck.check(pa, pb, pc, b_pa) || TriangleCheck.check(pa, pb, pc, b_pb) || TriangleCheck.check(pa, pb, pc, b_pc)) {	
								
									collideFlags.push(ssb,ssc);									
									//Tracker.track(" ship on ship collision " + shipA.name + " : " + shipB.name);
									
									var temp:Point = shipA.vel;
									shipA.vel = shipB.vel;
									shipB.vel = temp;			
									
									//shipA.pos.x -= 10;
									//shipA.pos.y -= 10;
									//
									//shipB.pos.x += 10;
									//shipB.pos.y += 10;
									
									//var tempPos:Point = shipA.pos;
									//shipA.pos = shipB.pos;
									//shipB.pos = tempPos;
									
									shipA.rot += Math.random() * 10 + 10;
									shipB.rot += Math.random() * 15 + 15;
								}
							}
						}
					}
				}
			}
			

			
			// SHIP ASTEROIDS COLLISION DETECTION
			for (var sc:uint = 0; sc < numShips; sc++) {
				
				ship = GameModel.getInstance().ships[sc];				
				for (var ac:uint = 0; ac < numAsteroids; ac++) {
					
						asteroid = GameModel.getInstance().asteroids[ac];
						
						
						//loop shiplayout
						for (var sl:uint = 0; sl < 3; sl++) {
							if(numShips > 0){
								var dx:Number = (ship.pos.x+shiplLayout[sl].x) - asteroid.pos.x;
								var dy:Number = (ship.pos.y+shiplLayout[sl].y) - asteroid.pos.y; 
								
								var dist:Number = Math.sqrt((dx * dx) + (dy * dy)) - 8 - asteroid.diam;						
				
								if (dist < 0) {
									
									GameModel.getInstance().asteroids.splice(ac, 1);
									//numAsteroids--;			
									numAsteroids += removeAsteroid(asteroid);
									/*
									if (asteroid.diam > 15) {
										for (var na:uint = 0; na < 3; na++) {
											var newAsteroid:Asteroid = new Asteroid();
											newAsteroid.diam = asteroid.diam / 3;
											newAsteroid.pos = asteroid.pos;
											newAsteroid.vel.x = asteroid.vel.x * Math.random() * 2 -1;
											newAsteroid.vel.y = asteroid.vel.y * Math.random() * 2 -1;
											GameModel.getInstance().asteroids.push(newAsteroid);
											numAsteroids++;
										}
									}
									*/
									
									shipCollision(ship);
									
									//GameModel.getInstance().ships.splice(sc, 1);
									//numShips--;								
									//Tracker.track(" SHIP "+ship.name+" COLLIDED WITH ASTEROID " );
								}
							}
						}											
				}
			}			
			if (numAsteroids < 1) {
				createAsteroids();
			}
		}
		
		private function applyNewPositions(obj:BasePhysics, acc:Point , secs:Number):void {			
			
			var g:Point = getGravity(obj.pos);
			obj.acc.x = g.x + acc.x;
			obj.acc.y = g.y + acc.y;
			
			
			if (obj.vel.length > 0.1) {
				var frictionP:Point = new Point( -obj.vel.x, -obj.vel.y);
				frictionP.normalize(obj.friction);						
				obj.acc.x += frictionP.x;
				obj.acc.y += frictionP.y; 					
			}	
			
			obj.vel.x+=obj.acc.x*secs;
			obj.vel.y += obj.acc.y * secs;	
			
			if (obj.vel.length > obj.maxVel) {
				obj.vel.normalize(obj.maxVel);
			}
			

			
			obj.pos.x += obj.vel.x*secs;
			obj.pos.y += obj.vel.y*secs;
		}
		
		
		private function getGravity(pos:Point):Point {
			
			var _x:int = int(pos.x) / gravityRes;
			var _y:int = int(pos.y) / gravityRes;
			
			var gravW:int = SW / gravityRes;			
			
			var index:int = _y * gravW + _x;
			
			//trace("point x  : " + pos.x);
			//trace("point y  : " + pos.y);
			//trace("_x : " + _x);
			//trace("_y : " + _y);
			//trace("gravW : " + gravW);
			//trace("index: " + index);
			
			
			var grav:Point = gravity[index];
			return grav;			
		}
		
		public function addAsteroids():void {
			createAsteroids(2);
		}
		
		private function createAsteroids(num:int = 12):void
		{
			
			for (var i:uint = 0; i < num; i++) {
				var asteroid:Asteroid = new Asteroid();
				asteroid.diam = Math.random() * 20 + 20;
				asteroid.friction = 0;
				asteroid.maxVel = 20;
				asteroid.pos = Math.random() > .5 ? new Point(0 , Math.random() * SH) : new Point(Math.random() * SW, 0);
				asteroid.vel = Math.random() > .5 ? new Point(Math.random() * 5 + 5, Math.random() * 5 + 5) : new Point(Math.random() * -5 - 5, Math.random() * -5 - 5);
				
				GameModel.getInstance().asteroids.push(asteroid);
			}
		}
		
		private function removeAsteroid(asteroid:Asteroid):int {
			
			var ret:int = -1;
									
			var pos:Point = new Point(asteroid.pos.x, asteroid.pos.y);
			var size:int = asteroid.diam;
			createExplosion(size, pos);
			
			var totalAsteroids:int = GameModel.getInstance().asteroids.length;
			
			if (size > 32 &&  totalAsteroids < 20) {
				for (var na:uint = 0; na < 3; na++) {
					var newAsteroid:Asteroid = new Asteroid();
					newAsteroid.diam = size / 4;
					newAsteroid.pos = asteroid.pos;
					newAsteroid.friction = 0;
					newAsteroid.maxVel = 30;
					newAsteroid.vel.x = asteroid.vel.x * Math.random() *1  - asteroid.vel.x*2;
					newAsteroid.vel.y = asteroid.vel.y * Math.random() * 1 - asteroid.vel.y*2;
					GameModel.getInstance().asteroids.push(newAsteroid);
					ret++;
				}
			}
			return ret;
		}
		
		private function shipCollision(ship:Ship) {
			var pos:Point = new Point(ship.pos.x, ship.pos.y);
			createExplosion(20, pos);
			
			var userInput:UserInput =  GameModel.getInstance().userInputs[ship.name];
			userInput.shake = true;
			
			
			ship.pos.x = SW * .5;
			ship.pos.y = SH * .5;
		}
		
		private function createExplosion(size:int, pos:Point):void {
			var explosion:Explosion = new Explosion();
			explosion.pos = pos;
			explosion.size = size;
			GameModel.getInstance().explosions.push(explosion);
		}
	   
	}
	
}