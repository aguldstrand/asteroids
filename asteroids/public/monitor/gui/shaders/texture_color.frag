precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec4 u_color;

void main(void) {
  vec4 texcolor = texture2D(u_texture, vec2(v_texcoord.s, -v_texcoord.t));

  gl_FragColor = u_color * texcolor;
}