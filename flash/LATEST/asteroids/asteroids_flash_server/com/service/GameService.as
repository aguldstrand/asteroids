package com.service
{
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.utils.Dictionary;
	import flash.utils.Timer;
	import shared.SocketCom;
	import ComplexMessageEvent;
	import shared.vo.Ship;
	import shared.vo.UserInput;
	import SimpleMessageEvent;
	import shared.SimpleMessageTypes;
	import com.model.GameModel;
	import com.SKOJdk.Tracker;
	import com.utils.Counter;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class GameService 
	{
		private var socketCom:SocketCom;		
		private var monitors:Dictionary;
		private var players:Dictionary;
		
		
		
		public function GameService() {
			
		
			
			
			players = new Dictionary();
			monitors = new Dictionary();
			
			socketCom = new SocketCom(true);
			socketCom.addEventListener(ComplexMessageEvent.CONTROL_TYPE, complexMessageHandler);
			socketCom.addEventListener(SimpleMessageEvent.CONTROL_TYPE, simpleMessageHandler);
			socketCom.addEventListener(UserInputEvent.CONTROL_TYPE, userInputHandler);
			socketCom.addEventListener(UserConnectEvent.CONTROL_TYPE, userConnectHandler);
			
			var timer:Timer = new Timer(6000);
			timer.addEventListener(TimerEvent.TIMER, timerHandler);
			timer.start();
			
		}
		
		private function userConnectHandler(e:UserConnectEvent):void 
		{
			players[e.ip] = e.ip;			
		}
		
		private function userInputHandler(e:UserInputEvent):void 
		{
			
			
			var userInput:UserInput = new UserInput();
			if (GameModel.getInstance().userInputs[e.message.name] == null) {
				Tracker.track(" CONTROLLER CONNECTED : " + e.message.name + " :"  +e.message.ip );
				var ship:Ship = new Ship();
				ship.name = e.message.name;
				ship.pos.x = 500;
				ship.pos.y = 500;
				ship.color = e.message.color;
				GameModel.getInstance().ships.push(ship);
			}
			players[e.message.ip] = e.message.ip;
			GameModel.getInstance().userInputs[e.message.name] = userInput;
			userInput.left = e.message.left;
			userInput.right = e.message.right;
			userInput.thrust = e.message.thrust;
			userInput.shoot = e.message.shoot;
			userInput.name = e.message.name;
			userInput.ip = e.message.ip;
		}
		
		private function timerHandler(e:TimerEvent):void 
		{
			kickPlayers();
			kickClients();
			clearClients();
			clearPlayers();
		}
		
		public function sendComplexMessage():void {
			var complexMessage:ComplexMessage = new ComplexMessage();
			complexMessage.ships = GameModel.getInstance().ships;
			complexMessage.asteroids = GameModel.getInstance().asteroids;
			//complexMessage.bullets = GameModel.getInstance().bullets;
			complexMessage.explosions = GameModel.getInstance().explosions;
			socketCom.sendComplexMessage(complexMessage,GameModel.getInstance().monitors);
			
		}
		
		private function complexMessageHandler(e:ComplexMessageEvent):void 
		{
			
		}
		
		private function simpleMessageHandler(e:SimpleMessageEvent):void 
		{
			switch(e.message) {
				case SimpleMessageTypes.connectView:
					handleConnectView(e);
				break;	
			}
		}
		
		public function sendControllerMessages():void {
			
			for (var i:String in GameModel.getInstance().userInputs) {			
				var userInput:UserInput = GameModel.getInstance().userInputs[i];
					
				if(userInput.shake){ 
					socketCom.sendControllerMessage(1, userInput.ip);
				}else {
					socketCom.sendControllerMessage(0, userInput.ip);
				}
				//trace(" sending controller message ");
			}
			
			
		}
		

		
		private function handleConnectView(e:SimpleMessageEvent):void
		{
			
			socketCom.sendSimpleMessage(SimpleMessageTypes.viewConnected, e.ip);
			
			monitors[e.ip] = e.ip;
			
			if (GameModel.getInstance().monitors.indexOf(e.ip) == -1) {
				GameModel.getInstance().monitors.push(e.ip);
				Tracker.track(" MONITOR CONNECTED : " + e.ip);				
			}
		}
		
		private function clearPlayers():void {
			players = new Dictionary();
		}
		
		private function clearClients():void {
			monitors = new Dictionary();
		}
		
		private function kickPlayers():void {			
			//for each (var value:Object
			//Tracker.track(" kickplayers () ");
			for (var i:String in GameModel.getInstance().userInputs) {
			
				var userInput:UserInput = GameModel.getInstance().userInputs[i];
				//Tracker.track(userInput);
				
				if(userInput != null){
				
					if ( players[userInput.ip] == null) {
						Tracker.track(" CONTROLLER DISCONNECTED : " + userInput.name + " :" + userInput.ip);
						delete GameModel.getInstance().userInputs[userInput.name];
						
						var numShips:uint = GameModel.getInstance().ships.length;
						for (var ss:uint = 0; ss < numShips; ss++) {
							var ship:Ship = GameModel.getInstance().ships[ss];
							if (ship.name == userInput.name) {
								GameModel.getInstance().ships.splice(ss, 1);
								numShips--;
							}
						}							
					}
				}
			}
			
		}
		
		private function kickClients():void {
			for (var i:uint = 0; i < GameModel.getInstance().monitors.length; i++) {
				if ( monitors[GameModel.getInstance().monitors[i]] == undefined) {
					Tracker.track(" MONITOR DISCONNECTED : " + GameModel.getInstance().monitors.splice(i, 1));
				}
			}
		}
	}
	
}