const { mkdir, rm, copyFile, readdir } = require('node:fs/promises');
const path = require('path');

const src = path.dirname(__filename) + '/files-test';
rm(src, { recursive: true }).then(() => {
  mkdir(src, { recursive: true }).then(() => {
    readdir(path.dirname(__filename) + '/files', { withFileTypes: true }).then(
      (files) => {
        files.forEach((file) => {
          copyFile(
            path.dirname(__filename) + '/files/' + file.name,
            src + '/' + file.name,
          );
        });
      },
    );
  });
});
