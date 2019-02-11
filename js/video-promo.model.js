window.modules["video-promo.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'published-articles',
    fields = ['primaryHeadline', 'canonicalUrl', 'feedImgUrl'];
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var query = queryService.newQueryWithCount(index, 1, locals);
  queryService.onlyWithinThisSite(query, locals.site);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addFilter(query, {
    term: {
      tags: 'science of us animations'
    }
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query).then(function (results) {
    return {
      banner: data.banner,
      videoSeriesTitle: data.videoSeriesTitle,
      callToActionLink: data.callToActionLink,
      articles: results
    };
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"49":49}];
