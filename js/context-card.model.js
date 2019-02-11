window.modules["context-card.model"] = [function(require,module,exports){'use strict';

var striptags = require(42),
    utils = require(43),
    sanitize = require(39);

module.exports.save = function (uri, data) {
  if (utils.has(data.headline)) {
    data.headline = sanitize.toSmartText(striptags(data.headline, ['em']));
  }

  if (utils.has(data.subheadline)) {
    data.subheadline = sanitize.toSmartText(striptags(data.subheadline, ['em']));
  }

  return data;
};
}, {"39":39,"42":42,"43":43}];
