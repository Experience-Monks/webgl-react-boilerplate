const fs = require('fs');
const shell = require('shelljs');
const convert = require('fbx2gltf');
const fileExtension = require('file-extension');
const configTemplate = require('./config').models;

/*
 * Convert or copy models from
 * the source to destination directory
 *
 * Preview your glb files with: https://gltf-viewer.donmccurdy.com/
 * fbx2gltf plugin: https://www.npmjs.com/package/fbx2gltf
 * GLTFLoader documentation: https://threejs.org/docs/#examples/en/loaders/GLTFLoader
 */
module.exports = class ModelOptimiser {
  constructor() {
    this.files = [];
  }

  add(directory, name, extension) {
    const fileName = `${name}.${extension}`;
    const filePath = `${directory}/${fileName}`;
    this.files.push({ filePath, fileName, name, extension });
  }

  includes(file) {
    return /(obj|fbx|glb|gltf)$/i.test(file);
  }

  copy(file, fileDest) {
    return new Promise((resolve, reject) => {
      const output = shell.cp('-f', file, fileDest);
      if (output.code === 0) {
        resolve();
      } else {
        reject(output.stderr);
      }
    });
  }

  convert(file, fileDest) {
    return new Promise((resolve, reject) => {
      convert(file, fileDest, ['--khr-materials-unlit', '--draco', '--verbose', '--no-flip-v']).then(
        destPath => {
          resolve();
        },
        error => {
          reject(error);
        }
      );
    });
  }

  validateConfig(configFile) {
    return configFile.models !== undefined;
  }

  process(folderName, srcDirectory, destDirectory) {
    return new Promise((resolve, reject) => {
      try {
        if (this.files.length === 0) {
          resolve();
          return;
        }

        const tmpDirectory = `${srcDirectory}/tmp-models`;
        shell.mkdir('-p', tmpDirectory);

        // Check of the current directory includes a config file
        let config = {};
        try {
          const file = Object.assign(config, JSON.parse(fs.readFileSync(`${srcDirectory}/config.json`)));
          if (this.validateConfig(file)) config = file.models;
        } catch (error) {}

        const queue = [];
        this.files.forEach(data => {
          const fileConfig = config[data.fileName] || configTemplate;
          // Only convert models if the flag is true
          if (fileConfig.convert) {
            const fileDest = `${tmpDirectory}/${data.name}.glb`;
            queue.push(this.convert(data.filePath, fileDest));
          } else {
            const fileDest = `${tmpDirectory}/`;
            queue.push(this.copy(data.filePath, fileDest));
          }
        });

        Promise.all(queue)
          .then(() => {
            // Create destination path
            const destinationDirectory = `${destDirectory}/${folderName}`;

            // Remove old files
            shell.ls(destinationDirectory).forEach(file => {
              const extension = fileExtension(file);
              if (this.includes(extension)) {
                const fullPath = `${destinationDirectory}/${file}`;
                shell.rm(fullPath);
              }
            });

            // Make directory if it doesn't exist
            shell.mkdir('-p', destinationDirectory);

            // Copy new files to destination directory
            shell.cp(`${tmpDirectory}/*`, destinationDirectory);

            // Cleanup tmp directory
            shell.rm('-rf', tmpDirectory);

            resolve();
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }
};
