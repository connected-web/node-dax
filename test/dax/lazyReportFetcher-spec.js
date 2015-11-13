var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var fs = require('fs');

var inject = require('../../lib/wiring/inject');
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
        var expectedError = {
            error: 'No data in cache; making separate request',
            request: reportRequest
        };

        it('should return an error, if the file is not cached', function(done) {
            fetchReport('nonExistingFileEmptyCacheTest', reportRequest, cacheDirectory).then(function(accept) {
                done('Unexpected success: ' + accept);
            }).catch(function(rejection) {
                try {
                    expect(rejection).to.deep.equal(expectedError);
                    done();
                } catch (ex) {
                    done(ex);
                }
            });
        });
    });

    describe('Fetching data', function() {

        afterEach(function() {
            inject('request', null);
        });

        it('should make a request to the DAX API if the file does not exist', function(done) {
            var expectedRequest = reportRequest;
            var mockRequest = function(url) {
                try {
                    expect(url).to.equal(expectedRequest);
                    done();
                } catch (ex) {
                    done(ex);
                }
            };
            inject('request', mockRequest);
            fetchReport('nonExistingFileFetchingDataTest', reportRequest, cacheDirectory);
        });
    });

    describe('Writing data', function() {

        var expectedTargetFile = cacheDirectory + '/fileToWriteTo.json';

        beforeEach(function() {
            try {
                fs.unlinkSync(expectedTargetFile);
            } catch (ex) {
                expect(ex.code).to.equal('ENOENT');
            }
        });

        it('should write data to the cache if received', function(done) {
            var expectedName = 'fileToWriteTo';
            var expectedData = {
                some: 'valid data'
            };

            var mockRequest = function(url, callback) {
                callback(null, null, JSON.stringify(expectedData));
            };
            inject('request', mockRequest);
            var mockNotify = function(notificationName, notificationData, notificationTargetFile) {
                try {
                    expect(notificationName).to.equal(expectedName);
                    expect(notificationData).to.deep.equal(expectedData);
                    expect(notificationTargetFile).to.equal(expectedTargetFile);

                    var actualData = require(expectedTargetFile);
                    expect(actualData).to.deep.equal(expectedData);
                    done();
                } catch (ex) {
                    done(ex);
                }
            };
            fetchReport(expectedName, reportRequest, cacheDirectory, mockNotify);
        });
    });
});