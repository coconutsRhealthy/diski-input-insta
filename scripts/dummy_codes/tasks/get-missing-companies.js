const fs = require('fs');
const path = require('path');

function getMissingCompanies() {
    const affDummyJsonPath = path.join(__dirname, '../../../src/assets/aff_dummy.json');
    const affDummyJson = JSON.parse(fs.readFileSync(affDummyJsonPath, 'utf-8'));

    const discountsPath = path.join(__dirname, '../../../src/assets/discounts_wlscks.json');
    const discountsJson = JSON.parse(fs.readFileSync(discountsPath, 'utf-8'));

    const companiesInDummy = Object.keys(affDummyJson);

    const companiesInDiscounts = discountsJson.map(line => {
        let name = line.split(",")[0].trim().toLowerCase();
        name = name.replace(/\s*\(.*?\)\s*/g, "").trim();
        return name;
    });

    const companiesInDiscountsSet = new Set(companiesInDiscounts);
    const missingNames = companiesInDummy.filter(name => !companiesInDiscountsSet.has(name.toLowerCase()));

    return new Set(missingNames);
}

module.exports = getMissingCompanies;

// test-run
if (require.main === module) {
    console.log("Running standalone...");
    const missing = getMissingCompanies();
    console.log("Missing companies:", [...missing]);
}
