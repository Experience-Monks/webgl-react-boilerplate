import EventEmitter from 'eventemitter3';
import { Scene, Group, GridHelper, AxesHelper } from 'three';
import { createPerspectiveCamera, createOrbitControls, resetCamera } from '../../cameras/cameras';
import { gui, GUIWrapper } from '../../utils/gui';
import Math3 from '../../utils/math';
import settings from '../../settings';
import { rendererSize } from '../../rendering/renderer';
import preloadGpu from '../../rendering/preload-gpu';

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
    // The scene for objects
    this.scene = new Scene();
    // The camera for rendering
    this.camera = createPerspectiveCamera(rendererSize.x / rendererSize.y);
    // Optionally create orbit controls
    if (options.controls) this.controls = createOrbitControls(this.camera);
    // Set the initial camera position
    resetCamera(this.camera, 5);

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
   * Use this function to setup any helpers for the scene
   *
   * @memberof BaseScene
   */
  createSceneHelpers = () => {
    return new Promise((resolve: Function, reject: Function) => {
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
  };

  /**
   * Use this function to setup any 3d objects once overridden
   *
   * @memberof BaseScene
   */
  createSceneObjects = () => {
    return new Promise((resolve, reject) => {
      try {
        throw new Error('createSceneObjects needs to be implemented');
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * Use this function to show any materials or objects that can't be seen
   * using the visible flag inside preloadGpu
   * An example of this could be a materials alpha is set to 0
   *
   * @memberof BaseScene
   */
  preloadGpuCullScene = (culled: Boolean) => {};

  /**
   * Setup is used to create any 3D objects
   * and pre-upload them to the GPU to ensure smooth transitions when rendering
   *
   * @memberof BaseScene
   */
  async setup() {
    await this.createSceneHelpers();
    await this.createSceneObjects();
    this.preloadGpuCullScene(true);
    await preloadGpu(this.scene, this.camera);
    this.preloadGpuCullScene(false);
  }

  /**
   * Toggle helpers on and off
   *
   * @memberof BaseScene
   */
  toggleHelpers = (visible: Boolean = true) => {
    this.helpers.visible = visible;
  };

  /**
   * Resize the camera's projection matrix
   *
   * @memberof BaseScene
   */
  resize = (width: Number, height: Number) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  /**
   * Update loop for animation, override this function
   *
   * @memberof BaseScene
   */
  update = (delta: Number) => {};
}
