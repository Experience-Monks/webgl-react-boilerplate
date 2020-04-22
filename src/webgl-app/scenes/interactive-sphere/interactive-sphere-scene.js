import BaseScene from '../base/base-scene';
import { VECTOR_ZERO } from '../../utils/math';
import Sphere from './objects/sphere/sphere';
import Ambient from '../../lights/ambient';
import Directional from '../../lights/directional';
import assets from './assets';
import Background from '../../objects/background/background';
import settings from '../../settings';

export const INTERACTIVE_SPHERE_SCENE_ID = 'interactive-sphere';

export default class InteractiveSphereScene extends BaseScene {
  constructor() {
    settings.devCamera = false;
    const lights = [new Ambient(), new Directional()];
    super({ id: INTERACTIVE_SPHERE_SCENE_ID, assets, gui: true, guiOpen: true, lights, controls: true });
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(VECTOR_ZERO);
  }

  /**
   * Create and setup any objects for the scene
   *
   * @memberof LandingScene
   */
  async createSceneObjects() {
    await new Promise((resolve, reject) => {
      try {
        this.background = new Background(this.gui);
        this.scene.add(this.background.mesh);
        this.sphere = new Sphere(this.camera);
        this.scene.add(this.sphere.mesh);
        this.animateInit();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  preloadGpuCullScene = (culled: boolean) => {
    this.sphere.preloadGpuCullScene(culled);
  };

  animateInit = () => {
    return this.sphere.animateInit();
  };

  animateIn = () => {
    return this.sphere.animateIn();
  };

  animateOut = () => {
    return this.sphere.animateOut();
  };

  /**
   * Update loop
   *
   * @memberof LandingScene
   */
  update = (delta: number) => {
    this.sphere.update(delta);
  };
}
