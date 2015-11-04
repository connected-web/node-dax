var expect = require('chai').expect;

var buildReportRequest = require('../../lib/dax/reportRequestBuilder');

describe('Build a Report Request', function() {

	beforeEach(function() {
		delete process.env.DAX_API_USERNAME;
		delete process.env.DAX_API_PASSWORD;
	});

	it('should build a default report in the correct format', function() {
		var actual = buildReportRequest();
		var expected = {
			uri: 'https://dax-rest.comscore.eu/v1/reportitems.json',
			method: 'POST',
			body: 'parameters=&itemid=&startdate=today-14&enddate=today-1&site=&client=&user=&password='
		};
		expect(actual).to.deep.equal(expected);
	});

	it('should inject user credentials set from the environment', function() {
		process.env.DAX_API_USERNAME = 'EXPECTED_USER';
		process.env.DAX_API_PASSWORD = 'EXPECTED_PASSWORD';

		var actual = buildReportRequest();
		var expected = {
			uri: 'https://dax-rest.comscore.eu/v1/reportitems.json',
			method: 'POST',
			body: 'parameters=&itemid=&startdate=today-14&enddate=today-1&site=&client=&user=EXPECTED_USER&password=EXPECTED_PASSWORD'
		};
		expect(actual).to.deep.equal(expected);
	});
});