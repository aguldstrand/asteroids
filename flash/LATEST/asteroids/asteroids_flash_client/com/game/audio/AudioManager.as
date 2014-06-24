package com.game.audio 
{
	import flash.events.Event;
	import flash.geom.Point;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.media.SoundTransform;
	import flash.utils.Dictionary;	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class AudioManager  
	{
		public static var TYPE_EXPLOSION:int = 0;
		
		private var sounds:Dictionary;
		private var soundIDs:Array;
		private var SW:int = 1200;
		
		public function AudioManager() {
			sounds = new Dictionary();
			soundIDs = new Array();
		}
		
		
		public function addSound(type:int, pos:Point, size:int) {
			
			if (sounds[pos.x] == null) {				
				sounds[pos.x]  = type;
				soundIDs.push(pos.x);
				var explosion:Esound = new Esound();
				
				var pan:Number = ((pos.x - SW * .5) / (SW*.5) );
								
				var soundTransform:SoundTransform = new SoundTransform((size / 40), pan);				
				
				var soundChannel:SoundChannel = new SoundChannel();
				
				soundChannel = explosion.play();
				soundChannel.soundTransform = soundTransform;				
				
				soundChannel.addEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);
			}			
		}
		
		private function soundCompleteHandler(e:Event):void {
			delete sounds[soundIDs.shift()];			
		}
	}
	
}