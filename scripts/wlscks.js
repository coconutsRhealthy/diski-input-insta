const fs = require('fs');
const path = require('path');

const sjaaksonPath = path.join(__dirname, '../src/assets/sjaakson.json');
const wlscksPath = path.join(__dirname, '../src/assets/wlscks.txt');
const updatedArraysPath = path.join(__dirname, '../src/assets/updatedArrays.json');

// Read the JSON file
fs.readFile(sjaaksonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading sjaakson.json:', err);
    return;
  }

  // Split the file into lines
  const lines = data.split('\n').map(line => line.trim());
  const arrays = [];
  let group = [];

  // Group lines based on blank lines
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

  // Add the last group if it exists
  if (group.length > 0) {
    arrays.push(group);
  }

  console.log('Initial arrays:', arrays);

  // Read the wlscks.txt file
  fs.readFile(wlscksPath, 'utf8', (err, wlscksData) => {
    if (err) {
      console.error('Error reading wlscks.txt:', err);
      return;
    }

    const wlscksLines = wlscksData.split('\n').filter(line => line.trim() !== '').map(line => '  ' + line);

    // Randomly assign wlscks lines to the first three arrays
    wlscksLines.forEach((line, index) => {
      const arrayIndex = Math.floor(Math.random() * 3); // Randomly select 0, 1, or 2
      arrays[arrayIndex].push(line);
    });

    console.log('Updated arrays with wlscks lines:', arrays);

        // Flatten all arrays and join them into a single string
        //const outputContent = arrays.flat().join('\n');

            let outputContent = '';
            arrays.forEach((array, index) => {
              outputContent += array.join('\n') + '\n'; // Join lines in the array with a newline
              if (index < arrays.length - 1) {
                outputContent += '\n'; // Add a blank line between arrays
              }
            });

        // Write the content to a new file
        fs.writeFile(updatedArraysPath, outputContent, (err) => {
          if (err) {
            console.error('Error saving updated arrays:', err);
          } else {
            console.log('Updated arrays saved to updatedArrays.txt');
          }
        });
  });
});
