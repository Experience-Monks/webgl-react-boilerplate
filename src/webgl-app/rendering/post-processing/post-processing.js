import { OrthographicCamera } from 'three';
import { bigTriangle } from '../../utils/geometry';
import { createRenderTarget } from '../render-target';
import { getRenderBufferSize } from '../resize';
import TransitionPass from './transition-pass/transition-pass';
import FinalPass from './final-pass/final-pass';
import EmptyScene from '../../scenes/empty/empty-scene';
import renderer from '../renderer';
import settings from '../../settings';
import { VIEWPORT_PREVIEW_SCALE } from '../../constants';

export default class PostProcessing {
  constructor(gui) {
    this.gui = gui.addFolder('post processing');
    this.gui.open();
    const geometry = bigTriangle();
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const { width, height } = getRenderBufferSize();
    const options = { stencilBuffer: false };
    this.renderTargetA = createRenderTarget(width, height, options);
    this.renderTargetB = createRenderTarget(width, height, options);
    this.renderTargetC = createRenderTarget(width, height, options);

    this.transitionPass = new TransitionPass(this.gui, geometry, this.camera);
    this.finalPass = new FinalPass(this.gui, geometry, this.camera);

    const sceneA = new EmptyScene('post scene a', 0x000000);
    const sceneB = new EmptyScene('post scene b', 0x000000);
    sceneA.setup();
    sceneB.setup();

    this.currentScene = null;
    this.lastPass = null;

    this.setScenes(sceneA, sceneB);
    this.resize();
  }

  setScenes(sceneA, sceneB) {
    this.sceneA = sceneA;
    this.sceneB = sceneB;
  }

  resize() {
    const scale = settings.devCamera ? VIEWPORT_PREVIEW_SCALE : 1;
    let { width, height } = getRenderBufferSize();
    width *= scale;
    height *= scale;
    this.renderTargetA.setSize(width, height);
    this.renderTargetB.setSize(width, height);
    this.renderTargetC.setSize(width, height);
    this.transitionPass.resize(width, height);
    this.finalPass.resize(width, height);
  }

  render(delta: Number) {
    this.currentScene = this.transitionPass.mesh.material.uniforms.transition.value === 0 ? this.sceneA : this.sceneB;
    this.lastPass = this.currentScene;

    renderer.setClearColor(this.currentScene.clearColor);

    if (this.transitionPass.active) {
      this.transitionPass.render(this.sceneA, this.sceneB, this.renderTargetA, this.renderTargetB, delta);
      this.lastPass = this.transitionPass;
    } else {
      this.currentScene.update(delta);
    }

    // Render target A & B are now free
    this.finalPass.render(this.lastPass, this.renderTargetC, delta);
  }
}
