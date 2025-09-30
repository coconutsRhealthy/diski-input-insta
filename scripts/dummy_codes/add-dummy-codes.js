const getMissingCompanies = require('./tasks/get-missing-companies');
const createDiscountsLines = require('./tasks/create-discounts-lines');
const writeToDiscountsDummy = require('./tasks/write-to-discounts-dummy');

function addDummyCodes() {
    const missingCompanies = getMissingCompanies();
    const discountLinesMap = createDiscountsLines(missingCompanies);
    writeToDiscountsDummy(discountLinesMap);
}

module.exports = addDummyCodes;

if (require.main === module) {
    addDummyCodes();
}
