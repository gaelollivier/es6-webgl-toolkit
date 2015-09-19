precision mediump float;

varying vec2 position;

uniform float time;

void main() {
    vec3 color = vec3(1.0, 0.0, 0.0);

	gl_FragColor = vec4(color, 1.0);
}
