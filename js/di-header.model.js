window.modules["di-header.model"] = [function(require,module,exports){'use strict';

var mediaPlay = require(53),
    utils = require(43);

module.exports.save = function (ref, data) {
  if (!utils.isFieldEmpty(data.magazineImageUrl) && mediaPlay.isMediaPlay(data.magazineImageUrl)) {
    data.magazineImageUrl = mediaPlay.getRendition(data.magazineImageUrl, 'vertical-subscription');
  }

  return data;
};
}, {"43":43,"53":53}];
