package shared
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.MouseEvent;
	import flash.events.SecurityErrorEvent;
	import flash.events.DatagramSocketDataEvent;
	import flash.events.TimerEvent;
	import flash.geom.Point;
	import flash.net.DatagramSocket;
	import flash.utils.ByteArray;
	import flash.utils.Timer;
	import ConnectConstants;
	import MessageTypes;
	import Monitor;
	import shared.vo.Explosion;
	import shared.vo.UserInput;
	
	import SimpleMessageEvent;	
	import UserConnectEvent;
	import shared.vo.Asteroid;
	import shared.vo.EndPoint;
	import shared.vo.Bullet;
	import shared.vo.Ship;
	import com.SKOJdk.Tracker;
	/**
	 * ...   /////////////////////////////////// SERVER
	 * @author oscjoh
	 */
	public class SocketCom extends EventDispatcher
	{		
		private var datagramSocket:DatagramSocket;		
		private var SERVER_PORT:int = 19851;		
		private var MONITOR_PORT:int = 19850;
		private var IS_SERVER:Boolean;
		

		public function SocketCom(IS_SERVER:Boolean = true)
		{	
			this.IS_SERVER = IS_SERVER;
			//Create the socket
			datagramSocket = new DatagramSocket();
			datagramSocket.addEventListener( DatagramSocketDataEvent.DATA, dataReceived );

			//Bind the socket to the local network interface and port
			
			if(IS_SERVER){
				datagramSocket.bind( SERVER_PORT );
			}else {
				datagramSocket.bind( MONITOR_PORT );
			}
			
			datagramSocket.receive();
		}
		
		private function dataReceived( event:DatagramSocketDataEvent ):void
		{
			var mType:int = event.data.readByte();
			
			//Tracker.track(" data recieved  " + mType);
			
			switch(mType) {				
				case MessageTypes.simple:
					handleSimpleMessage(event);
				break;				
				case MessageTypes.complex:
					handleComplexMessage(event);
				break;				
				case MessageTypes.controller:
					handleControllerMessage(event);
				case MessageTypes.controllerConnect:
					handeControllerConnect(event);
				break;
			}
		}
		
		private function handeControllerConnect(event:DatagramSocketDataEvent):void
		{
			
			//var typeLen:int = event.data.readByte();
			//var type:String = event.data.readUTFBytes(typeLen);
			//var nameLen:int = event.data.readByte();
			//var name:String = event.data.readUTFBytes(nameLen);						
			var name:String = event.data.readUTFBytes(event.data.bytesAvailable);						
			
			//Tracker.track(" controller connect");
			
			//dispatchEvent(new SimpleMessageEvent(name, event.srcAddress));
			dispatchEvent(new UserConnectEvent("type", name, event.srcAddress));
		}
		
		private function handleControllerMessage(event:DatagramSocketDataEvent):void
		{
			var ba:ByteArray = event.data;
			
			var userInput:UserInput = new UserInput();
			userInput.left = ba.readBoolean();
			userInput.right = ba.readBoolean();
			userInput.shoot = ba.readBoolean();
			userInput.thrust = ba.readBoolean();
			var nameLen:uint = ba.readByte();
			userInput.name = ba.readUTFBytes(nameLen);
			userInput.color = ba.readInt();
			userInput.ip = event.srcAddress;
			
			//Tracker.track("color : " + userInput.color);
			
			//Tracker.track(" user name : " + userInput.name);
			
			dispatchEvent(new UserInputEvent(userInput,event.srcAddress));
		}	
		
		
		private function handleComplexMessage(event:DatagramSocketDataEvent):void
		{
			var ba:ByteArray = event.data;
			
			var complexMessage:ComplexMessage = new ComplexMessage();
			
			var numShips:uint = ba.readByte();
			for (var i:uint = 0; i < numShips; i++) {
				var ship:Ship = new Ship();

				ship.color = ba.readUnsignedInt();
				
				var nameLen:uint = ba.readByte();				
				ship.name = ba.readUTFBytes(nameLen);				
				
				ship.pos = new Point(ba.readShort(), ba.readShort());
				
				ship.rot = ba.readShort();
				
				ship.vel = new Point(ba.readFloat(), ba.readFloat());	
				
				ship.score = ba.readInt();
				
				var numBullets:uint = ba.readByte();
				for (var b:uint = 0; b < numBullets; b++) {
					var bullet:Bullet = new Bullet();
					//bullet.color = ba.readUnsignedInt();
					bullet.pos = new Point(ba.readShort(), ba.readShort());
					bullet.vel = new Point(ba.readFloat(), ba.readFloat());
					
					bullet.direction = ba.readByte();
					//complexMessage.bullets.push(bullet);
					ship.bullets.push(bullet);
				}				
				complexMessage.ships.push(ship);
			}
			
			var numAsteroids:uint = ba.readByte();
			for (var a:uint = 0; a <  numAsteroids; a++) {
				var asteroid:Asteroid = new Asteroid();
				asteroid.diam = ba.readShort();
				asteroid.pos = new Point(ba.readShort(), ba.readShort());
				asteroid.vel = new Point(ba.readFloat(), ba.readFloat());	
				complexMessage.asteroids.push(asteroid);
			}
			
			//var numBullets:uint = ba.readByte();
			//for (var b:uint = 0; b < numBullets; b++) {
				//var bullet:Bullet = new Bullet();
				//bullet.color = ba.readUnsignedInt();
				//bullet.pos = new Point(ba.readShort(), ba.readShort());
				//bullet.vel = new Point(ba.readFloat(), ba.readFloat());
				//
				//bullet.direction = ba.readByte();
				//complexMessage.bullets.push(bullet);
			//}
			var numExplosions:uint = ba.readByte();
			for (var e:uint = 0; e < numExplosions; e++) {
				var explosion:Explosion = new Explosion();
				explosion.pos = new Point(ba.readShort(), ba.readShort());
				explosion.size = ba.readShort();
				complexMessage.explosions.push(explosion);
			}
			
			dispatchEvent(new ComplexMessageEvent(complexMessage,event.srcAddress));
		
		}
		
		private function handleSimpleMessage(event:DatagramSocketDataEvent):void
		{		
			var message:String = event.data.readUTFBytes(event.data.bytesAvailable);			
			dispatchEvent(new SimpleMessageEvent(message, event.srcAddress));
		}
		
		public function sendComplexMessage(complexMessage:ComplexMessage, ips:Array):void {			
			var ba:ByteArray = new ByteArray();
			
			//Tracker.track("sendComplexMessage ");
			
			ba.writeByte(MessageTypes.complex);
			
			ba.writeByte(complexMessage.ships.length);
			
			var numShips:uint = complexMessage.ships.length;
			for (var i:uint = 0; i < numShips; i++) {
				var ship:Ship = complexMessage.ships[i];
				
				ba.writeUnsignedInt(ship.color);
				
				ba.writeByte(ship.name.length);
				ba.writeUTFBytes(ship.name);
				
				ba.writeShort(ship.pos.x);
				ba.writeShort(ship.pos.y);
				
				ba.writeShort(ship.rot);
				
				ba.writeFloat(ship.vel.x);
				ba.writeFloat(ship.vel.y);
				ba.writeInt(ship.score);
				
				ba.writeByte(ship.bullets.length);
				var numBullets:uint = ship.bullets.length;
				for (var b:uint = 0; b < numBullets; b++) {
					var bullet:Bullet = ship.bullets[b];										
					ba.writeShort(bullet.pos.x);
					ba.writeShort(bullet.pos.y);					
					ba.writeFloat(bullet.vel.x);
					ba.writeFloat(bullet.vel.y);
					ba.writeByte(bullet.direction);				
				}
				
			}
			
			ba.writeByte(complexMessage.asteroids.length);
			var numAsteroids:uint = complexMessage.asteroids.length;
			for (var a:uint = 0; a < numAsteroids; a++) {
				var asteroid:Asteroid = complexMessage.asteroids[a];
				ba.writeShort(asteroid.diam);
				
				ba.writeShort(asteroid.pos.x);
				ba.writeShort(asteroid.pos.y);
				
				ba.writeFloat(asteroid.vel.x);
				ba.writeFloat(asteroid.vel.y);
			}
			//
			//ba.writeByte(complexMessage.bullets.length);
			//var numBullets:uint = complexMessage.bullets.length;
			//for (var b:uint = 0; b < numBullets; b++) {
				//var bullet:Bullet = complexMessage.bullets[b];
				//ba.writeUnsignedInt(bullet.color);
				//
				//ba.writeShort(bullet.pos.x);
				//ba.writeShort(bullet.pos.y);
				//
				//ba.writeFloat(bullet.vel.x);
				//ba.writeFloat(bullet.vel.y);
				//ba.writeByte(bullet.direction);				
			//}
			
			ba.writeByte(complexMessage.explosions.length);			
			var numExplosions:uint = complexMessage.explosions.length;
			for (var e:uint = 0; e < numExplosions; e++) {
				var explosion:Explosion = complexMessage.explosions[e];
				ba.writeShort(explosion.pos.x);
				ba.writeShort(explosion.pos.y);
				ba.writeShort(explosion.size);
			}
			//trace("_____________");
			//trace(Base64.encode(ba));
			Tracker.trackProperty("message size bytes: " + ba.length, 10);
			
			var ipLen:uint = ips.length;
			for (var m:uint = 0; m < ipLen; m++) {
				var ip:String = ips[m];
				if (IS_SERVER) {
					datagramSocket.send( ba, 0, 0, ip, MONITOR_PORT); 
				}else {
					datagramSocket.send( ba, 0, 0, ip, SERVER_PORT); 
				}				
			}			
		}
		
		public function sendSimpleMessage(simpleMessage:String, ip:String):void {
			
			var ba:ByteArray = new ByteArray();
			ba.writeByte(MessageTypes.simple);
			ba.writeUTFBytes(simpleMessage);
			
			if (IS_SERVER) {
				datagramSocket.send( ba, 0, 0, ip, MONITOR_PORT); 
			}else {
				datagramSocket.send( ba, 0, 0, ip, SERVER_PORT); 
			}			
		}		
		
		public function sendControllerMessage(simpleControllerMessage:int, ip:String):void {
			
			var ba:ByteArray = new ByteArray();
			//ba.writeByte(MessageTypes.simple);
			ba.writeInt(simpleControllerMessage);
			
			if (IS_SERVER) {
				datagramSocket.send( ba, 0, 0, ip, MONITOR_PORT); 
			}else {
				datagramSocket.send( ba, 0, 0, ip, SERVER_PORT); 
			}			
		}	
	}	
}