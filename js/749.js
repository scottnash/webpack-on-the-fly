window.modules["749"] = [function(require,module,exports){var isArray = require(129),
    isKey = require(795),
    stringToPath = require(834),
    toString = require(833);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;
}, {"129":129,"795":795,"833":833,"834":834}];
