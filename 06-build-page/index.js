const path = require('path');
const {
  readFile,
  readdir,
  writeFile,
  mkdir,
  unlink,
  copyFile,
} = require('fs/promises');
const { appendFile } = require('fs');

let htmlCode;
const componentFiles = [];

mkdir(path.join(__dirname, '/project-dist'), { recursive: true });

// CSS
function createBundle(files) {
  writeFile(path.join(__dirname, 'project-dist', 'style.css'), '').then(() => {
    files.forEach((file) => {
      if (file.name.split('.')[1] === 'css') {
        readFile(path.join(file.path + '/' + file.name), 'utf-8').then((res) =>
          appendFile(
            path.join(__dirname, 'project-dist', 'style.css'),
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
    unlink(path.join(__dirname, '/project-dist/style.css'))
      .then(() => {
        createBundle(files);
      })
      .catch(() => {
        createBundle(files);
      });
  })
  .catch((err) => console.log('Error ' + err.message));

// Assets
function copyAssets(root, dist) {
  mkdir(dist, { recursive: true }).then(() => {
    readdir(root, { withFileTypes: true }).then((res) => {
      res.forEach((elem) => {
        if (elem.isFile()) {
          copyFile(path.join(root, elem.name), path.join(dist, elem.name));
        } else {
          copyAssets(path.join(root, elem.name), path.join(dist, elem.name));
        }
      });
    });
  });
}

copyAssets(
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'project-dist/assets'),
);

// HTML
readFile(path.join(__dirname, '/template.html'))
  .then((res) => res.toString())
  .then((res) => (htmlCode = res))
  .then(() => {
    readdir(path.join(__dirname, '/components'), {
      withFileTypes: true,
    })
      .then((files) => {
        files.forEach((file) => {
          if (file.isFile() && file.name.split('.')[1] === 'html') {
            componentFiles.push(file);
          }
        });
      })
      .then(async () => {
        let tags = htmlCode
          .match(/{{(.*?)}}/g)
          .map((tag) => tag.slice(2, tag.length - 2));
        let values = await Promise.all(tags.map((tag) => changeHTMLCode(tag)));
        values = await values.map((arr) => arr.filter((item) => item !== ''));
        let result = htmlCode.replace(/{{(.*?)}}/g, () => values.shift());
        return result;
      })
      .then((html) => {
        writeFile(path.join(__dirname, 'project-dist', 'index.html'), html);
      });
  })
  .catch((err) => {
    throw err;
  });

async function changeHTMLCode(tag) {
  let promises = componentFiles.map(async (item) => {
    if (item.name.split('.')[0] === tag) {
      let text = await readFile(
        path.join(__dirname, '/components/', tag + '.html'),
        'utf-8',
      );
      return text;
    }
    return '';
  });
  let result = await Promise.all(promises);
  return result;
}
