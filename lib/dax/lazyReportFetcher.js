var fs = require('fs');
var makeDaxRequest = require('./reportFetcher');
var testFileAge = require('../util/testFileAge');
var logger = require('../util/logger');

function fetchReport(name, reportRequest, storagePath, requester, notify) {

    name = name || false;
    reportRequest = reportRequest || false;
    storagePath = storagePath || __dirname + '/../../daxCache';
    notify = notify || function() {};

    var cachedFile = storagePath + '/' + name + '.json';

    return new Promise(function(accept, reject) {
        if (reportRequest) {
            // DAX is restricted to 30 requests per minute
            // Since the data is daily, we should not be making more than 1 request a day per URL
            // Check for local cached file:

            // if(cachedFile is older than 1 day, then go get a new one)
            var buffer = fs.readFile(cachedFile, 'utf-8', function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    try {
                        var jsonData = JSON.parse(result);
                        accept(jsonData);
                    } catch (ex) {
                        reject(ex);
                    }
                }
            });
        } else {
            if (name) {
                reject('No report with the name ' + name + ' has been defined.');
            } else {
                reject('No name set to save report');
            }
        };

        // 12 hours, plus 0-1 hours, so that not all reports are refreshed at the same time
        var maxAgeInMs = ((3600 * 12) + Math.round(Math.random() * 3600)) * 1000;

        // Later, go do a file update check
        process.nextTick(function() {
            logger.log('Go do file update');
            testFileAge(cachedFile, maxAgeInMs).then(function() {
                return makeDaxRequest(name, reportRequest, requester)
                    .then(function(data) {
                        write(data, cachedFile, name);
                    })
                    .catch(logger.error);
            }).catch(function(err) {
                logger.error('Cached check failed:', err);
            });
        });
    });

    function write(data, targetFile, name) {
        var contents = JSON.stringify(data, null, null, 2);
        logger.log('Writing data to file:', targetFile, contents);
        fs.writeFile(targetFile, contents, 'utf-8', function(err, result) {
            logger.log('File written', err, result);
            notify(name, data, targetFile);
        });
    }
}

module.exports = fetchReport;