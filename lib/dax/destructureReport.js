function destructureReport(reportData) {
	var reportItem = reportData.reportitems.reportitem[0];
	var title = reportItem.title;
	var columnHeadings = destructureColumnHeadings(reportItem);
	var rows = destructureRows(reportItem);

	return {
		title: title,
		columnHeadings: columnHeadings,
		rows: rows
	};
}

function destructureColumnHeadings(report) {
	return report.columns.column.map(function(column) {
		return column.ctitle;
	});
}

function destructureRows(report) {
	return report.rows.r.map(function(row) {
		return row.c;
	});
}

module.exports = destructureReport;