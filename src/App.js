import React from 'react';
import './App.css';
import WebGLApp from './webgl-app/webgl-app';

class App extends React.PureComponent {
  componentDidMount() {
    this.webglApp = new WebGLApp(this.container);
    window.addEventListener('resize', this.onResize);

    this.webglApp
      .setup()
      .then(() => {
        this.webglApp.render(true);
      })
      .catch((error: String) => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this.webglApp.render(false);
    this.webglApp.dispose();
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.webglApp.resize(window.innerWidth, window.innerHeight);
  };

  render() {
    return (
      <div
        className="App"
        ref={node => {
          this.container = node;
        }}
      ></div>
    );
  }
}

export default App;
