export default class AppState {
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
