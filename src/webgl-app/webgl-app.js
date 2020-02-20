import EventEmitter from 'eventemitter3';
import { Clock } from 'three';
import renderer, { setRendererSize, rendererSize } from './rendering/renderer';
import settings from './settings';
import { rendererStats } from './utils/stats';
import { setQuery } from './utils/query-params';
import { gui } from './utils/gui';
import { createPerspectiveCamera, createOrbitControls, resetCamera } from './cameras/cameras';
import PreloaderScene from './scenes/preloader/preloader-scene';
import AppState from './app-state';
import LandingScene from './scenes/landing/landing-scene';

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

    // Dev camera and controls
    this.devCamera = createPerspectiveCamera(rendererSize.x / rendererSize.y);
    this.devControls = createOrbitControls(this.devCamera);

    // Initial camera position
    resetCamera(this.devCamera, 10);

    // Setup the preloader scene right away as we need a scene to render on page load
    this.preloaderScene = new PreloaderScene();
    this.preloaderScene.setup();
    this.currentScene = this.preloaderScene;

    // Gui settings group
    const guiSettings = gui.addFolder('settings');
    guiSettings.open();

    // Toggle between dev and scene camera
    guiSettings.add(settings, 'devCamera').onChange((value: Boolean) => {
      setQuery('devCamera', value);
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
        this.preloaderScene
          .animateIn()
          .then(resolve)
          .catch(reject);
        resolve();
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
            this.currentScene = landingScene;
            landingScene.animateIn();
          });
        })
        .catch((error: String) => {
          console.log(error);
        });
    }
  };

  /**
   * resize handler
   *
   * @memberof WebGLApp
   */
  resize = (width: Number, height: Number) => {
    setRendererSize(width, height);
    this.devCamera.aspect = width / height;
    this.devCamera.updateProjectionMatrix();
    this.currentScene.resize(width, height);
  };

  /**
   * Render the scene within viewport coordinates
   *
   * @memberof WebGLApp
   */
  renderScene = (camera: PerspectiveCamera, left: Number, bottom: Number, width: Number, height: Number) => {
    left *= rendererSize.x;
    bottom *= rendererSize.y;
    width *= rendererSize.x;
    height *= rendererSize.y;
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.render(this.currentScene.scene, camera);
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

    this.currentScene.update(this.delta);

    renderer.setClearColor(this.currentScene.clearColor);

    if (settings.devCamera) {
      this.renderScene(this.devCamera, 0, 0, 1, 1);
      this.renderScene(this.currentScene.camera, 0, 0, 0.25, 0.25);
    } else {
      this.renderScene(this.currentScene.camera, 0, 0, 1, 1);
    }

    if (settings.stats) {
      rendererStats.update(renderer);
    }
  };
}

export default WebGLApp;
