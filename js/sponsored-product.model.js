window.modules["sponsored-product.model"] = [function(require,module,exports){'use strict';

var striptags = require(42),
    _isString = require(164),
    _set = require(87),
    mediaPlay = require(53),
    sanitize = require(39),
    utils = require(43),
    styles = require(44);
/**
 * removes html tags froms strings
 * @param {string} text
 * @param {array} allowTags
 * @returns {string}
 */


function cleanText(text, allowTags) {
  var allowedTags = ['strong', 'em', 'a'];
  return sanitize.toSmartText(striptags(text, allowTags ? allowedTags : []));
}
/**
 * sanitizes text labels
 * @param {object} data
 */


function updateText(data) {
  // all text labels (except for image captions) are stripped of html tags
  data.imageCaption = cleanText(data.imageCaption, true);
  data.imageCreditOverride = cleanText(data.imageCreditOverride, true);
}
/**
 * sets product image rendition
 * @param {object} data
 */


function updateImage(data) {
  if (!utils.isFieldEmpty(data.imageUrl)) {
    data.imageUrl = mediaPlay.getRendition(data.imageUrl, data.imageRendition);
  }
}
/**
 * sets product images credit and caption
 * @param {object} data
 * @returns {Promise}
 */


function updateImageMetadata(data) {
  return mediaPlay.getMediaplayMetadata(data.imageUrl).then(function (metadata) {
    data.imageType = metadata.imageType;

    if (_isString(data.imageCreditOverride) && !utils.isFieldEmpty(data.imageCreditOverride)) {
      data.imageCredit = data.imageCreditOverride;
    } else {
      data.imageCredit = metadata.credit;
    }

    return data;
  });
}

function setPerInstanceStyling(data, uri) {
  if (utils.has(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      return _set(data, 'css', css);
    });
  } else {
    return _set(data, 'css', '');
  }
}

module.exports.save = function (uri, data) {
  // only do this stuff for component instances not for component base
  if (utils.isInstance(uri)) {
    updateText(data);
    updateImage(data);
    setPerInstanceStyling(data, uri);
    return updateImageMetadata(data).then(function (data) {
      return data;
    });
  }

  return data;
};
}, {"39":39,"42":42,"43":43,"44":44,"53":53,"87":87,"164":164}];
