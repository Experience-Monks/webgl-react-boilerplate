const fs = require('fs');
const shell = require('shelljs');
const sharp = require('sharp');
const sizeOf = require('image-size');
const fileExtension = require('file-extension');
const configTemplate = require('./config').textures;

/*
 * Resize and copy textures from
 * the source to destination directory
 *
 * Uses sharp for the image conversion: https://www.npmjs.com/package/sharp
 */
module.exports = class TextureOptimiser {
  constructor() {
    this.files = [];
  }

  add(directory, name, extension) {
    const fileName = `${name}.${extension}`;
    const filePath = `${directory}/${fileName}`;
    this.files.push({ filePath, fileName, name, extension });
  }

  includes(file) {
    return /(jpg|png)$/i.test(file);
  }

  copy(file, fileDest) {
    return new Promise((resolve, reject) => {
      sharp(file).toFile(fileDest, (error, info) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(fileDest);
      });
    });
  }

  resize(file, fileDest, size) {
    return new Promise((resolve, reject) => {
      const dimensions = sizeOf(file);
      const scale = dimensions.height / dimensions.width;
      sharp(file)
        .resize(size, Math.floor(size * scale))
        .toFile(fileDest, (error, info) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(fileDest);
        });
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

        const tmpDirectory = `${srcDirectory}/tmp-textures`;
        shell.mkdir('-p', tmpDirectory);

        // Check of the current directory includes a config file
        let config = {};
        try {
          const file = Object.assign(config, JSON.parse(fs.readFileSync(`${srcDirectory}/config.json`)));
          if (this.validateConfig(file)) config = file.textures;
        } catch (error) {}

        const queue = [];
        this.files.forEach(data => {
          const fileConfig = config[data.fileName] || configTemplate;
          // Only resize textures if a size is specified and the resize flag is true
          if (fileConfig.sizes.length > 0 && fileConfig.resize) {
            fileConfig.sizes.forEach(size => {
              const fileDest = `${tmpDirectory}/${data.name}-${size}.${data.extension}`;
              queue.push(this.resize(data.filePath, fileDest, size));
            });
          } else {
            const fileDest = `${tmpDirectory}/${data.fileName}`;
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
