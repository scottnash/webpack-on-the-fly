window.modules["annotation.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  data.text = sanitize.validateTagContent(sanitize.toSmartText(data.text || ''));
  return data;
};
}, {"39":39}];
