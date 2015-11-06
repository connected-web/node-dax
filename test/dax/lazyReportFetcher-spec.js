var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var fs = require('fs');

var fetchReport = require('../../lib/dax/lazyReportFetcher');
var sampleDaxReport = require('../fixtures/sampleDaxReport.json');

describe('Lazy Report Fetcher', function() {

	var reportRequest = {
		uri: 'https://dax-rest.comscore.eu/v1/reportitems.json',
		method: 'POST',
		body: 'parameters=&itemid=&startdate=today-14&enddate=today-1&site=&client=&user=&password='
	};
	var cacheDirectory = __dirname + '/../../daxCache';
	var sampleCachedFile = cacheDirectory + '/lazyReportFetcherTest.json';

	beforeEach(function() {
		fs.writeFileSync(sampleCachedFile, JSON.stringify(sampleDaxReport, null, 2), 'utf8');
	});

	it('should return the contents of a local file, if it exists', function() {
		return expect(fetchReport('lazyReportFetcherTest', reportRequest, cacheDirectory))
			.to.eventually.deep.equal(sampleDaxReport);
	});
});