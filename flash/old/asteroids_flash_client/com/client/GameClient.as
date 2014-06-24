package com.client
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	import shared.SocketCom;
	import SimpleMessageEvent;
	import ComplexMessageEvent;
	import shared.SimpleMessageTypes;
	import com.model.GameModel;
	import com.SKOJdk.Tracker;
	import com.utils.Counter;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class GameClient extends EventDispatcher
	{
		//socket class reference
		private var socketCom:SocketCom;
		
		//connection status
		private var connected:Boolean;
		private var oldConnected:Boolean;
				
		private var _____ip:String;
		
		//connection checks
		private var c:Counter;
		private var connectDiff:Counter;
		private var connectDiffLen:uint;
		
		public static var CONNECTION_STATE_CHANGED:String = "com.client.connection_state_changed";
		
		// connection time debugging
		private var forty:uint;
		private var fifty:uint;
		private var sixty:uint;
		private var hundred:uint;
		
		
		public function GameClient(ip:String) {
			
			_____ip = ip; 
			
			c = new Counter();			
			connectDiff = new Counter();
			
			forty = 0;
			fifty = 0;
			sixty = 0;
			hundred = 0;
			
			socketCom = new SocketCom(false);
			socketCom.addEventListener(SimpleMessageEvent.CONTROL_TYPE, simpleMessageHandler);
			socketCom.addEventListener(ComplexMessageEvent.CONTROL_TYPE, complexMessageHandler);
			
			var connectTimer:Timer = new Timer(1800);
			connectTimer.addEventListener(TimerEvent.TIMER, connectHandler);
			connectTimer.start();
		}
		
		private function connectHandler(e:TimerEvent):void {
			connect();
			connectDiffLen = connectDiff.diff();
			updateConnectionStatus();						
		}	
		
		private function connect():void
		{
			if( !connected){  // just to avoid confusion on the Tracker.   it is still sending but this is now used as a keep-alive call.
				Tracker.track(" trying to connect to : " + _____ip);
				
			}
			socketCom.sendSimpleMessage(SimpleMessageTypes.connectView, _____ip);
		}
		
		private function simpleMessageHandler(e:SimpleMessageEvent):void 
		{

		}
		
		private function complexMessageHandler(e:ComplexMessageEvent):void 
		{
			
			connectDiffLen = connectDiff.diff();

			var diff:uint = c.diff();
			if(connected){
				if (diff > 40) {
					forty++;
				}
				if (diff > 50) {
					fifty++;
				}
				if (diff > 60) {
					sixty++;
				}
				if (diff > 100) {
					hundred++;
				}
			}
			
			connected = true;
			updateConnectionStatus();
				
			//Tracker.track("rec. complex : S:" + e.message.ships.length + " A : " + e.message.asteroids.length + " B : " + e.message.bullets.length + " since last : " + diff + " ms");
			GameModel.getInstance().ships = e.message.ships;
			GameModel.getInstance().asteroids = e.message.asteroids;
			GameModel.getInstance().bullets = e.message.bullets;
			GameModel.getInstance().explosions = e.message.explosions;
			
		}
		
		private function updateConnectionStatus():void
		{
			
			Tracker.trackProperty("connected : " + connected, 0);			
			Tracker.trackProperty("forty : " + forty, 1);
			Tracker.trackProperty("fifty : " + fifty, 2);
			Tracker.trackProperty("sixty : " + sixty, 3);
			Tracker.trackProperty("hundred : " + hundred, 4);
						
			if (connectDiffLen> 1000) {
				connected = false;				
			}else {
				connected = true;				
			}
			
			if (oldConnected != connected) {
				dispatchEvent(new Event(CONNECTION_STATE_CHANGED));
			}
			
			oldConnected = connected;
			
			
		}
	}
	
}