window.modules["subscription-tier-option.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (uri, data) {
  if (data.tierMessage) {
    data.tierMessage = sanitize.toSmartHeadline(data.tierMessage);
  }

  return data;
};
}, {"39":39}];
