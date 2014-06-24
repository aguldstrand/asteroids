package com.model
{
	import shared.vo.UserInput;
	/**
	 * ...
	 * @author oscjoh
	 */
	public class Model 
	{
		private var _userInput:UserInput;
		

		
		private static var instance:Model;
		private static var allowInstantiation:Boolean;
		
		public function Model() {
		   if (!allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use GameModel.getInstance() instead of new.");			
          }
		  init();
		}
		
		private function init():void
		{
			trace("MODEL INIT ");
			_userInput = new UserInput();
		}
		public static function getInstance():Model {
         if (instance == null) {
            allowInstantiation = true;
            instance = new Model();			
            allowInstantiation = false;
          }		  
		  return instance;
       }   
	   
	   public function get userInput():UserInput { return _userInput; }
	   
	   public function set userInput(value:UserInput):void 
	   {
		   _userInput = value;
	   }
	   

	}	
}