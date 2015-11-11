var dax = require('./index');
dax.logger.enabled = false;

var NL = '\n';
var TAB = '\t';

var startDate = 'today-14';
var endDate = 'today-1';
var bucket = 'bucket';
var client = 'client';

var reportRequest = dax.requestBuilder(12345, {
    'name': 'demo.home.page',
    'app_name': 'demo',
    'app_type': 'example'
}, bucket, client, startDate, endDate);

console.info('Report Request:', reportRequest, NL);

dax.fetchReport('demo', reportRequest).then(function(result) {
    var report = dax.destructureReport(result);
    console.log('Report title:');
    console.log(TAB, report.title, NL);
    console.log('Report column headings:');
    console.log(TAB, report.columnHeadings, NL);
    console.log('Report rows:');
    console.log(TAB, report.rows, NL);
}).catch(function(error) {
    console.error(error, NL);
});