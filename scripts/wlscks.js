const fs = require('fs');
const path = require('path');

// Define the relative path to the JSON file from the script's location
const jsonFilePath = path.join(__dirname, '../src/assets/eije.json');

// Read the JSON file
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
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

  // Add "zzz" to the arrays of the two most recent dates
  if (sortedDates.length > 1) {
    dateGroups[sortedDates[0]].push("zzz");
    dateGroups[sortedDates[1]].push("zzz");
  }

  // Log the result
  console.log(dateGroups);
});
