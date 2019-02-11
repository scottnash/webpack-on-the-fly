window.modules["342"] = [function(require,module,exports){'use strict';

const isUriStringCheck = require(356);

/**
 * First test if argument passed in is a String. If true, get page instance
 * from uri that includes page version. Otherwise, throw an error.
 * @example /_pages/cj21ud3rt00wmqpyefc944hez@published returns cj21ud3rt00wmqpyefc944hez@published
 * @param  {string} uri
 * @return {string|null}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  const result = /\/_pages\/([^\.\/]+)/.exec(uri);

  return result && result[1];
};
}, {"356":356}];
