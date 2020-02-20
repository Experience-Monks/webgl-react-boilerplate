import BaseScene from '../base/base-scene';
import { VECTOR_ZERO } from '../../utils/math';
import Sphere from './objects/sphere/sphere';
import Ambient from '../../lights/ambient';
import Directional from '../../lights/directional';

export default class LandingScene extends BaseScene {
  constructor() {
    const lights = [new Ambient(), new Directional()];
    super({ id: 'landing', gui: true, guiOpen: true, lights, controls: true });
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(VECTOR_ZERO);
  }

  /**
   * Create and setup any objects for the scene
   *
   * @memberof LandingScene
   */
  createSceneObjects = (resolve: Function, reject: Function) => {
    try {
      this.sphere = new Sphere();
      this.scene.add(this.sphere.mesh);
      this.animateInit();
      resolve();
    } catch (error) {
      reject(error);
    }
  };

  animateInit = () => {};

  animateIn = () => {};

  animateOut = () => {};

  /**
   * Update loop
   *
   * @memberof LandingScene
   */
  update = (delta: Number) => {
    this.sphere.update(delta);
  };
}
