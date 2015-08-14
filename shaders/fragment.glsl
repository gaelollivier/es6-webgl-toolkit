precision mediump float;

varying vec2 position;

uniform float time;

void main() {
    vec3 color = vec3(1.0);

    float distToCenter = length(position - vec2(0.5, 0.5));
    color *= sin(distToCenter * 20.0 - time * 10.0);

	gl_FragColor = vec4(color, 1.0);
}
