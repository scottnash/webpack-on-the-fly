window.modules["issue-promo.model"] = [function(require,module,exports){'use strict';

var mediaplay = require(53);

module.exports.save = function (ref, data) {
  if (data.imageUrl) {
    data.imageUrl = mediaplay.getRendition(data.imageUrl, 'issue-promo');
  }

  return data;
};
}, {"53":53}];
