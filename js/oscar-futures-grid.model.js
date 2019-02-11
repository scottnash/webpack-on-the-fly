window.modules["oscar-futures-grid.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    utils = require(43);

module.exports.save = function (uri, data) {
  // Add smart quotes, etc to text
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.currentPrediction)) {
    data.currentPrediction = sanitize.toSmartText(striptags(data.currentPrediction, ['em', 'strong', 'a']));
  }

  return data;
};
}, {"39":39,"42":42,"43":43}];
