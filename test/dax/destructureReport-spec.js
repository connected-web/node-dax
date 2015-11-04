var expect = require('chai').expect;

var destructureReport = require('../../lib/dax/destructureReport');
var sampleDaxReport = require('../fixtures/sampleDaxReport.json');

describe('Destructure Report', function() {

	var report;

	beforeEach(function() {
		report = destructureReport(sampleDaxReport);
	});

	it('should correctly extract the title from the DAX report', function() {
		expect(report.title).to.equal('Experimental Support - Brightness - pass');
	});

	it('should correctly extract the column headings from the DAX report', function() {
		var expectedColumnHeadings = ['app_version', 'brand', 'model', 'Action type', 'Action name', 'pass', 'Browsers', 'Hidden events'];
		expect(report.columnHeadings).to.deep.equal(expectedColumnHeadings);
	});
});