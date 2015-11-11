var fs = require('fs');
var request = require('request');
var logger = require('../util/logger');

function fetchReport(name, reportRequest, requester) {
    name = name || false;
    reportRequest = reportRequest || false;
    requester = requester || request;

    return makeRequest(name, reportRequest, requester);
}

function makeRequest(name, reportRequest, requester) {
    return new Promise(function(accept, reject) {
        requester(reportRequest, function(error, response, body) {
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