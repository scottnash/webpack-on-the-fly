window.modules["newsletter-recirc.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    _require = require(53),
    getRendition = _require.getRendition,
    _get = require(32),
    _require2 = require(43),
    has = _require2.has,
    FIELDS = ['byline', 'canonicalUrl', 'feedImgUrl', 'teaser', 'primaryHeadline', 'tags'],
    QUERY_INDEX = 'published-articles';
/**
 * Gets the latest X articles to be used in the recirc unit
 * @param {Object} data
 * @param {Object} locals
 * @returns {Object}
 */


function pullLatestArticles(data, locals) {
  var query = queryService(QUERY_INDEX, locals),
      slug = _get(locals, 'site.slug', '');

  if (has(data.tags)) {
    data.tags.forEach(function (tag) {
      queryService.addMust(query, {
        term: {
          tags: tag.text
        }
      });
    });
  }

  queryService.addFilter(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  queryService.addFilter(query, {
    term: {
      site: slug
    }
  });
  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, data.articleLimit + data.excludeLimit);
  return queryService.searchByQuery(query).then(function (latestArticles) {
    if (data.excludeLatestStory) latestArticles.shift(); // Removes the latest story if true;

    var articles = latestArticles.map(function (article) {
      article.feedImgUrl = data.imageRendition ? getRendition(article.feedImgUrl, data.imageRendition, true) : article.feedImgUrl;
      return article;
    });
    data.feedElements = articles;
    return data;
  });
}
/**
 * Ensures that the feed always pulls the right amount of articles.
 * @param {Object} data
 */


function handleArticleLimit(data) {
  data.excludeLimit = data.excludeLatestStory ? 1 : 0;
}

;
/**
 * @param {string} ref
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise|Object}
 */

module.exports.render = function (ref, data, locals) {
  return pullLatestArticles(data, locals);
};
/**
 * @param {string} ref
 * @param {object} data
 * @param {Object} locals
 * @returns {object}
 */


module.exports.save = function (ref, data, locals) {
  handleArticleLimit(data);
  pullLatestArticles(data, locals);
  return data;
};
}, {"32":32,"43":43,"49":49,"53":53}];
