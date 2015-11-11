var fs = require('fs');
var request = require('request');
var logger = require('../util/logger');

function fetchReport(name, reportRequest, storagePath, requester) {

    name = name || false;
    reportRequest = reportRequest || false;
    storagePath = storagePath || __dirname + '/../../daxCache/';
    requester = requester || request;

    var targetFile = storagePath + '/' + name + '.json';

    requester(reportRequest, function(error, response, body) {
        logger.log('Received DAX response');
        if (body) {
            logger.log('Body received', body);
            validateThenWrite(body, targetFile);
        } else {
            logger.error('Unexpected body returned for request', reportRequest, error, body);
        }
    });
}

function validateThenWrite(body, targetFile) {
    try {
        var data = JSON.parse(body);
        if (data.ERROR) {
            logger.error('DAX Error', data.ERROR);
        } else {
            logger.log('Writing body to file:', targetFile, body);
            fs.writeFile(targetFile, body, 'utf-8', function(err, result) {
                logger.log('File written', err, result);
            });
        }
    } catch (ex) {
        logger.error('Unexpected DAX format', ex, body);
    }
}

module.exports = fetchReport;