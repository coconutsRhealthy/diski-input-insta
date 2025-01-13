const fs = require('fs');
const path = require('path');

const sjaaksonPath = path.join(__dirname, '../src/assets/sjaakson2.json');
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
      const arrayIndex = Math.floor(index / 5); // Calculate which array to assign the line to

      const targetArray = arrays[arrayIndex];

      if (targetArray.length > 0) {
        // Extract the part after the second-to-last comma from the first element of the target array
        const secondElement = targetArray[1];
        const parts = secondElement.split(',');
        const secondToLastPart = parts.length >= 2 ? parts[parts.length - 2].trim() : '';

        // Replace the part after the second-to-last comma in the current line
        const lineParts = line.split(',');
        if (lineParts.length >= 2) {
          lineParts[lineParts.length - 2] = ' ' + secondToLastPart;
        }
        const updatedLine = lineParts.join(',');

        // Randomly place in the bottom half of the array
        const startIndex = Math.floor(targetArray.length / 2);
        const randomIndex = Math.floor(Math.random() * (targetArray.length - startIndex)) + startIndex;

        targetArray.splice(randomIndex, 0, updatedLine); // Insert line at the random position
      } else {
        // If the target array is empty, add the line without modification
        targetArray.push(line);
      }
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
