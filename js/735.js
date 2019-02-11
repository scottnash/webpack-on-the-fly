window.modules["735"] = [function(require,module,exports){var baseForOwnRight = require(736),
    createBaseEach = require(734);

/**
 * The base implementation of `_.forEachRight` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEachRight = createBaseEach(baseForOwnRight, true);

module.exports = baseEachRight;
}, {"734":734,"736":736}];
