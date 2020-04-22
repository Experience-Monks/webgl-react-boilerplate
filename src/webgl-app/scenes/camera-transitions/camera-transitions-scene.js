import { CameraHelper } from 'three';
import { Power1 } from 'gsap';
import BaseScene from '../base/base-scene';
import assets from './assets';
import CameraDollyManager from '../../cameras/camera-dolly/camera-dolly-manager';
import { resetCamera } from '../../cameras/cameras';
import settings from '../../settings';

export const CAMERA_TRANSITION_SCENE_ID = 'camera-transitions';

export default class CameraTransitionsScene extends BaseScene {
  constructor() {
    // Show dev camera view during this scene
    settings.devCamera = true;
    super({ id: CAMERA_TRANSITION_SCENE_ID, assets, gui: true, guiOpen: true, controls: true });
    resetCamera(this.cameras.dev, 50);
  }

  /**
   * Create and setup any objects for the scene
   *
   * @memberof CameraTransitionsScene
   */
  async createSceneObjects() {
    await new Promise((resolve, reject) => {
      try {
        // Disable main control sincw we're using the camera dolly
        this.controls.main.enabled = false;

        this.gui.add(this, 'play');
        this.gui.add(this, 'stop');

        // Create a camera helper to see the main camera easier
        const helper = new CameraHelper(this.cameras.main);
        this.scene.add(helper);

        // Require camera dolly tracks
        const tracks = {
          'track 0': require('./data/dolly-data-0.json'),
          'track 1': require('./data/dolly-data-1.json')
        };

        this.trackIds = Object.keys(tracks);
        this.trackIndex = 1;

        // Create camera dolly manager
        this.cameraDollyManager = new CameraDollyManager({
          gui: this.gui,
          guiOpen: true
        });
        this.scene.add(this.cameraDollyManager.group);

        // Add tracks to the manager
        Object.keys(tracks).forEach((id: string) => {
          this.cameraDollyManager.addTransition(
            id,
            tracks[id],
            this.cameras.main,
            this.cameras.dev,
            this.controls.dev,
            {
              linesVisible: true,
              controlsVisible: false,
              pointsVisible: true
            }
          );
        });

        this.play();

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Play the current camera dolly track
   *
   * @memberof CameraTransitionsScene
   */
  play = () => {
    this.animateCamera();
  };

  /**
   * Stop the current camera dolly track
   *
   * @memberof CameraTransitionsScene
   */
  stop = () => {
    this.cameraDollyManager.stop();
  };

  /**
   * Cycle through camera dolly tracks
   *
   * @memberof CameraTransitionsScene
   */
  animateCamera() {
    this.cameraDollyManager.setTransition(this.trackIds[this.trackIndex], this.cameras.main);
    this.cameraDollyManager.transition(5, Power1.easeOut).then(() => {
      this.trackIndex++;
      this.trackIndex %= this.trackIds.length;
      this.animateCamera();
    });
  }
}
