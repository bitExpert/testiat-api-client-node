# testiat-api-client-node

This is the NodeJS API client for [Testi@](https://testi.at).


## Installation

```
yarn add testiat-api-client-node
npm install testiat-api-client-node
```


## Usage

`index.js`
```javascript
const testiatApiClient = require('testiat-api-client-node');

(async () => {
    const clientsList = await testiatApiClient.getAvailableClients();
    console.log(clientsList);
})();
```

```shell
node index.js --apikey <your-api-key>
TESTIAT_APIKEY=<your-api-key> node index.js
```

You can also use [dotenv](https://www.npmjs.com/package/dotenv).


## Available methods

All methods return a Promise and are either resolved to the API response or rejected with an Error object when one of the required arguments was not set or of the correct type.


### getAvailableClients

List the email clients that you can use.


### getProjectStatus(id)

Gets the status of the given project ID.


### startEmailTest(subject, html, clients)

Starts a new email test using the given subject, html string and array of email client IDs.