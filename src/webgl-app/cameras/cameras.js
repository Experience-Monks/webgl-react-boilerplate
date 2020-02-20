import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import renderer from '../rendering/renderer';
import { VECTOR_ZERO } from '../utils/math';

export const FOV = 65;
const near = 0.1;
const far = 1000;

export function resetCamera(camera: PerspectiveCamera, value: Number = 1) {
  camera.position.set(1 * value, 1 * value, 1 * value);
  camera.lookAt(VECTOR_ZERO);
}

export function createPerspectiveCamera() {
  return new PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, near, far);
}

export function createOrbitControls(camera: PerspectiveCamera) {
  return new OrbitControls(camera, renderer.domElement);
}
