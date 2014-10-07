attribute vec2 a_position;
attribute vec2 a_texcoord;

uniform vec2 u_resolution;
uniform vec2 u_position;
uniform vec2 u_scale;

varying vec2 v_texcoord;

void main(void){
	vec2 scaled = a_position * u_scale;
	vec2 translated = scaled + u_position;
	vec2 zeroToOne = translated / u_resolution;
	vec2 zeroToTwo = zeroToOne * 2.0;
	vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(vec2(clipSpace.x, -clipSpace.y), 0, 1);

  v_texcoord = a_texcoord;
}