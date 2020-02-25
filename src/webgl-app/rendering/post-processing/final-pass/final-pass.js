import { Scene, Mesh, ShaderMaterial, Vector2, UniformsUtils, WebGLRenderTarget } from 'three';
import { vertexShader, fragmentShader } from './shader.glsl';
import { getRenderBufferSize } from '../../resize';
import { uniforms as filmUniforms, guiControls as filmGuiControls } from '../passes/film.glsl';
import renderer from '../../renderer';

export default class FinalPass {
  constructor(gui, geometry, camera) {
    this.gui = gui.addFolder('final pass');
    this.gui.open();
    this.scene = new Scene();
    this.camera = camera;
    const { width, height } = getRenderBufferSize();
    const material = new ShaderMaterial({
      uniforms: UniformsUtils.merge([
        {
          time: {
            value: 0
          },
          texture: {
            value: null
          },
          resolution: {
            value: new Vector2(width, height)
          }
        },
        filmUniforms
      ]),
      vertexShader,
      fragmentShader
    });

    // Film
    filmGuiControls(this.gui, material);

    this.mesh = new Mesh(geometry, material);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
    this.scene.add(this.mesh);
  }

  resize(width: Number, height: Number) {
    this.mesh.material.uniforms.resolution.value.x = width;
    this.mesh.material.uniforms.resolution.value.y = height;
  }

  render(scene, renderTarget: WebGLRenderTarget, delta: Number) {
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene.scene, scene.camera);
    renderer.setRenderTarget(null);
    this.mesh.material.uniforms.texture.value = renderTarget.texture;
    this.mesh.material.uniforms.time.value += delta;
    renderer.render(this.scene, this.camera);
  }
}
