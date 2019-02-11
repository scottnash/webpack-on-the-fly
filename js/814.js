window.modules["814"] = [function(require,module,exports){var castPath = require(749),
    last = require(24),
    parent = require(762),
    toKey = require(750);

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

module.exports = baseUnset;
}, {"24":24,"749":749,"750":750,"762":762}];
