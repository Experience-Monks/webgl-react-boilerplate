const fs = require('fs');
const shell = require('shelljs');
const fileName = require('file-name');
const fileExtension = require('file-extension');
const ModelOptimiser = require('./model-optimiser');
const TextureOptimiser = require('./texture-optimiser');

const ASSETS_SRC = './src/assets';
const DESTINATION_DEST = './public/assets/webgl';

/*
 * Loop through all files locacted in the source directory
 * and run optimisers on any directories found
 */
shell.ls(ASSETS_SRC).forEach(value => {
  const directory = `${ASSETS_SRC}/${value}`;

  if (!fs.lstatSync(directory).isDirectory()) {
    shell.echo(`Assets needs to be placed in a directory: ${value}`);
    return;
  }

  const textureOptimiser = new TextureOptimiser();
  const modelOptimiser = new ModelOptimiser();

  // Loop through files of the directory
  shell.ls('-A', directory).forEach(file => {
    const filename = fileName(file);
    const extension = fileExtension(file);
    if (textureOptimiser.includes(file)) textureOptimiser.add(directory, filename, extension);
    if (modelOptimiser.includes(file)) modelOptimiser.add(directory, filename, extension);
  });

  // Process all optimisers
  Promise.all([
    textureOptimiser.process(value, directory, DESTINATION_DEST),
    modelOptimiser.process(value, directory, DESTINATION_DEST)
  ])
    .then(() => {
      console.log('Processed assets!');
    })
    .catch(error => {
      console.log('Error processing assets', error);
    });
});
