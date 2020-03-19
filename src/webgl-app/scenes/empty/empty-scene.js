import BaseScene from '../base/base-scene';
import { VECTOR_ZERO } from '../../utils/math';

export default class EmptyScene extends BaseScene {
  constructor(id: String, clearColor: Number) {
    super({ id, clearColor });
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(VECTOR_ZERO);
  }

  /**
   * Create and setup any objects for the scene
   *
   * @memberof PreloaderScene
   */
  createSceneObjects = () => {
    return new Promise((resolve, reject) => {
      try {
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
}
