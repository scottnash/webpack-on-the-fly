window.modules["856"] = [function(require,module,exports){var flatten = require(150),
    overRest = require(820),
    setToString = require(821);

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;
}, {"150":150,"820":820,"821":821}];
