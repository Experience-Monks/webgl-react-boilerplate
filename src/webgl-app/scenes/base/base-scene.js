import EventEmitter from 'eventemitter3';
import { Scene, Group, GridHelper, AxesHelper } from 'three';
import { createPerspectiveCamera, createOrbitControls, resetCamera } from '../../cameras/cameras';
import { gui, GUIWrapper } from '../../utils/gui';
import Math3 from '../../utils/math';
import settings from '../../settings';

export default class BaseScene extends EventEmitter {
  constructor(options: Object) {
    super();
    this.id = options.id || Math3.generateUUID();
    this.clearColor = options.clearColor || 0x000000;
    this.lights = options.lights || [];
    this.scene = new Scene();
    this.camera = createPerspectiveCamera();
    if (options.controls) this.controls = createOrbitControls(this.camera);
    resetCamera(this.camera, 5);

    if (options.gui) {
      this.gui = gui.addFolder(`${this.id} scene`);
      if (options.guiOpen) this.gui.open();
    } else {
      this.gui = new GUIWrapper();
    }

    this.lights.forEach(light => {
      this.scene.add(light.light);
      light.gui(this.gui);
    });
  }

  createSceneObjects = (resolve: Function, reject: Function) => {
    try {
      throw new Error('createSceneObjects needs to be implemented');
    } catch (error) {
      reject(error);
    }
  };

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

  toggleHelpers = (visible: Boolean = true) => {
    this.helpers.visible = visible;
  };

  resize = (width: Number, height: Number) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  update = (delta: Number) => {};
}
