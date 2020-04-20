import { CameraHelper } from 'three';
import BaseScene from '../base/base-scene';
// import { VECTOR_ZERO } from '../../utils/math';
import Ambient from '../../lights/ambient';
import Directional from '../../lights/directional';
import assets from './assets';
import CameraDollyManager from '../../cameras/camera-dolly/camera-dolly-manager';
import { resetCamera } from '../../cameras/cameras';

export const CAMERA_TRANSITION_SCENE_ID = 'camera-transitions';

export default class CameraTransitionsScene extends BaseScene {
  constructor() {
    const lights = [new Ambient(), new Directional()];
    super({ id: CAMERA_TRANSITION_SCENE_ID, assets, gui: true, guiOpen: true, lights, controls: true });
    resetCamera(this.camera, 20);
    // this.camera.position.set(0, 0, 5);
    // this.camera.lookAt(VECTOR_ZERO);
  }

  /**
   * Create and setup any objects for the scene
   *
   * @memberof CameraTransitionsScene
   */
  async createSceneObjects() {
    await new Promise((resolve, reject) => {
      try {
        this.cameraDollyManager = new CameraDollyManager({
          gui: this.gui,
          guiOpen: true
        });
        this.scene.add(this.cameraDollyManager.group);

        this.controls.main.enabled = false;

        const helper = new CameraHelper(this.cameras.main);
        this.scene.add(helper);

        const data = require('./data/dolly-data.json');
        this.cameraDollyManager.addTransition('default', data, this.cameras.main, this.cameras.dev, this.controls.dev);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Update loop
   *
   * @memberof CameraTransitionsScene
   */
  update = (delta: number) => {};
}
