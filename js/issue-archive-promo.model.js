window.modules["issue-archive-promo.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'magazine-archive',
    fields = ['coverImageUrl', 'coverImageAlternativeText', 'canonicalUrl', 'issueHeadline', 'magazineIssueDateFrom'],
    publicationsQuantity = 6;

function setIssueList(publication) {
  return {
    issueImageUrl: publication.coverImageUrl || '',
    issueImageAlt: publication.coverImageAlternativeText || '',
    issueLabel: publication.issueHeadline || '',
    issueLink: publication.canonicalUrl || ''
  };
}

module.exports.render = function (ref, data) {
  var query = queryService(index);
  queryService.addFilter(query, {
    range: {
      magazineIssueDateFrom: {
        gt: 0,
        format: 'yyyy-MM-dd||yyyy'
      }
    }
  });
  queryService.addSort(query, {
    magazineIssueDateFrom: 'desc'
  });
  queryService.addSize(query, publicationsQuantity);
  queryService.onlyWithTheseFields(query, fields);
  return queryService.searchByQuery(query).then(function (results) {
    data.issues = results.map(setIssueList);
    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"49":49}];
