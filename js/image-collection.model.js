window.modules["image-collection.model"] = [function(require,module,exports){(function (__filename){
'use strict';
/**
 * @typedef imageCollectionItem
 * @type {object}
 * @property {string} imageUrl
 * @property {string} imageCaption
 * @property {string} [imageCredit]
 * @property {string} [imageRendition]
 * @property {string} [imageType]
 */

/**
 * @typedef imageCollectionData
 * @type {object}
 * @property {articleImageCollectionItem[]} imageCollection
 * @property {string} collectionLayout
 */

var _get = require(32),
    _reduce = require(124),
    _set = require(87),
    _filter = require(51),
    _isEmpty = require(75),
    striptags = require(42),
    mediaplay = require(53),
    sanitize = require(39),
    caption = require(125),
    log = require(81).setup({
  file: __filename,
  component: 'nymImageCollection'
}),
    util = require(123),
    allowedTags = ['strong', 'em', 'a'],
    // tags allowed in caption, credit
layouts = util.layouts,
    layoutsByCollectionSize = util.layoutsByCollectionSize,
    getDefaultLayout = function getDefaultLayout(collectionSize) {
  return _get(layoutsByCollectionSize, "".concat(collectionSize - 1, ".0"), null);
},
    stripAndSanitizeText = function stripAndSanitizeText(text) {
  return sanitize.toSmartText(striptags(text, allowedTags));
},
    organizeCaptionComponents = function organizeCaptionComponents(collection) {
  return _reduce(collection,
  /**
   * @param {object} accum
   * @param {imageCollectionItem} item
   * @returns {object}
   */
  function (accum, item) {
    var imageCaption = item.imageCaption,
        imageCaptionIndex = item.imageCaptionIndex,
        imageMobileCaptionIndex = item.imageMobileCaptionIndex,
        imageCredit = item.imageCredit,
        imageType = item.imageType,
        desktop = accum.desktop,
        mobile = accum.mobile;
    return {
      desktop: _set(desktop, imageCaptionIndex, {
        imageCaption: imageCaption,
        imageCredit: imageCredit,
        imageType: imageType
      }),
      mobile: _set(mobile, imageMobileCaptionIndex, {
        imageCaption: imageCaption,
        imageCredit: imageCredit,
        imageType: imageType
      })
    };
  }, {
    desktop: collection.map(function () {
      return {};
    }),
    mobile: collection.map(function () {
      return {};
    })
  });
};
/**
 *
 * @param {imageCollectionData} imageCollectionItem
 * @param {object} layoutItem
 * @returns {imageCollectionItem}
 */


function addMediaplayDetails(imageCollectionItem, layoutItem) {
  var imageUrl = imageCollectionItem.imageUrl;

  if (!imageUrl) {
    return Promise.resolve(imageCollectionItem);
  }

  return mediaplay.getMediaplayMetadata(imageUrl).then(function (metadata) {
    var credit = _get(metadata, 'credit', ''),
        imageType = _get(metadata, 'photoType', 'Photo');

    return {
      imageAlt: striptags(imageCollectionItem.imageAlt),
      imageCaption: stripAndSanitizeText(imageCollectionItem.imageCaption),
      imageCaptionIndex: layoutItem.captionIndex,
      imageMobileCaptionIndex: layoutItem.mobileCaptionIndex || layoutItem.captionIndex,
      imageCredit: stripAndSanitizeText(credit),
      imageRendition: layoutItem.rendition,
      imageType: imageType,
      imageUrl: mediaplay.getRendition(imageUrl, layoutItem.rendition)
    };
  });
}
/**
 *
 * @param {imageCollectionData} data
 * @param {number} collectionSize
 * @returns {string}
 */


function determineCollectionLayout(data, collectionSize) {
  var defaultLayout = getDefaultLayout(collectionSize),
      layout = _get(data, 'collectionLayout', null) || defaultLayout,
      layoutsForCollectionSize = _get(layoutsByCollectionSize, collectionSize - 1, []);

  if (!layoutsForCollectionSize.includes(layout)) {
    return defaultLayout;
  }

  return layout;
}

module.exports.render = function (uri, data, locals) {
  var renderer = _get(locals, 'params.ext', null);

  if (renderer === 'amp') {
    data.imageCollection = data.imageCollection.map(function (item) {
      item.ampAspectRatio = mediaplay.getRenditionAspectRatio(item.imageRendition);
      return item;
    });
  }

  return data;
};
/**
 *
 * @param {string} uri
 * @param {imageCollectionData} data
 * @returns {imageCollectionData}
 */


module.exports.save = function (uri, data) {
  var imageCollection = _get(data, 'imageCollection', []),
      sharedCredit = _get(data, 'sharedCredit', null),
      sharedCaption = _get(data, 'sharedCaption', null),
      collectionLayout = determineCollectionLayout(data, imageCollection.length),
      hasImages = _filter(imageCollection, function (item) {
    return !_isEmpty(item.imageUrl);
  }).length,
      imgCapCount = _filter(imageCollection, function (item) {
    return !_isEmpty(item.imageCaption);
  }).length,
      imgCreditCount = _filter(imageCollection, function (item) {
    return !_isEmpty(item.imageCredit);
  }).length,
      layoutMap = _get(layouts, collectionLayout, null),
      captionPrefix = _get(layoutMap, 'captionPrefix', null),
      mobileCaptionPrefix = _get(layoutMap, 'mobileCaptionPrefix', null) || captionPrefix;

  if (!collectionLayout || !hasImages) {
    data.collectionLayout = null;
    return Promise.resolve(data);
  }

  return Promise.all(imageCollection.map(function (item, index) {
    var layoutMapItem = _get(layoutMap.layoutItems, index, null);

    return addMediaplayDetails(item, layoutMapItem);
  })).then(function (collection) {
    var expandedCaption = organizeCaptionComponents(collection),
        checkCapCreditMult = (imgCreditCount > 1 || imgCapCount > 1) && !sharedCredit,
        captionPrefixCheck = checkCapCreditMult ? captionPrefix : '',
        mobileCaptionPrefixCheck = checkCapCreditMult ? mobileCaptionPrefix : ''; // remove default prefix from caption and credit when too few captions and shared credit exists

    data.imageCollection = collection;
    data.collectionLayout = collectionLayout;
    data.desktopCaption = caption.generateImageCollectionCaption(expandedCaption.desktop, sharedCredit, sharedCaption, captionPrefixCheck, false);
    data.mobileCaption = caption.generateImageCollectionCaption(expandedCaption.mobile, sharedCredit, sharedCaption, mobileCaptionPrefixCheck, true);
    return data;
  }).catch(function (error) {
    log('error', 'Error saving nymImageCollection', {
      error: error.message,
      uri: uri
    });
    data.imageCollection = imageCollection;
    data.collectionLayout = collectionLayout;
    return data;
  });
};

}).call(this,"/components/image-collection/model.js")}, {"32":32,"39":39,"42":42,"51":51,"53":53,"75":75,"81":81,"87":87,"123":123,"124":124,"125":125}];
