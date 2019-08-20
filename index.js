const https = require('https');
const querystring = require('querystring');

const API_ENDPOINT = 'https://testi.at/UAPI';
const API_ENDPOINT_CLIENTS_LIST = '/listEmlClients';
const API_ENDPOINT_PROJECT_STATUS = '/projStatus';
const API_ENDPOINT_EMAILTEST_START = '/letsgo';

const STRINGS = {
    ERROR: {
        MISSING_PROJECT_ID: 'Please provide a valid project ID.',
        MISSING_SUBJECT_HTML_CLIENTS: 'Please provide subject, html and client list.',
        MISSING_CLIENTS: 'Please provide at least one client as array.'
    }
}

module.exports = class Testiat {

    constructor(apikey) {
        this.apikey = apikey;

        this.defaultRequestData = {
            API: this.apikey
        };

        this.api_url = new URL(API_ENDPOINT);
    
        this.defaultRequestDataString = querystring.stringify(this.defaultRequestData);

        this.defaultRequestOptions = {
            hostname: this.api_url.hostname,
            port: 443,
            path: this.api_url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': this.defaultRequestDataString.length
            }
        }
    }

    getApiEndpoint() {
        return API_ENDPOINT;
    }

    getAvailableClients() {
        return new Promise((resolve, reject) => {
            const data = this.defaultRequestDataString;

            const requestOptions = Object.assign(
                {},
                this.defaultRequestOptions,
                {
                    path: this.api_url.pathname + API_ENDPOINT_CLIENTS_LIST
                }
            );

            const req = https.request(requestOptions, (res) => {
                res.on('data', (data) => {
                    resolve(
                        JSON.parse(data.toString('utf-8'))
                    );
                });
            }).on('error', (err) => {
                reject(err);
            });

            req.write(data);
            req.end();
        });
    }

    getProjectStatus(id) {
        return new Promise((resolve, reject) => {
            if (
                typeof id === 'undefined' ||
                typeof id !== 'string'
            ) {
                reject(new Error(STRINGS.ERROR.MISSING_PROJECT_ID));
            }

            const data = querystring.stringify(
                Object.assign(
                    {},
                    this.defaultRequestData,
                    {
                        ProjID: id
                    }
                )
            );
    
            const requestOptions = Object.assign(
                {},
                this.defaultRequestOptions,
                {
                    path: this.api_url.pathname + API_ENDPOINT_PROJECT_STATUS,
                    headers: {
                        ...this.defaultRequestOptions.headers,
                        'Content-Length': data.length
                    }
                }
            );
    
            const req = https.request(requestOptions, (res) => {
                res.on('data', (data) => {
                    resolve(
                        JSON.parse(data.toString('utf-8'))
                    );
                });
            }).on('error', (err) => {
                reject(err);
            });
    
            req.write(data);
            req.end();
        });
    }
    
    startEmailTest(subject, html, clients) {
        return new Promise((resolve, reject) => {
            if (
                !subject ||
                !html ||
                !clients
            ) {
                reject(new Error(STRINGS.ERROR.MISSING_SUBJECT_HTML_CLIENTS));
            }

            if (
                !Array.isArray(clients) ||
                clients.length === 0
            ) {
                reject(new Error(STRINGS.ERROR.MISSING_CLIENTS));
            }

            const data = querystring.stringify(
                Object.assign(
                    {},
                    this.defaultRequestData,
                    {
                        Subject: subject,
                        HTML: html,
                        'ECID[]': clients
                    }
                )
            );

            const requestOptions = Object.assign(
                {},
                this.defaultRequestOptions,
                {
                    path: this.api_url.pathname + API_ENDPOINT_EMAILTEST_START,
                    headers: {
                        ...this.defaultRequestOptions.headers,
                        'Content-Length': data.length
                    }
                }
            );

            const req = https.request(requestOptions, (res) => {
                res.on('data', (data) => {
                    resolve(
                        JSON.parse(data.toString('utf-8'))
                    );
                });
            }).on('error', (err) => {
                reject(err);
            });

            req.write(data);
            req.end();
        });
    }
};