window.modules["clay-paragraph-designed.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  var text = data.text || '';
  data.saveText = sanitize.validateTagContent(sanitize.toSmartText(text));
  return data;
};
}, {"39":39}];
