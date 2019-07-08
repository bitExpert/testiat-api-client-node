const https = require('https');
const querystring = require('querystring');
const argvProcessed = require('./util/process-argv.js');

const API_ENDPOINT = 'https://testi.at//UAPI';

console.log(`
████████╗███████╗███████╗████████╗██╗    █████╗ ████████╗
╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██║   ██╔══██╗╚══██╔══╝
   ██║   █████╗  ███████╗   ██║   ██║   ███████║   ██║ 
   ██║   ██╔══╝  ╚════██║   ██║   ██║   ██╔══██║   ██║   
   ██║   ███████╗███████║   ██║   ██║██╗██║  ██║   ██║   
   ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚═╝╚═╝╚═╝  ╚═╝   ╚═╝ 
`);

if (
    !argvProcessed.keys.includes('--apikey') ||
    typeof process.env.TESTIAT_APIKEY === 'undefined'
) {
    console.error('Please provide an API key');
}

const API_KEY = process.env.TESTIAT_APIKEY
    ? process.env.TESTIAT_APIKEY
    : argvProcessed.options['--apikey'];

const api_url = new URL(API_ENDPOINT);

const defaultRequestData = {
    API: API_KEY
};

const defaultRequestDataString = querystring.stringify(defaultRequestData);

const defaultRequestOptions = {
    hostname: api_url.hostname,
    port: 443,
    path: api_url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': defaultRequestDataString.length
    }
}

function getAvailableClients() {
    return new Promise(function(resolve, reject){
        const data = defaultRequestDataString;

        const requestOptions = Object.assign(
            {},
            defaultRequestOptions,
            {
                path: api_url.pathname + '/listEmlClients'
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

function getProjectStatus(id) {
    return new Promise(function(resolve, reject){
        if (
            typeof id === 'undefined' ||
            typeof id !== 'string'
        ) {
            reject(new Error('Please provide a valid project ID.'));
        }

        const data = querystring.stringify(
            Object.assign(
                {},
                defaultRequestData,
                {
                    ProjID: id
                }
            )
        );

        const requestOptions = Object.assign(
            {},
            defaultRequestOptions,
            {
                path: api_url.pathname + '/projStatus',
                headers: {
                    ...defaultRequestOptions.headers,
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

function startEmailTest(subject, html, clients) {
    return new Promise(function(resolve, reject){
        if (
            typeof subject === 'undefined' ||
            typeof html === 'undefined' ||
            typeof clients === 'undefined'
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
                defaultRequestData,
                {
                    Subject: subject,
                    HTML: html,
                    'ECID[]': clients
                }
            )
        );

        const requestOptions = Object.assign(
            {},
            defaultRequestOptions,
            {
                path: api_url.pathname + '/letsgo',
                headers: {
                    ...defaultRequestOptions.headers,
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

module.exports = {
    getAvailableClients,
    getProjectStatus,
    startEmailTest
}