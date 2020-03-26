/**
 * Create a canvas and 2d context
 *
 * @export
 * @param {Number} width
 * @param {Number} height
 * @returns
 */
export default function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  return {
    ctx,
    canvas
  };
}
