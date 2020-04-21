import { BufferGeometry, BufferAttribute } from 'three';

/**
 * Return a triangle that covers screen-space
 * Mainly used for post processing
 * https://github.com/mikolalysenko/a-big-triangle
 *
 * @export
 * @returns
 */
export function bigTriangle() {
  const geometry = new BufferGeometry();
  const attribute = new BufferAttribute(new Float32Array([-1, -1, 0, -1, 4, 0, 4, -1, 0]), 3);
  geometry.setAttribute('position', attribute);
  geometry.setIndex([0, 2, 1]);
  return geometry;
}
