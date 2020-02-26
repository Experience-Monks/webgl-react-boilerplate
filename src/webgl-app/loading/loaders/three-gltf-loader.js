import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Loader from './loader';
import Asset from '../asset';

// Use the draco loader for gltf if the glb file is compressed with draco
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/assets/lib/draco/gltf/');
dracoLoader.preload();

export default class ThreeGLTFLoader extends Loader {
  constructor(asset: Asset) {
    super();
    this.asset = asset;
  }

  load = () => {
    var loadStartTime = performance.now();
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const onLoaded = gltf => {
      this.asset.data = gltf;
      console.info('Load time: ' + (performance.now() - loadStartTime).toFixed(2) / 1000 + ' s.');
      this.emit('loaded', this.asset);
    };

    const onError = () => {
      this.emit('error', `Failed to load ${this.asset.src}`);
    };

    loader.load(this.asset.src, onLoaded, null, onError);
  };
}
