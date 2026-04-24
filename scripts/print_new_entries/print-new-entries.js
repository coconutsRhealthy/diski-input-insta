const fs = require("fs");
const path = require("path");

function main(maxPerWebshop = 1) {
    console.log("\n");

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

        grouped[webshop].push(code);
    });

    // Verzamelen met maxPerWebshop
    const rows = [];
    Object.entries(grouped).forEach(([webshop, codes]) => {
        codes.slice(0, maxPerWebshop).forEach(code => {
            rows.push([webshop, code]);
        });
    });

    // Alfabetisch sorteren
    rows.sort((a, b) =>
        a[0].toLowerCase().localeCompare(b[0].toLowerCase())
    );

    // Printen als: shopnaam - code
    rows.forEach(([webshop, code]) => {
        console.log(`${webshop} - ${code}`);
    });

    console.log("\n");
}

main(30);
