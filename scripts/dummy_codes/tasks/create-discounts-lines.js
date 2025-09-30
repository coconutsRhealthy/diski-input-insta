const fs = require('fs');
const path = require('path');

const affDummyJsonPath = path.join(__dirname, '../../../src/assets/aff_dummy.json');
const affDummyJson = JSON.parse(fs.readFileSync(affDummyJsonPath, 'utf-8'));

function getDiscountCode(companyName) {
    const lowerName = companyName.toLowerCase();

    for (const [key, code] of Object.entries(affDummyJson)) {
        if (key.toLowerCase() === lowerName) {
            return code;
        }
    }

    console.warn(`Geen kortingscode gevonden voor bedrijf: "${companyName}"`);
    return 'None';
}

function getDateString() {
    const discountsPath = path.join(__dirname, '../../../src/assets/discounts_wlscks.json');
    const content = fs.readFileSync(discountsPath, 'utf-8');
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const secondLastLine = lines[lines.length - 2];
    const parts = secondLastLine.split(',');
    const rawDate = parts[parts.length - 1].trim().replace(/"/g, '');
    const [month, day] = rawDate.split('-').map(Number);
    const dateObj = new Date(2000, month - 1, day);
    dateObj.setDate(dateObj.getDate() - 1);

    // Format again to MM-DD
    const newMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
    const newDay = String(dateObj.getDate()).padStart(2, '0');

    return `${newMonth}-${newDay}`;
}

function getDiscountPercentage(code) {
    const match = code.match(/\d+/);
    if (match) {
        let percentage = parseInt(match[0], 10);

        if (percentage > 25) percentage = 25;
        if (percentage < 10) percentage = 10;

        return percentage;
    }

    return 10;
}

function createDiscountsLines(missingCompanies) {
    const map = new Map();

    for (const companyName of missingCompanies) {
        const code = getDiscountCode(companyName);
        const percentage = getDiscountPercentage(code);
        const dateStr = getDateString();
        const line = `${companyName}, ${code}, ${percentage}, aff_dummy, ${dateStr}`;
        map.set(companyName, line);
    }

    return map;
}

module.exports = createDiscountsLines;
