const path = require('path');
const getMissingCompanies = require('./tasks/get-missing-companies');
const createDiscountsLines = require('./tasks/create-discounts-lines');
const writeToDiscountsDummy = require('./tasks/write-to-discounts-dummy');

function addDummyCodes() {
    const missingCompanies = getMissingCompanies(path.join(__dirname, '../../src/assets/discounts_wlscks.json'));
    const discountLinesMap = createDiscountsLines(missingCompanies);
    writeToDiscountsDummy(discountLinesMap);
}

module.exports = addDummyCodes;

if (require.main === module) {
    addDummyCodes();
}
