import EventEmitter from 'eventemitter3';
import Asset from '../asset';

/**
 *
 *
 * @class Loader
 * @extends {EventEmitter}
 */
class Loader extends EventEmitter {
  asset: Asset;
  static json = 'json';
  static image = 'image';
  static threeGLTF = 'gltf';
  static threeTexture = 'texture';
}

export default Loader;
