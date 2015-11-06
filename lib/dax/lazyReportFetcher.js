var fs = require('fs');
var request = require('request');

function fetchReport(name, reportRequest, storagePath) {

	storagePath = storagePath || __dirname + '/../../daxCache/';

	return new Promise(function(accept, reject) {
		if (reportRequest) {
			// DAX is restricted to 30 requests per minute
			// Since the data is daily, we should not be making more than 1 request a day per URL
			// Check for local cached file:
			var cachedFile = storagePath + '/' + name + '.json';
			// if(cachedFile is older than 1 day, then go get a new one)
			var buffer = fs.readFileSync(cachedFile, 'utf-8');
      var jsonData = JSON.parse(buffer);
			accept(jsonData);
		} else {
			if (name) {
				reject('No report with the name ' + name + ' has been defined.');
			} else {
				reject('No name set to save report');
			}
		};

    // Later, go do a file update check
		process.nextTick(function() {
      console.log('Go do file update');
			checkFileAge(cachedFile).then(function() {
				return makeDaxRequest(reportRequest, cachedFile);
			}).catch(function(err) {
				console.error('Cached check failed:', err);
			});
		});
	});

	function checkFileAge(filePath) {
		// 12 hours, plus 0-1 hours, so that not all reports are refreshed at the same time
		var MAX_AGE_IN_MS = ((3600 * 12) + Math.round(Math.random() * 3600)) * 1000;

		console.log('Cached file check', filePath);
		return new Promise(function(accept, reject) {
			fs.stat(filePath, function(err, stat) {
				var endTime, now;
				if (err) {
					console.log('Check file age failed: ', err);
					return accept(true);
				}
				now = new Date().getTime();
				endTime = stat.mtime.getTime() + MAX_AGE_IN_MS;
				console.log('Check file age: ', MAX_AGE_IN_MS, ' ms')
				console.log('  File MTIME : ', stat.mtime.getTime(), stat.mtime);
				console.log('  End time   : ', endTime, new Date(endTime));
				console.log('  Date now   : ', now, new Date(now));
				if (now > endTime) {
					console.log('File needs updating');
					accept(true);
				} else {
					console.log('File does not need updating');
					reject(false);
				}
			});
		});
	}

	function makeDaxRequest(reportRequest, targetFile) {
		console.log('Making DAX request to', reportRequest);
		request(reportRequest, function(error, response, body) {
			console.log('Received DAX response');
			if (body) {
				console.log('Body received', body);
				validateThenWrite(body, targetFile);
			} else {
				console.error('Unexpected body returned for request', reportRequest, error, body);
			}
		});
	}

	function validateThenWrite(body, targetFile) {
		try {
			var data = JSON.parse(body);
			if (data.ERROR) {
				console.error('DAX Error', data.ERROR);
			} else {
				console.log('Writing body to file:', targetFile, body);
				fs.writeFile(targetFile, body, 'utf-8', function(err, result) {
					console.log('File written', err, result);
				});
			}
		} catch (ex) {
			console.error('Unexpected DAX format', ex, body);
		}
	}
}

module.exports = fetchReport;