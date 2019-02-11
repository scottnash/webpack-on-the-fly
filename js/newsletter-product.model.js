window.modules["newsletter-product.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    _require = require(43),
    has = _require.has;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.rubric)) data.rubric = sanitize.toSmartText(data.rubric);
  if (has(data.title)) data.title = sanitize.toSmartText(data.title);
  if (has(data.description)) data.description = sanitize.toSmartText(data.description);
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
