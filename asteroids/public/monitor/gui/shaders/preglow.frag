precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;

const float c_luminanceEpsilon = 0.2;

void main(void) {
  vec4 color = texture2D(u_texture, vec2(v_texcoord.s, -v_texcoord.t));

  float luminance = (color.r * 0.2126) + (color.g * 0.7152) + (color.b * 0.0722);

  if (luminance > c_luminanceEpsilon) {
    gl_FragColor = vec4(color.rgb, min(luminance * 2.0, 1.0));
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
}