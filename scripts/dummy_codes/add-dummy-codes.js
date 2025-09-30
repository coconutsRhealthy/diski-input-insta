const getMissingCompanies = require('./tasks/get-missing-companies');
const createDiscountsLines = require('./tasks/create-discounts-lines');
const writeToDiscountsDummy = require('./tasks/write-to-discounts-dummy');

function main() {
    const missingCompanies = getMissingCompanies();
    const discountLinesMap = createDiscountsLines(missingCompanies);
    writeToDiscountsDummy(discountLinesMap);
}

main();
