const fs = require('fs');
const path = require('path');

// Define the relative paths to the files
const jsonFilePath = path.join(__dirname, '../src/assets/eije.json');
const txtFilePath = path.join(__dirname, '../src/assets/wlscks.txt');

// Read the JSON file
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the JSON file:', err);
    return;
  }

  // Parse the JSON data into an array
  const lines = JSON.parse(data);

  // Object to hold arrays for each date
  const dateGroups = {};

  // Iterate over each line and group them by date
  lines.forEach(line => {
    const parts = line.split(', ');
    const date = parts[parts.length - 1]; // The last part is the date
    if (!dateGroups[date]) {
      dateGroups[date] = [];
    }
    dateGroups[date].push(line);
  });

  // Get all the dates and sort them in descending order
  const sortedDates = Object.keys(dateGroups).sort((a, b) => {
    const [dayA, monthA] = a.split('-').map(num => parseInt(num, 10));
    const [dayB, monthB] = b.split('-').map(num => parseInt(num, 10));

    if (monthA !== monthB) {
      return monthB - monthA; // Sort by month
    }
    return dayB - dayA; // If months are the same, sort by day
  });

  // Read the wlscks.txt file and add the lines to the most recent date's array
  fs.readFile(txtFilePath, 'utf8', (err, txtData) => {
    if (err) {
      console.error('Error reading the wlscks.txt file:', err);
      return;
    }

    // Split the txtData into lines
    const txtLines = txtData.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Add these lines to the array of the most recent date
    if (sortedDates.length > 0) {
      dateGroups[sortedDates[0]].push(...txtLines);
    }

    // Log the result
    console.log(dateGroups);
  });
});
