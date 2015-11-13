var expect = require('chai').expect;
var testFileAge = require('../../lib/util/testFileAge');

describe('Test File Age', function() {
    it('should report file not found, for non-existing files', function(done) {
        var expected = {
            ageInMs: 0,
            message: 'File not found',
            recommendation: 'Update the file'
        };
        testFileAge('Non existing file', 0).then(function(result) {
            try {
                expect(result).to.deep.equal(expected);
                done();
            } catch (ex) {
                done(ex);
            }
        }).catch(done)
    });
});