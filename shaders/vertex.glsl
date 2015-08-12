precision mediump float;

attribute vec2 vertexPosition;
attribute vec3 vertexColor;

varying vec2 position;
varying vec3 color;

void main() {
	position = vec2(vertexPosition.xy) * 0.5 + 0.5;
    color = vertexColor;
	gl_Position = vec4(vertexPosition, 0.0, 1.0);
}
