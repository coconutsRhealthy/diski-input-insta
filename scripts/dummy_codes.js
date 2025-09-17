const fs = require('fs');
const path = require('path');

// Bestand inlezen
const filePath = path.join(__dirname, '../src/assets/aff_dummy.json');
const content = fs.readFileSync(filePath, 'utf-8');

// Opschonen en regels sorteren
const sorted = content
  .split('\n')                  // opsplitsen in regels
  .map(line => line.trim())     // spaties weghalen
  .filter(line => line.length)  // lege regels eruit
  .sort((a, b) => a.localeCompare(b)); // alfabetisch sorteren

// Resultaat tonen
console.log(sorted.join('\n'));
