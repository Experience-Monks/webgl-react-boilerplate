// @flow

import EventEmitter from 'eventemitter3';
import { Scene, Group, GridHelper, AxesHelper } from 'three';
import { createPerspectiveCamera, createOrbitControls, resetCamera } from '../../cameras/cameras';
import { gui, GUIWrapper } from '../../utils/gui';
import Math3 from '../../utils/math';
import settings from '../../settings';
import { rendererSize } from '../../rendering/resize';
import preloadGpu from '../../rendering/preload-gpu';
import assetLoader from '../../loading/asset-loader';
import assetManager from '../../loading/asset-manager';
import Asset from '../../loading/asset';
import disposeObjects from '../../utils/dispose-objects';

/**
 * A base scene for other scenes to inherit
 * It's main purpose is to abtract a lot of boilerplate code and serves
 * as a pattern for working with multiple scenes in a project
 *
 * @export
 * @class BaseScene
 * @extends {EventEmitter}
 */
export default class BaseScene extends EventEmitter {
  constructor(options: Object) {
    super();
    // Unique scene id
    this.id = options.id || Math3.generateUUID();
    // Clear color for the scene
    this.clearColor = options.clearColor || 0x000000;
    // Array of lights to add to the scene
    this.lights = options.lights || [];
    // Assets manifest
    this.assets = options.assets || [];
    // The scene for objects
    this.scene = new Scene();

    // The cameras for rendering
    this.cameras = {
      dev: createPerspectiveCamera(rendererSize.x / rendererSize.y),
      main: createPerspectiveCamera(rendererSize.x / rendererSize.y)
    };

    // Active rendering camera
    this.camera = settings.devCamera ? this.cameras.dev : this.cameras.main;

    // Set the initial camera positions
    resetCamera(this.cameras.dev, 5);
    resetCamera(this.cameras.main, 5);

    // Orbit controls
    this.controls = {};

    // Optionally create orbit controls for main camera
    if (options.controls) {
      this.controls.dev = createOrbitControls(this.cameras.dev);
      this.controls.main = createOrbitControls(this.cameras.main);
    }

    // Active camera control
    this.control = settings.devCamera ? this.controls.dev : this.controls.main;

    // Optionally create gui controls
    if (options.gui) {
      this.gui = gui.addFolder(`${this.id} scene`);
      if (options.guiOpen) this.gui.open();
    } else {
      this.gui = new GUIWrapper();
    }

    // Add any lights to the scene
    this.lights.forEach(light => {
      this.scene.add(light.light);
      light.gui(this.gui);
    });
  }

  /**
   *
   *
   * @memberof BaseScene
   */
  async loadAssets() {
    await new Promise((resolve, reject) => {
      try {
        if (this.assets.length > 0) {
          assetLoader.once('loaded', (response: Asset[]) => {
            if (response.length > 0) assetManager.add(this.id, response);
            resolve();
          });
          assetLoader.once('error', error => {
            reject(error);
          });
          assetLoader.load(this.id, this.assets);
        } else {
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Use this function to setup any helpers for the scene
   *
   * @memberof BaseScene
   */
  async createSceneHelpers() {
    await new Promise((resolve: Function, reject: Function) => {
      try {
        // Add helpers
        this.helpers = new Group();
        this.helpers.add(new GridHelper(10, 10), new AxesHelper());
        this.helpers.visible = settings.helpers;
        this.scene.add(this.helpers);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Use this function to setup any 3d objects once overridden
   *
   * @memberof BaseScene
   */
  async createSceneObjects() {
    await new Promise((resolve, reject) => {
      try {
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Use this function to show any materials or objects that can't be seen
   * using the visible flag inside preloadGpu
   * An example of this could be a materials alpha is set to 0
   *
   * @memberof BaseScene
   */
  preloadGpuCullScene = (culled: boolean) => {};

  /**
   * Setup is used to create any 3D objects
   * and pre-upload them to the GPU to ensure smooth transitions when rendering
   *
   * @memberof BaseScene
   */
  async setup() {
    await this.loadAssets();
    await this.createSceneHelpers();
    await this.createSceneObjects();
    this.preloadGpuCullScene(true);
    preloadGpu(this.scene, this.camera);
    this.preloadGpuCullScene(false);
  }

  /**
   * Toggle helpers on and off
   *
   * @memberof BaseScene
   */
  toggleHelpers = (visible: boolean = true) => {
    this.helpers.visible = visible;
  };

  /**
   * Toggle helpers on and off
   *
   * @memberof BaseScene
   */
  toogleCameras = (devCamera: boolean = true) => {
    this.camera = devCamera ? this.cameras.dev : this.cameras.main;
    this.control = devCamera ? this.controls.dev : this.controls.main;
  };

  /**
   * Resize the camera's projection matrix
   *
   * @memberof BaseScene
   */
  resize = (width: number, height: number) => {
    this.cameras.dev.aspect = width / height;
    this.cameras.dev.updateProjectionMatrix();
    this.cameras.main.aspect = width / height;
    this.cameras.main.updateProjectionMatrix();
  };

  /**
   * Provide a promise after the scene has animated in
   *
   * @memberof BaseScene
   */
  async animateIn() {
    await new Promise((resolve, reject) => {
      try {
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Provide a promise after the scene has animated out
   *
   * @memberof BaseScene
   */
  async animateOut() {
    await new Promise((resolve, reject) => {
      try {
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Update loop for animation, override this function
   *
   * @memberof BaseScene
   */
  update = (delta: number) => {};

  /**
   * Clear up scene objects
   *
   * @memberof BaseScene
   */
  dispose = () => {
    disposeObjects(this.scene, null);
    if (this.gui) gui.removeFolder(this.gui.name);
  };
}
