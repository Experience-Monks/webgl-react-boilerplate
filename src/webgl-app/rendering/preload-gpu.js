import { Scene, PerspectiveCamera, RGBAFormat, Object3D } from 'three';
import renderer from './renderer';
import { createRenderTarget } from './render-target';
import RenderTargetHelper from '../utils/render-target-helper';

const RENDER_TARGET_SIZE = 128;
const RENDER_TARGET_DEBUG = false;

const renderTarget = createRenderTarget(RENDER_TARGET_SIZE, RENDER_TARGET_SIZE, {
  depthBuffer: false,
  format: RGBAFormat
});

let renderTargetHelper;
if (RENDER_TARGET_DEBUG) {
  renderTargetHelper = new RenderTargetHelper(renderTarget);
}

// https://medium.com/@hellomondaycom/how-we-built-the-google-cloud-infrastructure-webgl-experience-dec3ce7cd209
function setAllCulled(obj: Object3D, overrideCulled: boolean) {
  if (overrideCulled === false) {
    obj.wasFrustumCulled = obj.frustumCulled;
    obj.wasVisible = obj.visible;
    obj.visible = true;
    obj.frustumCulled = false;
  } else {
    obj.visible = obj.wasVisible;
    obj.frustumCulled = obj.wasFrustumCulled;
  }
  obj.children.forEach(child => setAllCulled(child, overrideCulled));
}

export default function preloadGpu(scene: Scene, camera: PerspectiveCamera) {
  const cameraAspect = camera.aspect;
  camera.aspect = 1;
  camera.updateProjectionMatrix();
  setAllCulled(scene, false);
  renderer.setRenderTarget(renderTarget);
  renderer.render(scene, camera);
  if (RENDER_TARGET_DEBUG) renderTargetHelper.update();
  renderer.setRenderTarget(null);
  camera.aspect = cameraAspect;
  camera.updateProjectionMatrix();
  setAllCulled(scene, true);
}
