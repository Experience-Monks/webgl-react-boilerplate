import EventEmitter from 'eventemitter3';
import { Scene, Group, GridHelper, AxesHelper } from 'three';
import { createPerspectiveCamera, createOrbitControls, resetCamera } from '../../cameras/cameras';
import { gui, GUIWrapper } from '../../utils/gui';
import Math3 from '../../utils/math';
import settings from '../../settings';
import { rendererSize } from '../../rendering/renderer';

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
   * Use this function to setup any 3d objects once overridden
   *
   * @memberof BaseScene
   */
  createSceneObjects = (resolve: Function, reject: Function) => {
    try {
      throw new Error('createSceneObjects needs to be implemented');
    } catch (error) {
      reject(error);
    }
  };

  /**
   * Setup is primarily used for generic object setup shared across scenes
   * In the future loading will happen during this phase
   *
   * @memberof BaseScene
   */
  setup = () => {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        // Add helpers
        this.helpers = new Group();
        this.helpers.add(new GridHelper(10, 10), new AxesHelper());
        this.helpers.visible = settings.helpers;
        this.scene.add(this.helpers);
        this.createSceneObjects(resolve, reject);
      } catch (error) {
        reject(error);
      }
    });
  };

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
