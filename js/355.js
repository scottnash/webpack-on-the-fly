window.modules["355"] = [function(require,module,exports){'use strict';

const isUriStringCheck = require(356);

/**
 * First test if argument passed in is a String. If true, get list instance
 * from URI. Otherwise, throw an error.
 * @example /_lists/foo returns "foo"
 * @param  {string} uri
 * @return {string|null}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  const result = /\/_lists\/(.*)/.exec(uri);

  return result && result[1];
};
}, {"356":356}];
