const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../src/assets/discounts_dummy.json');
const outputFile = path.join(__dirname, '../src/assets/discounts_anon.json');

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const lines = data.split('\n');

  const modifiedLines = lines.map(line => {
    const parts = line.split(',');
    if (parts.length >= 4) {
      parts[3] = ' zzz';
    }
    return parts.join(',');
  });

  const modifiedData = modifiedLines.join('\n');

  fs.writeFile(outputFile, modifiedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to the file:', err);
      return;
    }
    console.log('Modified file saved as discounts_anon.json');
  });
});
