window.modules["668"] = [function(require,module,exports){var Hash = require(646),
    ListCache = require(655),
    Map = require(662);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;
}, {"646":646,"655":655,"662":662}];
