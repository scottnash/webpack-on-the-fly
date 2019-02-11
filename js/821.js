window.modules["821"] = [function(require,module,exports){var baseSetToString = require(822),
    shortOut = require(884);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;
}, {"822":822,"884":884}];
