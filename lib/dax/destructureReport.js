function destructureReport(reportData) {
	var report = reportitems.reportitem[0];
	var title = report.title;
	var columnHeadings = destructureColumnHeadings(report);
	var rows = destructureRows(report);

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