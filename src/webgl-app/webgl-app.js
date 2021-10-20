import EventEmitter from 'eventemitter3';
import { Clock, Vector4, PerspectiveCamera, Group, GridHelper, AxesHelper, Scene, Mesh } from 'three';
import renderer from './rendering/renderer';
import { setRendererSize, rendererSize } from './rendering/resize';
import settings from './settings';
import { rendererStats } from './utils/stats';
import { setQuery } from './utils/query-params';
import { gui } from './utils/gui';
import { devCamera, mainCamera } from './cameras/cameras';
import Ambient from './lights/ambient';
import Directional from './lights/directional';
import scene from './scene';
import assets from './assets';
import assetLoader from './loading/asset-loader';
import assetManager from './loading/asset-manager';
import Asset from './loading/asset';

class WebGLApp extends EventEmitter {
  helpers: Group = new Group();
  clock: Clock = new Clock(true);
  rafId: AnimationFrameID;
  delta: number = 0;
  isRendering: boolean = false;
  id: string = 'app';

  constructor(parent: HTMLElement) {
    super();
    parent.appendChild(renderer.domElement);

    this.viewport = {
      debug: new Vector4(
        0,
        0,
        rendererSize.x * settings.viewportPreviewScale,
        rendererSize.y * settings.viewportPreviewScale
      ),
      main: new Vector4(0, 0, rendererSize.x, rendererSize.y)
    };

    const guiSettings = gui.addFolder('settings');
    guiSettings.open();

    guiSettings.add(settings, 'devCamera').onChange((value: string) => {
      setQuery('devCamera', value);
    });

    guiSettings.add(settings, 'helpers').onChange((value: string) => {
      setQuery('helpers', value);
      this.toggleHelpers(value);
    });

    const lights = [new Ambient(), new Directional()];

    const guiLights = gui.addFolder('lights');
    guiLights.open();
    lights.forEach(light => {
      scene.add(light.light);
      light.gui(guiLights);
    });

    this.helpers.add(new GridHelper(10, 10), new AxesHelper());
    this.helpers.visible = settings.helpers;
    scene.add(this.helpers);
  }

  toggleHelpers = (visible: boolean = true) => {
    this.helpers.visible = visible;
  };

  async setup() {
    return this.loadAssets().then(this.createContent);
  }

  loadAssets() {
    return new Promise((resolve, reject) => {
      try {
        if (assets.length > 0) {
          assetLoader.once('loaded', (response: Asset[]) => {
            if (response.length > 0) assetManager.add(this.id, response);
            resolve();
          });
          assetLoader.once('error', error => {
            reject(error);
          });
          assetLoader.load(this.id, assets);
        } else {
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  createContent = () => {
    const asset = assetManager.get(this.id, 'jam3-logo');
    if (typeof asset === 'object' && asset !== null) {
      const scene: Scene = asset.scene;
      const model: Mesh = scene.children[0]?.children[0];
      const scale = 20;
      model.scale.set(scale, scale, scale);
    }
    scene.add(asset.scene);
  };

  resize = (width: number, height: number) => {
    setRendererSize(renderer, width, height);
    this.viewport.debug.set(
      0,
      0,
      rendererSize.x * settings.viewportPreviewScale,
      rendererSize.y * settings.viewportPreviewScale
    );
    this.viewport.main.set(0, 0, rendererSize.x, rendererSize.y);
    devCamera.aspect = width / height;
    devCamera.updateProjectionMatrix();
    mainCamera.aspect = width / height;
    mainCamera.updateProjectionMatrix();
  };

  renderScene = (camera: PerspectiveCamera, viewport: Vector4, delta: number) => {
    renderer.setViewport(viewport.x, viewport.y, viewport.z, viewport.w);
    renderer.setScissor(viewport.x, viewport.y, viewport.z, viewport.w);
    renderer.render(scene, camera);
  };

  render = (render: boolean) => {
    if (this.isRendering === render) return;
    this.isRendering = render;
    if (render) {
      this.update();
    } else {
      cancelAnimationFrame(this.rafId);
    }
  };

  update = () => {
    this.rafId = requestAnimationFrame(this.update);
    this.delta = this.clock.getDelta();

    if (settings.devCamera) {
      this.renderScene(devCamera, this.viewport.main, this.delta);
      this.renderScene(mainCamera, this.viewport.debug, this.delta);
    } else {
      this.renderScene(mainCamera, this.viewport.main, this.delta);
    }

    if (settings.stats) {
      rendererStats.update(renderer);
    }
  };
}

export default WebGLApp;
