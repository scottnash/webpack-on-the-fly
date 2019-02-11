window.modules["subscription-form-header.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (uri, data) {
  if (data.headerText) {
    data.headerText = sanitize.toSmartHeadline(data.headerText);
  }

  return data;
};
}, {"39":39}];
