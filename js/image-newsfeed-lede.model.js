window.modules["image-newsfeed-lede.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'published-articles',
    fields = ['primaryHeadline', 'plaintextPrimaryHeadline', 'authors', 'teaser', 'feedImgUrl', 'date', 'canonicalUrl', 'pageUri'];
/**
 * On save, if there is an `overrideLede`, get relevant data for that article
 * and set it as the primary article.
 *
 * @param  {String} uri
 * @param  {Object} data
 * @param  {Object} locals
 * @return {Promise}
 */


module.exports.save = function (uri, data, locals) {
  var overrideLedeQuery = queryService(index, locals);

  if (data.overrideLede) {
    overrideLedeQuery = queryService.onePublishedArticleByUrl(data.overrideLede);
    queryService.onlyWithTheseFields(overrideLedeQuery, fields);
    return queryService.searchByQuery(overrideLedeQuery).then(function (results) {
      data.primary = results[0];
      return data;
    });
  }

  return data;
};
/**
 * On render, query for the first 3 articles in chronological
 * order that are from this site.
 *
 * @param  {String} uri
 * @param  {Object} data
 * @param  {Object} locals
 * @return {Promise}
 */


module.exports.render = function (uri, data, locals) {
  var query = queryService.addSize(queryService(index, locals), 3);

  if (data.newsfeedArticlesOnly) {
    queryService.addFilter(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
  }

  if (data.tags && data.tags.length > 0) {
    data.tags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, 1);
  }

  if (data.overrideLede) {
    queryService.addMustNot(query, {
      term: {
        canonicalUrl: data.overrideLede
      }
    });
  }

  queryService.withinThisSiteAndCrossposts(query, locals.site);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query).then(function (results) {
    if (data.overrideLede) {
      data.secondaryArticles = results.slice(0, results.length - 1);
    } else {
      data.primary = results[0];
      data.secondaryArticles = results.slice(1);
    }

    return data;
  });
};
}, {"49":49}];
