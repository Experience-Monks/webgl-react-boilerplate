import { TweenLite } from 'gsap/gsap-core';
import { Mesh, MeshLambertMaterial, SphereBufferGeometry, PerspectiveCamera } from 'three';
import materialModifier from '../../../../utils/material-modifier';
import shaderConfig from './shader.glsl';
import InteractiveObject from '../../../../interaction/interactive-object';
import { getGraphicsMode, GRAPHICS_HIGH } from '../../../../rendering/graphics';

export default class Sphere {
  camera: PerspectiveCamera;
  shader: Object;
  mesh: Mesh;
  interactiveObject: InteractiveObject;

  constructor(camera: PerspectiveCamera) {
    this.camera = camera;

    // Use less polys on normal graphics mode
    const divisions = getGraphicsMode() === GRAPHICS_HIGH ? 64 : 32;
    const geometry = new SphereBufferGeometry(1, divisions, divisions);
    const material = new MeshLambertMaterial({ transparent: true, opacity: 0 });

    this.shader = undefined;
    let compiled = false;
    // Customise the lambert material
    material.onBeforeCompile = (shader: Object) => {
      if (compiled) return;
      compiled = true;
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

  onHover = (over: boolean, event: Object) => {
    // console.log(over ? 'over' : 'out', over ? event : '');
  };

  onEnd = () => {
    // console.log('end');
    this.scaleMesh(false);
  };

  preloadGpuCullScene = (culled: boolean) => {
    this.mesh.material.opacity = culled ? 1 : 0;
  };

  animateInit = () => {
    TweenLite.killTweensOf(this.mesh.material.opacity);
    this.mesh.material.opacity = 0;
  };

  async animateIn() {
    await new Promise((resolve, reject) => {
      TweenLite.to(this.mesh.material, 1, {
        opacity: 1,
        onComplete: () => {
          resolve();
        }
      });
    });
  }

  async animateOut() {
    await new Promise((resolve, reject) => {
      TweenLite.to(this.mesh.material, 1, {
        opacity: 0,
        onComplete: () => {
          resolve();
        }
      });
    });
  }

  scaleMesh = (over: boolean) => {
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
  update(delta: number) {
    if (this.shader) {
      this.shader.uniforms.time.value += delta;
    }
  }
}
