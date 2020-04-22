import EventEmitter from 'eventemitter3';
import { Clock, Vector4, PerspectiveCamera } from 'three';
import renderer, { postProcessing } from './rendering/renderer';
import { setRendererSize, rendererSize } from './rendering/resize';
import settings from './settings';
import { rendererStats } from './utils/stats';
import { setQuery, getQueryFromParams } from './utils/query-params';
import { gui } from './utils/gui';
import PreloaderScene, { PRELOADER_SCENE_ID } from './scenes/preloader/preloader-scene';
import AppState from './app-state';
import LandingScene, { LANDING_SCENE_ID } from './scenes/landing/landing-scene';
import CameraTransitionScene, {
  CAMERA_TRANSITION_SCENE_ID
} from './scenes/camera-transitions/camera-transitions-scene';
import Screenshot from './utils/screenshot';
import InteractiveSphereScene, {
  INTERACTIVE_SPHERE_SCENE_ID
} from './scenes/interactive-sphere/interactive-sphere-scene';

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

    // Scenes map
    this.scenes = {
      [PRELOADER_SCENE_ID]: PreloaderScene,
      [LANDING_SCENE_ID]: LandingScene,
      [INTERACTIVE_SPHERE_SCENE_ID]: InteractiveSphereScene,
      [CAMERA_TRANSITION_SCENE_ID]: CameraTransitionScene
    };
    // List of ids to switch between
    const sceneIds = [LANDING_SCENE_ID, INTERACTIVE_SPHERE_SCENE_ID, CAMERA_TRANSITION_SCENE_ID];

    // The target scene id
    this.sceneId = LANDING_SCENE_ID;
    if (sceneIds.includes(getQueryFromParams('sceneId'))) {
      this.sceneId = getQueryFromParams('sceneId');
    }

    this.viewport = {
      debug: new Vector4(
        0,
        0,
        rendererSize.x * settings.viewportPreviewScale,
        rendererSize.y * settings.viewportPreviewScale
      ),
      main: new Vector4(0, 0, rendererSize.x, rendererSize.y)
    };

    // Add screenshot utility
    this.screenshot = new Screenshot(gui, 1280, 720, 2);
    this.screenshot.gui.add(this, 'captureScreenshot').name('capture');

    // Gui settings group
    const guiSettings = gui.addFolder('settings');
    guiSettings.open();

    // Toggle between dev and scene camera
    guiSettings.add(settings, 'devCamera').onChange((value: string) => {
      setQuery('devCamera', value);
      postProcessing.resize();
      this.currentScene.toogleCameras(value);
    });

    // Toggle scene helpers
    guiSettings.add(settings, 'helpers').onChange((value: string) => {
      setQuery('helpers', value);
      this.currentScene.toggleHelpers(value);
    });

    // Toggle between scenes
    guiSettings
      .add(this, 'sceneId', sceneIds)
      .onChange((value: string) => {
        this.setScene(value);
        setQuery('sceneId', value);
      })
      .listen();
  }

  captureScreenshot = () => {
    this.screenshot.capture(this.currentScene.scene, this.currentScene.camera);
  };

  /**
   * Setup any
   *
   * @memberof WebGLApp
   */
  async setup() {
    await new Promise((resolve, reject) => {
      try {
        // Setup the preloader scene right away as we need a scene to render on page load
        this.setScene(PRELOADER_SCENE_ID)
          .then(resolve)
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Set the new state
  setState = (state: AppState) => {
    if (state.equals(this.state)) return;
    this.prevState = this.state.clone();
    this.state = state;
    this.onStateChanged(this.state);
  };

  onStateChanged = (state: AppState) => {
    if (this.state.ready && this.state.ready !== this.prevState.ready) {
      this.setScene(this.sceneId);
    }
  };

  /**
   * Set the current scene to render
   * The scene should be inheritted from BaseScene
   *
   * @param {BaseScene} scene
   * @memberof WebGLApp
   */
  async setScene(sceneId: string) {
    await new Promise((resolve, reject) => {
      if (this.currentScene && sceneId === this.currentScene.id) return;
      // Create new scene instance
      const scene = new this.scenes[sceneId]();
      scene
        .setup()
        .then(() => {
          // Cache the previous scene
          const previousScene = this.currentScene;
          // Callback when the previous scene has animated out
          const nextScene = () => {
            // Set the current scene
            this.currentScene = scene;
            // Animate the scene in
            this.currentScene.animateIn().then(resolve, reject);
            // Update the post processing scene transition pass
            postProcessing.setScenes(postProcessing.sceneB, scene);
            postProcessing.transitionPass.transition().then(() => {
              // After the transition has ended, dispose of any objects
              if (previousScene) previousScene.dispose();
            });
          };
          // If the previous scene exists, animate out
          if (previousScene) {
            previousScene
              .animateOut()
              .then(nextScene)
              .catch(reject);
          } else {
            // Otherwise go to the next scene immediately
            nextScene();
          }
        })
        .catch(reject);
    });
  }

  /**
   * resize handler
   *
   * @memberof WebGLApp
   */
  resize = (width: number, height: number) => {
    setRendererSize(renderer, width, height);
    this.currentScene.resize(width, height);
    postProcessing.resize();
    this.viewport.debug.set(
      0,
      0,
      rendererSize.x * settings.viewportPreviewScale,
      rendererSize.y * settings.viewportPreviewScale
    );
    this.viewport.main.set(0, 0, rendererSize.x, rendererSize.y);
  };

  /**
   * Render the scene within viewport coordinates
   *
   * @memberof WebGLApp
   */
  renderScene = (camera: PerspectiveCamera, viewport: Vector4, delta: number, usePostProcessing: boolean) => {
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
  render = (render: boolean) => {
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
      this.renderScene(this.currentScene.cameras.dev, this.viewport.main, this.delta, false);
      this.renderScene(this.currentScene.cameras.main, this.viewport.debug, this.delta, true);
    } else {
      this.renderScene(this.currentScene.cameras.main, this.viewport.main, this.delta, true);
    }

    if (settings.stats) {
      rendererStats.update(renderer);
    }
  };
}

export default WebGLApp;
