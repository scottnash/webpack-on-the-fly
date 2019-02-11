window.modules["clay-meta-keywords.model"] = [function(require,module,exports){'use strict';

var _isEmpty = require(75),
    _isObject = require(74),
    _head = require(25),
    _map = require(37);

module.exports.save = function (ref, data) {
  // convert array of {text: string} objects into regular array of strings
  if (!_isEmpty(data.tags) && _isObject(_head(data.tags))) {
    data.tags = _map(data.tags, function (tag) {
      return tag.text;
    });
  }

  return data;
};

module.exports.render = function (ref, data, locals) {
  // if we're in edit mode, convert array of strings into {text: string}
  // objects so they can be edited
  if (locals && locals.edit && Array.isArray(data.tags)) {
    data.tags = data.tags.map(function (text) {
      return {
        text: text
      };
    });
  }

  return data;
};
}, {"25":25,"37":37,"74":74,"75":75}];
