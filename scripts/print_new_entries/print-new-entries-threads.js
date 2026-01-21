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

    // ---- GROEPEREN PER WEBSHOP ----
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

    // ---- MAX PER WEBSHOP ----
    const rows = [];
    Object.values(grouped).forEach(items => {
        rows.push(...items.slice(0, maxPerWebshop));
    });

    // ---- SORTEREN ----
    rows.sort((a, b) =>
        a[0].toLowerCase().localeCompare(b[0].toLowerCase())
    );

    const MAX_CHARS = 400;
    const today = getTodayLabel();

    // ---- CHUNK LOGICA (gelijkmatig + geen restchunk) ----

    const lines = rows.map(([shop, code]) => `${shop} - ${code}`);
    const lineLengths = lines.map(l => l.length + 1); // + newline

    const totalChars = lineLengths.reduce((a, b) => a + b, 0);

    // exact aantal chunks
    const totalChunks = Math.ceil(totalChars / MAX_CHARS);

    const chunks = [];
    let currentChunk = [];
    let currentChars = 0;

    let remainingChars = totalChars;
    let remainingChunks = totalChunks;

    lines.forEach((line, i) => {
        const len = lineLengths[i];

        // dynamisch target voor deze chunk
        const targetForThisChunk = Math.min(
            MAX_CHARS,
            Math.ceil(remainingChars / remainingChunks)
        );

        if (
            currentChars + len > targetForThisChunk &&
            currentChunk.length > 0
        ) {
            chunks.push(currentChunk);

            remainingChars -= currentChars;
            remainingChunks--;

            currentChunk = [];
            currentChars = 0;
        }

        currentChunk.push(line);
        currentChars += len;
    });

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    // ---- PRINTEN ----
    chunks.forEach((chunk, index) => {
        if (index > 0) {
            console.log("\n\n");
        }

        console.log(`${today} ${index + 1}/${chunks.length} 👀`);

        chunk.forEach(line => {
            console.log(line);
        });
    });

    console.log("\n\n");
}

main(30);
