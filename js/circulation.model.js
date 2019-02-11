window.modules["circulation.model"] = [function(require,module,exports){'use strict';

var _require = require(55),
    generatePageDescription = _require.generatePageDescription;

module.exports.save = function (uri, data) {
  generatePageDescription(data);
  return data;
};
}, {"55":55}];
