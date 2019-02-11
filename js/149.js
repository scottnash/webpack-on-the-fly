window.modules["149"] = [function(require,module,exports){// Utility methods for cleaning up data returned by Swiftype. Specific to
// listings search.
'use strict';

var _forIn = require(179),
    _initial = require(898),
    _isArray = require(129),
    _last = require(24),
    striptags = require(42),
    _require = require(152),
    mapDollarSigns = _require.mapDollarSigns,
    ALLOWED_TAGS = ['bold', 'b', 'italic', 'em', 'strike', 's'];
/**
 * Remove width, height, cropping, and resolution from media-play url. Exactly
 * the same method found in services/.../media-play
 * @param {string} imgUrl
 * @returns {string}
 */


function cleanUrl(imgUrl) {
  return imgUrl.replace('http://', 'https://').replace(/\.w\d+/i, '') // remove width
  .replace(/\.h\d+/i, '') // remove height
  .replace(/\.\dx/, '') // remove dimensions
  .replace(/\.nocrop/, ''); // remove cropping
}
/**
 * generate mediaplay urls
 * @param  {string} imgUrl - image url that's in Swiftype
 * @return {obj} obj - with rendition names and urls
 */


function getMediaplayUrls(imgUrl) {
  var parsedImgUrl = imgUrl.split('.'),
      base = cleanUrl(_initial(parsedImgUrl).join('.')),
      fileExt = _last(parsedImgUrl),
      // the file used as a placeholder is thousand-best-v1[rendition].png
  placeholderImageName = 'thousand-best-v1'; // we don't want to show the placeholder image, so return null


  if (imgUrl.includes(placeholderImageName)) {
    return null;
  } else {
    return {
      smallHiRes: "".concat(base, ".w140.h140.2x.").concat(fileExt),
      small: "".concat(base, ".w140.h140.").concat(fileExt),
      bigHiRes: "".concat(base, ".w235.h156.").concat(fileExt),
      big: "".concat(base, ".w235.h156.2x.").concat(fileExt)
    };
  }
}
/**
 * Clean data returned by Swiftype. Make the data easier to consume by templates
 * A result is returned as:
 *  {
 *    "name": {
 *      "raw": "The Loyal"
 *    },
 *    "listing_features": {
 *      "raw": [
 *        "Bar Scene",
 *        "Notable Chef",
 *        "Good for Groups"
 *      ]
*    }
 *
 * ... which can lead to some gnarly template code. So let's clean this up a little.
 *
 * @param  {object} result
 * @return {object}
 */


function cleanData(result) {
  var clean = {};

  _forIn(result, function (value, key) {
    if (key === 'price' && value.raw) {
      clean[key] = mapDollarSigns(value.raw);
    } else if (key === 'feed_img_url') {
      clean[key] = getMediaplayUrls(value.raw);
    } else if (key === 'teaser') {
      clean[key] = striptags(value.raw, ALLOWED_TAGS);
    } else if (_isArray(value.raw)) {
      clean[key] = value.raw.join(', ');
    } else {
      clean[key] = value.raw;
    }
  });

  return clean;
}

function alphaSort(obj1, obj2) {
  // sort filters alphabetically. If there is a displayValue, sort by that instead.
  var a = obj1.displayValue ? obj1.displayValue.toLowerCase() : obj1.value.toLowerCase(),
      b = obj2.displayValue ? obj2.displayValue.toLowerCase() : obj2.value.toLowerCase();

  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }
}
/**
 * Clean facets data returned by Swiftype.
 *
 * @param  {array} data
 * @param  {string} type - the facets group. Is either 'neighborhood', 'listing_features', 'price', 'cuisine'
 * @return {array}
 */


function getFacets(data, type) {
  return data[0].data.filter(function (val) {
    // we don't want empty values
    return !!val.value;
  }).map(function (val) {
    var clean = {
      type: type,
      value: val.value
    };

    if (type === 'price') {
      clean.displayValue = mapDollarSigns(val.value);
    }

    return clean;
  });
}

module.exports.cleanData = cleanData;
module.exports.getFacets = getFacets;
module.exports.mapDollarSigns = mapDollarSigns;
module.exports.alphaSort = alphaSort;
}, {"24":24,"42":42,"129":129,"152":152,"179":179,"898":898}];
