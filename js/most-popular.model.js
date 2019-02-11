window.modules["most-popular.model"] = [function(require,module,exports){'use strict';

var recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    callout = require(80),
    _set = require(87),
    ELASTIC_FIELDS = ['pageUri', 'tags', 'authors'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  if (result.pageUri) {
    data.pageUri = result.pageUri;
  }

  if (data.primaryHeadline) {
    data.plaintextPrimaryHeadline = toPlainText(data.primaryHeadline);
  }

  if (Array.isArray(data.featureTypes)) {
    data.featureTypes = data.featureTypes.reduce(function (prev, curr) {
      return _set(prev, curr, true);
    }, {});
  }

  if (result.tags) {
    data.tags = result.tags;
  }

  if (result.authors) {
    data.authors = result.authors;
  }

  data.callout = callout(data);
  return data;
}

module.exports.save = function (ref, data, locals) {
  return Promise.all(data.articles.map(function (articleData) {
    articleData.url = articleData.canonicalUrl;
    return recircCmpt.getArticleDataAndValidate(ref, articleData, locals, ELASTIC_FIELDS).then(function (result) {
      return assignToData(articleData, result);
    });
  })).then(function (articles) {
    data.articles = articles;
    data.limit = parseInt(data.limit, 10) || 5;
    return data;
  });
};
}, {"39":39,"80":80,"87":87,"103":103}];
