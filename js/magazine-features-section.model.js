window.modules["magazine-features-section.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    sanitize = require(39);
/**
 * Component save method
 *
 * @param {string} ref - component ref
 * @param {Object} data - component data object
 * @returns {Object} data object
 */


module.exports.save = function (ref, data) {
  // run titles through headline quotes
  if (!utils.isFieldEmpty(data.title)) {
    data.title = sanitize.toSmartHeadline(data.title);
  }

  return data;
};
}, {"39":39,"43":43}];
