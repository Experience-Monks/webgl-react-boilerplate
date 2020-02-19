import { Mesh, MeshLambertMaterial, SphereBufferGeometry } from 'three';
import materialModifier from '../../utils/material-modifier';
import shaderConfig from './shader.glsl';
import { GRAPHICS_HIGH, getGraphicsMode } from '../../constants';

export default class Sphere {
  constructor() {
    const divisions = getGraphicsMode() === GRAPHICS_HIGH ? 64 : 32;
    const geometry = new SphereBufferGeometry(1, divisions, divisions);
    const material = new MeshLambertMaterial();

    this.shader = undefined;
    material.onBeforeCompile = (shader: Object) => {
      this.shader = materialModifier(shader, shaderConfig);
    };

    this.mesh = new Mesh(geometry, material);
  }

  update(delta: number) {
    if (this.shader) {
      this.shader.uniforms.time.value += delta;
    }
  }
}
