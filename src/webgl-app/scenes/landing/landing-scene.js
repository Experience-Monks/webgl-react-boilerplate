import BaseScene from '../base/base-scene';
import { VECTOR_ZERO } from '../../utils/math';
import assets from './assets';
import Background from '../../objects/background/background';
import renderer from '../../rendering/renderer';
import ParticlesNormal from './objects/particles/particles-normal';
import Particles from './objects/particles/particles';
import Jam3 from './objects/jam3/jam3';
import settings from '../../settings';

export const LANDING_SCENE_ID = 'landing';

export default class LandingScene extends BaseScene {
  constructor() {
    settings.devCamera = false;
    super({ id: LANDING_SCENE_ID, assets, gui: true, guiOpen: true, controls: true });
    this.cameras.main.position.set(0, 0, 60);
    this.cameras.main.lookAt(VECTOR_ZERO);
    this.controls.main.enableDamping = true;
  }

  /**
   * Create and setup any objects for the scene
   *
   * @memberof LandingScene
   */
  async createSceneObjects() {
    await new Promise((resolve, reject) => {
      try {
        this.background = new Background(this.gui, 100);
        this.scene.add(this.background.mesh);

        // Create particle classes
        this.particlesNormal = new ParticlesNormal(renderer);
        this.particles = new Particles(
          this.gui,
          5000, // total particles
          this.particlesNormal, // particles normal texture class
          renderer.getPixelRatio()
        );

        // Create Jam3 logo
        this.jam3 = new Jam3(this.gui, this.particles.renderTarget);
        this.scene.add(this.jam3.group);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Resize the camera's projection matrix
   *
   * @memberof LandingScene
   */
  resize = (width: number, height: number) => {
    this.cameras.dev.aspect = width / height;
    this.cameras.dev.updateProjectionMatrix();
    this.cameras.main.aspect = width / height;
    this.cameras.main.updateProjectionMatrix();
    this.particles.resize();
    this.jam3.resize();
  };

  /**
   * Update loop
   *
   * @memberof LandingScene
   */
  update = (delta: number) => {
    this.controls.main.update();
    this.particlesNormal.render(this.camera);
    this.particles.render(delta, this.camera);
    this.jam3.update(this.camera);
  };
}
