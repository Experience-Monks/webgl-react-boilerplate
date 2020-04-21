import { PerspectiveCamera, Group, Vector3 } from 'three';
import { TweenMax, Power1 } from 'gsap/gsap-core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import Dolly from './camera-dolly';
import type DollyData from './camera-dolly';
import type HelperOptions from './camera-dolly';
import { GUIWrapper } from '../../utils/gui';

export type CameraDollyManagerOptions = {|
  gui: GUI,
  guiOpen: boolean
|};

export type DollyOptions = {|
  gui: GUI,
  guiOpen?: boolean
|};

export default class CameraDollyManager {
  dollies: {
    [key: string]: Dolly
  };
  time: number;
  gui: GUI;
  tracksGui: GUI;
  group: Group;
  dollyId: string;
  dollyIds: string[];
  lookat: Vector3;
  camera: PerspectiveCamera;
  options: CameraDollyManagerOptions;

  constructor(options: CameraDollyManagerOptions) {
    // Current playback time 0 - 1
    this.time = 0;

    // Container for any 3d objects
    this.group = new Group();

    // Dollies added
    this.dollies = {};

    // Active dolly id
    this.dollyId = '';

    // Array of dolly track ids
    this.dollyIds = [];

    // Lookat vector
    this.lookat = new Vector3();

    // Active camera
    this.camera = null;

    this.options = options;

    // Create GUI instance
    if (options.gui) {
      this.gui = options.gui.addFolder('camera dolly manager');
      if (options.guiOpen) this.gui.open();

      this.gui
        .add(this, 'time', 0, 1)
        .listen()
        .onChange(this.update);
    } else {
      this.gui = new GUIWrapper();
    }

    // Add tracks GUI
    // Since the list can change if more dollies are added
    // We recreate this gui everytime addTransition is called
    this.tracksGui = this.gui.addFolder('tracks');
    this.tracksGui.open();
  }

  /**
   * Add a transition
   * Note two camereas are required for the transform controls to work
   *
   * @param {string} id
   * @param {DollyData} data
   * @param {PerspectiveCamera} cameraMain
   * @param {PerspectiveCamera} cameraDev
   * @param {OrbitControls} control
   * @memberof CameraDollyManager
   */
  addTransition(
    id: string,
    data: DollyData,
    cameraMain: PerspectiveCamera,
    cameraDev: PerspectiveCamera,
    control: OrbitControls,
    helperOptions: HelperOptions
  ) {
    this.dollies[id] = new Dolly(id, data, this.gui, cameraDev, control, helperOptions);
    this.dollies[id].on('rebuild', this.update);
    this.group.add(this.dollies[id].group);
    this.setTransition(id, cameraMain);
  }

  /**
   * Set the current transition
   *
   * @param {string} id
   * @param {PerspectiveCamera} camera
   * @memberof CameraDollyManager
   */
  setTransition(id: string, camera: PerspectiveCamera) {
    // Set the new dolly id
    this.dollyId = id;

    // Add the id to the dolly list
    if (!this.dollyIds.includes(id)) this.dollyIds.push(id);

    // Remove and recreate the tracks gui
    this.gui.removeFolder(this.tracksGui.name);
    this.tracksGui = this.gui.addFolder('tracks');
    this.tracksGui.open();
    this.tracksGui.add(this, 'dollyId', this.dollyIds).onChange(this.onTrackChange);

    // Set the active camera
    this.camera = camera;

    // Show the active dolly path, if helpers are visible
    Object.keys(this.dollies).forEach((key: string) => {
      const visible = key === id;
      this.dollies[key].toggleVisibility(visible);
    });

    // Update camera
    this.update();
  }

  /**
   * Switch to the new track
   *
   * @memberof CameraDollyManager
   */
  onTrackChange = (value: string) => {
    this.setTransition(value, this.camera);
  };

  /**
   * Animate the current track
   *
   * @param {number} [duration=1]
   * @param {Object} [ease=Power1.easeOut]
   * @memberof CameraDollyManager
   */
  async transition(duration: number = 1, ease: Object = Power1.easeOut) {
    await new Promise((resolve, reject) => {
      TweenMax.killTweensOf(this);
      this.time = 0;
      this.update();
      TweenMax.to(this, duration, {
        time: 1,
        ease,
        onUpdate: () => {
          this.update();
        },
        onComplete: () => {
          resolve();
        }
      });
    });
  }

  /**
   * Stop current playback
   *
   * @memberof CameraDollyManager
   */
  stop() {
    TweenMax.killTweensOf(this);
  }

  /**
   * Update camera position and playback
   *
   * @memberof CameraDollyManager
   */
  update = () => {
    if (this.dollies[this.dollyId] === undefined) return;
    const { origin, lookat } = this.dollies[this.dollyId].getCameraDataByTime(this.time);
    this.camera.position.set(origin.x, origin.y, origin.z);
    this.lookat.set(lookat.x, lookat.y, lookat.z);
    this.camera.lookAt(this.lookat);
  };

  /**
   * Dispose
   *
   * @memberof CameraDollyManager
   */
  dispose() {
    this.stop();
    Object.keys(this.dollies).forEach((id: string) => {
      this.dollies[id].dispose();
    });
    if (this.options.gui) {
      this.options.gui.removeFolder(this.gui.name);
    }
  }
}
