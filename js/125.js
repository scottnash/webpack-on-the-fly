window.modules["125"] = [function(require,module,exports){'use strict';

var _reduce = require(124),
    truncate = require(1273);

function buildCaption(captionComponents, sharedCredit, sharedCaption, captionPrefix) {
  var baseCaption = _reduce(captionComponents, function (accum, item) {
    var creditType = item.imageType || 'Photo',
        inlineCredit = item.imageCredit ? "".concat(!sharedCaption && item.imageCaption ? ' ' : '', "<span class=\"credit\">").concat(creditType, ": ").concat(item.imageCredit, "</span>") : '',
        captionComponent = "".concat(sharedCaption ? '' : item.imageCaption).concat(sharedCredit ? '' : inlineCredit);
    return "".concat(accum).concat(captionComponent).concat(!!captionComponent ? '<i class="buffer"></i>' : '');
  }, "".concat(sharedCaption ? sharedCaption + ' ' : '').concat(sharedCredit && sharedCaption ? '' : "<strong class=\"caption-prefix\">".concat(captionPrefix, "</strong>")));

  return sharedCredit ? "".concat(baseCaption, "<span class=\"credit\">").concat(sharedCredit, ".</span>") : baseCaption;
}

function generateImageCollectionCaption(captionComponents, sharedCredit, sharedCaption, captionPrefix, withTruncate) {
  // eslint-disable-line max-params
  var caption = buildCaption(captionComponents, sharedCredit, sharedCaption, captionPrefix);
  return withTruncate ? truncate.truncateText(caption, 150) : caption;
}

module.exports.generateImageCollectionCaption = generateImageCollectionCaption;
}, {"124":124,"1273":1273}];
