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
