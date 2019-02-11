window.modules["blockquote.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  var text = data.text || '';
  data.text = sanitize.validateTagContent(sanitize.toSmartText(text));
  return data;
};
}, {"39":39}];
