window.modules["849"] = [function(require,module,exports){var asciiToArray = require(703),
    hasUnicode = require(850),
    unicodeToArray = require(886);

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

module.exports = stringToArray;
}, {"703":703,"850":850,"886":886}];
