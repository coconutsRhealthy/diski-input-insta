const fs = require("fs");
const path = require("path");

function getTodayLabel() {
    const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    const d = new Date();
    return `${d.getDate()} ${months[d.getMonth()]}`;
}

function main(maxPerWebshop = 1) {
    console.log("\n\n");

    const filename = path.join(__dirname, "discounts-for-script.json");
    const data = JSON.parse(fs.readFileSync(filename, "utf-8"));

    // Groeperen per webshop
    const grouped = {};
    data.forEach(line => {
        const parts = line.split(",").map(p => p.trim());
        let webshop = parts[0];
        const code = parts[1];

        // extensies strippen
        webshop = webshop.replace(/\.(com|nl|eu|store)$/i, "");

        if (!grouped[webshop]) {
            grouped[webshop] = [];
        }
        grouped[webshop].push([webshop, code]);
    });

    // Max per webshop
    const rows = [];
    Object.values(grouped).forEach(items => {
        rows.push(...items.slice(0, maxPerWebshop));
    });

    // Sorteren
    rows.sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));

    const MAX_CHARS = 480;
    const today = getTodayLabel();

    // ---- EERSTE PASS: chunks berekenen ----
    const chunks = [];
    let currentChunk = [];
    let charCount = 0;

    rows.forEach(([shop, code]) => {
        const line = `${shop} - ${code}`;
        const lineLength = line.length + 1; // newline

        if (charCount + lineLength > MAX_CHARS && currentChunk.length > 0) {
            chunks.push(currentChunk);
            currentChunk = [];
            charCount = 0;
        }

        currentChunk.push(line);
        charCount += lineLength;
    });

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    const totalChunks = chunks.length;

    // ---- TWEEDE PASS: printen ----
    chunks.forEach((chunk, index) => {
        if (index > 0) {
            console.log("\n\n");
        }

        console.log(`${today} ${index + 1}/${totalChunks} 👀`);

        chunk.forEach(line => {
            console.log(line);
        });
    });

    console.log("\n\n");
}

main(30);
