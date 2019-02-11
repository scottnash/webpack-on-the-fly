window.modules["homepage-top-lede.model"] = [function(require,module,exports){'use strict';

var mediaplay = require(53),
    cuneiformCmpt = require(95),
    _get = require(32);

function getHeadline(data) {
  if (data.overrideHeadline) {
    return data.overrideHeadline;
  }

  if (data.article && data.headlineVariation) {
    return data.article[data.headlineVariation];
  }

  return '';
}

function getHeadlineSize(data) {
  if (data.headline) {
    var fullHeadline = data.headline;

    if (_get(data, 'show.teaser') && _get(data, 'article.teaser')) {
      fullHeadline += ' ' + data.article.teaser;
    }

    return fullHeadline.length > 100 ? 'long' : 'short';
  }

  return '';
}

function getImgUrl(data) {
  if (data.article && data.article.feedImgUrl) {
    return mediaplay.getRenditionUrl(data.article.feedImgUrl, {
      w: 620,
      h: 620
    });
  }

  return '';
}

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals);
  data.article = data.cuneiformResults ? data.cuneiformResults[0] : data.article;
  data.imgUrl = getImgUrl(data);
  data.callout = cuneiformCmpt.getCallout(data.article);
  data.headline = getHeadline(data);
  data.headlineSize = getHeadlineSize(data);
  return data;
};

module.exports.render = cuneiformCmpt.render;
}, {"32":32,"53":53,"95":95}];
