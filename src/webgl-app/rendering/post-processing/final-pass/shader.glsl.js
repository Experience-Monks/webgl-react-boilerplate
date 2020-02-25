import { fragmentUniforms as filmFragmentUniforms,
         fragmentMain as filmFragmentMain }
         from '../passes/film.glsl';

export const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform vec2 resolution;
  uniform float time;
  uniform sampler2D texture;
  ${filmFragmentUniforms}
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 outgoingColor = texture2D(texture, uv);
    ${filmFragmentMain}
    gl_FragColor.rgb = outgoingColor.rgb;
    gl_FragColor.a = outgoingColor.a;
    // gl_FragColor = vec4(uv, 1.0, 1.0);
  }
`;
