package com.game
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.filters.DisplacementMapFilter;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.Dictionary;
	import shared.vo.Explosion;
	
	
	import shared.vo.Ship;
	import shared.vo.Bullet;
	import shared.vo.Asteroid;
	import com.model.GameModel;
	import com.game.TitleFactory;
	import com.game.GameDistortion;
	import com.SKOJdk.Tracker;
	import com.utils.Counter;
	import com.game.ScoreBoard;
	import com.game.PixelPoint;
	import com.game.audio.AudioManager;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class Game extends Sprite 
	{
		private var container:Sprite;
		private var resContainer:Sprite;
		private var triangles:Sprite;
		private var piOver180:Number = Math.PI/180;
		private var GAME_BMD:BitmapData;
		private var GAME_BMP:Bitmap;
		
		//private var EXPLOSIONS_BMD:BitmapData;
		
		private var DIST_BMD:BitmapData;
		
		private var stars:Array;
		
		private var activeTitles:Dictionary;
		private var titleFactory:TitleFactory;
		private var SW:int;
		private var SH:int;
		
		private var LwingP:Point;
		private var RwingP:Point;
		private var noseP:Point;
		
		private var resDivider:int;
		private var c:Counter;
		
		private var scoreBoard:ScoreBoard;
		
		private var gd:GameDistortion;   // not using this for the moment, draws to much CPU
		
		private var titles:Dictionary;
		
		private var useTriangles:Boolean = false;
		private var audioManager:AudioManager;
		private var pixelPoints:Array;
		
		public function Game() {
			addEventListener(Event.ADDED_TO_STAGE, init);
		}
		
		private function init(e:Event):void 
		{
			audioManager = new AudioManager();
			c = new Counter();
			gd = new GameDistortion();
			removeEventListener(Event.ADDED_TO_STAGE, init);
			
			titleFactory = new TitleFactory();
			titles = new Dictionary();
			activeTitles = new Dictionary();
			pixelPoints = new Array();
			stars = new Array();
			
			LwingP = new Point( -20, -20);
			RwingP = new Point( -20, 20);
			noseP = new Point(40, 0);
			
			SW = GameModel.getInstance().SW;
			SH = GameModel.getInstance().SH;			
			resDivider = 1;
			
			gd.setup(SW, SH, resDivider);
			
			titleFactory.textSize = resDivider * 10;
			
			container = new Sprite();
			resContainer = new Sprite();
			resContainer.addChild(container);
			
			container.scaleX = container.scaleY = 1 / resDivider;
			
		
			
			GAME_BMD = new BitmapData(SW / resDivider, SH / resDivider, false);

			
			DIST_BMD = new BitmapData(SW / resDivider, SH / resDivider, false);
			
			
			if(useTriangles){
				GAME_BMP = new Bitmap(DIST_BMD);				
			}else {
				GAME_BMP = new Bitmap(GAME_BMD);
			}
			
			GAME_BMP.scaleX = GAME_BMP.scaleY = resDivider;
			addChild(GAME_BMP);
			
			
			scoreBoard = new ScoreBoard();
			addChild(scoreBoard);
			
			
			createStars();
		
		}		
		
		private function createStars():void
		{
			for (var i:uint = 0; i < SH; i++) {
				stars.push(Math.random() * SW);
			}
		}
		
		public function reset():void
		{
			//activeTitles = new Dictionary();
			//titles = new Dictionary();
			//for (var i:uint = 0; i < container.numChildren; i++) {
				//container.removeChildAt(i);
			//}
		}
		
		
		
		public function draw():void 
		{
			c.diff();
			container.graphics.clear();
			container.graphics.beginFill(0x000000);
			container.graphics.drawRect(0, 0, SW, SH);
			container.graphics.endFill();
			
			drawShipsAndBullets();		
			drawAsteroids();	
			
			drawToBitmap();			
			drawExplosionsOnBitmap();
			drawStarsOnBitmap();
			drawScore();
			
			if(useTriangles){
				distortBitmap();
			}
			Tracker.trackProperty( "MS : " + c.diff(), 5);
		}
		
		private function drawStarsOnBitmap():void
		{
			for (var i:uint = 0; i < SH; i++) {
				GAME_BMD.setPixel(stars[i], i, 0xFFFFFF);					
			}
			
			stars.unshift(Math.random() * SW);
			stars.pop();
		}
		
		private function drawScore():void
		{
			var numShips:int = GameModel.getInstance().ships.length;
			for (var i:uint = 0; i < numShips; i++) {
				var ship:Ship = GameModel.getInstance().ships[i];
				
				Tracker.trackProperty(ship.name +" : " + ship.color +  " : " + ship.score + " pts " , 6 + i);
			}
			
			
			scoreBoard.draw(GameModel.getInstance().ships);
			
		}
		
		private function drawToBitmap():void
		{
			
			
			
			//gd.distort(18 * 5, 50);
			//gd.distort(18 * 7, 50);
			//gd.distort(18 * 9, 50);
			//gd.distort(Math.random()*647, 50);
			
			GAME_BMD.draw(resContainer);
		}
		
		
		private function distortBitmap():void
		{
			//DRAW TRIANGLES       //probobly to much CPU use
			gd.draw(GAME_BMD);
			DIST_BMD.draw(gd);
			
			
			
			// PERLIN NOISE        //might work,  but hard to do overlapping of explosions...      maybe give it a try again later
			//DIST_BMD.perlinNoise(123, 555, 2, 123, true, false, 2, true);			
			//GAME_BMD.applyFilter(GAME_BMD, new Rectangle(0, 0, SW / (resDivider*1), SH / (1*resDivider)), new Point(0, 0), new DisplacementMapFilter(DIST_BMD, new Point(0, 0), 4, 4, 30, 30));
		}
		

		
		private function drawExplosionsOnBitmap():void
		{
			
			var numExplosions:uint = GameModel.getInstance().explosions.length;
			var pp:PixelPoint;
			for (var i:uint = 0; i < numExplosions; i++) {
				var explosion:Explosion = GameModel.getInstance().explosions[i];
				var explosionSize:uint = explosion.size * 10;
				
				audioManager.addSound(AudioManager.TYPE_EXPLOSION, explosion.pos,explosion.size);
				
				for (var e:uint = 0; e < explosionSize; e++) {
					
						var radi:int = Math.random() * explosionSize;
						var radius:Number = Math.random() * 360;
						
						for (var r:uint = 0; r < radi; r+=6) {
								
								var randSize:Number =r;
								var posX:int = (Math.sin(radius * piOver180 )* randSize) + explosion.pos.x;
								var posY:int = (Math.cos(radius * piOver180 )* randSize) + explosion.pos.y;

							GAME_BMD.setPixel(posX, posY, 0xCCCCCC);	
							if(explosionSize > 150){
								GAME_BMD.setPixel(posX+1, posY, 0xFF0000);					
								GAME_BMD.setPixel(posX, posY+1, 0xFFFF00);					
								GAME_BMD.setPixel(posX + 1, posY + 1, 0xFF0000);		
								
								if (Math.random() > .99) {
								
									if(pixelPoints.length <2000){
										pp = new PixelPoint();
										pp.color =  0xFFFFFF;
										pp.p.x = posX;
										pp.p.y = posY;
										pp.life = Math.random() * 100 + 20;
										pp.drift = Math.random() * 10 - 5;
										pp.fall = Math.random() * 3+2;
										pixelPoints.push(pp);
									}
								}
							}
						}

				}				
			}
			
			
			if (numExplosions > 0) {
				GAME_BMP.x = Math.random() > .5 ?  numExplosions : -numExplosions;
				GAME_BMP.y = Math.random() > .5 ?  numExplosions : -numExplosions;
			}else {
				GAME_BMP.x = 0;
				GAME_BMP.y = 0;
			}
			
			var ppLen:uint = pixelPoints.length;
			
		
			
			for (var p:uint = 0; p < ppLen; p++) {
				
				pp = pixelPoints[p];
				pp.p.y += pp.fall;
				pp.p.x += pp.drift;
				
				pp.life--;
				
				if (pp.drift < 0) {
					pp.drift++;
				}else if (pp.drift > 0) {
					pp.drift--;
				}
				
				pp.color -= .00001;
				GAME_BMD.setPixel(pp.p.x, pp.p.y,  pp.color);
				
				if (pp.life < 0 || pp.p.y > SH ) {
					ppLen--;
					pixelPoints.splice(p, 1);
				}
			}
			
			
		}
		
		

		
		//DRAW VO's
		private function drawAsteroids():void
		{
			var numAsteroids:int = GameModel.getInstance().asteroids.length;
			
			//Tracker.track(" num A : " + numAsteroids);
			for (var i:uint = 0; i < numAsteroids; i++) {
				var asteroid:Asteroid = GameModel.getInstance().asteroids[i];
				

				container.graphics.lineStyle(2, 0xFFFFFF);
				
				container.graphics.drawCircle(asteroid.pos.x, asteroid.pos.y, asteroid.diam);
			}
		}
		

		
		private function drawShipsAndBullets():void
		{
			
			activeTitles = new Dictionary();
			
			var numShips:int = GameModel.getInstance().ships.length;
			//Tracker.track(" num S : " + numShips);
			var matrix:Matrix = new Matrix();
			for (var i:uint = 0; i < numShips; i++) {
				
				
				
				var ship:Ship = GameModel.getInstance().ships[i];
				
				activeTitles[ship.name] = true;
				matrix.identity();
				matrix.rotate(ship.rot*Math.PI/180);
				
				
				var Lwing:Point = matrix.transformPoint(LwingP);
				var Rwing:Point = matrix.transformPoint(RwingP);
				var Nose:Point = matrix.transformPoint(noseP);
				//var laser:Point = matrix.transformPoint(new Point(0, 180));
				
				
				container.graphics.lineStyle(2, ship.color);
				
				
				
				
				if (titles[ship.name] != null) {
					titles[ship.name].x = ship.pos.x - titles[ship.name].width*.5;
					titles[ship.name].y = ship.pos.y-35;
				}else {
					titles[ship.name] = titleFactory.getTitle(ship.name, ship.color)
					container.addChild(titles[ship.name]);
					Tracker.track(" PLAYER CONNECTED : " + ship.name);
				}
				
				
				
				//container.graphics.drawCircle(ship.pos.x, ship.pos.y, 3);
				
				container.graphics.moveTo(ship.pos.x+Lwing.x, ship.pos.y+Lwing.y);				
				container.graphics.lineTo(ship.pos.x+Nose.x, ship.pos.y+Nose.y);
				container.graphics.lineTo(ship.pos.x+Rwing.x,ship.pos.y+ Rwing.y);
				container.graphics.lineTo(ship.pos.x + Lwing.x, ship.pos.y + Lwing.y);	
				

				
				var numBullets:int = ship.bullets.length;
				for ( var b:uint = 0; b < numBullets; b++) {
					
					var bullet:Bullet = ship.bullets[b];
					container.graphics.lineStyle(2, ship.color);
					container.graphics.drawCircle(bullet.pos.x, bullet.pos.y, 2);
				}
				
				//laser sight
				//container.graphics.moveTo(ship.pos.x + noseP.x, ship.pos.y + noseP.y );
				//container.graphics.lineStyle(1, 0xFF0000);
				//container.graphics.lineTo(ship.pos.x + noseP.x + laser.x, ship.pos.y + noseP.y + laser.y);
				//
				
			}
			
			for (var s:String in titles) {
				if (activeTitles[s] == null) {
					
					
					//Tracker.track(" Should remove title : " + s);
					//Tracker.track(" Should remove title : " + titles[s]);
					if(titles[s] != null){
						container.removeChild(titles[s]);
						
						
						Tracker.track(" PLAYER LEFT : " + s);
						delete activeTitles[s];
						delete titles[s];
						titleFactory.removeTitle(s);
					}
					
				}
			}
		}
	}	
}