
const nock = require('nock');
const Testiat = require('../index.js');
const testiatApiClient = new Testiat("");

const EXISTING_PROJECT_ID = '3nXhwO7IoLu1GkhPAVUjO7T1';
const NOT_EXISTING_PROJECT_ID = 'pD9HxnLigMsPzxFqNytPP8uvY';

nock(testiatApiClient.getApiEndpoint())
    .post('/listEmlClients')
    .reply(200, [
        {
            ECID: "1234567890",
            Name: "testname",
            Type: "some"
        }
    ]
);

nock(testiatApiClient.getApiEndpoint())
    .post('/projStatus', new RegExp(`ProjID=${NOT_EXISTING_PROJECT_ID}`,'gi'))
    .reply(200, { Error: 'Project Not Found', ErrCode: 11 }
);

nock(testiatApiClient.getApiEndpoint())
    .post('/projStatus', new RegExp(`ProjID=${EXISTING_PROJECT_ID}`,'gi'))
    .reply(200, {
        Subject: 'Email Subject',
        Date: 1562596885,
        Preview: 'http://testi.at/44GGPPCC/preview/test.jpeg',
        Proj: [
            { Title: 'Webmail', Eml: [] },
            { Title: 'Desktop Clients', Eml: [] },
            { Title: 'Mobile', Eml: [] }
        ]
    }
);

nock(testiatApiClient.getApiEndpoint())
    .post('/letsgo', body => body.Subject && body.HTML && body.ECID)
    .reply(200, { Status: 'OK', ProjID: EXISTING_PROJECT_ID }
);

describe('getAvailableClients', () => {
    test('gets available clients with properties', async () => {
        const data = await testiatApiClient.getAvailableClients();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
        expect(typeof data[0].ECID).toBe("string");
        expect(typeof data[0].Name).toBe("string");
        expect(typeof data[0].Type).toBe("string");
    });
});

describe('getProjectStatus', () => {
    test('throws error if no project ID is set', async () => {
        expect(testiatApiClient.getProjectStatus()).rejects.toThrow(
            Error
        )
        expect(testiatApiClient.getProjectStatus()).rejects.toEqual(
            new Error('Please provide a valid project ID.')
        )
    });

    test('returns error response if project is not found', async () => {
        const data = await testiatApiClient.getProjectStatus(NOT_EXISTING_PROJECT_ID);
        expect(data).toEqual({ Error: 'Project Not Found', ErrCode: 11 })
    });

    test('gets project status properties', async () => {
        const data = await testiatApiClient.getProjectStatus(EXISTING_PROJECT_ID);
        expect(data).toEqual({
            Subject: 'Email Subject',
            Date: 1562596885,
            Preview: 'http://testi.at/44GGPPCC/preview/test.jpeg',
            Proj: [
                { Title: 'Webmail', Eml: [] },
                { Title: 'Desktop Clients', Eml: [] },
                { Title: 'Mobile', Eml: [] }
            ]
        })
    });
});

describe('startEmailTest', () => {
    test('returns status response if email test was successfully started', async () => {
        const data = await testiatApiClient.startEmailTest(
            'test title',
            '<p>Sample HTML code</p>',
            [1436979269]
        );
        expect(data).toEqual(
            { Status: 'OK', ProjID: EXISTING_PROJECT_ID }
        )
    });

    test('throws error if no email client was provided', async () => {
        expect(testiatApiClient.startEmailTest(
            'test title',
            '<p>Sample HTML code</p>',
            [])
        ).rejects.toEqual(
            new Error('Please provide at least one client as array.')
        )
    });

    test('throws error if subject, html and client list are not set', async () => {
        expect(testiatApiClient.startEmailTest()).rejects.toEqual(
            new Error('Please provide subject, html and client list.')
        )
    });

    test('throws error if subject, html or client list are not set', async () => {
        expect(testiatApiClient.startEmailTest('test')).rejects.toEqual(
            new Error('Please provide subject, html and client list.')
        )
    });
})