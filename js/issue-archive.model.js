window.modules["issue-archive.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'magazine-archive',
    fields = ['coverImageUrl', 'coverImageAlternativeText', 'canonicalUrl', 'issueHeadline', 'magazineIssueDateFrom'];
/**
 * Parse elastic data to match template requirement
 * @param  {Object} publication - publication object
 * @return {Object} parsed data
 */


function mungeIssueData(publication) {
  return {
    issueLink: publication.canonicalUrl || '',
    issueImage: publication.coverImageUrl || '',
    issueImageAlt: publication.coverImageAlternativeText || '',
    issueHeadline: publication.issueHeadline || ''
  };
}

module.exports.render = function (uri, data, locals) {
  var currentYear = new Date().getFullYear(),
      query = queryService(index, locals);
  var magazineDate = '',
      magazineYear = 0,
      order = '',
      queryDateRange = {};

  if (data.magazineIssueDateFrom) {
    magazineDate = new Date(data.magazineIssueDateFrom);
    magazineDate.setHours(24);
    magazineYear = magazineDate.getFullYear();
  }

  order = magazineYear === currentYear ? 'desc' : 'asc';
  queryDateRange = {
    gte: magazineYear,
    lt: magazineYear + 1,
    format: 'yyyy-MM-dd||yyyy'
  };

  if (magazineYear) {
    queryService.addFilter(query, {
      range: {
        magazineIssueDateFrom: queryDateRange
      }
    });
    queryService.onlyWithTheseFields(query, fields);
    queryService.addSort(query, {
      magazineIssueDateFrom: order
    });
    queryService.addSize(query, 100);
    return queryService.searchByQuery(query).then(function (results) {
      data.issues = results.map(mungeIssueData);
      return data;
    }).catch(function (e) {
      queryService.logCatch(e, uri);
      return data;
    });
  }

  return data;
};
}, {"49":49}];
