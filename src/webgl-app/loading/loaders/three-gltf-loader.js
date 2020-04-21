import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Loader from './loader';
import Asset from '../asset';
import settings from '../../settings';

// Use the draco loader for gltf if the glb file is compressed with draco
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(`${settings.baseUrl}/assets/lib/draco/gltf/`);
dracoLoader.preload();

/**
 * Threejs GLTF Loader
 *
 * @export
 * @class ThreeGLTFLoader
 * @extends {Loader}
 */
export default class ThreeGLTFLoader extends Loader {
  constructor(asset: Asset) {
    super();
    this.asset = asset;
  }

  load = () => {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const onLoaded = (gltf: Object) => {
      this.asset.data = gltf;
      this.emit('loaded', this.asset);
    };

    const onError = () => {
      this.emit('error', `Failed to load ${this.asset.src}`);
    };

    loader.load(this.asset.src, onLoaded, null, onError);
  };
}
