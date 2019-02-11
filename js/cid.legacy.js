window.modules["cid.legacy"] = [function(require,module,exports){'use strict';
/**
 * Generates a unique id on the _client_.
 *
 * @example $cid();
 */

DS.service('$cid', function () {
  var counter = Math.floor(Math.random() * 100); // random number between 0 and 100

  return function () {
    counter++; // iterate

    return 'cid-' + counter;
  };
});
}, {}];
