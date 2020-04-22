export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform vec3 color0;
  uniform vec3 color1;
  uniform float strength;
  uniform float powStrength;
  varying vec2 vUv;

  void main() {
    float y = distance(vec2(0.5), vec2(0.5, vUv.y)) * strength;
    y = pow(y, powStrength);
    vec3 color = mix(color0, color1, y);
    gl_FragColor = vec4(color, 1.0);
  }
`;
