import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import renderer from '../rendering/renderer';
import { VECTOR_ZERO, VECTOR_ONE } from '../utils/math';

// Perspective camera defaults
export const FOV = 65;
const near = 0.1;
const far = 1000;

/**
 * Reset the camera position
 *
 * @export
 * @param {PerspectiveCamera} camera
 * @param {number} [zoom=1]
 * @param {Vector3} [angle=VECTOR_ONE]
 */
export function resetCamera(camera: PerspectiveCamera, zoom: number = 1, angle: Vector3 = VECTOR_ONE) {
  camera.position.set(angle.x * zoom, angle.y * zoom, angle.z * zoom);
  camera.lookAt(VECTOR_ZERO);
}

/**
 * Utility for creating a perspective camera
 *
 * @export
 * @returns
 */
export function createPerspectiveCamera(aspect: number): PerspectiveCamera {
  return new PerspectiveCamera(FOV, aspect, near, far);
}

/**
 * Utility for creating orbit controls
 *
 * @export
 * @param {PerspectiveCamera} camera
 * @returns
 */
export function createOrbitControls(camera: PerspectiveCamera): OrbitControls {
  return new OrbitControls(camera, renderer.domElement);
}
