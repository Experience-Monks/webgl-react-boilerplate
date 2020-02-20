import { AmbientLight } from 'three';
import { GUI_PRECISION } from '../constants';

/**
 * Utility for creating ambient lights
 *
 * @export
 * @class Ambient
 */
export default class Ambient {
  constructor(options: Object = {}) {
    this.settings = Object.assign(
      {
        color: 0xd4d4d4,
        intensity: 0.6
      },
      options
    );
    this.light = new AmbientLight(this.settings.color, this.settings.intensity);
  }

  gui(guiParent) {
    this.guiParent = guiParent;
    this.gui = guiParent.addFolder('ambient');
    this.gui.open();
    this.gui.add(this.light, 'intensity', 0, 1, GUI_PRECISION);
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
  };

  dispose() {
    this.guiParent.removeFolder(this.gui.name);
  }
}
