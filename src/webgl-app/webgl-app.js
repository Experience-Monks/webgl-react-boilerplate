import EventEmitter from 'eventemitter3';
import { Clock, GridHelper, AxesHelper, CameraHelper, Group, DirectionalLight, AmbientLight } from 'three';
import renderer, { setRendererSize, rendererSize } from './renderer';
import settings from './settings';
import scene from './scene';
import * as cameras from './cameras';
import { rendererStats } from './utils/stats';
import { setQuery } from './utils/query-params';
import { gui } from './utils/gui';
import Sphere from './objects/sphere/sphere';

class WebGLApp extends EventEmitter {
  constructor(parent: HTMLElement) {
    super();
    parent.appendChild(renderer.domElement);

    this.clock = new Clock(true);
    this.rafId = 0;
    this.delta = 0;
    this.isRendering = false;

    // Add helpers
    this.helpers = new Group();
    this.helpers.add(new GridHelper(10, 10), new AxesHelper(), new CameraHelper(cameras.main));
    this.helpers.visible = settings.helpers;
    scene.add(this.helpers);

    const guiSettings = gui.addFolder('settings');
    guiSettings.open();

    guiSettings.add(settings, 'devCamera').onChange((value: Boolean) => {
      setQuery('devCamera', value);
    });
    guiSettings.add(settings, 'helpers').onChange((value: Boolean) => {
      this.helpers.visible = value;
      setQuery('helpers', value);
    });

    // Lights
    const ambientLight = new AmbientLight();
    const directionLight = new DirectionalLight();
    directionLight.position.set(1, 1, 1);
    scene.add(ambientLight, directionLight);
  }

  setup = () => {
    return new Promise((resolve, reject) => {
      try {
        this.sphere = new Sphere();
        scene.add(this.sphere.mesh);
        resolve();
      } catch (error) {
        reject();
      }
    });
  };

  resize = (width: Number, height: Number) => {
    setRendererSize(width, height);
    cameras.dev.aspect = width / height;
    cameras.main.aspect = width / height;
    cameras.dev.updateProjectionMatrix();
    cameras.main.updateProjectionMatrix();
  };

  renderScene = (camera: PerspectiveCamera, left: Number, bottom: Number, width: Number, height: Number) => {
    left *= rendererSize.x;
    bottom *= rendererSize.y;
    width *= rendererSize.x;
    height *= rendererSize.y;
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.render(scene, camera);
  };

  render = (render: Boolean) => {
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

    this.sphere.update(this.delta);

    if (settings.devCamera) {
      this.renderScene(cameras.dev, 0, 0, 1, 1);
      this.renderScene(cameras.main, 0, 0, 0.25, 0.25);
    } else {
      this.renderScene(cameras.main, 0, 0, 1, 1);
    }

    if (settings.stats) {
      rendererStats.update(renderer);
    }
  };

  dispose = () => {};
}

export default WebGLApp;
