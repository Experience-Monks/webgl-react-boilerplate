import { SpotLight } from 'three';
import { GUI } from 'dat.gui';
import settings from '../settings';

/**
 * Utility for creating spot lights
 *
 * @export
 * @class Spot
 */
export class Spot {
  settings: Object;
  light: SpotLight;
  gui: GUI;
  guiParent: GUI;

  constructor(options: Object = {}) {
    this.settings = Object.assign(
      {
        color: 0xd4d4d4,
        intensity: 0.6,
        distance: 100,
        angle: Math.PI / 3,
        power: Math.PI * 4,
        penumbra: 0,
        decay: 1,
        guiOpen: false
      },
      options
    );
    this.light = new SpotLight(
      this.settings.color,
      this.settings.intensity,
      this.settings.distance,
      this.settings.angle,
      this.settings.penumbra,
      this.settings.decay
    );
    this.light.power = this.settings.power;
    this.light.position.set(1, 1, 1);
  }

  gui(guiParent: GUI) {
    this.guiParent = guiParent;
    this.gui = guiParent.addFolder('spot');
    if (this.settings.guiOpen) this.gui.open();
    const range = 100;
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
    this.gui.add(this.light, 'intensity', 0, 10, settings.guiPrecision);
    this.gui.add(this.light, 'distance', 0, 100);
    this.gui.add(this.light, 'decay', 0, 100);
    this.gui.add(this.light, 'angle', 0, 100);
    this.gui.add(this.light, 'penumbra', 0, 100);
    this.gui.add(this.light, 'power', 0, 100);
    this.gui
      .add(this.light.position, 'x', -range, range)
      .step(settings.guiPrecision)
      .name('position x');
    this.gui
      .add(this.light.position, 'y', -range, range)
      .step(settings.guiPrecision)
      .name('position y');
    this.gui
      .add(this.light.position, 'z', -range, range)
      .step(settings.guiPrecision)
      .name('position z');
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
  };

  dispose() {
    this.guiParent.removeFolder(this.gui.name);
  }
}
