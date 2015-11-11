# Node DAX
A node js library for making queries to DAX.

## Make talking to DAX via Node JS fun
Do fun things like:
- Build and Store Report Requests
- Lazily Fetch Reports
- Destructure Reports

Remember, stats are fun!

## Installation
Install `node-dax` as a library using `npm`:

```
npm install node-dax --save
```

## Example

```js
var dax = require('./index');
dax.logger.enabled = false;

var startDate = 'today-14';
var endDate = 'today-1';
var bucket = 'bucket';
var client = 'client';

var reportRequest = dax.requestBuilder(12345, {
    'name': 'demo.home.page',
    'app_name': 'demo',
    'app_type': 'example'
}, bucket, client, startDate, endDate);

console.info('Report Request:', reportRequest);

dax.fetchReport('demo', reportRequest).then(function(result) {
    var report = dax.destructureReport(result);
    console.log(report);
}).catch(function(error) {
    console.error(error);
});
```

## API Methods

```js
var api = require('node-dax');
```

### `api.requestBuilder(reportId, parameters, site, client, startdate, enddate)`
Creates a DAX POST request, valid against the supplied parameters. DAX will tell you if you've made an logical or access based errors based off this request format. It can be used directly with the `request` library available on `npm`.

### `api.destructureReport(reportData)`
Removes unnecessary layers of structuring from the data returned by DAX. Can be wired in to the output of `api.fetchReport` or `api.fetchReportNow`.

### `api.fetchReport(name, reportRequest, storagePath, requester, notify)`
Lazily fetches a report based on the name, and reportRequest. It returns whatever is stored in a local file cache, or an error, and then goes away and tries to make the DAX report. The notify method will be called once the data is received and written to disk.

### `api.fetchReportNow(name, reportRequest, requester)`
Fetches a report, now! Immediately goes off and hits DAX with a request. Not recommended if you have account limits on how frequent you can hit DAX. The `api.fetchReport` is the recommend method of attack, but this method will help you debug parameter issues more easily.

### `api.logger`
Allows logging to be turned on or off, or redirected to a custom target.

Has three methods:
- `logger.log`
- `logger.info`
- `logger.error`

Has two configurable properties:
- `logger.enabled`, default `false`
- `logger.target`, default `console`
