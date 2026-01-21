const fs = require("fs");
const path = require("path");

function main() {
    const filename = path.join(__dirname, "discounts-for-script.json");

    // JSON bestand inlezen
    const data = JSON.parse(fs.readFileSync(filename, "utf-8"));

    // Webshop + code verzamelen
    const rows = data.map(line => {
        const parts = line.split(",").map(p => p.trim());
        return `${parts[0]} - ${parts[1]}`;
    });

    // Alfabetisch sorteren
    rows.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    // Printen
    rows.forEach(row => console.log(row));
}

main();
