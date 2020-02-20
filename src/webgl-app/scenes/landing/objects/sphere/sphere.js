import { TweenLite } from 'gsap/gsap-core';
import { Mesh, MeshLambertMaterial, SphereBufferGeometry } from 'three';
import materialModifier from '../../../../utils/material-modifier';
import shaderConfig from './shader.glsl';
import { GRAPHICS_HIGH, getGraphicsMode } from '../../../../constants';

export default class Sphere {
  constructor() {
    // Use less polys on normal graphics mode
    const divisions = getGraphicsMode() === GRAPHICS_HIGH ? 64 : 32;
    const geometry = new SphereBufferGeometry(1, divisions, divisions);
    const material = new MeshLambertMaterial({ transparent: true, opacity: 0 });

    this.shader = undefined;
    // Customise the lambert material
    material.onBeforeCompile = (shader: Object) => {
      this.shader = materialModifier(shader, shaderConfig);
    };

    this.mesh = new Mesh(geometry, material);
  }

  animateInit = () => {
    TweenLite.killTweensOf(this.mesh.material.opacity);
    this.mesh.material.opacity = 0;
  };

  animateIn = () => {
    return new Promise((resolve, reject) => {
      TweenLite.to(this.mesh.material, 1, {
        opacity: 1,
        onComplete: () => {
          resolve();
        }
      });
    });
  };

  animateOut = () => {
    return new Promise((resolve, reject) => {
      TweenLite.to(this.mesh.material.opacity, 1, {
        opacity: 0,
        onComplete: () => {
          resolve();
        }
      });
    });
  };

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
