window.modules["175"] = [function(require,module,exports){'use strict';
/**
 * get value from cache
 * @param {object} cache
 * @param {string} hash
 * @returns {*}
 */

function get(cache, hash) {
  return cache[hash] && cache[hash].value;
}
/**
 * test if an unexpired value exists in cache
 * @param {object} cache
 * @param {string} hash
 * @param {number} ttl
 * @returns {boolean}
 */


function isExpired(cache, hash, ttl) {
  var born = cache[hash] && cache[hash].born;
  return !(typeof born === 'number' && Date.now() - born < ttl);
}
/**
 * save value to cache with current timestamp
 * @param {object} cache
 * @param {string} hash
 * @returns {Function}
 */


function set(cache, hash) {
  return function (result) {
    cache[hash] = {
      value: result,
      born: Date.now()
    };
  };
}
/**
 * try to return cached value and log error, otherwise throw error
 * @param {object} cache
 * @param {string} hash
 * @returns {Function}
 */


function tryCache(cache, hash) {
  return function (err) {
    var cachedValue = get(cache, hash);

    if (typeof cachedValue === 'undefined') {
      throw err;
    } else {
      return cachedValue;
    }
  };
}
/**
 * returns the latest value; attempts to refresh after ttl expires
 * @param {Function} fn - function that returns a bluebird promise
 * @param {number} ttl - time to live
 * @returns {Function}
 */


function init(fn, ttl) {
  var cache = {};
  return function () {
    var hash = fn.name + JSON.stringify(arguments);

    if (isExpired(cache, hash, ttl)) {
      return fn.apply(this, arguments).then(function (result) {
        set(cache, hash)(result);
        return result;
      }).catch(tryCache(cache, hash));
    } else {
      return Promise.resolve(get(cache, hash));
    }
  };
}

module.exports.init = init;
}, {}];
