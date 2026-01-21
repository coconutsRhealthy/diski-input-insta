const fs = require("fs");
const path = require("path");

function main(maxPerWebshop = 1) {
    const INDENT = "\t";
    console.log("\n\n");

    const filename = path.join(__dirname, "discounts-for-script.json");

    // JSON bestand inlezen
    const data = JSON.parse(fs.readFileSync(filename, "utf-8"));

    // Groeperen per webshop
    const grouped = {};
    data.forEach(line => {
        const parts = line.split(",").map(p => p.trim());
        const webshop = parts[0];
        const code = parts[1];

        if (!grouped[webshop]) {
            grouped[webshop] = [];
        }
        grouped[webshop].push([webshop, code]);
    });

    // Maximaal aantal regels per webshop
    const rows = [];
    Object.values(grouped).forEach(items => {
        rows.push(...items.slice(0, maxPerWebshop));
    });

    // Alfabetisch sorteren
    rows.sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));

    // Splitsen in twee kolommen
    const mid = Math.ceil(rows.length / 2);
    const leftCol = rows.slice(0, mid);
    const rightCol = rows.slice(mid);

    // Breedtes instellen
    const SHOP_WIDTH = 24;
    const CODE_WIDTH = 17;
    const SEPARATOR = " | ";

    // Header
    const header =
        `${"WEBSHOP".padEnd(SHOP_WIDTH)} ${"CODE".padEnd(CODE_WIDTH)}` +
        SEPARATOR +
        `${"WEBSHOP".padEnd(SHOP_WIDTH)} ${"CODE".padEnd(CODE_WIDTH)}`;
    console.log(INDENT + header);
    console.log(INDENT + "-".repeat(SHOP_WIDTH + CODE_WIDTH + SEPARATOR.length + SHOP_WIDTH + CODE_WIDTH));

    // Printen
    for (let i = 0; i < mid; i++) {
        const left = leftCol[i];
        const right = i < rightCol.length ? rightCol[i] : ["", ""];

        const leftText = `${left[0].padEnd(SHOP_WIDTH)} ${left[1].padEnd(CODE_WIDTH)}`;
        const rightText = `${right[0].padEnd(SHOP_WIDTH)} ${right[1].padEnd(CODE_WIDTH)}`;

        console.log(INDENT + `${leftText}${SEPARATOR}${rightText}`);
    }

    console.log("\n\n");
}

main(30);
