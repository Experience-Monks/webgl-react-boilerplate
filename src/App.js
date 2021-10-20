import React from 'react';
import './App.css';
import WebGLApp from './webgl-app/webgl-app';

class App extends React.PureComponent<{}, {}> {
  componentDidMount() {
    if (this.container === null) return;
    this.webglApp = new WebGLApp(this.container);
    this.webglApp
      .setup()
      .then(() => {
        this.onResize();
        this.webglApp.render(true);
      })
      .catch((error: string) => {
        console.log(error);
      });

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    if (this.container === null) return;
    // this.webglApp.render(false);
    window.removeEventListener('resize', this.onResize);
  }

  container: HTMLElement | null;
  webglApp: WebGLApp;

  onResize = () => {
    this.webglApp.resize(window.innerWidth, window.innerHeight);
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
