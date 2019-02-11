window.modules["related.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    callout = require(80),
    ELASTIC_FIELDS = ['primaryHeadline', 'feedImgUrl', 'pageUri', 'tags', 'featureTypes'];

module.exports.save = function (ref, data, locals) {
  if (!data.items.length || !locals) {
    return data;
  }

  return Promise.all(_map(data.items, function (item) {
    item.urlIsValid = item.ignoreValidation ? 'ignore' : null;
    return recircCmpt.getArticleDataAndValidate(ref, item, locals, ELASTIC_FIELDS).then(function (result) {
      var article = Object.assign(item, {
        title: item.overrideTitle || result.primaryHeadline,
        image: item.overrideImage || result.feedImgUrl,
        pageUri: result.pageUri,
        urlIsValid: result.urlIsValid,
        callout: callout(result)
      });

      if (article.title) {
        article.plaintextTitle = toPlainText(article.title);
      }

      return article;
    });
  })).then(function (items) {
    data.items = items;
    return data;
  });
};
}, {"37":37,"39":39,"80":80,"103":103}];
