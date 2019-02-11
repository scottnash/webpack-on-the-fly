window.modules["861"] = [function(require,module,exports){var asciiSize = require(701),
    hasUnicode = require(850),
    unicodeSize = require(885);

/**
 * Gets the number of symbols in `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the string size.
 */
function stringSize(string) {
  return hasUnicode(string)
    ? unicodeSize(string)
    : asciiSize(string);
}

module.exports = stringSize;
}, {"701":701,"850":850,"885":885}];
