export const vertexShader = `
  attribute float size; // Per particle size attribute
  uniform float particleSize; // Uniform particle size (affects all)
  varying vec3 vPosition; // Vertex position for fragment shader

  void main() {
    // Model view position
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Scale point size based on distance
    gl_PointSize = size * (particleSize / length(mvPosition.xyz));
    // Screen space projection
    gl_Position = projectionMatrix * mvPosition;
    // Set position varying
    vPosition = position;
  }
`;

export const fragmentShader = `
  uniform vec3 lightDirection;
  uniform sampler2D normalMap;
  varying vec3 vPosition;

  // Signed distance function for 2D circle
  float circle(vec2 uv, vec2 pos, float rad) {
    float d = length(pos - uv) - rad;
    return step(d, 0.0);
  }

  void main() {
    float c = circle(vec2(0.5), gl_PointCoord.xy, 0.5);
    // Discard any pixels outside of circle
    if (c == 0.0) discard;

    vec4 outgoingColor = vec4(1.0);

    // Sample normal from texture, y coords are inverted from render target
    vec3 normal = texture2D(normalMap, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y)).rgb * 2.0 - 1.0;
    // Second normal based on spherical particle position
    vec3 normal2 = normalize(vPosition);

    // Half lambert lighting model
    float intensity = max(0.2, dot(normal, lightDirection) * 0.5 + 0.5);
    float intensty2 = max(0.5, dot(normal2, lightDirection) * 0.5 + 0.5);

    // Base color on normal
    normal2.b = 1.0;
    vec3 color = vec3(normal2 * 0.5 + 0.5);

    // Apply lambert intensity
    color *= intensity;
    color *= intensty2;

    // Set outgoing color
    outgoingColor.rgb = color;

    gl_FragColor = outgoingColor;
  }
`;
