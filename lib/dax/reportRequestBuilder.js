function buildRequest(reportId, parameters, site, client, startdate, enddate) {

	var user = process.env.DAX_API_USERNAME;
	var password = process.env.DAX_API_PASSWORD;

	function encodeParameters(parameters) {
		var result = '';
		for (var param in parameters) {
			if (result) {
				result += '|';
			}
			result += param + ":" + parameters[param];
		}
		return result;
	}

	function enc(value) {
		return value || '';
	}

	var uri = 'https://dax-rest.comscore.eu/v1/reportitems.json';
	var body = 'parameters={parameters}&itemid={reportId}&startdate={startdate}&enddate={enddate}&site={site}&client={client}&user={user}&password={password}'
		.replace('{parameters}', encodeParameters(parameters))
		.replace('{reportId}', enc(reportId))
		.replace('{site}', enc(site))
		.replace('{client}', enc(client))
		.replace('{user}', enc(user))
		.replace('{password}', enc(password))
		.replace('{startdate}', enc(startdate || 'today-14'))
		.replace('{enddate}', enc(enddate || 'today-1'));

	return {
		uri: uri,
		method: 'POST',
		body: body
	};
}

module.exports = buildRequest;