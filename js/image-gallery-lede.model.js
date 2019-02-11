window.modules["image-gallery-lede.model"] = [function(require,module,exports){'use strict';

var striptags = require(42),
    _map = require(37),
    utils = require(43),
    sanitize = require(39),
    mediaplay = require(53),
    _require = require(43),
    has = _require.has,
    ALLOWED_TAGS = ['strong', 'em', 'a'];
/**
 * Gets image credit from mediaplay
 * @param  {Object} image
 * @return {Promise}
 */


function resolveMetadata(image) {
  if (image.imgUrl) {
    return mediaplay.getMediaplayMetadata(image.imgUrl).then(function (metadata) {
      if (utils.isFieldEmpty(image.creditOverride)) {
        image.credit = sanitize.toSmartText(striptags(metadata.credit, ALLOWED_TAGS));
      }

      return image;
    });
  } // always return a promise


  return Promise.resolve(image);
}
/**
 * Format image with facebook rendition
 * @param {Object} image
 * @return {Object}
 */


function setImageRendition(image) {
  image.imgUrl = mediaplay.getRendition(image.imgUrl, 'og:image');
  image.captionCredit = formattedCaptionCredit(image);
  return image;
}
/**
 * Return formatted image info for alt tags, etc
 * @param {Object} image
 * @returns {string}
 */


function formattedCaptionCredit(image) {
  var imageCredit = image.creditOverride || image.credit;
  var finalText = '';
  if (image.caption) finalText += image.caption;
  if (image.caption && imageCredit) finalText += ', ';
  if (imageCredit) finalText += "Photo: ".concat(imageCredit);
  return finalText;
}
/**
 * Create combined caption + credit string for display
 * @param {array} allItems
 * @returns {string}
 */


function getCombinedCaptionCredit() {
  var allItems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  // eslint-disable-line complexity
  var finalText = '',
      isMulti = allItems.length > 2,
      items = isMulti ? allItems.slice(0, 3) : allItems.slice(0),
      captionPrefix = '<strong class="caption-prefix">Clockwise from top left: </strong>',
      divider = '; ',
      i = 0,
      item,
      itemCredit;

  if (isMulti) {
    // add caption prefix for sets of 3 or more images
    finalText += captionPrefix; // move the second item in the array to the first position for human consumption

    items.splice(0, 0, items.splice(1, 1)[0]);
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      item = _step.value;
      itemCredit = item.creditOverride || item.credit; // only process the first image or initial 3 images

      if (i === 1 && items.length === 2 || i > 2) break; // add caption and credit info

      if (item.caption) finalText += item.caption;
      if (item.caption && itemCredit) finalText += ', ';
      if (itemCredit) finalText += "<span class=\"credit\">Photo: ".concat(itemCredit, "</span>");
      if (isMulti && i < 2) finalText += divider;
      i++;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  ;
  return finalText;
}
/**
 * Sets the proper rendition to a set of images
 * @param {Object} data
 * @returns {Promise}
 */


function setImagesRendition(data) {
  // Make sure we only show valid elements.
  data.galleryElements = data.galleryElements.filter(function (image) {
    return image.imgUrl;
  });

  if (has(data.galleryElements)) {
    return Promise.all(_map(data.galleryElements, resolveMetadata)).then(function (images) {
      images.forEach(function (image) {
        return setImageRendition(image);
      });
      return images;
    });
  }

  return Promise.resolve([]);
}
/**
 * Sets caption to a set of images
 * @param {Object} data
 * @param {Object[]} images
 */


function generateCaption(data, images) {
  data.galleryElements = images;

  if (has(images)) {
    var generatedCaption = getCombinedCaptionCredit(images.slice(0, 1)); // As of 10/25/18 we want to display only the first image

    data.captionDesktop = generatedCaption; // non-desktop views only display the first image

    data.captionMobile = generatedCaption;
  } else {
    // If there are no elements, then we clear the caption.
    data.captionDesktop = '';
    data.captionMobile = '';
  }
}

module.exports.save = function (uri, data) {
  return setImagesRendition(data).then(function (images) {
    generateCaption(data, images);
    return data;
  });
};
}, {"37":37,"39":39,"42":42,"43":43,"53":53}];
