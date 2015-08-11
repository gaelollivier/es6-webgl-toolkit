precision mediump float;

attribute vec3 vertexPosition;

varying vec2 position;

void main() {
	position = vec2(vertexPosition.xy) * 0.5 + 0.5;
	gl_Position = vec4(vertexPosition, 1.0);
}