const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.dirname(__filename) + '/messages.txt');
stdout.write('Please, enter your message, then press ENTER:\n');
stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'exit') process.exit();
  output.write(chunk);
});

process.on('SIGINT', () => {
  stdout.write('\nBye-bye!');
  process.exit();
});
