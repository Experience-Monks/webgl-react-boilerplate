import { UniformsUtils } from 'three';

const hooks = {
  vertex: {
    preTransform: 'before:#include <begin_vertex>\n',
    postTransform: 'after:#include <project_vertex>\n',
    preNormal: 'before:#include <beginnormal_vertex>\n'
  },
  fragment: {
    preFragColor: 'before:gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n',
    postFragColor: 'after:gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n',
    postNormal: 'after:#include <normal_fragment>\n',
    postFragFog: 'after:#include <fog_fragment>\n'
  }
};

function replace(shader: string, hooks: Object, config: Object) {
  Object.keys(hooks).forEach((hook: string) => {
    if (config[hook]) {
      const parts = hooks[hook].split(':');
      const line = parts[1];
      switch (parts[0]) {
        case 'after': {
          shader = shader.replace(
            line,
            `${line}
            ${config[hook]}`
          );
          break;
        }
        default: {
          // before
          shader = shader.replace(
            line,
            `${config[hook]}
            ${line}`
          );
          break;
        }
      }
    }
  });
  return shader;
}

/**
 * The material modifier injects custom shader code and uniforms
 * to three's built in materials
 *
 * @export
 * @param {Object} shader
 * @param {Object} config
 * @returns
 */
export default function materialModifier(shader: Object, config: Object) {
  shader.uniforms = UniformsUtils.merge([shader.uniforms, config.uniforms]);

  shader.vertexShader = `
    ${config.vertexShader.uniforms}
    ${config.vertexShader.functions}
    ${shader.vertexShader}
  `;
  shader.fragmentShader = `
    ${config.fragmentShader.uniforms}
    ${config.fragmentShader.functions}
    ${shader.fragmentShader}
  `;

  // Injection
  shader.vertexShader = replace(shader.vertexShader, hooks.vertex, config.vertexShader);
  shader.fragmentShader = replace(shader.fragmentShader, hooks.fragment, config.fragmentShader);

  return shader;
}
