import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import renderer from "./renderer";
import { VECTOR_ZERO } from "./utils/math";

export const FOV = 65;
const near = 0.1;
const far = 1000;

export function zoom(camera: PerspectiveCamera, value: Number = 1) {
  camera.position.set(1 * value, 1 * value, 1 * value);
  camera.lookAt(VECTOR_ZERO);
}

export function createPerspectiveCamera() {
  return new PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, near, far);
}

export const dev = createPerspectiveCamera();
export const main = createPerspectiveCamera();
export default {
  dev,
  main
};

export const devControls = new OrbitControls(dev, renderer.domElement);
export const mainControls = new OrbitControls(main, renderer.domElement);

zoom(dev, 5);
zoom(main, 5);
