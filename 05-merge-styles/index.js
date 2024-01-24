const path = require('path');
const { readdir, readFile, writeFile, unlink } = require('node:fs/promises');
const { appendFile } = require('fs');

function createBundle(files) {
  writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '').then(() => {
    files.forEach((file) => {
      if (file.name.split('.')[1] === 'css') {
        readFile(path.join(file.path, file.name), 'utf-8').then((res) =>
          appendFile(
            path.join(__dirname, 'project-dist', 'bundle.css'),
            res + '\n',
            (err) => {
              if (err) console.log(err.message);
            },
          ),
        );
      }
    });
  });
}

readdir(path.join(__dirname, '/styles'), { withFileTypes: true })
  .then((files) => {
    unlink(path.join(__dirname, '/project-dist/bundle.css'))
      .then(() => {
        createBundle(files);
      })
      .catch(() => {
        createBundle(files);
      });
  })
  .catch((err) => console.log('Error ' + err.message));
