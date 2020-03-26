import EventEmitter from 'eventemitter3';
import Asset from '../asset';

/**
 * Base loader
 *
 * @class Loader
 * @extends {EventEmitter}
 */
class Loader extends EventEmitter {
  asset: Asset;
  static json: string = 'json';
  static image: string = 'image';
  static threeFBX: string = 'fbx';
  static threeGLTF: string = 'gltf';
  static threeTexture: string = 'texture';
}

export default Loader;
