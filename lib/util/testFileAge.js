var fs = require('fs');
var logger = require('./logger');

function testFileAge(filePath, maxAgeInMs) {

    logger.log('Cached file check', filePath);
    return new Promise(function(accept, reject) {
        fs.stat(filePath, function(err, stat) {
            var endTime,
                now,
                ageInMs;

            if (err) {
                logger.log('Check file age failed: ', err);
                return accept(reportFileNotFound(maxAgeInMs, 0));
            }

            now = new Date().getTime();
            endTime = stat.mtime.getTime() + maxAgeInMs;
            ageInMs = now - stat.mtime.getTime();

            logger.log('Check file age: ', maxAgeInMs, ' ms')
            logger.log('  File MTIME : ', stat.mtime.getTime(), stat.mtime);
            logger.log('  End time   : ', endTime, new Date(endTime));
            logger.log('  Date now   : ', now, new Date(now));

            if (now > endTime) {
                accept(reportFileOlderThanLimit(maxAgeInMs, ageInMs));
            } else {
                reject(reportFileYoungerThanLimit(maxAgeInMs, ageInMs));
            }
        });
    });
}

function reportFileNotFound(maxAgeInMs, ageInMs) {
    return {
        message: 'File not found',
        recommendation: 'Update the file',
        ageInMs: ageInMs
    };
}

function reportFileOlderThanLimit(maxAgeInMs, ageInMs) {
    return {
        message: 'File is older than ' + maxAgeInMs + 'ms limit',
        recommendation: 'Update the file',
        ageInMs: ageInMs
    };
}

function reportFileYoungerThanLimit(maxAgeInMs, ageInMs) {
    return {
        message: 'File is younger than ' + maxAgeInMs + 'ms limit',
        recommendation: 'No update required',
        ageInMs: ageInMs
    };
}

module.exports = testFileAge;