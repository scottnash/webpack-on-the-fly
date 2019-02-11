window.modules["top-stories.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'published-articles',
    NUM_ARTICLES = 3,
    AUTO_FEED = 'use most recent with filter tag';

function getTopStoriesQuery(site, tag, locals) {
  var topStoriesQuery = queryService.newQueryWithCount(index, NUM_ARTICLES, locals),
      fields = ['canonicalUrl', 'plaintextPrimaryHeadline', 'shortHeadline', 'feedImgUrl', 'pageUri'];

  if (tag && tag.length) {
    fields.push('tags');
    queryService.addFilter(topStoriesQuery, {
      term: {
        tags: tag
      }
    });
  }

  queryService.withinThisSiteAndCrossposts(topStoriesQuery, site);
  queryService.onlyWithTheseFields(topStoriesQuery, fields);
  queryService.addSort(topStoriesQuery, {
    date: 'desc'
  });
  return topStoriesQuery;
}
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  if (data.storySourcing === AUTO_FEED) {
    // feed-driven, so get the most recently published articles (optionally filtered)
    var query = getTopStoriesQuery(locals.site, data.feedTag, locals);
    return queryService.searchByQuery(query).then(function (results) {
      // if we filtered by tag and didn't find enough stories, revert to no filtering
      if (results && results.length < NUM_ARTICLES && data.feedTag && data.feedTag.length) {
        query = getTopStoriesQuery(locals.site, '');
        return queryService.searchByQuery(query);
      } else {
        return results;
      }
    }).then(function (results) {
      data.articles = results;
      return data;
    }).catch(function (e) {
      queryService.logCatch(e, ref);
      return data;
    });
  } else {
    // use the articles we have manually set (handled by child components)
    data.articles = [];
    return Promise.resolve(data);
  }
};
}, {"49":49}];
