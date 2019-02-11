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
window.modules["image-gallery-image.model"] = [function(require,module,exports){'use strict';

var mediaplay = require(53),
    striptags = require(42),
    sanitize = require(39),
    allowedTags = ['strong', 'em', 'a'],
    // tags allowed in caption, credit, creditOverride
cleanText = function cleanText(text) {
  return sanitize.toSmartText(striptags(text, allowedTags));
};

module.exports.save = function (uri, data) {
  if (!data.url) return data;
  return mediaplay.getMediaplayMetadata(data.url).then(function (metadata) {
    var _ref = metadata.dimensions || {},
        width = _ref.width,
        height = _ref.height,
        credit = cleanText(metadata.credit);

    return Object.assign({}, data, {
      width: width,
      height: height,
      credit: credit
    });
  });
};
}, {"39":39,"42":42,"53":53}];
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
window.modules["image-gallery.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (uri, data) {
  data.galleryLength = data.images ? data.images.length : 0;
  return data;
};
}, {}];
window.modules["image-grid-image.model"] = [function(require,module,exports){'use strict';

var isEmpty = require(75),
    maxImgWidth = 1180;
/**
 * update image-grid and allow users to edit the width and the height from kiln
 * @param {object} data
 */

/**
* Images are the given the width and height from input from user on desktop, but are shown at 100% width on mobile/tablet.
* So we're pulling in the largest image that will be needed based on the aspect ratio from the user input.
* This component should be refactored to accommodate 2x images and more appropriate
* image sizes depending on viewport.
*/


function editWidthAndHeight(data) {
  var imageAspectRatio, imageWidth, imageHeight;

  if (data.width && data.height && !isEmpty(data.url)) {
    // Calculate image ratio based on user input
    imageAspectRatio = data.width / data.height;
    imageWidth = maxImgWidth;
    imageHeight = Math.round(maxImgWidth / imageAspectRatio); // Set the image url

    if (data.url.match(/\.w\d+/i)) {
      data.url = data.url.replace(/\.w\d+/i, '.w' + imageWidth);
      data.url = data.url.replace(/\.h\d+/i, '.h' + imageHeight);
    } else {
      var urlParts = data.url.split('.'),
          extension = '.' + urlParts.pop();
      data.url = urlParts.join('.');
      data.url = data.url + '.w' + imageWidth;
      data.url = data.url + '.h' + imageHeight;
      data.url = data.url + extension;
    }
  }
}
/**
 * update image-grid and allow users to edit the width and the height from kiln
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  editWidthAndHeight(data);
  return data;
};
}, {"75":75}];
window.modules["image-grid.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  var caption = data.caption || '';
  data.caption = sanitize.validateTagContent(sanitize.toSmartText(caption));
  return data;
};
}, {"39":39}];
window.modules["image-hotspot.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"43":43,"44":44}];
window.modules["image-hover-description.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"43":43,"44":44}];
window.modules["image-layout.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.render = function (ref, data) {
  data.numOfImages = data.images.length === 2 ? 'two' : 'one';
  return data;
};

module.exports.save = function (ref, data) {
  // compile styles if they're not empty
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = ''; // unset any compiled css

    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"43":43,"44":44}];
window.modules["image-newsfeed-lede.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'published-articles',
    fields = ['primaryHeadline', 'plaintextPrimaryHeadline', 'authors', 'teaser', 'feedImgUrl', 'date', 'canonicalUrl', 'pageUri'];
/**
 * On save, if there is an `overrideLede`, get relevant data for that article
 * and set it as the primary article.
 *
 * @param  {String} uri
 * @param  {Object} data
 * @param  {Object} locals
 * @return {Promise}
 */


module.exports.save = function (uri, data, locals) {
  var overrideLedeQuery = queryService(index, locals);

  if (data.overrideLede) {
    overrideLedeQuery = queryService.onePublishedArticleByUrl(data.overrideLede);
    queryService.onlyWithTheseFields(overrideLedeQuery, fields);
    return queryService.searchByQuery(overrideLedeQuery).then(function (results) {
      data.primary = results[0];
      return data;
    });
  }

  return data;
};
/**
 * On render, query for the first 3 articles in chronological
 * order that are from this site.
 *
 * @param  {String} uri
 * @param  {Object} data
 * @param  {Object} locals
 * @return {Promise}
 */


module.exports.render = function (uri, data, locals) {
  var query = queryService.addSize(queryService(index, locals), 3);

  if (data.newsfeedArticlesOnly) {
    queryService.addFilter(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
  }

  if (data.tags && data.tags.length > 0) {
    data.tags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, 1);
  }

  if (data.overrideLede) {
    queryService.addMustNot(query, {
      term: {
        canonicalUrl: data.overrideLede
      }
    });
  }

  queryService.withinThisSiteAndCrossposts(query, locals.site);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query).then(function (results) {
    if (data.overrideLede) {
      data.secondaryArticles = results.slice(0, results.length - 1);
    } else {
      data.primary = results[0];
      data.secondaryArticles = results.slice(1);
    }

    return data;
  });
};
}, {"49":49}];
window.modules["image-newsfeed-secondary.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _map = require(37),
    _clone = require(58),
    queryService = require(49),
    utils = require(43),
    index = 'published-articles',
    fields = ['primaryHeadline', 'plaintextPrimaryHeadline', 'authors', 'teaser', 'feedImgUrl', 'date', 'canonicalUrl', 'pageUri'];

module.exports.render = function (uri, data, locals) {
  var size = locals.start ? 51 : 48,
      from = utils.formatStart(parseInt(locals.start, 10) || 3),
      body = {
    from: data.overrideLede ? from - 1 : from,
    size: size
  },
      query = queryService(index, locals);
  query.body = _clone(body);
  queryService.withinThisSiteAndCrossposts(query, locals.site);

  if (data.newsfeedArticlesOnly) {
    queryService.addFilter(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
  }

  if (data.tags && data.tags.length > 0) {
    data.tags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, 1);
  }

  if (data.overrideLede) {
    queryService.addMustNot(query, {
      term: {
        canonicalUrl: data.overrideLede
      }
    });
  }

  queryService.onlyWithTheseFields(query, fields);
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQueryWithRawResult(query).then(function (results) {
    data.total = _get(results, 'hits.total');
    data.articles = _map(_get(results, 'hits.hits'), '_source');
    data.from = from;
    data.start = data.from + size;

    if (data.overrideLede) {
      data.total = data.total - 1;
    }

    return data;
  });
};
}, {"32":32,"37":37,"43":43,"49":49,"58":58}];
window.modules["image.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _keys = require(128),
    _get = require(32),
    _includes = require(33),
    striptags = require(42),
    mediaplay = require(53),
    sanitize = require(39),
    log = require(81).setup({
  file: __filename,
  component: 'nymImage'
}),
    aspectRatios = {
  'deep-vertical': {
    rendition: 'nym-image-collection-deep-vertical'
  },
  horizontal: {
    rendition: 'nym-image-collection-horizontal'
  },
  'horizontal-break-out': {
    rendition: 'nym-image-collection-horizontal-break-out'
  },
  square: {
    rendition: 'nym-image-collection-square'
  },
  vertical: {
    rendition: 'nym-image-collection-vertical'
  },
  flex: {
    rendition: 'nym-image-collection-flex'
  },
  'flex-break-out': {
    rendition: 'nym-image-collection-flex-break-out'
  }
},
    widths = {
  inset: {
    allowedAspectRatios: _keys(aspectRatios)
  },
  inline: {
    allowedAspectRatios: _keys(aspectRatios)
  },
  'break-out': {
    allowedAspectRatios: ['horizontal', 'flex']
  }
},
    defaultWidth = 'inline',
    allowedTags = ['strong', 'em', 'a'],
    // tags allowed in caption, credit
stripAndSanitizeText = function stripAndSanitizeText(text) {
  return sanitize.toSmartText(striptags(text, allowedTags));
};

function determineAspectRatioForDimensions(imageWidth, imageRawDimensions) {
  var height = imageRawDimensions.height,
      width = imageRawDimensions.width;

  if (imageWidth === 'break-out') {
    return 'horizontal';
  }

  if (height === width) {
    return 'square';
  } else if (width > height) {
    return 'horizontal';
  } else {
    return 'vertical';
  }
}
/**
 *
 * @param {string} assignedAspectRatio
 * @param {string} imageWidth
 * @param {object} imageRawDimensions
 * @param {boolean} useRecommended
 * @param {boolean} flexOverride
 * @return {string}
 */


function determineAspectRatio(assignedAspectRatio, imageWidth, imageRawDimensions, useRecommended, flexOverride) {
  // eslint-disable-line max-params
  var allowedAspectRatios = _get(widths, "".concat(imageWidth, ".allowedAspectRatios"), []); // Always use Flex AR when the Flex Override is enabled


  if (flexOverride) {
    return 'flex';
  } // When we allow the system to determine AR set based on imageWidth and imageDimensions


  if (useRecommended) {
    return determineAspectRatioForDimensions(imageWidth, imageRawDimensions);
  } // When we are assigned the Flex AR but do not have the flex override enabled reset based on imageWidth and imageDimensions


  if (assignedAspectRatio === 'flex' && !flexOverride) {
    return determineAspectRatioForDimensions(imageWidth, imageRawDimensions);
  } // When we are using an AR disallowed by our width setting reset based on imageWidth and imageDimensions


  if (!_includes(allowedAspectRatios, assignedAspectRatio)) {
    return determineAspectRatioForDimensions(imageWidth, imageRawDimensions);
  } // Otherwise use the assigned AR or set based on imageWidth and imageDimensions


  return assignedAspectRatio || determineAspectRatioForDimensions(imageWidth, imageRawDimensions);
}

function applyMediaplayMetadata(image, useRecommendedAspectRatio) {
  var imageAspectRatio = image.imageAspectRatio,
      imageAspectRatioFlexOverride = image.imageAspectRatioFlexOverride,
      imageCaption = image.imageCaption,
      imageCreditOverride = image.imageCreditOverride,
      imageUrl = image.imageUrl,
      imageWidth = image.imageWidth,
      imageAlt = image.imageAlt;

  if (!imageUrl) {
    return Promise.resolve(image);
  }

  return mediaplay.getMediaplayMetadata(imageUrl).then(function (metadata) {
    var credit = _get(metadata, 'credit', ''),
        imageType = _get(metadata, 'imageType', 'Photo'),
        imageRawDimensions = _get(metadata, 'dimensions', {
      width: 1,
      height: 1
    }),
        aspect = determineAspectRatio(imageAspectRatio, imageWidth, imageRawDimensions, useRecommendedAspectRatio, imageAspectRatioFlexOverride),
        imageRendition = "".concat(_get(aspectRatios, "".concat(aspect, ".rendition"), null)).concat(imageWidth === 'break-out' ? '-break-out' : ''),
        originalAspectRatio = Math.round(imageRawDimensions.width / imageRawDimensions.height * 100) / 100;

    return {
      imageAlt: striptags(imageAlt),
      imageAspectRatio: aspect,
      imageCaption: stripAndSanitizeText(imageCaption),
      imageCredit: stripAndSanitizeText(imageCreditOverride || credit),
      imageRendition: imageRendition,
      imageType: imageType,
      imageUrl: mediaplay.getRendition(imageUrl, imageRendition),
      imageWidth: imageWidth,
      originalAspectRatio: originalAspectRatio
    };
  });
}

module.exports.render = function (uri, data, locals) {
  var renderer = _get(locals, 'params.ext', null);

  if (renderer === 'amp') {
    data.ampAspectRatio = data.imageAspectRatioFlexOverride ? data.originalAspectRatio : mediaplay.getRenditionAspectRatio(data.imageRendition);
  }

  return data;
};

module.exports.save = function (uri, data) {
  var imageAspectRatio = _get(data, 'imageAspectRatio', null),
      imageAspectRatioFlexOverride = _get(data, 'imageAspectRatioFlexOverride', false),
      imageCaption = _get(data, 'imageCaption', null),
      imageCreditOverride = _get(data, 'imageCreditOverride', null),
      imageUrl = _get(data, 'imageUrl', null),
      useRecommendedAspectRatio = _get(data, 'useRecommendedAspectRatio', false),
      imageWidth = _get(data, 'imageWidth', null) || defaultWidth,
      image = {
    imageAspectRatio: imageAspectRatio,
    imageAspectRatioFlexOverride: imageAspectRatioFlexOverride,
    imageCaption: imageCaption,
    imageCreditOverride: imageCreditOverride,
    imageUrl: imageUrl,
    imageWidth: imageWidth
  };

  return applyMediaplayMetadata(image, useRecommendedAspectRatio).then(function (applied) {
    data.imageAspectRatio = applied.imageAspectRatio;
    data.imageCaption = applied.imageCaption;
    data.imageCredit = applied.imageCredit;
    data.imageRendition = applied.imageRendition;
    data.imageType = applied.imageType;
    data.imageUrl = applied.imageUrl;
    data.imageWidth = applied.imageWidth;
    data.originalAspectRatio = applied.originalAspectRatio;
    return data;
  }).catch(function (error) {
    log('error', 'Error saving nymImage', {
      error: error.message,
      uri: uri
    });
    return data;
  });
};

}).call(this,"/components/image/model.js")}, {"32":32,"33":33,"39":39,"42":42,"53":53,"81":81,"128":128}];
window.modules["imgur.model"] = [function(require,module,exports){(function (process){
'use strict';

var urlParse = require(38),
    _includes = require(33),
    _get = require(32),
    _last = require(24),
    _isArray = require(129),
    rest = require(5),
    API_KEY = window.process.env.IMGUR_KEY,
    HEADERS = {
  Authorization: "Client-ID ".concat(API_KEY)
};
/**
 * determine if a path is from an album or gallery
 * @param {string} path
 * @returns {boolean}
 */


function isAlbum(path) {
  return _includes(path, '/a/');
}
/**
 * get an ID from an album or gallery
 * e.g. '/a/albumID', '/gallery/galleryID', '/galleryID'
 * @param {string} path
 * @returns {string}
 */


function getID(path) {
  return _last(path.split('/'));
}

function parseImgurData(data) {
  return function (imgurResponse) {
    var imgurData = imgurResponse.data,
        isAlbum = _isArray(imgurData.images); // an "album" always has an images array
    // even if it's empty / contains one image


    return {
      url: data.url,
      id: isAlbum ? "a/".concat(imgurData.id) : imgurData.id,
      // albums need to embed with a/<id>
      // note: galleries that are also albums can simply be linked to the album ID
      title: imgurData.title || '<span class="imgur-empty">No Title</span>',
      // empty titles get special styling in edit mode
      // note: in practice, titles should almost never be empty. sometimes they are for single images, though
      img: isAlbum ? _get(imgurData, 'images[0].link') : imgurData.link // note: `link` in albums is actually a link to the album. in single-image galleries
      // and images, it's a direct link to the image file
      // also note: we're assuming the first album image is the cover image.
      // imgur's api defines a cover ID, but there's nothing in imgur's UI
      // where someone could make a different image the cover, so it might be extraneous

    };
  };
}
/**
 * get single image data
 * @param {string} path
 * @param {object} data
 * @returns {Function}
 */


function getImgurImageData(path, data) {
  return function () {
    return rest.get("https://api.imgur.com/3/image/".concat(getID(path)), {
      headers: HEADERS
    }).then(parseImgurData(data));
  };
}
/**
 * get image and title from imgur
 * note: "albums" are collections of multiple images,
 * but albums might also be galleries, and galleries might be albums,
 * but not always. oh also there are images that aren't in galleries OR albums.
 * @param {object} data
 * @returns {Promise}
 */


function getImgurData(data) {
  var path = urlParse(data.url).pathname;

  if (isAlbum(path)) {
    // it's an album. it'll need some special parsing
    return rest.get("https://api.imgur.com/3/album/".concat(getID(path)), {
      headers: HEADERS
    }).then(parseImgurData(data)); // if anything fails, it'll throw an error
  } else {
    // it's a gallery or image
    return rest.get("https://api.imgur.com/3/gallery/".concat(getID(path)), {
      headers: HEADERS
    }).then(parseImgurData(data)).catch(getImgurImageData(path, data)); // images and galleries have the exact same url structure!
  }
}

module.exports.save = function (ref, data) {
  return data.url ? getImgurData(data) : data;
};

}).call(this,require(22))}, {"5":5,"22":22,"24":24,"32":32,"33":33,"38":38,"129":129}];
window.modules["in-article-image-slide.model"] = [function(require,module,exports){'use strict';

var styles = require(44),
    utils = require(43),
    sanitize = require(39),
    striptags = require(42),
    mediaPlay = require(53);

function sanitizeText(data) {
  if (utils.has(data.imageCaption)) {
    data.imageCaption = sanitize.toSmartText(striptags(data.imageCaption, ['strong', 'em', 'a', 'span']));
  }

  return data;
}

function setSlideRendition(data) {
  var widths = {
    small: 670,
    medium: 800,
    large: 900,
    'extra-large': 1200,
    'super-extra-large': 1600
  },
      aspectRatio = 1.5,
      flexMax = 2147483647,
      imgWidth,
      imgHeight,
      crop;

  if (data.imageURL && data.slideWidth) {
    switch (data.slideDisplay) {
      case 'horizontal':
        imgWidth = widths[data.slideWidth];
        imgHeight = Math.round(imgWidth / aspectRatio);
        crop = true;
        break;

      case 'vertical':
        imgWidth = flexMax;
        imgHeight = Math.round(widths[data.slideWidth] / aspectRatio);
        crop = false;
        break;

      case 'flex':
      default:
        imgWidth = widths[data.slideWidth];
        imgHeight = flexMax;
        crop = false;
        break;
    }

    data.imageURL = mediaPlay.getRenditionUrl(data.imageURL, {
      w: imgWidth,
      h: imgHeight,
      r: '2x'
    }, crop);
  }
}

module.exports.save = function (uri, data) {
  sanitizeText(data);
  setSlideRendition(data);

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = ''; // unset any compiled css

    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"39":39,"42":42,"43":43,"44":44,"53":53}];
window.modules["in-article-image-slideshow.model"] = [function(require,module,exports){'use strict';

var styles = require(44),
    utils = require(43);

module.exports.save = function (uri, data) {
  // compile styles if they're not empty
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = ''; // unset any compiled css

    return data;
  }
};
}, {"43":43,"44":44}];
window.modules["intelligencer-header.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _startCase = require(111);

module.exports.render = function (uri, data, locals) {
  data.sectionHeading = '';

  if (data.pageType === 'section-page') {
    data.sectionHeading = _startCase(_get(locals, 'params.name', ''));

    if (data.sectionHeading === 'Tech') {
      data.sectionHeading = 'Technology';
    }
  }

  return data;
};
}, {"32":32,"111":111}];
window.modules["interactive-homelessness.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"43":43,"44":44}];
window.modules["interactive-tile.model"] = [function(require,module,exports){'use strict';

module.exports.render = function (ref, data) {
  data.id = ref.split('/').slice(-1)[0];
  return data;
};
}, {}];
window.modules["interactive-tiles.model"] = [function(require,module,exports){'use strict';

module.exports.render = function (ref, data, locals) {
  // In edit mode, replace component list of tile objects into an array of tile ref
  // strings for performance.
  if (locals.edit) {
    data.tiles = data.tiles.map(function (obj) {
      return obj._ref;
    });
  } // If the "tile" query param is given, include the tile object so it can be edited


  if (locals.edit && locals.tile) {
    data.editingTile = {
      _ref: locals.tile
    };
  }

  return data;
};
}, {}];
window.modules["issue-archive-promo.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'magazine-archive',
    fields = ['coverImageUrl', 'coverImageAlternativeText', 'canonicalUrl', 'issueHeadline', 'magazineIssueDateFrom'],
    publicationsQuantity = 6;

function setIssueList(publication) {
  return {
    issueImageUrl: publication.coverImageUrl || '',
    issueImageAlt: publication.coverImageAlternativeText || '',
    issueLabel: publication.issueHeadline || '',
    issueLink: publication.canonicalUrl || ''
  };
}

module.exports.render = function (ref, data) {
  var query = queryService(index);
  queryService.addFilter(query, {
    range: {
      magazineIssueDateFrom: {
        gt: 0,
        format: 'yyyy-MM-dd||yyyy'
      }
    }
  });
  queryService.addSort(query, {
    magazineIssueDateFrom: 'desc'
  });
  queryService.addSize(query, publicationsQuantity);
  queryService.onlyWithTheseFields(query, fields);
  return queryService.searchByQuery(query).then(function (results) {
    data.issues = results.map(setIssueList);
    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"49":49}];
window.modules["issue-archive.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'magazine-archive',
    fields = ['coverImageUrl', 'coverImageAlternativeText', 'canonicalUrl', 'issueHeadline', 'magazineIssueDateFrom'];
/**
 * Parse elastic data to match template requirement
 * @param  {Object} publication - publication object
 * @return {Object} parsed data
 */


function mungeIssueData(publication) {
  return {
    issueLink: publication.canonicalUrl || '',
    issueImage: publication.coverImageUrl || '',
    issueImageAlt: publication.coverImageAlternativeText || '',
    issueHeadline: publication.issueHeadline || ''
  };
}

module.exports.render = function (uri, data, locals) {
  var currentYear = new Date().getFullYear(),
      query = queryService(index, locals);
  var magazineDate = '',
      magazineYear = 0,
      order = '',
      queryDateRange = {};

  if (data.magazineIssueDateFrom) {
    magazineDate = new Date(data.magazineIssueDateFrom);
    magazineDate.setHours(24);
    magazineYear = magazineDate.getFullYear();
  }

  order = magazineYear === currentYear ? 'desc' : 'asc';
  queryDateRange = {
    gte: magazineYear,
    lt: magazineYear + 1,
    format: 'yyyy-MM-dd||yyyy'
  };

  if (magazineYear) {
    queryService.addFilter(query, {
      range: {
        magazineIssueDateFrom: queryDateRange
      }
    });
    queryService.onlyWithTheseFields(query, fields);
    queryService.addSort(query, {
      magazineIssueDateFrom: order
    });
    queryService.addSize(query, 100);
    return queryService.searchByQuery(query).then(function (results) {
      data.issues = results.map(mungeIssueData);
      return data;
    }).catch(function (e) {
      queryService.logCatch(e, uri);
      return data;
    });
  }

  return data;
};
}, {"49":49}];
window.modules["issue-promo.model"] = [function(require,module,exports){'use strict';

var mediaplay = require(53);

module.exports.save = function (ref, data) {
  if (data.imageUrl) {
    data.imageUrl = mediaplay.getRendition(data.imageUrl, 'issue-promo');
  }

  return data;
};
}, {"53":53}];
window.modules["item-dropdown.model"] = [function(require,module,exports){'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var queryService = require(49);

module.exports.render = function (uri, data, locals) {
  if (data.index && data.itemTextField && data.itemLinkField) {
    var index = data.index,
        query = queryService(index, locals),
        fields = [data.itemTextField, data.itemLinkField];
    queryService.onlyWithTheseFields(query, fields);
    queryService.addSize(query, 500);
    queryService.addMinimumShould(query, 1);

    if (!!data.sortProperty) {
      queryService.addSort(query, _defineProperty({}, data.sortProperty, 'asc'));
    }

    return queryService.searchByQuery(query).then(function (results) {
      data.items = results.map(function (item) {
        return {
          itemTextField: item[data.itemTextField],
          itemLinkField: item[data.itemLinkField]
        };
      });
      return data;
    }).catch(function (e) {
      queryService.logCatch(e, uri);
      return data;
    });
  } else {
    return data;
  }
};
}, {"49":49}];
window.modules["latest-article.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'published-articles',
    fields = ['plaintextPrimaryHeadline', 'canonicalUrl', 'feedImgUrl'];

module.exports.render = function (ref, data, locals) {
  var query = queryService.addSize(queryService(index, locals), 1); // Make a query with a size of 1

  queryService.onlyWithinThisSite(query, locals.site);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addFilter(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addFilter(query, {
    prefix: {
      tags: data.tag
    }
  });
  return queryService.searchByQuery(query).then(function (results) {
    data.article = results[0];
    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"49":49}];
window.modules["latest-feed.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var queryService = require(49),
    _map = require(37),
    sanitize = require(39),
    logger = require(81),
    log = logger.setup({
  file: __filename
}),
    striptags = require(42),
    INDEX = 'published-articles',
    QUERY_RE = /\?.*/,
    fields = ['canonicalUrl', 'feedLayout', 'date', 'rubric', 'primaryHeadline', 'shortHeadline', 'teaser', 'authors', 'feedImgUrl', 'tags', 'featureTypes', 'pageUri', 'syndicationStatus', 'crosspost', 'site'];

function defineTitleUrl(url) {
  return url.replace(QUERY_RE, '');
}

function defineClickUrl(url, dataSize) {
  if (url.includes('/?start=')) {
    return url;
  } else if (url.lastIndexOf('/')) {
    return "".concat(url, "?start=").concat(dataSize);
  }
}

function buildSearchQuery(data, locals, isCuneiform) {
  var size = Math.max(data.desktopArticleSize, data.mobileArticleSize, data.tabletArticleSize),
      query = isCuneiform ? queryService.newCuneiformQuery(INDEX) : queryService(INDEX, locals);

  if (locals) {
    queryService.withinThisSiteAndCrossposts(query, locals.site);
  }

  queryService.onlyWithTheseFields(query, fields);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, size);

  if (data.includeTags && data.includeTags.length) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });

    if (data.matchAllTags) {
      queryService.addMinimumShould(query, data.includeTags.length);
    } else {
      queryService.addMinimumShould(query, 1);
    }
  }

  if (data.excludeTags && data.excludeTags.length) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
    });
  }

  if (!data.nonFeedArticles) {
    queryService.addMust(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
  }

  return query;
}

function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  } else {
    return [];
  }
}

module.exports.render = function (uri, data, locals) {
  var query;

  if (data.populationBehavior !== 'static') {
    query = buildSearchQuery(data, locals, false);
    return queryService.searchByQuery(query).then(function (results) {
      data.articles = results;
      return data;
    }).catch(function (error) {
      log('error', error, {
        action: 'render',
        uri: uri
      });
      return data;
    });
  }

  return data;
};

module.exports.save = function (ref, data, locals) {
  data.title = sanitize.toSmartText(striptags(data.title || '', ['span']));

  if (data.readMoreUrl) {
    data.titleUrl = defineTitleUrl(data.readMoreUrl);
    data.clickUrl = defineClickUrl(data.readMoreUrl, data.desktopArticleSize);
    data.mobileUrl = defineClickUrl(data.readMoreUrl, data.mobileArticleSize);
    data.tabletUrl = defineClickUrl(data.readMoreUrl, data.tabletArticleSize);
  }

  if (data.populationBehavior === 'static') {
    data.cuneiformScopes = getScopes(data.scopes);
    data.cuneiformQuery = buildSearchQuery(data, locals, true);
  } else if (data.cuneiformScopes || data.cuneiformQuery) {
    delete data.cuneiformScopes;
    delete data.cuneiformQuery;
  }

  return data;
};

}).call(this,"/components/latest-feed/model.js")}, {"37":37,"39":39,"42":42,"49":49,"81":81}];
window.modules["latest-news.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _some = require(118),
    _values = require(60),
    _get = require(32),
    queryService = require(49),
    callout = require(80),
    _require = require(56),
    isComponent = _require.isComponent,
    index = 'published-articles',
    fields = ['plaintextPrimaryHeadline', 'primaryHeadline', 'teaser', 'canonicalUrl', 'feedImgUrl', 'pageUri', 'date', 'rubric', 'feedLayout', 'storyCharacteristics', 'tags', 'authors', 'featureTypes'];

function decorateResults(results, desktopRendition, showFeatures) {
  return _map(results, function (result) {
    result.featured = showFeatures && (_some(_values(result.storyCharacteristics), function (v) {
      return !!v;
    }) || result.feedLayout === 'large');
    result.callout = callout(result);
    result.dynamicImage = {
      url: result.feedImgUrl,
      mobile: 'square',
      tablet: result.featured ? 'square' : desktopRendition,
      desktop: result.featured ? 'square' : desktopRendition
    };
    return result;
  });
}

function getArticleFeedResults(data, locals, ref) {
  var query = queryService.addSize(queryService(index, locals), data.size);

  if (data.tag) {
    fields.push('tags');
    queryService.addShould(query, {
      prefix: {
        tags: data.tag
      }
    });
    queryService.addMinimumShould(query, 1);
  }

  if (data.featureType) {
    var term = {};
    term["featureTypes.".concat(data.featureType)] = true;
    fields.push('featureType');
    queryService.addShould(query, {
      term: term
    });
    queryService.addMinimumShould(query, 1);
  }

  if (!data.allSites) {
    queryService.withinThisSiteAndCrossposts(query, locals.site);
    queryService.addMustNot(query, {
      prefix: {
        canonicalUrl: "http://".concat(locals.site.host, "/press")
      }
    });
  }

  queryService.onlyWithTheseFields(query, fields);
  queryService.addFilter(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query, {
    ref: ref,
    uniqueKey: 'getArticleFeedResults'
  }, locals, false);
}

function normalizeCanonicalUrl(url) {
  return url.split('/amp/').join('/');
}

function getArticlesLikeThis(data, locals) {
  var articleUrl = normalizeCanonicalUrl(locals.url),
      thisArticleQuery = queryService.onePublishedArticleByUrl(articleUrl, []);

  if (isComponent(locals.url)) {
    return Promise.resolve([]);
  }

  return queryService.searchByQueryWithRawResult(thisArticleQuery).then(function (rawResult) {
    var articleUri = _get(rawResult, 'hits.hits[0]._id');

    var articlesLikeThisQuery;

    if (!articleUri) {
      return [];
    }

    articlesLikeThisQuery = queryService(index, locals);
    queryService.addSize(articlesLikeThisQuery, data.size);
    queryService.onlyWithinThisSite(articlesLikeThisQuery, locals.site);
    queryService.onlyWithTheseFields(articlesLikeThisQuery, fields);
    queryService.addShould(articlesLikeThisQuery, queryService.moreLikeThis(articlesLikeThisQuery, articleUri));
    queryService.addMinimumShould(articlesLikeThisQuery, 1);
    return queryService.searchByQuery(articlesLikeThisQuery, {
      ref: articleUri,
      // Not passing the component ref because the query changes based on the article
      uniqueKey: 'getArticlesLikeThis'
    }, locals, false);
  });
}
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var elasticCall;

  if (data.showArticlesLikeThis) {
    elasticCall = getArticlesLikeThis;
  } else {
    elasticCall = getArticleFeedResults;
  }

  return elasticCall(data, locals, ref).then(function (results) {
    data.articles = decorateResults(results, data.desktopImgRendition, data.showFeatures);
    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};

module.exports.save = function (ref, data) {
  // show the rubric (no date) on mobile if its a tag feed
  // otherwise show the date with no rubric on mobile
  data.showMobileRubric = !!data.tag || !!data.featureType;
  return data;
};
}, {"32":32,"37":37,"49":49,"56":56,"60":60,"80":80,"118":118}];
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
window.modules["lede-full-bleed.model"] = [function(require,module,exports){'use strict';

var _isEmpty = require(75),
    sanitize = require(39),
    striptags = require(42),
    styles = require(44),
    brandingRubricHandlers = require(144);
/**
 * Only allow emphasis, italic, and strikethroughs in headlines.
 * @param  {string} oldHeadline
 * @returns {string}
 */


function stripHeadTags(oldHeadline) {
  return striptags(oldHeadline, ['em', 'i', 's', 'strike', 'span']);
}
/**
 * See if a field exists and is not empty.
 * @param {string} field
 * @returns {boolean}
 */


function has(field) {
  return field && field.length > 0;
}
/**
 * Update and sanitize headline.
 * @param {object} data
 * @returns {object}
 */


function updateHeadline(data) {
  // Add smart quotes, etc to wysiwyg headlines
  // Also strip out unwanted html tags
  if (has(data.displayHeadline)) {
    data.displayHeadline = sanitize.toSmartHeadline(stripHeadTags(data.displayHeadline));
  }

  return data;
}
/**
 * Update and sanitize teaser.
 * @param {object} data
 * @returns {object}
 */


function updateTeaser(data) {
  // Add smart quotes, etc to teaser
  // Also strip out unwanted html tags
  if (has(data.displayTeaser)) {
    data.displayTeaser = sanitize.toSmartText(stripHeadTags(data.displayTeaser));
  }

  return data;
}
/**
 * Translates the selected position to the appropiate flex-box property
 * @param {object} data
 * @param {string} orientation
 * @returns {object}
 */


function parseTextPosition(data) {
  var mapping = {
    top: 'flex-start',
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    bottom: 'flex-end'
  }; // account for undefined properties and set to 'center'

  if (!data.textVerticalPosition) {
    data.textVerticalPosition = 'center';
  }

  if (!data.textHorizontalPosition) {
    data.textHorizontalPosition = 'center';
  }

  data.alignItemsProp = mapping[data.textVerticalPosition];
  data.justifyContentProp = mapping[data.textHorizontalPosition];
  return data;
}
/**
 * Calls a rubric handler for a page when certain conditions are met
 * Conditions are contained in an array iterated over in order
 * When the first condition is met, it will use that rubric and stop
 * @param {object} handlers
 * @param {object} data make sure to set a default, so handlers can assume it exists
 * @param {object} locals make sure to set a default, so handlers can assume it exists
 */


function callRubricHandlers() {
  var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var locals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var handlerIndex;

  for (handlerIndex = 0; handlerIndex < handlers.length; handlerIndex++) {
    if (handlers[handlerIndex].when(data, locals)) {
      handlers[handlerIndex].handler(data);
      break;
    }
  }
}
/**
 * set tag rubric
 * @param {object} data
 * @param {object} locals
 */


function setRubrics(data, locals) {
  // always check for the graphical branding rubric
  callRubricHandlers(brandingRubricHandlers, data, locals);
}

module.exports.save = function (uri, data, locals) {
  // Do these in order
  updateHeadline(data);
  updateTeaser(data);
  parseTextPosition(data);
  setRubrics(data, locals);

  if (!_isEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
    return Promise.resolve(data);
  }
};
}, {"39":39,"42":42,"44":44,"75":75,"144":144}];
window.modules["lede-gallery.model"] = [function(require,module,exports){'use strict';

var _require = require(55),
    formatDate = _require.formatDate,
    setCanonicalUrl = _require.setCanonicalUrl,
    queryService = require(49),
    promises = require(46),
    _require2 = require(43),
    has = _require2.has,
    QUERY_INDEX = 'authors',
    mediaplay = require(53),
    striptags = require(42),
    sanitize = require(39),
    allowedTags = ['strong', 'em', 'a'],
    cleanText = function cleanText(text) {
  return sanitize.toSmartText(striptags(text, allowedTags));
};
/**
 * query elastic to get social media stuff for an author
 * @param {Object} query
 * @param {string} name
 * @returns {Promise}
 */


function getAuthorData(query, name) {
  queryService.addShould(query, {
    match: {
      'name.normalized': sanitize.normalizeName(name.text)
    }
  });
  queryService.addMinimumShould(query, 1);
  return queryService.searchByQuery(query).catch(function () {
    return {
      name: name.text
    };
  }).then(function (authors) {
    return authors;
  });
}
/**
 * Gets the authorsAndMeta data if there exists any authors of the article
 * note: the template expects data.authorsAndMeta, so always populate it
 * @param  {Object} query
 * @param  {Object} data
 * @return {Promise}
 */


function getAuthorSocialData(query, data) {
  var bareAuthors = has(data.authors) ? data.authors : [];

  if (bareAuthors.length === 1) {
    // if there's a single author, query for their social media handle
    return promises.timeout(getAuthorData(query, bareAuthors[0]).then(function (authorsAndMeta) {
      // set the authors & metadata property, using the metadata if it exists
      data.authorsAndMeta = authorsAndMeta && authorsAndMeta.length ? authorsAndMeta : bareAuthors;
    }), 1000).catch(function () {
      data.authorsAndMeta = bareAuthors;
    }); // fail gracefully
  } else {
    data.authorsAndMeta = bareAuthors;
  }

  return Promise.resolve();
}

function resolveLedeImage(data) {
  if (!data.ledeImageUrl) return data;
  return mediaplay.getMediaplayMetadata(data.ledeImageUrl).then(function (metadata) {
    data.ledeImageCredit = cleanText(metadata.credit);
    return data;
  });
}

module.exports.save = function (uri, data, locals) {
  var query = queryService(QUERY_INDEX, locals);
  formatDate(data, locals);
  setCanonicalUrl(data, locals);
  return Promise.all([getAuthorSocialData(query, data), resolveLedeImage(data)]).then(function () {
    return data;
  });
};
}, {"39":39,"42":42,"43":43,"46":46,"49":49,"53":53,"55":55}];
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
window.modules["lede-interactive.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    styles = require(44),
    utils = require(43);
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
    data.displayTeaser = sanitize.toSmartText(striptags(data.displayTeaser, ['strong', 'em', 'i', 'strike', 'span']));
  }
}

module.exports.save = function (uri, data) {
  updateHeadline(data);
  updateTeaser(data);

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
}, {"39":39,"42":42,"43":43,"44":44}];
window.modules["lede-video.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    striptags = require(42),
    dateFormat = require(52),
    dateParse = require(54),
    utils = require(43),
    _require = require(48),
    getParselySiteId = _require.getParselySiteId,
    has = utils.has,
    isFieldEmpty = utils.isFieldEmpty,
    sanitize = require(39),
    promises = require(46),
    circulationService = require(55),
    rest = require(5),
    mediaplay = require(53);
/**
 * only allow emphasis, italic, and strikethroughs in headlines
 * @param  {string} oldHeadline
 * @returns {string}
 */


function stripHeadlineTags(oldHeadline) {
  var newHeadline = striptags(oldHeadline, ['em', 'i', 'strike']); // if any tags include a trailing space, shift it to outside the tag

  return newHeadline.replace(/ <\/(i|em|strike)>/g, '</$1> ');
}
/**
 * sanitize headlines and teasers
 * @param  {object} data
 */


function sanitizeInputs(data) {
  if (has(data.primaryHeadline)) {
    data.primaryHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.primaryHeadline));
  }

  if (has(data.shortHeadline)) {
    data.shortHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.shortHeadline));
  }

  if (has(data.overrideHeadline)) {
    data.overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.overrideHeadline));
  }

  if (has(data.seoHeadline)) {
    // seo headline doesn't allow any html, but should get curly quotes, fancy dashes, and ellipses
    data.seoHeadline = sanitize.toSmartHeadline(striptags(data.seoHeadline));
  }

  if (has(data.teaser)) {
    data.teaser = sanitize.toSmartText(stripHeadlineTags(data.teaser));
  }

  if (has(data.seoDescription)) {
    // seo description doesn't allow any html, but should get curly quotes (and decoded entities)
    data.seoDescription = sanitize.toSmartText(striptags(data.seoDescription));
  }
}
/**
 * generate the primary headline from the overrideHeadline
 * if the primary headline is empty and the overrideHeadline is less than 80 characters
 * @param  {object} data
 */


function generatePrimaryHeadline(data) {
  if (isFieldEmpty(data.primaryHeadline) && has(data.overrideHeadline) && data.overrideHeadline.length < 80) {
    // note: this happens AFTER overrideHeadline is sanitized
    data.primaryHeadline = data.overrideHeadline;
  }
}
/**
 * add extra stuff to the page title on certain sites
 * @param {string} title
 * @param {object} locals
 * @returns {string}
 */


function addSiteTitle(title, locals) {
  // add '-- Science of Us' if we're on that site
  if (_get(locals, 'site.slug') === 'scienceofus') {
    return "".concat(title, " -- Science of Us");
  } else {
    return title;
  }
}
/**
 * generate plaintext pageTitle / twitterTitle / ogTitle
 * on every save
 * @param  {object} data
 * @param  {object} locals
 */


function generatePageTitles(data, locals) {
  if (has(data.seoHeadline) || has(data.shortHeadline) || has(data.primaryHeadline)) {
    var plaintextTitle = sanitize.toPlainText(data.seoHeadline || data.shortHeadline || data.primaryHeadline); // published to pageTitle

    data.pageTitle = addSiteTitle(plaintextTitle, locals);
  }

  if (has(data.primaryHeadline)) {
    // published to ogTitle
    data.plaintextPrimaryHeadline = sanitize.toPlainText(data.primaryHeadline);
  }

  if (has(data.shortHeadline)) {
    // published to twitterTitle
    data.plaintextShortHeadline = sanitize.toPlainText(data.shortHeadline);
  }
}
/**
 * generate pageDescription from seoDescription / teaser
 * @param  {object} data
 */


function generatePageDescription(data) {
  if (has(data.seoDescription) || has(data.teaser)) {
    // published to pageDescription
    data.pageDescription = sanitize.toPlainText(data.seoDescription || data.teaser);
  }

  if (has(data.teaser)) {
    // published to socialDescription (consumed by share components and og:description/twitter:description)
    data.socialDescription = sanitize.toPlainText(data.teaser);
  }
}
/**
 * set the publish date from the locals (even if it's already set),
 * and format it correctly
 * @param  {object} data
 * @param  {object} locals
 */


function formatDate(data, locals) {
  if (_get(locals, 'date')) {
    // if locals and locals.date exists, set the article date (overriding any date already set)
    data.date = dateFormat(locals.date); // ISO 8601 date string
  } else if (has(data.articleDate) || has(data.articleTime)) {
    // make sure both date and time are set. if the user only set one, set the other to today / right now
    data.articleDate = has(data.articleDate) ? data.articleDate : dateFormat(new Date(), 'YYYY-MM-DD');
    data.articleTime = has(data.articleTime) ? data.articleTime : dateFormat(new Date(), 'HH:mm'); // generate the `date` data from these two fields

    data.date = dateFormat(dateParse(data.articleDate + ' ' + data.articleTime)); // ISO 8601 date string
  }
}
/**
 * set the canonical url from the locals (even if it's already set)
 * @param {object} data
 * @param {object} locals
 */


function setCanonicalUrl(data, locals) {
  if (_get(locals, 'publishUrl')) {
    data.canonicalUrl = locals.publishUrl;
  }
}
/**
 * ensure the feed image is using the original rendition.
 * anything consuming the image is expected to apply the correct rendition at time of use.
 * @param  {object} data
 * @param  {object|null} mediaplayImage
 */


function setFeedImage(data) {
  if (has(data.feedImgUrl)) {
    // make sure the feed image is using the original rendition
    data.feedImgUrl = mediaplay.getRendition(data.feedImgUrl, 'original');
  }
}
/**
 * set the site for ES indexing
 * @param {object} data
 * @param {object} locals
 */


function setSite(data, locals) {
  if (locals && locals.site && locals.site.slug) {
    data.site = locals.site.slug;
  }
}
/**
 * get article's previously-saved data, if it exists
 * note: only grab the data if we're thinking of updating the slug
 * @param  {string} uri
 * @param {object} data
 * @param {object} locals
 * @return {Promise}
 */


function getPrevData(uri, data, locals) {
  if (has(data.seoHeadline) || has(data.shortHeadline) || has(data.slug)) {
    return rest.get(utils.uriToUrl(utils.replaceVersion(uri), locals)).catch(function () {
      return null;
    }); // eat any errors (e.g. if there isn't previously-saved data)
  }
}
/**
 * get article's previously-published data, if it exists
 * note: only grab the data if we're thinking of updating the slug
 * @param  {string} uri
 * @param {object} data
 * @param {object} locals
 * @return {Promise}
 */


function getPublishedData(uri, data, locals) {
  if (has(data.seoHeadline) || has(data.shortHeadline) || has(data.slug)) {
    return rest.get(utils.uriToUrl(utils.replaceVersion(uri, 'published'), locals)).catch(function () {
      return null;
    }); // eat any errors (e.g. if there isn't previously-published data)
  }
}
/**
 * determine if user has manually updated the slug
 * note: manually removing the slug (setting it to emptystring)
 * is still considered manually updating the slug
 * note: this checks the new data before any slug would be generated,
 * so we're directly comparing what the user is saving to the old data
 * @param  {object} data
 * @param  {object|null} prevData
 * @return {Boolean}
 */


function manualSlugUpdate(data, prevData) {
  return prevData ? data.slug !== prevData.slug : false;
}
/**
 * determine if user has manually locked the slug (by going into settings)
 * @param  {object} data
 * @param  {object|null} prevData
 * @return {Boolean}
 */


function manualSlugLock(data, prevData) {
  return prevData ? prevData.slugLock === false && data.slugLock === true : false;
}
/**
 * determine if user has manually unlocked the slug (by going into settings)
 * @param  {object} data
 * @param  {object|null} prevData
 * @return {Boolean}
 */


function manualSlugUnlock(data, prevData) {
  return prevData ? prevData.slugLock === true && data.slugLock === false : false;
}
/**
 * generate the slug from the seoHeadline or shortHeadline
 * note: they should already have been sanitized
 * @param  {object} data
 */


function generateSlug(data) {
  if (has(data.seoHeadline)) {
    data.slug = sanitize.cleanSlug(data.seoHeadline);
  } else if (has(data.shortHeadline)) {
    data.slug = sanitize.cleanSlug(data.shortHeadline);
  } // else don't set the slug

}
/**
 * generate and/or lock the slug
 * @param  {object|null} data
 * @param  {object|null} prevData
 * @param  {object} publishedData
 */


function setSlugAndLock(data, prevData, publishedData) {
  if (manualSlugUpdate(data, prevData)) {
    // if you manually updated the slug, sanitize and update it and lock the slug
    data.slug = sanitize.cleanSlug(data.slug);
    data.slugLock = true;
    data.manualSlugUnlock = false; // manually changing the slug ALWAYS locks it again
  } else if (manualSlugLock(data, prevData)) {
    // if you manually locked the slug, don't generate a new slug
    data.slugLock = true;
    data.manualSlugUnlock = false; // manually locking the slug ALWAYS locks it again (of course)
  } else if (manualSlugUnlock(data, prevData)) {
    // if you manually unlocked the slug, generate a new slug
    generateSlug(data);
    data.manualSlugUnlock = true; // manually unlocking the slug means it won't be locked again (even if published)
  } else if (publishedData && (isFieldEmpty(data.manualSlugUnlock) || data.manualSlugUnlock === false)) {
    // if you've already published the article, don't regenerate the slug
    // note: if you publish and manually unlock the slug, it'll stay unlocked
    // until you either manually write a new slug or manually lock the slug again
    data.slugLock = true;
  } else if (isFieldEmpty(data.slugLock) || data.slugLock === false) {
    // if the slug is NOT locked (and no other situation above matches), generate it
    generateSlug(data);
  } // if the slug is locked (and no other situation above matches), do nothing

}

module.exports.render = function (ref, data, locals) {
  if (locals && !locals.edit) {
    return data;
  } // only need parselyApiKey for amp pages (gtm handles our non-amp pages)


  if (_get(locals, 'params.ext') === 'amp') {
    data.parselyApiKey = getParselySiteId(locals);
  }

  return promises.props({
    past: circulationService.getRollingStandoutArticles(locals),
    publishedData: getPublishedData(ref, data, locals)
  }).then(function (resolved) {
    circulationService.setGoogleStandoutHelpers(data, resolved.publishedData, resolved.past.length);
    return data;
  });
};

module.exports.save = function (uri, data, locals) {
  // first, let's get all the synchronous stuff out of the way:
  // sanitizing inputs, setting fields, etc
  sanitizeInputs(data); // do this before using any headline/teaser/etc data

  generatePrimaryHeadline(data);
  generatePageTitles(data, locals);
  generatePageDescription(data);
  formatDate(data, locals);
  setCanonicalUrl(data, locals);
  setFeedImage(data);
  setSite(data, locals); // now that we have some initial data (and inputs are sanitized),
  // do the api calls necessary to update the page and authors list and slug

  return promises.props({
    prevData: getPrevData(uri, data, locals),
    publishedData: getPublishedData(uri, data, locals)
  }).then(function (resolved) {
    // once async calls are done, use their resolved values to update some more data
    setSlugAndLock(data, resolved.prevData, resolved.publishedData);
    return data;
  });
};
}, {"5":5,"32":32,"39":39,"42":42,"43":43,"46":46,"48":48,"52":52,"53":53,"54":54,"55":55}];
window.modules["leftovers-nav.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"43":43,"44":44}];
window.modules["listicle-hundred-jokes.model"] = [function(require,module,exports){'use strict';

var isEmpty = require(75); // autopopulates the byline field in the settings based on the inline input


function updateNavBylineSettings(data) {
  if (data.bylines.length > 0 && isEmpty(data.navByline)) {
    data.navByline = data.bylines.map(function (person) {
      return person.text;
    }).join(', ');
  }

  return data;
}

function generateAnchorLink(data) {
  var slug = ''; // an anchor link slug has the format of 'label-headline' or just 'headline' when there's no label

  if (data.headline) {
    data.headline = data.headline.toString();

    if (data.label) {
      data.label = data.label.toString();
      slug = data.label.replace(/[^A-Za-z0-9]+/g, '') + '-' + data.headline.replace(/[^A-Za-z0-9]+/g, '');
      data.anchorLinkSlug = slug;
    } else {
      data.anchorLinkSlug = data.headline.replace(/[^A-Za-z0-9]+/g, '');
    }
  }
}
/**
 * update listicle-item
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  updateNavBylineSettings(data);
  generateAnchorLink(data);
  return data;
};
}, {"75":75}];
window.modules["listing-contact.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  data = sanitize.recursivelyStripSeperators(data);
  return data;
};
}, {"39":39}];
window.modules["listing-feed.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _get = require(32),
    _isEmpty = require(75),
    urlParse = require(38),
    yaml = require(115),
    queryService = require(49),
    mediaplay = require(53),
    INDEX = 'listings'; // Determine whether a listing should have the sponsored indicator.
// If the feed has only paid listings, do not show the indicator
// Otherwise, show if there is a brand teaser and there is NO editorial teaser


function getSponsoredIndicator(listing, data) {
  return !data.onlyPaidListings && _isEmpty(listing.content.teaser) && !_isEmpty(listing.content.brandTeaser);
} // If a listing is on feed that servers only paid listings, prefer the brand teaser
// Otherwise, prefer the editorial teaser over the brand teaser


function getFeedTeaser(listing, data) {
  if (data.onlyPaidListings) {
    return listing.content.brandTeaser || listing.content.teaser;
  } else {
    return listing.content.teaser || listing.content.brandTeaser;
  }
} // Sets media renditions for images in a listing specific to the listing-feed component


function setMediaRenditions(listing) {
  if (listing.media.image) {
    listing.media.image.mediaplayUrl = mediaplay.getRendition(listing.media.image.mediaplayUrl, 'listing-media');
  }

  if (listing.media.slideshow) {
    listing.media.slideshow.imageUrl = mediaplay.getRendition(listing.media.slideshow.imageUrl, 'listing-media');
  }
}

function setWebsiteLink(listing) {
  if (listing.contact && !_isEmpty(listing.contact.website)) {
    var parsedWebsite = urlParse(listing.contact.website);

    if (_isEmpty(parsedWebsite.protocol)) {
      parsedWebsite.set('protocol', 'http');
    }

    listing.contact.websiteLink = parsedWebsite.toString();
  }
}

module.exports.save = function (uri, data) {
  if (data.query) {
    // js-yaml doesn't like tabs so we replace them with 2 spaces
    data.query = data.query.replace(/\t/g, '  ');
    data.jsonQuery = JSON.stringify(yaml.safeLoad(data.query));
  }

  return data;
}; // During our render, we query ElasticSearch for listings, then munge the returned data for the template


module.exports.render = function (ref, data, locals) {
  var query = queryService(INDEX, locals);

  if (data.jsonQuery) {
    query.body = JSON.parse(data.jsonQuery);
    queryService.addSort(query, {
      'name.lower_case': 'asc'
    });
    queryService.addSize(query, 200);
    return queryService.searchByQueryWithRawResult(query).then(function (results) {
      data.listings = _map(_get(results, 'hits.hits'), '_source');
      data.listings.forEach(function (listing) {
        listing.sponsoredIndicator = getSponsoredIndicator(listing, data);
        listing.feedTeaser = getFeedTeaser(listing, data);
        setWebsiteLink(listing);
        setMediaRenditions(listing);
      });
      return data;
    });
  }

  return data;
}; // exported for tests in model.js


module.exports.getSponsoredIndicator = getSponsoredIndicator;
module.exports.getFeedTeaser = getFeedTeaser;
}, {"32":32,"37":37,"38":38,"49":49,"53":53,"75":75,"115":115}];
window.modules["listing-media-slideshow.model"] = [function(require,module,exports){'use strict';

var slideshow = require(147);

module.exports.save = function (ref, data, locals) {
  return slideshow.addSlideshowLink(locals)(data);
};
}, {"147":147}];
window.modules["listing-metadata.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    toTitleCase = function toTitleCase(str) {
  if (str) {
    return str.toLowerCase().replace(/(^| )(\w)/g, function (s) {
      return s.toUpperCase();
    });
  }

  return;
};

module.exports.save = function (ref, data, locals) {
  if (data.title) {
    data.slug = sanitize.cleanSlug(data.title);
  }

  if (locals && locals.publishUrl) {
    data.canonicalUrl = locals.publishUrl;
  }

  data = sanitize.recursivelyStripSeperators(data);
  data.kilnTitle = "Listing - ".concat(toTitleCase(data.category) || 'Uncategorized', " - ").concat(data.title || 'Untitled');
  return data;
};
}, {"39":39}];
window.modules["listing.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  data = sanitize.recursivelyStripSeperators(data);
  return data;
};
}, {"39":39}];
window.modules["listings-search-filters.model"] = [function(require,module,exports){'use strict';

var _sortBy = require(102);

module.exports.save = function (ref, data) {
  var groups = ['manhattanNabes', 'brooklynNabes', 'queensNabes', 'otherNabes'];
  var clientData = {};
  groups.forEach(function (group) {
    // ensure that neighborhoods are sorted alphabetically
    data[group] = _sortBy(data[group], function (nabe) {
      return nabe.text;
    });
    clientData[group] = data[group].map(function (val) {
      return {
        type: 'neighborhood',
        value: val.text
      };
    });
  });
  data.clientData = clientData;
  return data;
};
}, {"102":102}];
window.modules["lookup-list.model"] = [function(require,module,exports){'use strict';

var _sortBy = require(102),
    striptags = require(42),
    sanitize = require(39),
    utils = require(43),
    ALLOWED_TAGS = ['em', 'i', 'strong', 'b', 's', 'strike'];

module.exports.save = function (ref, data) {
  // sanitize title
  if (utils.has(data.title)) {
    data.title = sanitize.toSmartText(striptags(data.title, ALLOWED_TAGS));
  }

  if (utils.has(data.items)) {
    // sanitize each item's text
    data.items.forEach(function (itm) {
      itm.text = sanitize.toSmartText(striptags(itm.text, ALLOWED_TAGS));
    }); // sort items

    if (data.sortAlphabetically) {
      data.items = _sortBy(data.items, function (itm) {
        return itm.text.toLowerCase().startsWith('the ') ? itm.text.slice(4) : itm.text;
      });
    }
  }

  return data;
};
}, {"39":39,"42":42,"43":43,"102":102}];
window.modules["love-map.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44),
    sanitize = require(39);

function sanitizeEntries(entries) {
  var i;

  for (i = 0; i < entries.length; i++) {
    entries[i].address = sanitize.toSmartText(entries[i].address);
    entries[i].plainAddress = sanitize.toPlainText(entries[i].address);
    entries[i].story = sanitize.toSmartText(entries[i].story);
  }
}

module.exports.save = function (ref, data) {
  if (utils.has(data.loveEntries)) {
    sanitizeEntries(data.loveEntries);
  }

  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"39":39,"43":43,"44":44}];
