precision mediump float;

varying vec2 position;
varying vec3 color;

void main() {
	gl_FragColor = vec4(color, 1.0);
}
