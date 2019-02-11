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
