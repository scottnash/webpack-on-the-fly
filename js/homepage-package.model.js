window.modules["homepage-package.model"] = [function(require,module,exports){'use strict';

var striptags = require(42),
    sanitize = require(39);

module.exports.save = function (ref, data) {
  if (data.title) {
    data.title = sanitize.toSmartHeadline(striptags(data.title));
  }

  if (data.description) {
    data.description = sanitize.toSmartHeadline(striptags(data.description));
  }

  data.cuneiformIgnore = data.disabled;
  return data;
};
}, {"39":39,"42":42}];
