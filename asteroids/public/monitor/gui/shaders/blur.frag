precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec2 u_textureresolution;

uniform vec2 u_direction;

// const int c_kernelsize = 5;
const int c_kernelsize = 3;


void main(void) {
  vec2 texcoord = vec2(v_texcoord.s, -v_texcoord.t);
  vec2 direction = u_direction / u_textureresolution;

  float c_weights[c_kernelsize];
  c_weights[0] = 0.2270270270;
  c_weights[1] = 0.3162162162;
  c_weights[2] = 0.0702702703;

  float c_offset[c_kernelsize];
  c_offset[0] = 0.0;
  c_offset[1] = 1.3846153846;
  c_offset[2] = 3.2307692308;


  vec4 color = texture2D(u_texture, texcoord) * c_weights[0];

  for (int i = 1; i < c_kernelsize; i++) {
    float sample = c_offset[i];
    color += texture2D(u_texture, texcoord + (direction * vec2(sample, sample))) * c_weights[i];
    color += texture2D(u_texture, texcoord - (direction * vec2(sample, sample))) * c_weights[i];
  }

  gl_FragColor = vec4(color.rgb, 1.0);
}