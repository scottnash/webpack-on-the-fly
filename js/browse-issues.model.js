window.modules["browse-issues.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'magazine-archive',
    yearIntervalAggregation = {
  publication_year: {
    date_histogram: {
      field: 'magazineIssueDateFrom',
      interval: 'year',
      format: 'yyyy-MM-dd'
    }
  }
};
/**
 * Gets years
 * @param {string} [dateStr=''] - publication group date
 * @return {string} year string
 */


function getYear() {
  var dateStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return dateStr.split('-')[0];
}
/**
 * Sets toc issues years
 * @param {Object} data - component data
 * @returns {Function} dateMapper
 */


function assignIssuesYears(data) {
  /**
   * Maps ToC's publication group year in descending order
   * @param {Array<string>} results - elasticsearch aggregation results
   * @return {Object} component data with issueYears property assigned
   */
  return function dateMapper(results) {
    var yearsArray = results.map(getYear).reverse();
    data.issueYears = yearsArray.map(function (year) {
      return {
        link: "/magazine/".concat(year, ".html"),
        label: year
      };
    });
    return data;
  };
}

module.exports.render = function (uri, data, locals) {
  var query = queryService(index, locals);
  queryService.addFilter(query, {
    range: {
      magazineIssueDateFrom: {
        gt: 0,
        format: 'yyyy-MM-dd||yyyy'
      }
    }
  });
  queryService.addAggregation(query, yearIntervalAggregation);
  queryService.addSize(query, 0);
  return queryService.searchByQueryWithRawResult(query).then(queryService.formatAggregationResults('publication_year', 'key_as_string')).then(assignIssuesYears(data)).catch(function (error) {
    return console.log(error.message);
  });
};
}, {"49":49}];
