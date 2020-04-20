import { PerspectiveCamera, Group, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import Dolly from './camera-dolly';
import type DollyData from './camera-dolly';
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
  dollies: Object;
  time: number;
  gui: GUI;
  tracksGui: GUI;
  group: Group;
  dollyId: string;
  dollyIds: string[];
  lookat: Vector3;
  camera: PerspectiveCamera;

  constructor(options: CameraDollyManagerOptions) {
    this.time = 0;
    this.group = new Group();
    this.dollies = {};
    this.dollyId = '';
    this.dollyIds = [];
    this.lookat = new Vector3();
    this.camera = null;

    if (options.gui) {
      this.gui = options.gui.addFolder('camera dolly manager');
      if (options.guiOpen) this.gui.open();

      this.gui.add(this, 'time', 0, 1).onChange(this.update);
    } else {
      this.gui = new GUIWrapper();
    }

    this.tracksGui = this.gui.addFolder('tracks');
    this.tracksGui.open();
  }

  addTransition(
    id: string,
    data: DollyData,
    cameraMain: PerspectiveCamera,
    cameraDev: PerspectiveCamera,
    control: OrbitControls
  ) {
    this.dollies[id] = new Dolly(id, data, this.gui, cameraDev, control);
    this.dollies[id].on('rebuild', this.update);
    this.group.add(this.dollies[id].group);
    this.setTransition(id, cameraMain);
  }

  setTransition(id: string, camera: PerspectiveCamera) {
    this.dollyId = id;
    if (!this.dollyIds.includes(id)) this.dollyIds.push(id);

    this.gui.removeFolder(this.tracksGui.name);
    this.tracksGui = this.gui.addFolder('tracks');
    this.tracksGui.open();
    this.tracksGui.add(this, 'dollyId', this.dollyIds).onChange(this.onTrackChange);

    this.camera = camera;

    Object.keys(this.dollies).forEach((key: string) => {
      const visible = key === id;
      this.dollies[key].toggleVisibility(visible);
    });

    this.update();
  }

  onTrackChange = (value: string) => {
    this.setTransition(value, this.camera);
  };

  update = () => {
    if (this.dollies[this.dollyId] === undefined) return;
    const { origin, lookat } = this.dollies[this.dollyId].getCameraDataByTime(this.time);
    this.camera.position.set(origin.x, origin.y, origin.z);
    this.lookat.set(lookat.x, lookat.y, lookat.z);
    this.camera.lookAt(this.lookat);
  };

  dispose() {
    Object.keys(this.dollies).forEach((id: string) => {
      this.dollies[id].dispose();
    });
  }
}
