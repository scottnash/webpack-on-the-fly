window.modules["858"] = [function(require,module,exports){var metaMap = require(869),
    noop = require(864);

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
var getData = !metaMap ? noop : function(func) {
  return metaMap.get(func);
};

module.exports = getData;
}, {"864":864,"869":869}];
