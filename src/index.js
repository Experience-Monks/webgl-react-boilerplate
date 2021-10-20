import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import graphics from './webgl-app/rendering/graphics';

const root = document.getElementById('root');

graphics.run().then(() => {
  if (root) ReactDOM.render(<App />, root);
});
