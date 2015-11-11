var destructureReport = require('./lib/dax/destructureReport');
var fetchReport = require('./lib/dax/lazyReportFetcher');
var fetchReportNow = require('./lib/dax/reportFetcher');
var requestBuilder = require('./lib/dax/reportRequestBuilder');
var logger = require('./lib/util/logger');

var api = {
    destructureReport: destructureReport,
    fetchReport: fetchReport,
    fetchReportNow: fetchReportNow,
    requestBuilder: requestBuilder,
    logger: logger
}

module.exports = api;