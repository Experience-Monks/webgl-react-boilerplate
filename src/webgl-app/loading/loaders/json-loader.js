import Loader from './loader';
import Asset from '../asset';

/**
 * Json loader
 *
 * @export
 * @class JsonLoader
 * @extends {Loader}
 */
export default class JsonLoader extends Loader {
  constructor(asset: Asset) {
    super();
    this.asset = asset;
  }

  load = () => {
    const req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState !== 4) return;
      if (req.readyState === 4 && req.status === 200) {
        this.asset.data = JSON.parse(req.responseText);
        this.emit('loaded', this.asset);
      } else {
        this.emit('error', `Failed to load ${this.asset.src}`);
      }
    };

    req.open('GET', this.asset.src, true);
    req.send();
  };
}
