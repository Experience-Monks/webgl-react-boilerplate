import Asset from '../../loading/asset';
import Loader from '../../loading/loaders/loader';
import settings from '../../settings';

export default [
  new Asset({
    id: 'test-image',
    src: `${settings.baseUrl}/assets/webgl/test/test-128.jpg`,
    type: Loader.image
  }),
  new Asset({
    id: 'test-json',
    src: `${settings.baseUrl}/assets/webgl/test/test.json`,
    type: Loader.json
  }),
  new Asset({
    id: 'test-texture',
    src: `${settings.baseUrl}/assets/webgl/test/test-128.jpg`,
    type: Loader.threeTexture
  }),
  new Asset({
    id: 'scene-gltf',
    src: `${settings.baseUrl}/assets/webgl/test/scene.glb`,
    type: Loader.threeGLTF
  }),
  new Asset({
    id: 'cube-fbx',
    src: `${settings.baseUrl}/assets/webgl/test/cube.fbx`,
    type: Loader.threeFBX
  })
];
