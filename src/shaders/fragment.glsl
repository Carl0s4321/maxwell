uniform sampler2D uTexture;
uniform sampler2D uDisp;
uniform float uSpeed;
uniform float uDir;
varying vec2 vUv;

void main() {
	// vUv calc for distort scaling
	vec4 distortion = texture2D(uDisp, (vUv - vec2(.5) * (1. + uSpeed) + vec2(.5)));

	// distort on the edges then lower on the center
	float force = pow(abs(vUv.x) + 0.5, abs(uSpeed));
	vec2 newUv = vUv * cos(1. - force);

	// 0.7 for the fading opacity
	gl_FragColor = (0.05 + 1.25 * uSpeed) * texture2D(uTexture, newUv + distortion.xy * 0.02 + vec2(0., -0.03));

}