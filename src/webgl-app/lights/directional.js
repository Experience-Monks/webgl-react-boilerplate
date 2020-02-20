import { DirectionalLight, DirectionalLightHelper } from 'three';
import { GUI_PRECISION } from '../constants';

export default class Directional {
  constructor(options, gui) {
    this.settings = {
      color: 0xd4d4d4,
      intensity: 0.6
    };
    Object.assign(this.settings, options);
    this.light = new DirectionalLight(this.settings.color, this.settings.intensity);
    this.light.position.set(1, 1, 1);
    this.helper = new DirectionalLightHelper(this.light);
  }

  gui(guiParent) {
    this.guiParent = guiParent;
    this.gui = guiParent.addFolder('directional');
    this.gui.open();
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
    this.gui.add(this.light, 'intensity', 0, 1);
    const range = 1;
    this.gui
      .add(this.light.position, 'x', -range, range)
      .step(GUI_PRECISION)
      .name('direction x');
    this.gui
      .add(this.light.position, 'y', -range, range)
      .step(GUI_PRECISION)
      .name('direction y');
    this.gui
      .add(this.light.position, 'z', -range, range)
      .step(GUI_PRECISION)
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
