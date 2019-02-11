window.modules["lede-feature.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    styles = require(44),
    utils = require(43),
    mediaplay = require(53),
    ALLOWED_TAGS = ['em', 'i', 's', 'strike', 'span'];
/**
 * Update and sanitize headline.
 * @param {object} data
 */


function updateHeadline(data) {
  // Add smart quotes, etc to wysiwyg headlines
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.displayHeadline)) {
    data.displayHeadline = sanitize.toSmartHeadline(striptags(data.displayHeadline, ALLOWED_TAGS));
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
    data.displayTeaser = sanitize.toSmartText(striptags(data.displayTeaser, ALLOWED_TAGS));
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

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"39":39,"42":42,"43":43,"44":44,"53":53}];
