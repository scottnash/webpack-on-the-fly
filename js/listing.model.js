window.modules["listing.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  data = sanitize.recursivelyStripSeperators(data);
  return data;
};
}, {"39":39}];
