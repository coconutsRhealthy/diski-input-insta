const fs = require('fs');
const path = require('path');

function writeToDiscountsDummy(discountLinesMap) {
    const originalPath = path.join(__dirname, '../../../src/assets/discounts_wlscks.json');
    const dummyPath = path.join(__dirname, '../../../src/assets/discounts_dummy.json');

    let content = fs.readFileSync(originalPath, 'utf-8');

    const linesArray = [...discountLinesMap.values()];
    shuffleArray(linesArray);

    //Vind de positie van de sluitende ']' (laatste regel)
    const lines = content.split('\n');
    let insertIndex = lines.length - 1;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim() === ']') {
            insertIndex = i;
            break;
        }
    }

    //Zorg dat de laatste bestaande regel eindigt met een komma
    let lastExistingIndex = insertIndex - 1;
    if (!lines[lastExistingIndex].trim().endsWith(',')) {
        lines[lastExistingIndex] = lines[lastExistingIndex] + ',';
    }

    //Voeg een lege regel en de geshuffelde lines toe
    const newLines = [
        ...lines.slice(0, insertIndex),
        '', // lege regel
        ...linesArray.map((line, idx) => {
            const isLast = idx === linesArray.length - 1;
            return `  "${line}"${isLast ? '' : ','}`;
        }),
        lines[insertIndex] // de sluitende ']'
    ];

    fs.writeFileSync(dummyPath, newLines.join('\n'), 'utf-8');

    console.log(`discounts_dummy.json is aangemaakt met ${linesArray.length} nieuwe regels.`);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports = writeToDiscountsDummy;
