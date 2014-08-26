attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_position;

uniform vec2 u_camera;

uniform float u_scale;
uniform float u_rotation;

void main() {
  vec2 scaled = a_position * u_scale;
  vec2 rotated = vec2(scaled.x * cos(u_rotation) - scaled.y * sin(u_rotation), scaled.x * sin(u_rotation) + scaled.y * cos(u_rotation));
  vec2 translated = rotated + u_position - u_camera;
  vec2 clipSpace = (translated / u_resolution) * 2.0 - 1.0;

  gl_Position = vec4(vec2(clipSpace.x, -clipSpace.y), 0, 1);
}