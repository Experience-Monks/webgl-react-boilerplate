import Loader from './loader';
import Asset from '../asset';

/**
 * Image Loader
 *
 * @export
 * @class ImageLoader
 * @extends {Loader}
 */
export default class ImageLoader extends Loader {
  constructor(asset: Asset) {
    super();
    this.asset = asset;
  }

  load = () => {
    const image = new Image();

    image.onload = () => {
      this.asset.data = image;
      this.emit('loaded', this.asset);
    };

    image.onerror = () => {
      this.emit('error', `Failed to load ${this.asset.src}`);
    };

    image.src = this.asset.src;
  };
}
