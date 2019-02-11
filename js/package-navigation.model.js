window.modules["package-navigation.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'published-articles',
    fields = ['plaintextShortHeadline', 'plaintextPrimaryHeadline', 'canonicalUrl', 'feedImgUrl', 'tags'];
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var query = queryService.newQueryWithCount(index, parseInt(data.count, 10) || 50, locals);
  queryService.withinThisSiteAndCrossposts(query, locals.site);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addFilter(query, {
    prefix: {
      tags: data.tag
    }
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query).then(function (results) {
    if (data.tag) {
      data.articles = results;
    }

    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"49":49}];
