/**
 * A class to manage the state of the webgl app
 *
 * @export
 * @class AppState
 */
export default class AppState {
  ready: boolean;

  constructor(props: Object = {}) {
    this.ready = props.ready || false;
  }

  equals(state: AppState) {
    return this.ready === state.ready;
  }

  clone() {
    return new AppState({
      ready: this.ready
    });
  }
}
