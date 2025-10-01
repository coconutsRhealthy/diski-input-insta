const path = require('path');
const updateDiscountsWlscks = require('./wlscks');
const addDummyCodes = require('./dummy_codes/add-dummy-codes');
const anonymize = require('./anonymize');
const getMissingCompanies = require('./dummy_codes/tasks/get-missing-companies');

async function runAllScripts() {
    try {
        console.log('Running wlscks.js...');
        await updateDiscountsWlscks();

        console.log('Running addDummyCodes.js...');
        addDummyCodes();

        console.log('Running anonymize.js...');
        await anonymize();

        console.log('Running get-missing-companies.js... check discounts_anon.json');
        const missing = getMissingCompanies(path.join(__dirname, '../src/assets/discounts_anon.json'));
        console.log('Missing companies:', [...missing]);

        console.log('All scripts completed successfully!');
    } catch (err) {
        console.error('Error while running scripts:', err);
    }
}

runAllScripts();
