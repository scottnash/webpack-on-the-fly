window.modules["disclaimer-text.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  var text = data.text || '',
      smartText = sanitize.validateTagContent(sanitize.toSmartText(text));
  return {
    text: smartText
  };
};
}, {"39":39}];
