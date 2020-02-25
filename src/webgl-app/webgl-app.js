import EventEmitter from 'eventemitter3';
import { Clock, Vector4 } from 'three';
import renderer, { postProcessing } from './rendering/renderer';
import { setRendererSize, rendererSize } from './rendering/resize';
import settings from './settings';
import { rendererStats } from './utils/stats';
import { setQuery } from './utils/query-params';
import { gui } from './utils/gui';
import { createPerspectiveCamera, createOrbitControls, resetCamera } from './cameras/cameras';
import PreloaderScene from './scenes/preloader/preloader-scene';
import AppState from './app-state';
import LandingScene from './scenes/landing/landing-scene';
import BaseScene from './scenes/base/base-scene';
import { VIEWPORT_PREVIEW_SCALE } from './constants';

class WebGLApp extends EventEmitter {
  /**
   * Creates an instance of WebGLApp.
   * @param {HTMLElement} parent
   * @memberof WebGLApp
   */
  constructor(parent: HTMLElement) {
    super();
    // Append the renderer canvas to the component reference
    parent.appendChild(renderer.domElement);

    // Clock for elapsed time and delta
    this.clock = new Clock(true);

    // Current request animation frame id
    this.rafId = 0;

    // Current frame delta
    this.delta = 0;

    // Flag to prevent multiple raf's running
    this.isRendering = false;

    // Initial state
    this.state = new AppState({ ready: false });

    this.viewport = {
      debug: new Vector4(0, 0, rendererSize.x * VIEWPORT_PREVIEW_SCALE, rendererSize.y * VIEWPORT_PREVIEW_SCALE),
      main: new Vector4(0, 0, rendererSize.x, rendererSize.y)
    };

    // Dev camera and controls
    this.devCamera = createPerspectiveCamera(rendererSize.x / rendererSize.y);
    this.devControls = createOrbitControls(this.devCamera);

    // Initial camera position
    resetCamera(this.devCamera, 10);

    // Gui settings group
    const guiSettings = gui.addFolder('settings');
    guiSettings.open();

    // Toggle between dev and scene camera
    guiSettings.add(settings, 'devCamera').onChange((value: Boolean) => {
      setQuery('devCamera', value);
      postProcessing.resize();
    });

    // Toggle scene helpers
    guiSettings.add(settings, 'helpers').onChange((value: Boolean) => {
      setQuery('helpers', value);
      this.currentScene.toggleHelpers(value);
    });
  }

  /**
   * Setup any
   *
   * @memberof WebGLApp
   */
  setup = () => {
    return new Promise((resolve, reject) => {
      try {
        // Setup the preloader scene right away as we need a scene to render on page load
        this.preloaderScene = new PreloaderScene();
        this.preloaderScene
          .setup()
          .then(() => {
            this.setScene(this.preloaderScene);
            resolve();
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Set the new state
  setState = (state: AppState) => {
    if (state.equals(this.state)) return;
    this.prevState = this.state.clone();
    this.state = state;
    this.onStateChanged(this.state);
  };

  onStateChanged = (state: AppState) => {
    if (this.state.ready && this.state.ready !== this.prevState.ready) {
      const landingScene = new LandingScene();
      landingScene
        .setup()
        .then(() => {
          this.preloaderScene.animateOut().then(() => {
            this.setScene(landingScene);
          });
        })
        .catch((error: String) => {
          console.log(error);
        });
    }
  };

  /**
   * Set the current scene to render
   * Should be inheritted from BaseScene
   *
   * @param {BaseScene} scene
   * @memberof WebGLApp
   */
  setScene(scene: BaseScene) {
    return new Promise((resolve, reject) => {
      this.currentScene = scene;
      this.currentScene.animateIn().then(resolve, reject);
      postProcessing.setScenes(postProcessing.sceneB, scene);
      postProcessing.transitionPass.transition();
    });
  }

  /**
   * resize handler
   *
   * @memberof WebGLApp
   */
  resize = (width: Number, height: Number) => {
    setRendererSize(renderer, width, height);
    this.devCamera.aspect = width / height;
    this.devCamera.updateProjectionMatrix();
    this.currentScene.resize(width, height);
    postProcessing.resize();

    this.viewport.debug.set(0, 0, rendererSize.x * VIEWPORT_PREVIEW_SCALE, rendererSize.y * VIEWPORT_PREVIEW_SCALE);
    this.viewport.main.set(rendererSize.x, rendererSize.y, rendererSize.x, rendererSize.y);
  };

  /**
   * Render the scene within viewport coordinates
   *
   * @memberof WebGLApp
   */
  renderScene = (camera: PerspectiveCamera, viewport: Vector4, delta: Number, usePostProcessing: Boolean) => {
    renderer.setViewport(viewport.x, viewport.y, viewport.z, viewport.w);
    renderer.setScissor(viewport.x, viewport.y, viewport.z, viewport.w);

    if (usePostProcessing) {
      postProcessing.render(delta);
    } else {
      this.currentScene.update(this.delta);
      renderer.setClearColor(this.currentScene.clearColor);
      renderer.render(this.currentScene.scene, camera);
    }
  };

  /**
   * Toggle the rendering and animation loop
   *
   * @memberof WebGLApp
   */
  render = (render: Boolean) => {
    if (this.isRendering === render) return;
    this.isRendering = render;
    if (render) {
      this.update();
    } else {
      cancelAnimationFrame(this.rafId);
    }
  };

  /**
   * Main render loop and update of animations
   *
   * @memberof WebGLApp
   */
  update = () => {
    this.rafId = requestAnimationFrame(this.update);
    this.delta = this.clock.getDelta();

    if (settings.devCamera) {
      this.renderScene(this.devCamera, this.viewport.main, this.delta);
      this.renderScene(this.currentScene.camera, this.viewport.debug, this.delta, true);
    } else {
      this.renderScene(this.currentScene.camera, this.viewport.main, this.delta, true);
    }

    if (settings.stats) {
      rendererStats.update(renderer);
    }
  };
}

export default WebGLApp;
