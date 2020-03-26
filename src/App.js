import React from 'react';
import { TweenLite } from 'gsap/gsap-core';
import './App.css';
import WebGLApp from './webgl-app/webgl-app';
import AppState from './webgl-app/app-state';

type Props = {};

type State = {|
  ready: boolean,
  windowSize: { width: number, height: number }
|};

class App extends React.PureComponent<Props, State> {
  state = {
    ready: false,
    windowSize: { width: window.innerWidth, height: window.innerHeight }
  };

  componentDidMount() {
    if (this.container === null) return;
    this.webglApp = new WebGLApp(this.container);
    this.webglApp
      .setup()
      .then(() => {
        this.webglApp.setState(new AppState(this.state));
        this.webglApp.render(true);
        TweenLite.delayedCall(1, this.onReady);
      })
      .catch((error: String) => {
        console.log(error);
      });

    window.addEventListener('resize', this.onResize);
  }

  componentDidUpdate(prevProps: Object, prevState: Object) {
    if (this.container === null) return;

    this.webglApp.setState(new AppState(this.state));

    if (
      this.state.windowSize.width !== prevState.windowSize.width ||
      this.state.windowSize.height !== prevState.windowSize.height
    ) {
      // Resize the app
      this.webglApp.resize(this.state.windowSize.width, this.state.windowSize.height);
    }
  }

  componentWillUnmount() {
    if (this.container === null) return;
    this.webglApp.render(false);
    window.removeEventListener('resize', this.onResize);
  }

  container: HTMLElement | null;
  webglApp: WebGLApp;

  onReady = () => {
    this.setState({
      ready: true
    });
  };

  onResize = () => {
    this.setState({
      windowSize: { width: window.innerWidth, height: window.innerHeight }
    });
  };

  render() {
    return (
      <div
        className="App"
        ref={(node: HTMLElement | null) => {
          this.container = node;
        }}
      ></div>
    );
  }
}

export default App;
