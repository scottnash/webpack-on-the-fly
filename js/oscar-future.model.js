window.modules["oscar-future.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    utils = require(43),
    mediaplay = require(53);
/**
 * Update and sanitize text
 * @param {object} data
 */


function updateText(data) {
  // Add smart quotes, etc to text
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.title)) {
    data.title = sanitize.toSmartText(striptags(data.title, ['em']));
  }

  if (!utils.isFieldEmpty(data.text)) {
    data.text = sanitize.toSmartText(striptags(data.text, ['em', 'strong', 'a']));
  }
}
/**
 * format image with a small square rendition
 * @param  {object} data
 */


function updateImage(data) {
  if (!utils.isFieldEmpty(data.imageUrl)) {
    data.imageUrl = mediaplay.getRendition(data.imageUrl, 'square-small');
  }
}

module.exports.save = function (uri, data) {
  updateText(data);
  updateImage(data);
  return data;
};
}, {"39":39,"42":42,"43":43,"53":53}];
