import EventEmitter from 'eventemitter3';
import Asset from './asset';
import GroupLoader from './loaders/group-loader';

/**
 * Assetloader configures an instance of GroupLoader
 * and should be used for loading any asset groups for the asset manager
 *
 * @class AssetLoader
 * @extends {EventEmitter}
 */
class AssetLoader extends EventEmitter {
  load = (id: string, assets: Asset[]) => {
    const loader = new GroupLoader({ id });
    assets.forEach(asset => {
      if (asset.args === undefined) asset.args = {};
    });

    loader.on('progress', response => {
      this.emit('progress', response);
    });

    loader.once('loaded', response => {
      this.emit('loaded', response);
    });

    loader.once('error', error => {
      this.emit('error', error);
    });

    loader.load(assets);
  };
}

export default new AssetLoader();
