import {
  Vector3,
  CatmullRomCurve3,
  PerspectiveCamera,
  Group,
  Mesh,
  SphereBufferGeometry,
  MeshBasicMaterial,
  Geometry,
  Line,
  LineBasicMaterial
} from 'three';
import EventEmitter from 'eventemitter3';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import renderer from '../../rendering/renderer';
import { GUIWrapper } from '../../utils/gui';

export type DollyPoint = {|
  x: number,
  y: number,
  z: number
|};

export interface DollyData {
  steps: number;
  origin: DollyPoint[];
  lookat: DollyPoint[];
}

export type HelperOptions = {
  linesVisible: boolean,
  controlsVisible: boolean,
  pointsVisible: boolean
};

const ORIGIN = 'origin';
const LOOKAT = 'lookat';

// Create reuseable geometry and materials
const helperGeometry = new SphereBufferGeometry(0.1, 16, 16);
const helperMaterial = new MeshBasicMaterial();
const helperLineMaterialOrigin = new LineBasicMaterial({
  color: 0xffffff
});
const helperLineMaterialLookat = new LineBasicMaterial({
  color: 0xffff00
});

export default class CameraDolly extends EventEmitter {
  steps: number;
  origin: Vector3[];
  lookat: Vector3[];
  curves: Object;

  constructor(
    id: string,
    data: DollyData,
    gui: GUI | GUIWrapper,
    camera: PerspectiveCamera,
    control: OrbitControls,
    helperOptions: HelperOptions
  ) {
    super();
    // Container to contain any 3d objects
    this.group = new Group();
    // Smoothness of camera path
    this.steps = data.steps;
    // The dev camera
    this.camera = camera;
    // Active orbit control
    this.control = control;
    // Origin points
    this.origin = [];
    // Lookat points
    this.lookat = [];
    // Create gui
    this.gui = gui.addFolder(`${id} camera dolly`);

    // Convert point to vectors
    data.origin.forEach((point: DollyPoint) => {
      this.origin.push(new Vector3(point.x, point.y, point.z));
    });

    data.lookat.forEach((point: DollyPoint) => {
      this.lookat.push(new Vector3(point.x, point.y, point.z));
    });

    // Create curves
    this.curves = {
      [ORIGIN]: this.createSmoothSpline(this.origin, this.steps),
      [LOOKAT]: this.createSmoothSpline(this.lookat, this.steps)
    };

    // Add transform controls
    this.controls = new Group();
    this.controls.visible = helperOptions.controlsVisible;
    this.group.add(this.controls);

    this.points = new Group();
    this.points.visible = helperOptions.pointsVisible;
    this.group.add(this.points);

    // List of positions from each path
    // These get updated from the transform controls
    this.curvePoints = {
      [ORIGIN]: [],
      [LOOKAT]: []
    };

    // Add a transform control for each point
    this.origin.forEach((point: Vector3, i: number) => {
      this.addControl(ORIGIN, i, point);
    });
    this.lookat.forEach((point: Vector3, i: number) => {
      this.addControl(LOOKAT, i, point);
    });

    // Create visible curves
    this.lines = new Group();
    this.lines.visible = helperOptions.linesVisible;
    // List of currently visible line meshes
    this.lineMeshes = [];
    this.group.add(this.lines);

    // Create helper lines to see the paths
    this.createLine(this.curves.origin.points, helperLineMaterialOrigin);
    this.createLine(this.curves.lookat.points, helperLineMaterialLookat);

    this.gui.add(this, 'steps', 5, 100, 1).onChange(this.rebuild);
    this.gui
      .add(this.controls, 'visible')
      .name('controls')
      .onChange((value: boolean) => {
        this.toggleControls(value);
      });
    this.gui.add(this.points, 'visible').name('points');
    this.gui.add(this.lines, 'visible').name('lines');
    this.gui.add(this, 'export');
    this.gui.open();
  }

  /**
   * Toggle the visibility of the helpers and gui
   *
   * @memberof CameraDolly
   */
  toggleVisibility = (visible: boolean) => {
    this.group.visible = visible;
    this.gui[visible ? 'open' : 'close']();
    this.toggleControls(visible);
  };

  /**
   * Toggle transform controls
   *
   * @param {boolean} enabled
   * @memberof CameraDolly
   */
  toggleControls(enabled: boolean) {
    for (let i = 0; i < this.controls.children.length; i++) {
      this.controls.children[i].enabled = this.controls.visible && this.group.visible;
    }
  }

  /**
   * Create a smooth spline from the data points
   *
   * @memberof CameraDolly
   */
  createSmoothSpline = (positions: Vector3[], totalPoints: number = 10) => {
    let curve = new CatmullRomCurve3(positions);
    const points = curve.getPoints(totalPoints);
    curve = new CatmullRomCurve3(points);
    return {
      curve,
      points
    };
  };

  /**
   * Get the camera origin and lookat by a nornalised time value 0 - 1
   *
   * @memberof Dolly
   */
  getCameraDataByTime = (time: number = 0) => {
    const origin: Vector3 = this.curves.origin.curve.getPointAt(time);
    const lookat: Vector3 = this.curves.lookat.curve.getPointAt(time);
    return {
      origin,
      lookat
    };
  };

  /**
   * Recreate the curves after the points change
   *
   * @memberof CameraDolly
   */
  updateSplines = () => {
    this.curves.origin = this.createSmoothSpline(this.origin, this.steps);
    this.curves.lookat = this.createSmoothSpline(this.lookat, this.steps);
  };

  /**
   * Add a transform control and helper
   *
   * @memberof CameraDolly
   */
  addControl = (id: string, index: number, point: Vector3) => {
    // Create mesh
    const mesh = new Mesh(helperGeometry, helperMaterial);
    mesh.position.copy(point);
    this.points.add(mesh);

    // Create control
    const control = new TransformControls(this.camera, renderer.domElement);
    control.enabled = this.controls.visible;
    this.controls.add(control);
    control.addEventListener('dragging-changed', this.onTransformChanged);
    control.attach(mesh);

    this.curvePoints[id][index] = mesh.position;
  };

  /**
   * Create a helper line for the curve
   *
   * @memberof CameraDolly
   */
  createLine = (vertices: Vector3[], material: LineBasicMaterial) => {
    const geometry = new Geometry();
    geometry.vertices = vertices;
    const line = new Line(geometry, material);
    this.lines.add(line);
    this.lineMeshes.push(line);
  };

  /**
   * Remove old lines
   *
   * @memberof CameraDolly
   */
  removeLines() {
    for (let i = 0; i < this.lineMeshes.length; i++) {
      this.lines.remove(this.lineMeshes[i]);
    }
  }

  /**
   * When the transform control is manipulated, disable the orbit controls
   *
   * @memberof CameraDolly
   */
  onTransformChanged = (event: any) => {
    this.control.enabled = !event.value;
    this.rebuild();
  };

  /**
   * Rebuild the curves and update the points
   *
   * @memberof CameraDolly
   */
  rebuild = () => {
    for (let i = 0; i < this.origin.length; i++) {
      this.origin[i].copy(this.curvePoints[ORIGIN][i]);
    }
    for (let i = 0; i < this.lookat.length; i++) {
      this.lookat[i].copy(this.curvePoints[LOOKAT][i]);
    }
    this.updateSplines();
    this.removeLines();
    this.createLine(this.curves.origin.points, helperLineMaterialOrigin);
    this.createLine(this.curves.lookat.points, helperLineMaterialLookat);
  };

  /**
   * Export data to json
   *
   * @memberof CameraDolly
   */
  export = () => {
    const data = JSON.stringify(
      {
        steps: this.steps,
        origin: this.origin,
        lookat: this.lookat
      },
      undefined,
      2
    );
    window.prompt('Copy to clipboard: Ctrl+C, Enter', data);
  };

  /**
   * Dispose
   *
   * @memberof CameraDolly
   */
  dispose = () => {
    for (let i = 0; i < this.controls.children.length; i++) {
      this.controls.children[i].removeEventListener('dragging-changed', this.onTransformDragChanged);
    }
  };
}
