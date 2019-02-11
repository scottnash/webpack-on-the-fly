window.modules["homepage-article-promo.model"] = [function(require,module,exports){'use strict';

var cuneiformCmpt = require(95);

function getDynamicFeedImg(data) {
  if (!(data.variation && data.article && data.article.feedImgUrl)) {
    return undefined;
  }

  return {
    url: data.article.feedImgUrl,
    mobile: data.callout === 'video' ? // at small screen size videos have a special aspect ratio
    'homepage-article-promo-video-small' : "homepage-article-promo-".concat(data.variation, "-small"),
    tablet: "homepage-article-promo-".concat(data.variation, "-medium"),
    desktop: "homepage-article-promo-".concat(data.variation, "-large")
  };
}

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals);
  data.article = data.cuneiformResults ? data.cuneiformResults[0] : data.article;
  data.callout = cuneiformCmpt.getCallout(data.article);
  data.dynamicFeedImg = getDynamicFeedImg(data); // Prevent microservice from placing an article into
  // this spot if it is showing an ad

  data.botIgnore = !!data.showAd;
  return data;
};

module.exports.render = cuneiformCmpt.render;
}, {"95":95}];
