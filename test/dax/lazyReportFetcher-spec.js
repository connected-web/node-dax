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

    describe('Local cache', function() {
        beforeEach(function() {
            fs.writeFileSync(sampleCachedFile, JSON.stringify(sampleDaxReport, null, 2), 'utf8');
        });

        it('should return the contents of a local cached file, if it exists', function() {
            return expect(fetchReport('lazyReportFetcherTest', reportRequest, cacheDirectory))
                .to.eventually.deep.equal(sampleDaxReport);
        });
    });

    describe('Empty cache', function() {
        var expectedErrorFragment = 'Error: ENOENT: no such file or directory, open ';

        it('should return an error, if the file is not cached', function(done) {
            fetchReport('nonExistingFileEmptyCacheTest', reportRequest, cacheDirectory).then(function(accept) {
                done('Unexpected success: ' + accept);
            }).catch(function(reject) {
                try {
                    expect(reject.toString()).to.contain(expectedErrorFragment);
                    done();
                } catch (ex) {
                    done(ex);
                }
            });
        });
    });

    describe('Fetching data', function() {
        var expectedRequest = reportRequest;
        it('should make a request to the DAX API if if the file does not exist', function(done) {
            var mockRequest = function(url) {
                try {
                    expect(url).to.equal(expectedRequest);
                    done();
                } catch (ex) {
                    done(ex);
                }
            };
            fetchReport('nonExistingFileFetchingDataTest', reportRequest, cacheDirectory, mockRequest);
        });
    });
});