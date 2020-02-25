export const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D texture0;
  uniform sampler2D texture1;
  uniform float transition;
  uniform vec2 resolution;
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 texel0 = texture2D(texture0, uv);
    vec4 texel1 = texture2D(texture1, uv);
    gl_FragColor = mix(texel0, texel1, transition);
  }
`;
