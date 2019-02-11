window.modules["homepage-article-list.model"] = [function(require,module,exports){'use strict';

var cuneiformCmpt = require(95),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    _set = require(87),
    _cloneDeep = require(47);
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

  return data;
}

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals); // Warning: Never mutate objects in cuneiformResults. If you do, Cuneiform will
  // think the results are outdated and issue unnecessary PUTs

  data.articles = (data.cuneiformResults ? _cloneDeep(data.cuneiformResults) : data.articles) || [];
  data.callouts = data.articles.map(cuneiformCmpt.getCallout); // retrieve article metadata from elastic if cuneiform bot is toggled off,
  // as would be the case when we have paradiseSquare putting to most-popular

  if (data.botIgnore) {
    return Promise.all(data.articles.map(function (articleData) {
      articleData.url = articleData.canonicalUrl;
      return recircCmpt.getArticleDataAndValidate(ref, articleData, locals, ['pageUri']).then(function (result) {
        return assignToData(articleData, result);
      });
    })).then(function (articles) {
      data.articles = articles;
      return data;
    });
  }

  return data;
};

module.exports.render = cuneiformCmpt.render;
}, {"39":39,"47":47,"87":87,"95":95,"103":103}];
