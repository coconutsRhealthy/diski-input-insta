const fs = require('fs');
const path = require('path');

// Bestanden inlezen
const affDummyJsonPath = path.join(__dirname, '../src/assets/aff_dummy.json');
const affDummyJson = JSON.parse(fs.readFileSync(affDummyJsonPath, 'utf-8'));
const dTestDiscountsPath = path.join(__dirname, '../src/assets/d_test_discounts.json');
const dTestDiscountsJson = JSON.parse(fs.readFileSync(dTestDiscountsPath, 'utf-8'));

// alle bedrijfsnamen uit aff_dummy.json
const companiesInDummy = Object.keys(affDummyJson);

// bedrijfsnamen uit d_test_discounts.json (eerste deel voor de komma)
const companiesInDiscounts = dTestDiscountsJson.map(line => {
  let name = line.split(",")[0].trim().toLowerCase();
  // alles tussen haakjes weghalen, inclusief de haakjes zelf
  name = name.replace(/\s*\(.*?\)\s*/g, "").trim();
  return name;
});

// set maken om sneller te kunnen checken
const companiesInDiscountsSet = new Set(companiesInDiscounts);

// check welke namen ontbreken in d_test_discounts.json
const missingNames = companiesInDummy.filter(name => !companiesInDiscountsSet.has(name.toLowerCase()));

// resultaten printen
if (missingNames.length > 0) {
  console.log("Bedrijven die WEL in aff_dummy.json staan maar NIET in d_test_discounts.json:");
  console.log(missingNames.join("\n"));
} else {
  console.log("Geen ontbrekende bedrijven gevonden 🎉");
}
