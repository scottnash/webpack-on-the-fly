window.modules["facebook.legacy"] = [function(require,module,exports){'use strict';

DS.service('facebook', [function () {
  /**
   * Wrapping fb API for safe testing because it loads async
   * @param {string} methodName  The facebook method to call
   * Subsequent params are forwarded to the Facebook method
   */
  this.fb = function (methodName) {
    window.FB && window.FB[methodName].apply(this, Array.prototype.slice.call(arguments, 1)); // no point in using $window as cannot be stubbed directly.
  };
}]);
}, {}];
