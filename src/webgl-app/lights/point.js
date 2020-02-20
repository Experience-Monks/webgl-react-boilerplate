import { PointLight } from 'three';
import { GUI_PRECISION } from '../constants';

export class Point {
  constructor(options, gui) {
    this.settings = {
      color: 0xd4d4d4,
      intensity: 0.6,
      distance: 100,
      decay: 0
    };

    Object.assign(this.settings, options);

    this.light = new PointLight(
      this.settings.color,
      this.settings.intensity,
      this.settings.distance,
      this.settings.decay
    );
    this.light.position.set(1, 1, 1);
  }

  gui(guiParent) {
    this.guiParent = guiParent;
    this.gui = guiParent.addFolder('point');
    this.gui.open();
    const range = 100;
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
    this.gui.add(this.settings, 'intensity', 0, 10);
    this.gui.add(this.settings, 'distance', 0, 1000);
    this.gui.add(this.settings, 'decay', 0, 1000);
    this.gui
      .add(this.light.position, 'x', -range, range)
      .step(GUI_PRECISION)
      .name('position x');
    this.gui
      .add(this.light.position, 'y', -range, range)
      .step(GUI_PRECISION)
      .name('position y');
    this.gui
      .add(this.light.position, 'z', -range, range)
      .step(GUI_PRECISION)
      .name('position z');
  }

  onChange = () => {
    this.light.color.setHex(Number(`${this.settings.color}`.replace('#', '0x')));
  };

  dispose() {
    this.guiParent.removeFolder(this.gui.name);
  }
}
