window.modules["circulation-listings-image.model"] = [function(require,module,exports){'use strict';

var _require = require(43),
    has = _require.has,
    mediaplay = require(53);
/**
 * Sets image with the correct rendition.
 * @param {object} data
 */


function setFeedImage(data) {
  if (has(data.feedImgUrl)) {
    // make sure the feed image is using the original rendition
    data.feedImgUrl = mediaplay.getRendition(data.feedImgUrl, 'og:image');
  }
}

module.exports.save = function (uri, data) {
  setFeedImage(data);
  return data;
}; // Exposed for testing


module.exports.setFeedImage = setFeedImage;
}, {"43":43,"53":53}];
