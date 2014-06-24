package com.service
{
		import flash.events.DatagramSocketDataEvent;
		import flash.net.DatagramSocket;
		import flash.utils.ByteArray;
		import com.model.Model;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class ControllerService 
	{
		private var _ip:String;
		private var _name:String;
		private var _color:String;
		
		private var datagramSocket:DatagramSocket;		
		private var CONTROLLER_PORT:int = 19851;
		public function ControllerService() {
			datagramSocket = new DatagramSocket();
			datagramSocket.bind( CONTROLLER_PORT );
			datagramSocket.receive();
		}
		
		public function get color():String { return _color; }
		
		public function set color(value:String):void 
		{
			_color = value;
		}
		
		public function get name():String { return _name; }
		
		public function set name(value:String):void 
		{
			_name = value;
		}
		
		public function get ip():String { return _ip; }
		
		public function set ip(value:String):void 
		{
			_ip = value;
		}
		

		
		public function send() {
			var ba:ByteArray = new ByteArray();
			ba.writeByte(2);
			ba.writeBoolean(Model.getInstance().userInput.left);
			ba.writeBoolean(Model.getInstance().userInput.right);
			ba.writeBoolean(Model.getInstance().userInput.shoot);
			ba.writeBoolean(Model.getInstance().userInput.thrust);
			var nameLen:uint = Model.getInstance().userInput.name.length;
			ba.writeByte(nameLen);
			ba.writeUTFBytes(Model.getInstance().userInput.name);
			ba.writeUnsignedInt(Model.getInstance().userInput.color);
			//ba.writeUnsignedInt(0xFFFF00);
			
			datagramSocket.send( ba, 0, 0, Model.getInstance().userInput.ip, CONTROLLER_PORT); 
			//trace(">"+Model.getInstance().userInput.ip+"<");
			
			
			//keep alive 
			keepAlive();
			
			
		}
		
		public function keepAlive():void
		{
			var ba:ByteArray = new ByteArray();
			ba.writeByte(3);
			ba.writeUTFBytes(Model.getInstance().userInput.name);
			datagramSocket.send( ba, 0, 0, Model.getInstance().userInput.ip, CONTROLLER_PORT); 
		}
		
		
		
		
	}
	
}