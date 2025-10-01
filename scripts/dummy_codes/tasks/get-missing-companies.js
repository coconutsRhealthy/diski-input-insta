const fs = require('fs');
const path = require('path');

function getMissingCompanies(discountsPath) {
    const affLinkServicePath = '/Users/LennartMac/Documents/Projects/light19/src/app/services/affiliate-link.service.ts';
    const affLinkServiceContent = fs.readFileSync(affLinkServicePath, 'utf-8');

    const match = affLinkServiceContent.match(/affiliateLinks[^=]*=\s*({[\s\S]*?});/);

    if (!match) {
      throw new Error('Could not find affiliateLinks object in affiliate-link.service.ts');
    }

    const affiliateLinks = eval(`(${match[1]})`);
    const companiesInAffiliateLinks = Object.keys(affiliateLinks);

    if (!fs.existsSync(discountsPath)) {
        throw new Error(`Discounts file not found at: ${discountsPath}`);
    }

    const discountsJson = JSON.parse(fs.readFileSync(discountsPath, 'utf-8'));

    const companiesInDiscounts = discountsJson.map(line => {
        let name = line.split(",")[0].trim().toLowerCase();
        name = name.replace(/\s*\(.*?\)\s*/g, "").trim();
        return name;
    });

    const companiesInDiscountsSet = new Set(companiesInDiscounts);
    const missingNames = companiesInAffiliateLinks.filter(name => !companiesInDiscountsSet.has(name.toLowerCase()));

    return new Set(missingNames);
}

module.exports = getMissingCompanies;

// test-run
if (require.main === module) {
    console.log("Running standalone...");
    const missing = getMissingCompanies(path.join(__dirname, '../../../src/assets/discounts_anon.json'));
    console.log("Missing companies:", [...missing]);
}
