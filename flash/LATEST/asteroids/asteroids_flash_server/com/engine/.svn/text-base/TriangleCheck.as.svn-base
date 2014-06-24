package com.engine
{
	
	import flash.geom.Point;
	
	/**
	 * ...
	 * @author oscjoh
	 */
	public class TriangleCheck 
	{
		public static function check(t1:Point,t2:Point,t3:Point,point:Point):Boolean
		{
		  var invDenom:Number = new Number;
		  var u:Number = new Number;
		  var v:Number = new Number;
		  var dot00:Number = new Number;
		  var dot01:Number = new Number;
		  var dot02:Number = new Number;
		  var dot11:Number = new Number;
		  var dot12:Number = new Number;
		  var v0:Array = new Array(2);
		  var v1:Array = new Array(2);
		  var v2:Array = new Array(2);

		  // Compute vectors
		  v0[0] = t3.x - t1.x;
		  v1[0] = t2.x - t1.x;
		  v2[0] = point.x - t1.x;
		  v0[1] = t3.y - t1.y;
		  v1[1] = t2.y - t1.y;
		  v2[1] = point.y - t1.y;

		  // Compute dot products
		  dot00 = dot(v0, v0);
		  dot01 = dot(v0, v1);
		  dot02 = dot(v0, v2);
		  dot11 = dot(v1, v1);
		  dot12 = dot(v1, v2);

		  // Compute barycentric coordinates
		  invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
		  u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		  v = (dot00 * dot12 - dot01 * dot02) * invDenom;

		  // Check if point is in triangle
		  return (u > 0) && (v > 0) && (u + v < 1);
		}
		private static function dot(vect1:Array, vect2:Array) : Number
		{
		  return(vect1[0]*vect2[0] + vect1[1]*vect2[1]);
		}
	}
	
}