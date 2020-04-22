export const vertexShader = `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  void main() {
    vNormal = normal;
    vWorldPosition = -(modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform float fresnelPow;
  uniform vec2 resolution;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  uniform sampler2D particleMap;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 texel = texture2D(particleMap, uv).rgb;

    vec3 normal = normalize( vNormal );
    // normal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );

    vec3 eye = cameraPosition - vWorldPosition.xyz;

    float cosTheta = abs(dot(normalize(eye), normal));
    float fresnel = pow(cosTheta, fresnelPow);

    vec3 glass = vec3(fresnel);


    gl_FragColor = vec4(mix(texel, glass, 0.25), 1.0);
  }
`;
