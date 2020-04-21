import {
  Scene,
  Mesh,
  ShaderMaterial,
  Vector2,
  UniformsUtils,
  WebGLRenderTarget,
  BufferGeometry,
  OrthographicCamera,
  PerspectiveCamera
} from 'three';
import { GUI } from 'dat.gui';
import { vertexShader, fragmentShader } from './shader.glsl';
import { getRenderBufferSize } from '../../../resize';
import { uniforms as filmUniforms, guiControls as filmGuiControls } from '../../passes/film.glsl';
import { uniforms as fxaaUniforms, guiControls as fxaaGuiControls } from '../../passes/fxaa.glsl';
import renderer from '../../../renderer';

/**
 * The final pass contains the post fx and is then output to the screen
 *
 * @export
 * @class FinalPass
 */
export default class FinalPass {
  gui: GUI;
  scene: Scene;
  camera: OrthographicCamera;
  mesh: Mesh;

  constructor(gui: GUI, geometry: BufferGeometry, camera: OrthographicCamera) {
    // Create gui
    this.gui = gui.addFolder('final pass');
    this.gui.open();
    // Create scene
    this.scene = new Scene();
    // Use camera from post processing
    this.camera = camera;
    const { width, height } = getRenderBufferSize();
    // Setup shader and combine uniforms from any post fx you want to include
    const material = new ShaderMaterial({
      uniforms: UniformsUtils.merge([
        {
          time: {
            value: 0
          },
          tDiffuse: {
            // Keep it the same as threejs for reusability
            value: null
          },
          resolution: {
            value: new Vector2(width, height)
          }
        },
        fxaaUniforms,
        filmUniforms
      ]),
      vertexShader,
      fragmentShader
    });

    // Add gui controls
    fxaaGuiControls(this.gui, material);
    filmGuiControls(this.gui, material);

    // Create the mesh and turn off matrixAutoUpdate
    this.mesh = new Mesh(geometry, material);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
    this.scene.add(this.mesh);
  }

  /**
   * Resize handler, update uniforms
   *
   * @param {Number} width
   * @param {Number} height
   * @memberof FinalPass
   */
  resize(width: number, height: number) {
    this.mesh.material.uniforms.resolution.value.x = width;
    this.mesh.material.uniforms.resolution.value.y = height;
    this.mesh.material.uniforms.fxaaResolution.value.x = 1 / width;
    this.mesh.material.uniforms.fxaaResolution.value.y = 1 / height;
  }

  /**
   * Render the pass and output to screen
   *
   * @param {*} scene
   * @param {WebGLRenderTarget} renderTarget
   * @param {Number} delta
   * @memberof FinalPass
   */
  render(scene: Scene, renderTarget: WebGLRenderTarget, delta: number) {
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene.scene, scene.camera);
    renderer.setRenderTarget(null);
    this.mesh.material.uniforms.tDiffuse.value = renderTarget.texture;
    this.mesh.material.uniforms.time.value += delta;
    renderer.render(this.scene, this.camera);
  }

  /**
   * Render the final pass when used with the screenshot utility
   *
   * @param {Scene} scene
   * @param {PerspectiveCamera} camera
   * @param {WebGLRenderTarget} renderTargetA
   * @param {WebGLRenderTarget} renderTargetB
   * @param {number} delta
   * @memberof FinalPass
   */
  screenshotRender(
    scene: Scene,
    camera: PerspectiveCamera,
    renderTargetA: WebGLRenderTarget,
    renderTargetB: WebGLRenderTarget,
    delta: number
  ) {
    this.mesh.material.uniforms.tDiffuse.value = renderTargetA.texture;
    this.mesh.material.uniforms.time.value += delta;
    renderer.setRenderTarget(renderTargetB);
    renderer.render(this.scene, this.camera);
  }
}
