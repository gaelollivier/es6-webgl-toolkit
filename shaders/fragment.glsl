precision mediump float;

varying vec2 position;

void main() {
	gl_FragColor = vec4(position.x, 0.0, 0.0, 1.0);
}