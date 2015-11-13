var expect = require('chai').expect;
var testFileAge = require('../../lib/util/testFileAge');
var fs = require('fs');

describe('Test File Age', function() {
    it('should report file not found, for non-existing files', function(done) {
        var expected = {
            ageInMs: 0,
            message: 'File not found',
            recommendation: 'Update the file'
        };
        testFileAge('non-existing-file.txt', 0).then(function(result) {
            try {
                expect(result).to.deep.equal(expected);
                done();
            } catch (ex) {
                done(ex);
            }
        }).catch(done)
    });

    it('should report file does not need updating, for file younger than limit', function(done) {
        var expectedLimitMs = 1000;
        var expected = {
            ageInMs: 0,
            message: `File is younger than ${expectedLimitMs}ms limit`,
            recommendation: 'No update required'
        };
        var filePath = __dirname + '/../../daxCache/testFileAge.json';
        fs.writeFileSync(filePath, JSON.stringify({
            some: 'data'
        }), 'utf8');
        testFileAge(filePath, expectedLimitMs).then(done).catch(function(result) {
            try {
                expect(result).to.have.property('message', expected.message);
                expect(result).to.have.property('recommendation', expected.recommendation);
                done();
            } catch (ex) {
                done(ex);
            }
        });
    });

    it('should report file does need updating, for file older than limit', function(done) {
        var expectedLimitMs = 10;
        var expected = {
            ageInMs: 0,
            message: `File is older than ${expectedLimitMs}ms limit`,
            recommendation: 'Update the file'
        };
        var filePath = __dirname + '/../../daxCache/testFileAge.json';
        fs.writeFileSync(filePath, JSON.stringify({
            some: 'data'
        }), 'utf8');

        setTimeout(function() {
            testFileAge(filePath, expectedLimitMs).then(function(result) {
                try {
                    expect(result).to.have.property('message', expected.message);
                    expect(result).to.have.property('recommendation', expected.recommendation);
                    done();
                } catch (ex) {
                    done(ex);
                }
            }).catch(done);
        }, expectedLimitMs + 1);
    });
});