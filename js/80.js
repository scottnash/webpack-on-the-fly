window.modules["80"] = [function(require,module,exports){'use strict';

var _includes = require(33);

function isVideo(contentData) {
  return contentData.featureTypes && (contentData.featureTypes['Video-Original'] || contentData.featureTypes['Video-Aggregation'] || contentData.featureTypes['Video-Original News']);
}

function isGallery(contentData) {
  return contentData.tags && (_includes(contentData.tags, 'gallery') || _includes(contentData.tags, 'slideshow'));
}

function getCalloutType(contentData) {
  if (isVideo(contentData)) {
    return 'video';
  }

  if (isGallery(contentData)) {
    return 'gallery';
  }

  return '';
}

module.exports = getCalloutType;
}, {"33":33}];
