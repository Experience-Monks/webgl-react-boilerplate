import { OrthographicCamera, WebGLRenderTarget } from 'three';
import { GUI } from 'dat.gui';
import { bigTriangle } from '../../utils/geometry';
import { createRenderTarget } from '../render-target';
import { getRenderBufferSize } from '../resize';
import TransitionPass from './passes/transition-pass/transition-pass';
import FinalPass from './passes/final-pass/final-pass';
import EmptyScene from '../../scenes/empty/empty-scene';
import renderer from '../renderer';
import settings from '../../settings';
import BaseScene from '../../scenes/base/base-scene';

export default class PostProcessing {
  gui: GUI;
  camera: OrthographicCamera;
  renderTargetA: WebGLRenderTarget;
  renderTargetB: WebGLRenderTarget;
  renderTargetC: WebGLRenderTarget;
  transitionPass: TransitionPass;
  finalPass: FinalPass;
  currentScene: BaseScene;
  lastPass: mixed;
  sceneA: BaseScene;
  sceneB: BaseScene;

  constructor(gui: GUI) {
    // Create gui
    this.gui = gui.addFolder('post processing');
    // this.gui.open();
    // Create big triangle geometry, faster than using quad
    const geometry = bigTriangle();
    // Post camera
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    // Setup render targets
    const { width, height } = getRenderBufferSize();
    const options = { stencilBuffer: false };
    this.renderTargetA = createRenderTarget(width, height, options);
    this.renderTargetB = createRenderTarget(width, height, options);
    this.renderTargetC = createRenderTarget(width, height, options);

    // Create passes
    this.transitionPass = new TransitionPass(this.gui, geometry, this.camera);
    this.finalPass = new FinalPass(this.gui, geometry, this.camera);

    // Create empty scenes
    const sceneA = new EmptyScene('post scene a', 0x000000);
    const sceneB = new EmptyScene('post scene b', 0x000000);
    sceneA.setup();
    sceneB.setup();

    this.setScenes(sceneA, sceneB);
    this.resize();
  }

  /**
   * Set the two main scenes used for the transition pass
   *
   * @param {BaseScene} sceneA
   * @param {BaseScene} sceneB
   * @memberof PostProcessing
   */
  setScenes(sceneA: BaseScene, sceneB: BaseScene) {
    this.sceneA = sceneA;
    this.sceneB = sceneB;
  }

  /**
   * Resize handler for passes and render targets
   *
   * @memberof PostProcessing
   */
  resize() {
    const scale = settings.devCamera ? settings.viewportPreviewScale : 1;
    let { width, height } = getRenderBufferSize();
    width *= scale;
    height *= scale;
    this.renderTargetA.setSize(width, height);
    this.renderTargetB.setSize(width, height);
    this.renderTargetC.setSize(width, height);
    this.transitionPass.resize(width, height);
    this.finalPass.resize(width, height);
  }

  /**
   * Render passes and output to screen
   *
   * @param {Number} delta
   * @memberof PostProcessing
   */
  render(delta: number) {
    // Determine the current scene based on the transition pass value
    this.currentScene = this.transitionPass.mesh.material.uniforms.transition.value === 0 ? this.sceneA : this.sceneB;
    this.lastPass = this.currentScene;

    // If the transition pass is active
    if (this.transitionPass.active) {
      this.transitionPass.render(this.sceneA, this.sceneB, this.renderTargetA, this.renderTargetB, delta);
      this.lastPass = this.transitionPass;
    } else {
      // Otherwise we just render the current scene
      renderer.setClearColor(this.currentScene.clearColor);
      this.currentScene.update(delta);
    }

    // Render the final pass which contains all the post fx
    this.finalPass.render(this.lastPass, this.renderTargetC, delta);
  }
}
