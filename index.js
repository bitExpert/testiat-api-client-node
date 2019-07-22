const https = require('https');
const querystring = require('querystring');

const API_ENDPOINT = 'https://testi.at/UAPI';

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
                    path: this.api_url.pathname + '/listEmlClients'
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
                reject(new Error('Please provide a valid project ID.'));
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
                    path: this.api_url.pathname + '/projStatus',
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
                reject(new Error('Please provide subject, html and client list.'));
            }
    
            if (
                !Array.isArray(clients) ||
                clients.length === 0
            ) {
                reject(new Error('Please provide at least one client as array.'));
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
                    path: this.api_url.pathname + '/letsgo',
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