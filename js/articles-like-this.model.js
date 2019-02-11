window.modules["articles-like-this.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    _get = require(32),
    index = 'published-articles',
    _require = require(56),
    isComponent = _require.isComponent,
    fieldsForFeedItems = ['plaintextPrimaryHeadline', 'primaryHeadline', 'teaser', 'canonicalUrl', 'feedImgUrl', 'pageUri', 'date'];
/**
 * gets articles like the one on the current page
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise|object}
 */


module.exports.render = function (ref, data, locals) {
  // build query to get the current articleUri
  var thisArticleQuery = queryService.onePublishedArticleByUrl(locals.url, []); // not a page request, so no article to be found and can return early

  if (isComponent(locals.url)) {
    return data;
  }

  return queryService.searchByQueryWithRawResult(thisArticleQuery).then(function (rawResult) {
    var articleUri = _get(rawResult, 'hits.hits[0]._id');

    var articlesLikeThisQuery; // if no articleUri then return early, could be caused by article not being published yet

    if (!articleUri) {
      return;
    } // build query to get more articles like this


    articlesLikeThisQuery = queryService(index, locals);
    queryService.addSize(articlesLikeThisQuery, data.size);
    queryService.onlyWithinThisSite(articlesLikeThisQuery, locals.site);
    queryService.onlyWithTheseFields(articlesLikeThisQuery, fieldsForFeedItems);
    queryService.addShould(articlesLikeThisQuery, queryService.moreLikeThis(articlesLikeThisQuery, articleUri));
    queryService.addMinimumShould(articlesLikeThisQuery, 1);
    return queryService.searchByQuery(articlesLikeThisQuery);
  }).catch(function (e) {
    return queryService.logCatch(e, ref);
  }) // log es error, but still render component
  .then(function (articlesLikeThis) {
    data.articles = articlesLikeThis;
    return data;
  });
};
}, {"32":32,"49":49,"56":56}];
