const Testiat = require('../index.js');
const testiatApiClient = new Testiat('yourapikey');

(async () => {
    const clientsList = await testiatApiClient.getAvailableClients();
    console.log(clientsList);
})();