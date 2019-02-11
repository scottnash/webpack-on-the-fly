window.modules["latest-article.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'published-articles',
    fields = ['plaintextPrimaryHeadline', 'canonicalUrl', 'feedImgUrl'];

module.exports.render = function (ref, data, locals) {
  var query = queryService.addSize(queryService(index, locals), 1); // Make a query with a size of 1

  queryService.onlyWithinThisSite(query, locals.site);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addFilter(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addFilter(query, {
    prefix: {
      tags: data.tag
    }
  });
  return queryService.searchByQuery(query).then(function (results) {
    data.article = results[0];
    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"49":49}];
