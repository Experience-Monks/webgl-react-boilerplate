import { simplexNoise3D } from '../../../../shaders/noise.glsl';

export default {
  uniforms: {
    time: { value: 0 }
  },
  vertexShader: {
    uniforms: `
      uniform float time;
      varying vec3 vNormal;
    `,
    functions: `
      ${simplexNoise3D}
    `,
    preTransform: ``,
    postTransform: `
      float speed = time * 0.5;
      float noise = simplexNoise3D(position.xyz * 0.75 + speed) * 0.15;
      transformed = normal * noise;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position + transformed, 1.0);
      vNormal = normal;
    `
  },
  fragmentShader: {
    uniforms: `
      varying vec3 vNormal;
    `,
    functions: ``,
    preFragColor: `
      vec3 normal = normalize(vNormal);
      normal.b = 1.0;
      outgoingLight *= (normal * 0.5 + 0.5);
    `,
    postFragColor: `
      gl_FragColor.a = opacity;
    `
  }
};
