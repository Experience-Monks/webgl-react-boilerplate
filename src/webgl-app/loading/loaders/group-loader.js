import EventEmitter from 'eventemitter3';
import detect from '@jam3/detect';
import Asset from '../asset';
import Loader from './loader';
import ImageLoader from './image-loader';
import JsonLoader from './json-loader';
import ThreeTextureLoader from './three-texture-loader';
import ThreeFBXLoader from './three-fbx-loader';
import ThreeGLTFLoader from './three-gltf-loader';

const LOADERS = {
  [Loader.image]: ImageLoader,
  [Loader.json]: JsonLoader,
  [Loader.threeTexture]: ThreeTextureLoader,
  [Loader.threeFBX]: ThreeFBXLoader,
  [Loader.threeGLTF]: ThreeGLTFLoader
};

/**
 * Group loader loads an array of assets based on their asset types
 *
 * @export
 * @class GroupLoader
 * @extends {EventEmitter}
 */
export default class GroupLoader extends EventEmitter {
  constructor(options: Object = {}) {
    super();
    this.id = options.id || '';
    this.minParallel = options.minParallel || 5;
    this.maxParallel = options.maxParallel || 10;
    // How many parallel loads at once
    this.parallelLoads = detect.device.isDesktop ? this.maxParallel : this.minParallel;
  }

  load = (manifest: Asset[]) => {
    this.loaders = [];

    manifest.forEach(asset => {
      if (LOADERS[asset.type] !== undefined) {
        this.loaders.push(new LOADERS[asset.type](asset));
      }
    });

    this.loaded = 0;
    this.queue = 0;
    this.currentParallel = 0;
    this.total = this.loaders.length;

    if (this.total === 0) {
      this.emit('loaded', manifest);
    } else {
      this.loadNextInQueue();
    }
  };

  /**
   * Load the next in queue
   *
   * @memberof GroupLoader
   */
  loadNextInQueue = () => {
    if (this.queue < this.total) {
      if (this.currentParallel < this.parallelLoads) {
        const loader = this.loaders[this.queue];
        this.queue += 1;
        this.currentParallel += 1;
        loader.once('loaded', this.onLoaded);
        loader.once('error', this.onError);
        loader.load();
        this.loadNextInQueue();
      }
    }
  };

  /**
   * Loaded handler
   *
   * @memberof GroupLoader
   */
  onLoaded = () => {
    this.loaded += 1;
    // console.log(`${this.id} loaded`, this.loaded, '/', this.total);
    this.emit('progress', this.loaded / this.total);
    if (this.loaded === this.total) {
      const assets = [];
      this.loaders.forEach((loader: Loader) => {
        assets.push(loader.asset);
      });
      this.emit('loaded', assets);
    } else {
      this.currentParallel -= 1;
      this.loadNextInQueue();
    }
  };

  /**
   * Error handler
   *
   * @memberof GroupLoader
   */
  onError = (error: string) => {
    this.emit('error', error);
  };
}
