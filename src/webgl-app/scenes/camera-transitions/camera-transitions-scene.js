import BaseScene from '../base/base-scene';
import { VECTOR_ZERO } from '../../utils/math';
import Ambient from '../../lights/ambient';
import Directional from '../../lights/directional';
import assets from './assets';

export const CAMERA_TRANSITION_SCENE_ID = 'camera-transitions';

export default class CameraTransitionsScene extends BaseScene {
  constructor() {
    const lights = [new Ambient(), new Directional()];
    super({ id: CAMERA_TRANSITION_SCENE_ID, assets, gui: true, guiOpen: true, lights, controls: true });
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(VECTOR_ZERO);
  }

  /**
   * Create and setup any objects for the scene
   *
   * @memberof CameraTransitionsScene
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
   * Update loop
   *
   * @memberof CameraTransitionsScene
   */
  update = (delta: number) => {};
}
