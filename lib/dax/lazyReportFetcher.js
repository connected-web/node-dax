var fs = require('fs');
var makeDaxRequest = require('./reportFetcher');
var testFileAge = require('../util/testFileAge');
var logger = require('../util/logger');

function fetchReport(name, reportRequest, storagePath, notify, cacheTimeMs) {

    name = name || false;
    reportRequest = reportRequest || false;
    storagePath = storagePath || __dirname + '/../../daxCache';
    notify = notify || function() {};
    cacheTimeMs = cacheTimeMs || (12 * 60 * 60 * 1000);

    var cachedFile = storagePath + '/' + name + '.json';

    var promise;
    if (reportRequest) {
        // DAX is restricted to 30 requests per minute
        // Since the data is daily, we should not be making more than 1 request a day per URL
        // Return locally cached file:
        promise = readJsonFile(cachedFile).catch(function(ex) {
            logger.error(ex);
            return Promise.reject({
                error: 'No data in cache; making separate request',
                request: reportRequest
            });
        });
    } else {
        if (name) {
            promise = Promise.reject('No report with the name ' + name + ' has been defined.');
        } else {
            promise = Promise.reject('No name set to save report');
        }
    };

    // Later, go do a file update check
    process.nextTick(function() {
        logger.log('Go do file update');
        testFileAge(cachedFile, cacheTimeMs).then(function() {
            return makeDaxRequest(name, reportRequest)
                .then(function(data) {
                    write(data, cachedFile, name);
                })
                .catch(logger.error);
        }).catch(function(err) {
            logger.error('Cached check failed:', err);
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

    return promise;
}

function readJsonFile(filePath) {
    return readFile(filePath).then(function(result) {
        try {
            var jsonData = JSON.parse(result);
        } catch (ex) {
            throw ({
                exception: ex,
                file: filePath
            });
        }
        return Promise.accept(jsonData);
    });
}

function readFile(filePath) {
    return new Promise(function(accept, reject) {
        fs.readFile(filePath, 'utf-8', function(err, result) {
            if (err) {
                reject(err);
            } else {
                accept(result);
            }
        });
    });
}

module.exports = fetchReport;