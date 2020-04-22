import { GUI } from 'dat.gui';
import { Mesh, Group, ShaderMaterial, WebGLRenderTarget, Vector2, Vector3, PerspectiveCamera, Scene } from 'three';
import assetManager from '../../../../loading/asset-manager';
import { vertexShader, fragmentShader } from './shader.glsl';
import { getRenderBufferSize } from '../../../../rendering/resize';

export default class Jam3 {
  shader: Object;
  mesh: Mesh;
  group: Group;
  material: ShaderMaterial;
  gui: GUI;

  constructor(gui: GUI, particleMap: WebGLRenderTarget) {
    this.gui = gui.addFolder('Jam3');
    this.gui.open();
    this.group = new Group();

    // Setup material
    const { width, height } = getRenderBufferSize();
    this.material = new ShaderMaterial({
      uniforms: {
        particleMap: {
          value: particleMap.texture
        },
        resolution: {
          value: new Vector2(width, height)
        },
        cameraPosition: {
          value: new Vector3(1, 1, 1)
        },
        fresnelPow: {
          value: 25
        }
      },
      vertexShader,
      fragmentShader
    });

    const asset = assetManager.get('landing', 'jam3-logo');

    // Make sure asset exists
    if (typeof asset === 'object' && asset !== null) {
      const scene: Scene = asset.scene;
      const model: Mesh = scene.children[0]?.children[0];
      const scale = 300;
      model.scale.set(scale, scale, scale);

      model.children.forEach((mesh: Mesh) => {
        mesh.material = this.material;
      });

      this.group.add(model);
    }

    // Gui controls
    this.gui.add(this.material.uniforms.fresnelPow, 'value', 0, 50).name('fresnelPow');
  }

  /**
   * Resize handler
   *
   * @memberof Jam3
   */
  resize() {
    const { width, height } = getRenderBufferSize();
    this.material.uniforms.resolution.value.set(width, height);
  }

  /**
   * Update handler
   *
   * @param {PerspectiveCamera} camera
   * @memberof Jam3
   */
  update(camera: PerspectiveCamera) {
    this.material.uniforms.cameraPosition.value.copy(camera.position);
  }
}
