window.modules["65"] = [function(require,module,exports){'use strict';
/**
 * set a local storage property. 
 * Fails silently on error if fallback property is not passed
 * This is a common error to encounter, if for example use is in incgonito mode.
 * @param {string} key
 * @param {string} value
 * @param {function} fallback
 */

function setLocalStorage() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  try {
    localStorage.setItem(key, value);
  } catch (e) {
    fallback(e);
  }
}
/**
 * calls localStorage.removeItem with optional callback to handle the error.
 * @param {string} key
 * @param {function} fallback
 */


function removeLocalStorage() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  try {
    localStorage.removeItem(key);
  } catch (e) {
    fallback(e);
  }
}
/**
 * get a local storage property.
 * @param {string} key
 * @param {function} fallback
 * @return {string|undefined}
 */


function getLocalStorage(key) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  try {
    return localStorage.getItem(key);
  } catch (e) {
    fallback(e);
    return;
  }
}

module.exports = {
  getLocalStorage: getLocalStorage,
  setLocalStorage: setLocalStorage,
  removeLocalStorage: removeLocalStorage
};
}, {}];
