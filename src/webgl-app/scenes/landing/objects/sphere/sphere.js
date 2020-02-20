import { Mesh, MeshLambertMaterial, SphereBufferGeometry } from 'three';
import materialModifier from '../../../../utils/material-modifier';
import shaderConfig from './shader.glsl';
import { GRAPHICS_HIGH, getGraphicsMode } from '../../../../constants';

export default class Sphere {
  constructor() {
    // Use less polys on normal graphics mode
    const divisions = getGraphicsMode() === GRAPHICS_HIGH ? 64 : 32;
    const geometry = new SphereBufferGeometry(1, divisions, divisions);
    const material = new MeshLambertMaterial();

    this.shader = undefined;
    // Customise the lambert material
    material.onBeforeCompile = (shader: Object) => {
      this.shader = materialModifier(shader, shaderConfig);
    };

    this.mesh = new Mesh(geometry, material);
  }

  /**
   * Update loop
   *
   * @param {Number} delta
   * @memberof Sphere
   */
  update(delta: Number) {
    if (this.shader) {
      this.shader.uniforms.time.value += delta;
    }
  }
}
