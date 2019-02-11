window.modules["761"] = [function(require,module,exports){var apply = require(683),
    castPath = require(749),
    last = require(24),
    parent = require(762),
    toKey = require(750);

/**
 * The base implementation of `_.invoke` without support for individual
 * method arguments.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {Array} args The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 */
function baseInvoke(object, path, args) {
  path = castPath(path, object);
  object = parent(object, path);
  var func = object == null ? object : object[toKey(last(path))];
  return func == null ? undefined : apply(func, object, args);
}

module.exports = baseInvoke;
}, {"24":24,"683":683,"749":749,"750":750,"762":762}];
