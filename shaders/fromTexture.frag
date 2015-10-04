precision mediump float;

varying vec2 position;

uniform float time;
uniform sampler2D texture;

void main() {
    vec3 color = texture2D(texture, position).rgb;

    gl_FragColor = vec4(color, 1.0);
}
