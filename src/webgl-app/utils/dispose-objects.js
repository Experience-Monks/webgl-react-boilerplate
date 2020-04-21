import { Object3D, Scene } from 'three';

/**
 * Recursively dispose threejs objects
 *
 * @export
 * @param {Object3D} object
 * @param {(Scene | Object3D)} parent
 * @returns
 */
export default function disposeObjects(object: Scene | Object3D, parent: Scene | Object3D) {
  if (object === null || object === undefined) return;
  if (parent) parent.remove(object);
  if (object.dispose) {
    object.dispose();
  }
  if (object.geometry) {
    object.geometry.dispose();
  }
  if (object.material) {
    object.material.dispose();
  }
  if (object.children) {
    let i = 0;
    const l = object.children.length;
    while (i < l) {
      disposeObjects(object.children[0], object);
      i++;
    }
  }
  if (object.type === 'Scene') object.dispose();
  object = null;
}
