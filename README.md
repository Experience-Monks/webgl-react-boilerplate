# WebGL React App

![](https://img.shields.io/david/dev/jam3/webgl-react-app)
![](https://img.shields.io/github/license/jam3/webgl-react-app)

![WebGL React App](webgl-react-app.gif)

The goal is this project is to standardise WebGL and React based projects at Jam3.

Building upon experience it features highly optimised approaches for rendering and scene management.

This is a great starting place for creative coders who want to jump straight into coding webgl.

## Features

**Flow**

This Project uses [Flow](https://flow.org/) typing. A great place to start is with the [docs](https://flow.org/en/docs/) or this [cheatsheet](https://devhints.io/flow).

**Rendering**

- [Graphics profiling](src/webgl-app/rendering/profiler.js)
- Preload objects on [GPU](src/webgl-app/rendering/preload-gpu.js)
- Post Processing
  - [FXAA](src/webgl-app/rendering/post-processing/passes/fxaa.glsl.js) as a replacement for antialising when using PostProcessing on WebGL 1
  - [Film Pass](src/webgl-app/rendering/post-processing/passes/film.glsl.js) for a more filmic look
  - [Transition Pass](src/webgl-app/rendering/post-processing/passes/transition-pass/transition-pass.js) for blending between two webgl scenes
  - [Final Pass](src/webgl-app/rendering/post-processing/passes/final-pass/final-pass.js) Combine multiple effects in a single shader
- [Stats](src/webgl-app/utils/stats.js) for fps and threejs for performance insights

**Scenes**

- [BaseScene](src/webgl-app/scenes/base/base-scene.js), an extendable class that enforces a clean scene pattern
- [EventEmitter3](https://github.com/primus/eventemitter3) is used for event communication between classes

**Cameras**

- Helpers for [creating perspective cameras](src/webgl-app/cameras/cameras.js#L30) and adding [orbit controls](src/webgl-app/cameras/cameras.js#L41)

**Lights**

- Helpers added for [Ambient Light](src/webgl-app/lights/ambient.js), [Directional Light](src/webgl-app/lights/directional.js), [Point Light](src/webgl-app/lights/point.js) and [Spot Light](src/webgl-app/lights/spot.js)

**Materials**

- A [material modifier](src/webgl-app/utils/material-modifier.js) inspired by [three-material-modifier](https://github.com/jamieowen/three-material-modifier) that can extend three's built in Materials with custom shader code

**Interactions**

- [Touch Controls](src/webgl-app/interaction/touch-controls.js) for normalizing mouse and touch events
- [InteractiveObject](src/webgl-app/interaction/interactive-object.js) adds interactivity to meshes

**Asset Optimsing**

- [TextureOptimiser](scripts/assets/texture-optimiser.js) for compressing and resizing webgl textures
- [ModelOptimiser](scripts/assets/model-optimiser.js) for converting fbx models to gltf with draco compression

**Asset Management**

- [AssetLoader](src/webgl-app/loading/asset-loader.js) for loading an array of assets with different types
- [AssetManager](src/webgl-app/loading/asset-manager.js) for storing and retriving assets loaded with the AssetLoader

## Precommit and Husky

Sometimes husky doesn't run if you're using Git software.

To check this, open the console output in your Git software and make sure the pre-commit hook isn't bypassed.

If husky isn't working create a `~/.huskyrc` file and add:

```
# ~/.huskyrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

## References

- [Threejs documentation](https://threejs.org/docs/)
- [Discover threejs Tips and Tricks](https://discoverthreejs.com/tips-and-tricks/)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting
pull requests.

## License

[MIT](LICENSE)

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm eject`

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

### `npm build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
