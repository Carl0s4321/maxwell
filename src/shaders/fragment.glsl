uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
	gl_FragColor = texture2D(uTexture,vUv + vec2(0., -0.01));
}