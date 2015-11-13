var expect = require('chai').expect;
var inject = require('../../lib/wiring/inject');
var fetchReport = require('../../lib/dax/reportFetcher');

describe('Report Fetcher', function() {

    var reportRequest = {
        uri: 'https://dax-rest.comscore.eu/v1/reportitems.json',
        method: 'POST',
        body: 'parameters=&itemid=&startdate=today-14&enddate=today-1&site=&client=&user=&password='
    };

    afterEach(function() {
        inject('request', null);
    });

    it('should handle errors from the DAX API for invalid parameters', function(done) {
        var mockDAXResponse = {
            ERROR: 'Some error'
        };
        var mockRequest = function(url, callback) {
            callback(null, null, JSON.stringify(mockDAXResponse));
        };
        inject('request', mockRequest);
        fetchReport('uncachedFileTest', reportRequest)
            .then(done)
            .catch(function(actualError) {
                try {
                    expect(actualError).to.deep.equal({
                        error: 'DAX Error',
                        result: mockDAXResponse.ERROR
                    });
                    done();
                } catch (ex) {
                    done(ex);
                }
            });
    });

    it('should pass valid data back as returned from the DAX API', function(done) {
        var mockDAXResponse = {
            some: 'valid data'
        };
        var mockRequest = function(url, callback) {
            callback(null, null, JSON.stringify(mockDAXResponse));
        };
        inject('request', mockRequest);
        fetchReport('uncachedFileTest', reportRequest)
            .then(function(response) {
                try {
                    expect(response).to.deep.equal(mockDAXResponse);
                    done();
                } catch (ex) {
                    done(ex);
                }
            })
            .catch(done);
    });
});