const testiatApiClient = require('../index.js');

(async () => {
    const clientsList = await testiatApiClient.getAvailableClients();
    console.log(clientsList[0]);

    try {
        await testiatApiClient.getProjectStatus();
    } catch (err) {
        console.error(err.message);
    }

    try {
        const projectStatus = await testiatApiClient.getProjectStatus('pD9HxnLigMsPzxFqNytPP8uvY');
        console.log(projectStatus);
    } catch (err) {
        console.error(err.message);
    }

    try {
        await testiatApiClient.startEmailTest();
    } catch (err) {
        console.error(err.message);
    }

    try {
        const emailTest = await testiatApiClient.startEmailTest(
            'test title',
            '<p>Sample HTML code</p>',
            [1436979269]
        );
        console.log(emailTest);
    } catch (err) {
        console.error(err.message);
    }

    try {
        const emailTest = await testiatApiClient.startEmailTest(
            'test title',
            '<p>Sample HTML code</p>',
            [
                1436979269,
                1440353815
            ]
        );
        console.log(emailTest);
    } catch (err) {
        console.error(err.message);
    }
})();