var fs = require('fs');
var inject = require('../wiring/inject');
var logger = require('../util/logger');

function fetchReport(name, reportRequest) {
    name = name || false;
    reportRequest = reportRequest || false;

    return makeRequest(name, reportRequest);
}

function makeRequest(name, reportRequest) {
    var request = inject('request');
    return new Promise(function(accept, reject) {
        request(reportRequest, function(error, response, body) {
            logger.log('Received DAX response');
            if (body) {
                logger.log('Body received', body);
                validateDAXResponse(body)
                    .then(accept)
                    .catch(reject);
            } else {
                logger.error('Unexpected body returned for request', reportRequest, error, body);
                reject({
                    error: 'Unexpected body returned for request',
                    request: reportRequest,
                    result: error,
                    body: body
                });
            }
        });
    });
}

function validateDAXResponse(body) {
    return new Promise(function(accept, reject) {
        try {
            var data = JSON.parse(body);
            if (data.ERROR) {
                logger.error('DAX Error', data.ERROR);
                reject({
                    error: 'DAX Error',
                    result: data.ERROR
                });
            } else {
                accept(data);
            }
        } catch (ex) {
            logger.error('Unexpected DAX format', ex, body);
            reject({
                error: 'Unexpected DAX format',
                result: body,
                exception: ex
            });
        }
    });
}

module.exports = fetchReport;