window.modules["674"] = [function(require,module,exports){var ListCache = require(655),
    stackClear = require(678),
    stackDelete = require(675),
    stackGet = require(676),
    stackHas = require(677),
    stackSet = require(679);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;
}, {"655":655,"675":675,"676":676,"677":677,"678":678,"679":679}];
