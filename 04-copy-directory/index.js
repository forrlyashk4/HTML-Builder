const { mkdir, rm, copyFile, readdir } = require('node:fs/promises');
const path = require('path');

const src = path.dirname(__filename) + '/files-copy';
rm(src, { recursive: true })
  .then(() => {
    mkdir(src, { recursive: true }).then(() => {
      readdir(path.dirname(__filename) + '/files', {
        withFileTypes: true,
      }).then((files) => {
        files.forEach((file) => {
          if (file.isFile()) {
            copyFile(
              path.dirname(__filename) + '/files/' + file.name,
              src + '/' + file.name,
            );
          }
        });
      });
    });
  })
  .catch(() => {
    mkdir(src, { recursive: true }).then(() => {
      readdir(path.dirname(__filename) + '/files', {
        withFileTypes: true,
      }).then((files) => {
        files.forEach((file) => {
          if (file.isFile()) {
            copyFile(
              path.dirname(__filename) + '/files/' + file.name,
              src + '/' + file.name,
            );
          }
        });
      });
    });
  });
