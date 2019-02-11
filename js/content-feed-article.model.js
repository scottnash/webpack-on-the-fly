window.modules["content-feed-article.model"] = [function(require,module,exports){'use strict';

var _findIndex = require(79),
    articleVariationsByContentLength = [[], ['lede'], ['lede', 'large'], ['lede', 'small', 'large'], ['lede', 'small', 'small', 'small'], ['lede', 'medium', 'small', 'small', 'large'], ['lede', 'medium', 'medium', 'large', 'small', 'large']];

var cuneiformCmpt = require(95);

function getDynamicFeedImg(data) {
  if (!(data.displayVariation && data.article && data.article.feedImgUrl)) {
    return undefined;
  }

  return {
    url: data.article.feedImgUrl,
    mobile: "content-feed-article-".concat(data.displayVariation, "-small"),
    tablet: "content-feed-article-".concat(data.displayVariation, "-medium"),
    desktop: "content-feed-article-".concat(data.displayVariation, "-large")
  };
}

function getDisplayVariation(ref, data) {
  var parentContent = data.parentContent || [],
      articleVariations = articleVariationsByContentLength[parentContent.length],
      refIndex = _findIndex(parentContent, ['_ref', ref]);

  if (refIndex > -1 && articleVariations.length) {
    return articleVariations[refIndex];
  }
}

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals); // data.parentContent is provided by a parent `content-feed` component
  // through pub-sub client-side

  if (data.parentContent) {
    data.displayVariation = getDisplayVariation(ref, data);
    delete data.parentContent;
  }

  data.article = data.cuneiformResults ? data.cuneiformResults[0] : data.article;
  data.dynamicFeedImg = getDynamicFeedImg(data);
  return data;
};

module.exports.render = cuneiformCmpt.render;
}, {"79":79,"95":95}];
