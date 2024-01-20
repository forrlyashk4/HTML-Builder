const { readdir } = require('fs').promises;
const { stat } = require('fs').promises;
const path = require('path');

async function readFiles() {
  try {
    const files = await readdir(path.dirname(__filename) + '/secret-folder', {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        stat(__dirname + '/secret-folder/' + file.name).then((data) =>
          console.log(
            file.name.split('.')[0],
            '-',
            data.size,
            '-',
            file.name.split('.')[1],
          ),
        );
      }
    }
  } catch (err) {
    console.log(err, 1);
  }
}

readFiles();
