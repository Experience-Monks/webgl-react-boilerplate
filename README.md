# WebGL React App

The goal is this project is to standardise WebGL and React based projects at Jam3.

Building upon experience it features highly optimised approaches for rendering and scene management.

This is a great starting place for creative coders who want to jump straight into coding webgl.

## Features

**Rendering**

- Graphics profiling using [detect-gpu](https://github.com/TimvanScherpenzeel/detect-gpu)
- Preload objects on [GPU](https://medium.com/@hellomondaycom/how-we-built-the-google-cloud-infrastructure-webgl-experience-dec3ce7cd209)
- Post Processing
  - FXAA as a replacement for antialising when using PostProcessing on WebGL 1
  - Film Pass for a more filmic look
  - Transition Pass for blending between two webgl scenes
- [Stats](blob/develop/src/webgl-app/utils/stats.js) for fps and threejs for performance insights

**Scenes**

- BaseScene, an extendable class that enforces a clean scene pattern
- Event Emitter is used for event communication between classes

**Cameras**

- Helpers for creating perspective cameras and adding orbit controls

**Lights**

- Helpers added for `Ambient Light, Directional Light, Point Light and Spot Light`

**Materials**

- A material modifier inspired by [three-material-modifier](https://github.com/jamieowen/three-material-modifier) that can extend three's built in Materials with custom shader code

**Interactions**

- [Touch Controls](blob/develop/src/webgl-app/interaction/touch-controls.js) for normalizing mouse and touch events
- [InteractiveObject](blob/develop/src/webgl-app/interaction/interactive-object.js), a raycasting helper for interactive meshes

## References

- [Threejs documentation](https://threejs.org/docs/)
- [Discover threejs Tips and Tricks](https://discoverthreejs.com/tips-and-tricks/)

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
