import { TextureLoader } from 'three';
import Loader from './loader';
import Asset from '../asset';

/**
 * Threejs texture loader
 *
 * @export
 * @class ThreeTextureLoader
 * @extends {Loader}
 */
export default class ThreeTextureLoader extends Loader {
  constructor(asset: Asset) {
    super();
    this.asset = asset;
  }

  load = () => {
    const loader = new TextureLoader();

    const onLoaded = texture => {
      this.asset.data = texture;
      this.emit('loaded', this.asset);
    };

    const onError = () => {
      this.emit('error', `Failed to load ${this.asset.src}`);
    };

    loader.load(this.asset.src, onLoaded, null, onError);
  };
}
