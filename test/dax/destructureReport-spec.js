var expect = require('chai').expect;

var destructureReport = require('../../lib/dax/destructureReport');
var sampleDaxReport = require('../fixtures/sampleDaxReport.json');

describe('Destructure Report', function() {
	it('should correctly extract the title from the DAX report', function() {
		var report = destructureReport(sampleDaxReport);

		expect(report.title).to.deep.equal('Experimental Support - Brightness - pass');
	})
});