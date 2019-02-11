window.modules["187"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    _require = require(43),
    urlToCanonicalUrl = _require.urlToCanonicalUrl,
    _head = require(25),
    articleFieldName = 'tags',
    logicFieldName = 'tags';
/**
 * @param  {string} url
 * @param  {object} locals
 * @return {Promise}
 */


function getArticleTags(url, locals) {
  var query = queryService.onePublishedArticleByUrl(url, [articleFieldName]); // passing locals to queryService.onePublishedArticleByUrl will be needed for client-side query,
  // for when space-logic becomes editable in kiln

  return queryService.searchByQuery(query, {
    uniqueKey: "getArticleTags:".concat(urlToCanonicalUrl(url))
  }, locals, false).then(function (result) {
    return _head(result);
  });
}
/**
 * see if the tags to filter by are present on the article
 * @param  {Array} [articleTags]
 * @param  {Array} [matchTags]
 * @return {boolean}
 */


function findMatch(articleTags, matchTags) {
  return !!(articleTags && matchTags && matchTags.some(function (tag) {
    return articleTags.indexOf(tag) > -1;
  }));
}
/**
 * display depending if tag found and whether tags are being excluded or included; defaults to 'include'
 * @param {object} componentData
 * @returns {object | promise}
 */


function setDisplay(componentData) {
  return function (results) {
    var componentTags, matchFound; // If no results then just return promise rejection

    if (!results) {
      return Promise.reject();
    }

    componentTags = componentData[logicFieldName] && componentData[logicFieldName].split(',');
    matchFound = findMatch(results[articleFieldName], componentTags);
    componentData.displaySelf = componentData.tagsAction === 'exclude' ? !matchFound : matchFound;
    return componentData.displaySelf ? componentData : Promise.reject();
  };
}
/**
 * Check if article has a tag
 * @param  {object} componentData
 * @param  {string} localUrl
 * @param  {object} queryParams
 * @param  {object} locals
 * @return {[type]}
 */


function tagLogic(componentData, localUrl, queryParams, locals) {
  if (!componentData[logicFieldName]) {
    throw new Error('There are no ' + logicFieldName + ' for this Logic');
  }

  return getArticleTags(localUrl, locals).then(setDisplay(componentData));
}

module.exports = tagLogic;
}, {"25":25,"43":43,"49":49}];
