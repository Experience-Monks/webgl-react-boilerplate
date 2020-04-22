import { GUI } from 'dat.gui';
import {
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
  Vector3,
  Points,
  Math as Math3,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderTarget
} from 'three';
import { vertexShader, fragmentShader } from './shader.glsl';
import ParticlesNormal from './particles-normal';
import { createRenderTarget } from '../../../../rendering/render-target';
import { getRenderBufferSize } from '../../../../rendering/resize';
import renderer from '../../../../rendering/renderer';

export default class Particles {
  config: Object;
  attributes: {
    [key: string]: BufferAttribute
  };
  mesh: Mesh;
  renderTarget: WebGLRenderTarget;
  scene: Scene;
  gui: GUI;

  constructor(gui: GUI, totalParticles: number, particlesNormal: ParticlesNormal, pixelRatio: number) {
    this.gui = gui.addFolder('particles');
    this.gui.open();

    // Config to adjust particles
    this.config = {
      totalParticles,
      size: {
        min: 0.1,
        max: 5
      }
    };

    // Create scene
    this.scene = new Scene();

    const { width, height } = getRenderBufferSize();
    this.renderTarget = createRenderTarget(width, height);

    // Create two attributes for positions and size
    this.attributes = {
      position: new BufferAttribute(new Float32Array(this.config.totalParticles * 3), 3),
      size: new BufferAttribute(new Float32Array(this.config.totalParticles), 1)
    };

    // Set initial position and scale for particles
    for (let i = 0; i < this.config.totalParticles; i++) {
      const { x, y, z } = this.spherePoint(0, 0, 0, Math.random(), Math.random(), Math3.randFloat(10, 50));
      this.attributes.position.setXYZ(i, x, y, z);

      const size = Math3.randFloat(this.config.size.min, this.config.size.max) * pixelRatio;
      this.attributes.size.setX(i, size);
    }

    // Setup buffer geometry
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', this.attributes.position);
    geometry.setAttribute('size', this.attributes.size);

    // Setup custom shader material
    const material = new ShaderMaterial({
      uniforms: {
        particleSize: { value: 100 }, // Scale particles uniformly
        lightDirection: { value: new Vector3(1, 1, 1) }, // Light direction for lambert shading
        normalMap: {
          value: particlesNormal.renderTarget.texture // Normal map
        }
      },
      vertexShader,
      fragmentShader
    });

    // Add gui slider to tweak light direction
    this.gui.add(material.uniforms.lightDirection.value, 'x', -1, 1).name('light x');
    this.gui.add(material.uniforms.lightDirection.value, 'y', -1, 1).name('light y');
    this.gui.add(material.uniforms.lightDirection.value, 'z', -1, 1).name('light z');

    // Create points mesh
    this.mesh = new Points(geometry, material);
    this.scene.add(this.mesh);
  }

  /**
   * Resize handler
   *
   * @memberof Particles
   */
  resize() {
    const { width, height } = getRenderBufferSize();
    this.renderTarget.setSize(width, height);
  }

  /**
   * Render the scene into the render target
   *
   * @param {number} delta
   * @param {PerspectiveCamera} camera
   * @memberof Particles
   */
  render(delta: number, camera: PerspectiveCamera) {
    this.mesh.rotation.y += delta * 0.1;
    renderer.setRenderTarget(this.renderTarget);
    renderer.render(this.scene, camera);
    renderer.setRenderTarget(null);
  }

  /**
   * Util for random spherical distribution
   *
   * @param {number} x0
   * @param {number} y0
   * @param {number} z0
   * @param {number} u
   * @param {number} v
   * @param {number} radius
   * @returns
   * @memberof Particles
   */
  spherePoint(x0: number, y0: number, z0: number, u: number, v: number, radius: number) {
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const x = x0 + radius * Math.sin(phi) * Math.cos(theta);
    const y = y0 + radius * Math.sin(phi) * Math.sin(theta);
    const z = z0 + radius * Math.cos(phi);
    return { x, y, z };
  }
}
