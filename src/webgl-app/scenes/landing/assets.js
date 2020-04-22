import Asset from '../../loading/asset';
import Loader from '../../loading/loaders/loader';
import settings from '../../settings';

export default [
  new Asset({
    id: 'jam3-logo',
    src: `${settings.baseUrl}/assets/webgl/landing/jam3.glb`,
    type: Loader.threeGLTF
  })
];
