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
