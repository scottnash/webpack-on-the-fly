window.modules["newsletter-quote.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    _require = require(43),
    has = _require.has;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.attribution)) data.attribution = sanitize.toSmartText(data.attribution);
}
/**
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  sanitizeInputs(data);
  return data;
};
}, {"39":39,"43":43}];
