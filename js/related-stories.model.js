window.modules["related-stories.model"] = [function(require,module,exports){'use strict';

var toPlainText = require(39).toPlainText;

module.exports.save = function (ref, data) {
  if (data.title) {
    data.plaintextTitle = toPlainText(data.title);
  }

  return data;
};
}, {"39":39}];
