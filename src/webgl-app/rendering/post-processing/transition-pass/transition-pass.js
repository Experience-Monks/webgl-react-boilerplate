import { Scene, Mesh, ShaderMaterial, Vector2, BufferGeometry, OrthographicCamera, WebGLRenderTarget } from 'three';
import { TweenLite } from 'gsap';
import { vertexShader, fragmentShader } from './shader.glsl';
import { getRenderBufferSize } from '../../resize';
import renderer from '../../renderer';
import BaseScene from '../../../scenes/base/base-scene';

/**
 * Transition pass handles transitioning between two scenes
 *
 * @export
 * @class TransitionPass
 */
export default class TransitionPass {
  constructor(gui, geometry: BufferGeometry, camera: OrthographicCamera) {
    // Create gui
    this.gui = gui.addFolder('transition pass');
    this.gui.open();
    // Create scene
    this.scene = new Scene();
    this.camera = camera;
    this.active = false;
    const { width, height } = getRenderBufferSize();
    // Setup shader
    const material = new ShaderMaterial({
      uniforms: {
        texture0: {
          value: null
        },
        texture1: {
          value: null
        },
        transition: {
          value: 0
        },
        resolution: {
          value: new Vector2(width, height)
        }
      },
      vertexShader,
      fragmentShader
    });

    // Create the mesh and turn off matrixAutoUpdate
    this.mesh = new Mesh(geometry, material);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
    this.scene.add(this.mesh);

    // Setup gui
    this.gui
      .add(this.mesh.material.uniforms.transition, 'value', 0, 1)
      .onChange((value: Number) => {
        this.active = value !== 0 && value !== 1;
      })
      .name('transition')
      .listen();
  }

  /**
   * Transition activates this pass and blends from sceneA to sceneB
   *
   * @returns
   * @memberof TransitionPass
   */
  transition() {
    return new Promise((resolve, reject) => {
      this.mesh.material.uniforms.transition.value = 0;
      this.active = true;
      TweenLite.killTweensOf(this.mesh.material.uniforms.transition);
      TweenLite.to(this.mesh.material.uniforms.transition, 1, {
        value: 1,
        onComplete: () => {
          this.active = false;
          resolve();
        }
      });
    });
  }

  /**
   * Resize handler
   *
   * @param {Number} width
   * @param {Number} height
   * @memberof TransitionPass
   */
  resize(width: Number, height: Number) {
    this.mesh.material.uniforms.resolution.value.x = width;
    this.mesh.material.uniforms.resolution.value.y = height;
  }

  /**
   * Render both scenes to renderTargetA and renderTargetB
   *
   * @param {BaseScene} sceneA
   * @param {BaseScene} sceneB
   * @param {WebGLRenderTarget} renderTargetA
   * @param {WebGLRenderTarget} renderTargetB
   * @param {Number} delta
   * @memberof TransitionPass
   */
  render(
    sceneA: BaseScene,
    sceneB: BaseScene,
    renderTargetA: WebGLRenderTarget,
    renderTargetB: WebGLRenderTarget,
    delta: Number
  ) {
    sceneA.update(delta);
    sceneB.update(delta);
    renderer.setClearColor(sceneA.clearColor);
    renderer.setRenderTarget(renderTargetA);
    renderer.render(sceneA.scene, sceneA.camera);
    renderer.setClearColor(sceneB.clearColor);
    renderer.setRenderTarget(renderTargetB);
    renderer.render(sceneB.scene, sceneB.camera);
    this.mesh.material.uniforms.texture0.value = renderTargetA.texture;
    this.mesh.material.uniforms.texture1.value = renderTargetB.texture;
    renderer.setRenderTarget(null);
  }
}
