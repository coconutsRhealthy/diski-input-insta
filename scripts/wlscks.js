const fs = require('fs');
const path = require('path');

const discountsPath = path.join(__dirname, '../src/assets/discounts.json');
const wlscksPath = path.join(__dirname, '../src/assets/wlscks.txt');
const discountsWlscksPath = path.join(__dirname, '../src/assets/discounts_wlscks.json');

fs.readFile(discountsPath, 'utf8', (err, data) => {
  const lines = data.split('\n').map(line => line.trim());
  const arrays = [];
  let group = [];

  lines.forEach(line => {
    if (line === '') {
      if (group.length > 0) {
        arrays.push(group);
        group = [];
      }
    } else {
      group.push(line === '[' || line === ']' ? line : '  ' + line);
    }
  });

  if (group.length > 0) {
    arrays.push(group);
  }

  fs.readFile(wlscksPath, 'utf8', (err, wlscksData) => {
    const wlscksLines = wlscksData.split('\n').filter(line => line.trim() !== '').map(line => '  ' + line);

    wlscksLines.forEach((line, index) => {
      const arrayIndex = Math.floor(index / 5);
      const targetArray = arrays[arrayIndex];
      const elementToGetDateFrom = targetArray.length > 1 ? targetArray[1] : targetArray[0];
      const parts = elementToGetDateFrom.split(',');
      const secondToLastPart = parts.length >= 2 ? parts[parts.length - 2].trim() : '';

      const lineParts = line.split(',');
      if (lineParts.length >= 2) {
        lineParts[lineParts.length - 2] = ' ' + secondToLastPart;
      }
      const updatedLine = lineParts.join(',');

      const startIndex = Math.floor(targetArray.length / 2);
      const randomIndex = Math.floor(Math.random() * (targetArray.length - startIndex)) + startIndex;
      targetArray.splice(randomIndex, 0, updatedLine);
    });

    let outputContent = '';
    arrays.forEach((array, index) => {
      outputContent += array.join('\n') + '\n';
      if (index < arrays.length - 1) {
        outputContent += '\n';
      }
    });

    fs.writeFile(discountsWlscksPath, outputContent, (err) => {
      if (err) {
        console.error('Error saving discounts_wlscks.json:', err);
      } else {
        console.log('Updated arrays saved to discounts_wlscks.json');
      }
    });
  });
});
