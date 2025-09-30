const updateDiscountsWlscks = require('./wlscks');
const addDummyCodes = require('./dummy_codes/add-dummy-codes');
const anonymize = require('./anonymize');

async function runAllScripts() {
    try {
        console.log('Running wlscks.js...');
        await updateDiscountsWlscks();

        console.log('Running addDummyCodes.js...');
        addDummyCodes();

        console.log('Running anonymize.js...');
        await anonymize();

        console.log('All scripts completed successfully!');
    } catch (err) {
        console.error('Error while running scripts:', err);
    }
}

runAllScripts();
