attribute vec2 a_position;

uniform mat4 u_wvp;

void main() {
  gl_Position = vec4(a_position, 0, 1) * u_wvp;
}