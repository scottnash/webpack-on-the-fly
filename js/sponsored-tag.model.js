window.modules["sponsored-tag.model"] = [function(require,module,exports){'use strict';

var mediaPlay = require(53);

module.exports.save = function (uri, data) {
  var height = data.logoHeight || 25;

  if (data.brandUrl) {
    data.brandUrl = mediaPlay.getRenditionUrl(data.brandUrl, {
      w: 2147483647,
      h: height,
      r: '2x'
    }, false);
  }

  if (data.brandUrlMobile) {
    data.brandUrlMobile = mediaPlay.getRenditionUrl(data.brandUrlMobile, {
      w: 2147483647,
      h: height,
      r: '2x'
    }, false);
  }

  return data;
};
}, {"53":53}];
