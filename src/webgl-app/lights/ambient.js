import { AmbientLight } from 'three';
import { GUI } from 'dat.gui';
import settings from '../settings';

/**
 * Utility for creating ambient lights
 *
 * @export
 * @class Ambient
 */
export default class Ambient {
  settings: Object;
  light: AmbientLight;
  gui: GUI;
  guiParent: GUI;

  constructor(options: Object = {}) {
    this.settings = Object.assign(
      {
        color: 0xd4d4d4,
        intensity: 0.6,
        guiOpen: false
      },
      options
    );
    this.light = new AmbientLight(this.settings.color, this.settings.intensity);
  }

  gui(guiParent: GUI) {
    this.guiParent = guiParent;
    this.gui = guiParent.addFolder('ambient');
    if (this.settings.guiOpen) this.gui.open();
    this.gui.add(this.light, 'intensity', 0, 1, settings.guiPrecision);
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
  };

  dispose() {
    this.guiParent.removeFolder(this.gui.name);
  }
}
