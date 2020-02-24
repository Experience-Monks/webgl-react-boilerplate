import { TweenLite } from 'gsap/gsap-core';
import { Mesh, MeshLambertMaterial, SphereBufferGeometry, PerspectiveCamera } from 'three';
import materialModifier from '../../../../utils/material-modifier';
import shaderConfig from './shader.glsl';
import { GRAPHICS_HIGH, getGraphicsMode } from '../../../../constants';
import InteractiveObject from '../../../../interaction/interactive-object';

export default class Sphere {
  constructor(camera: PerspectiveCamera) {
    this.camera = camera;

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
    this.interactiveObject = new InteractiveObject(this.mesh, this.camera, {
      touchStart: true,
      touchMove: true,
      touchEnd: true,
      mouseMove: false
    });
    this.interactiveObject.on('start', this.onStart);
    this.interactiveObject.on('hover', this.onHover);
    this.interactiveObject.on('end', this.onEnd);
  }

  onStart = (event: Object) => {
    // console.log('start', event);
    this.scaleMesh(true);
  };

  onHover = (over: Boolean, event: Object) => {
    // console.log(over ? 'over' : 'out', over ? event : '');
  };

  onEnd = () => {
    // console.log('end');
    this.scaleMesh(false);
  };

  preloadGpuCullScene = (culled: Boolean) => {
    this.mesh.material.opacity = culled ? 1 : 0;
  };

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

  scaleMesh = (over: Boolean) => {
    TweenLite.killTweensOf(this.mesh.scale);
    TweenLite.to(this.mesh.scale, 0.5, {
      x: over ? 1.6 : 1,
      y: over ? 1.6 : 1,
      z: over ? 1.6 : 1
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
