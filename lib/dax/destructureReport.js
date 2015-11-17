function destructureReport(reportData) {
    var reportItem = reportData.reportitems.reportitem[0];
    var title = reportItem.title;
    var columnHeadings = destructureColumnHeadings(reportItem);
    var rows = destructureRows(reportItem);
    var statistics = destructureStatistics(reportItem);

    return {
        title: title,
        columnHeadings: columnHeadings,
        rows: rows,
        statistics: statistics
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

function destructureStatistics(report) {
    var statistics = {};
    Object.keys(report.statistics).forEach(function(key) {
        statistics[key] = report.statistics[key].c;
    });
    return statistics;
}

module.exports = destructureReport;