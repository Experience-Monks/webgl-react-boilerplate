import { TweenLite } from 'gsap/gsap-core';
import { Mesh, RingBufferGeometry, ShaderMaterial } from 'three';
import BaseScene from '../base/base-scene';
import { TWO_PI, VECTOR_ZERO } from '../../utils/math';
import settings from '../../settings';

export const PRELOADER_SCENE_ID = 'preloader';

export default class PreloaderScene extends BaseScene {
  constructor() {
    super({ id: PRELOADER_SCENE_ID });
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(VECTOR_ZERO);
  }

  /**
   * Create and setup any objects for the scene
   *
   * @memberof PreloaderScene
   */
  async createSceneObjects() {
    await new Promise((resolve, reject) => {
      try {
        // Create a spinner mesh to show loading progression
        this.spinner = new Mesh(
          new RingBufferGeometry(0.9, 1, 32, 1, 0, TWO_PI * 0.75),
          new ShaderMaterial({
            transparent: true,
            uniforms: {
              opacity: { value: 0 }
            },
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform float opacity;
              varying vec2 vUv;
              void main() {
                gl_FragColor = vec4(vUv, 1.0, vUv.y * opacity);
              }
          `
          })
        );
        this.spinner.name = 'spinner';
        this.scene.add(this.spinner);
        this.animateInit();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  preloadGpuCullScene = (culled: boolean) => {
    this.spinner.material.uniforms.opacity.value = culled ? 1 : 0;
  };

  animateInit = () => {
    TweenLite.killTweensOf(this.spinner.material.uniforms.opacity);
    this.spinner.material.uniforms.opacity.value = 0;
  };

  async animateIn() {
    await new Promise((resolve, reject) => {
      if (settings.skipTransitions) {
        resolve();
        return;
      }
      TweenLite.to(this.spinner.material.uniforms.opacity, 1, {
        value: 1,
        onComplete: () => {
          resolve();
        }
      });
    });
  }

  async animateOut() {
    await new Promise((resolve, reject) => {
      if (settings.skipTransitions) {
        resolve();
        return;
      }
      TweenLite.to(this.spinner.material.uniforms.opacity, 1, {
        value: 0,
        onComplete: () => {
          resolve();
        }
      });
    });
  }

  /**
   * Update loop
   *
   * @memberof PreloaderScene
   */
  update = (delta: number) => {
    this.spinner.rotation.z -= delta * 2;
  };
}
