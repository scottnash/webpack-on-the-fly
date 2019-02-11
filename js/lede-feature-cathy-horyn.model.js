window.modules["lede-feature-cathy-horyn.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    utils = require(43),
    mediaplay = require(53);
/**
 * Update and sanitize headline.
 * @param {object} data
 */


function updateHeadline(data) {
  // Add smart quotes, etc to wysiwyg headlines
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.displayHeadline)) {
    data.displayHeadline = sanitize.toSmartHeadline(striptags(data.displayHeadline, ['em', 'i', 'strike', 'span']));
  }
}
/**
 * Update and sanitize teaser.
 * @param {object} data
 */


function updateTeaser(data) {
  // Add smart quotes, etc to teaser
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.displayTeaser)) {
    data.displayTeaser = sanitize.toSmartText(striptags(data.displayTeaser, ['em', 'i', 'strike', 'span']));
  }
}
/**
 * Format image for Feature rendition.
 * @param {object} data
 */


function processImage(data) {
  if (!utils.isFieldEmpty(data.url)) {
    data.url = mediaplay.getRendition(data.url, 'feature-lede');
  }
}

module.exports.save = function (uri, data) {
  updateHeadline(data);
  updateTeaser(data);
  processImage(data);
  return data;
};
}, {"39":39,"42":42,"43":43,"53":53}];
