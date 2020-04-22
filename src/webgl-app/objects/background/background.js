import { Mesh, SphereBufferGeometry, BackSide, ShaderMaterial, Color } from 'three';
import { GUI } from 'dat.gui';
import { vertexShader, fragmentShader } from './shader.glsl';
import { GRAPHICS_HIGH, GRAPHICS_NORMAL, getGraphicsMode } from '../../rendering/graphics';

export default class Background {
  gui: GUI;
  guiParent: GUI;
  config: Object;
  mesh: Mesh;

  constructor(gui: GUI, radius: number = 50) {
    this.guiParent = gui;

    this.config = {
      color0: 0x000000,
      color1: 0x1b1b1b
    };

    const material = new ShaderMaterial({
      uniforms: {
        color0: {
          value: new Color(this.config.color0)
        },
        color1: {
          value: new Color(this.config.color1)
        },
        strength: {
          value: 2.5
        },
        powStrength: {
          value: 1.3
        }
      },
      vertexShader,
      fragmentShader,
      side: BackSide
    });

    this.gui = gui.addFolder('background');
    this.gui.open();

    this.gui
      .add(material.uniforms.strength, 'value', 0, 10)
      .name('strength')
      .onChange(this.onChange);
    this.gui
      .add(material.uniforms.powStrength, 'value', 0, 10)
      .name('powStrength')
      .onChange(this.onChange);
    this.gui.addColor(this.config, 'color0').onChange(this.onChange);
    this.gui.addColor(this.config, 'color1').onChange(this.onChange);

    const divisionSettings = {
      [GRAPHICS_HIGH]: [32, 16],
      [GRAPHICS_NORMAL]: [18, 8]
    };
    const divisions = divisionSettings[getGraphicsMode()];

    this.mesh = new Mesh(new SphereBufferGeometry(radius, divisions[0], divisions[1]), material);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
  }

  onChange = () => {
    this.mesh.material.uniforms.color0.value.setHex(this.config.color0);
    this.mesh.material.uniforms.color1.value.setHex(this.config.color1);
  };
}
