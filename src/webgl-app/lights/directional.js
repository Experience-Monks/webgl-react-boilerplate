import { DirectionalLight, DirectionalLightHelper } from 'three';
import { GUI } from 'dat.gui';
import settings from '../settings';

/**
 * Utility for creating directional lights
 *
 * @export
 * @class Directional
 */
export default class Directional {
  settings: Object;
  light: DirectionalLight;
  gui: GUI;
  guiParent: GUI;
  helper: DirectionalLightHelper;

  constructor(options: Object = {}) {
    this.settings = Object.assign(
      {
        color: 0xd4d4d4,
        intensity: 0.6,
        guiOpen: false
      },
      options
    );
    this.light = new DirectionalLight(this.settings.color, this.settings.intensity);
    this.light.position.set(1, 1, 1);
    this.helper = new DirectionalLightHelper(this.light);
  }

  gui(guiParent: GUI) {
    this.guiParent = guiParent;
    this.gui = guiParent.addFolder('directional');
    if (this.settings.guiOpen) this.gui.open();
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
    this.gui.add(this.light, 'intensity', 0, 1, settings.guiPrecision);
    const range = 1;
    this.gui
      .add(this.light.position, 'x', -range, range)
      .step(settings.guiPrecision)
      .name('direction x');
    this.gui
      .add(this.light.position, 'y', -range, range)
      .step(settings.guiPrecision)
      .name('direction y');
    this.gui
      .add(this.light.position, 'z', -range, range)
      .step(settings.guiPrecision)
      .name('direction z');
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
    this.helper.update();
  };

  dispose() {
    this.guiParent.removeFolder(this.gui.name);
  }
}
