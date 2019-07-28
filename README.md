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
const Testiat = require('../index.js');
const testiatApiClient = new Testiat('yourapikey');

(async () => {
    const clientsList = await testiatApiClient.getAvailableClients();
    console.log(clientsList);
})();
```


## Available methods

All methods return a Promise and are either resolved with the API response or rejected with an Error object when one of the required arguments was not set or of the correct type.


### getAvailableClients

List the email clients that you can use.


### getProjectStatus(id)

Gets the status of the given project ID.


### startEmailTest(subject, html, clients)

Starts a new email test using the given subject, html string and array of email client IDs.