var expect = require('chai').expect;

var destructureReport = require('../../lib/dax/destructureReport');
var sampleDaxReport = require('../fixtures/sampleDaxReport.json');
var expectedDestructuredReport = require('../fixtures/expectedDestructuredReport.json');

describe('Destructure Report', function() {

	var report;

	beforeEach(function() {
		report = destructureReport(sampleDaxReport);
	});

	it('should correctly extract the title from the DAX report', function() {
		expect(report.title).to.equal(expectedDestructuredReport.title);
	});

	it('should correctly extract the column headings from the DAX report', function() {
		expect(report.columnHeadings).to.deep.equal(expectedDestructuredReport.columnHeadings);
	});

	it('should correctly extract the rows from the DAX report', function() {
		expect(report.rows).to.deep.equal(expectedDestructuredReport.rows);
	});

	it('should correctly extract the statistics from the DAX report', function() {
		expect(report.statistics).to.deep.equal(expectedDestructuredReport.statistics);
	});

	it('should correctly destructure the whole report', function() {
		expect(report).to.deep.equal(expectedDestructuredReport);
	});
});