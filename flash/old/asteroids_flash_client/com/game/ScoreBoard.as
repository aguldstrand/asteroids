package com.game
{
	import flash.display.Sprite;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class ScoreBoard extends Sprite 
	{
		private var boards:Array;
		private var numBoards:int;
		private var shipLen:int;
		
		public function ScoreBoard() {
				boards = new Array();
				numBoards = 0;
		}
		
		public function draw(ships:Array) {
			shipLen = ships.length;
			
			if (numBoards != shipLen) {
				adjustNumBoards();
			}
			
			for (var i:uint = 0; i < shipLen; i++) {
				var board:Board = boards[i];
				board.update(ships[i]);
			}
			
		}
		
		private function adjustNumBoards():void
		{
			if(shipLen != numBoards){
				if (shipLen > numBoards) {
					createBoards();
				}else {
					removeBoards();
				}
			}
			
		}
		
		private function createBoards():void
		{
			var board:Board = new Board();
			addChild(board);
			boards.push(board);
			board.x = numBoards * 150 + 10;
			numBoards = boards.length;
		}
		
		private function removeBoards():void
		{
			removeChild(boards.pop());
			numBoards = boards.length;
		}
	}
	
}