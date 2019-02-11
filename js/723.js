window.modules["723"] = [function(require,module,exports){var baseCreate = require(653),
    getPrototype = require(874),
    isPrototype = require(786);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;
}, {"653":653,"786":786,"874":874}];
