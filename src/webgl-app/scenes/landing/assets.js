import Asset from '../../loading/asset';
import Loader from '../../loading/loaders/loader';

export default [
  new Asset({
    id: 'test-image',
    src: '/assets/webgl/test/test-128.jpg',
    type: Loader.image
  }),
  new Asset({
    id: 'test-json',
    src: '/assets/webgl/test/test.json',
    type: Loader.json
  }),
  new Asset({
    id: 'test-texture',
    src: '/assets/webgl/test/test-128.jpg',
    type: Loader.threeTexture
  }),
  new Asset({
    id: 'test-gltf',
    src: '/assets/webgl/test/test.glb',
    type: Loader.threeGLTF
  })
];
