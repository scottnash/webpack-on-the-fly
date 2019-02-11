window.modules["lede-horizontal.model"] = [function(require,module,exports){'use strict';

var _isEmpty = require(75),
    _capitalize = require(145),
    striptags = require(42),
    utils = require(43),
    sanitize = require(39),
    mediaplay = require(53),
    styles = require(44);
/**
 * Convert text fields to smart text and remove unwanted HTML.
 * @param {object} data
 */


function sanitizeText(data) {
  if (utils.has(data.displayHeadline)) {
    data.displayHeadline = sanitize.toSmartHeadline(striptags(data.displayHeadline, ['em', 'i', 's', 'strike', 'span']));
  }

  if (utils.has(data.displayTeaser)) {
    data.displayTeaser = sanitize.toSmartText(striptags(data.displayTeaser, ['em', 'i', 's', 'strike', 'span']));
  }

  if (utils.has(data.imageCaption)) {
    data.imageCaption = sanitize.toSmartText(striptags(data.imageCaption, ['strong', 'em', 'i', 's', 'strike', 'a']));
  }

  if (utils.has(data.imageCreditOverride)) {
    data.imageCreditOverride = sanitize.toSmartText(striptags(data.imageCreditOverride, ['strong', 'em', 'i', 's', 'strike', 'a']));
  }
}
/**
 * Set correct rendition on mediaplay image.
 * @param {object} data
 */


function setImageRendition(data) {
  if (utils.has(data.imageUrl)) {
    data.imageUrl = mediaplay.getRendition(data.imageUrl, 'flex-xlarge');
  }
}
/**
 * Get the image credit from mediaplay, or allow it to be overwritten.
 * @param {object} data
 * @returns {object}
 */


function setImageCredit(data) {
  if (!utils.isFieldEmpty(data.imageUrl)) {
    return mediaplay.getMediaplayMetadata(data.imageUrl).then(function (metadata) {
      var imageType = _capitalize(metadata.imageType || 'Photo'); // don't display credit if its marked to be hidden or if theres no credit from mediaplay AND no override credit


      if (data.hideImageCredit || utils.isFieldEmpty(data.imageCreditOverride) && utils.isFieldEmpty(metadata.credit)) {
        // eslint-disable-line no-extra-parens
        data.imageCredit = '';
      } else if (!utils.isFieldEmpty(data.imageCreditOverride)) {
        data.imageCredit = data.imageCreditOverride;
      } else {
        data.imageCredit = "".concat(imageType, ": ").concat(sanitize.toSmartText(striptags(metadata.credit, ['strong', 'em', 'i', 's', 'strike', 'a'])));
      }

      return data;
    });
  } else {
    data.imageCredit = '';
    return Promise.resolve(data);
  }
}
/**
 * Set SASS from CSS.
 * @param {string} uri
 * @param {object} data
 * @returns {object}
 */


function setSass(uri, data) {
  if (!_isEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
    return Promise.resolve(data);
  }
}

module.exports.save = function (uri, data) {
  sanitizeText(data);
  setImageRendition(data);
  return setImageCredit(data).then(setSass(uri, data));
};
}, {"39":39,"42":42,"43":43,"44":44,"53":53,"75":75,"145":145}];
