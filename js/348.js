window.modules["348"] = [function(require,module,exports){'use strict';

const isUriStringCheck = require(356);

/**
 * First test if argument passed in is a String. If true, get layout name
 * from uri. Otherwise throw an error.
 * @example /_layouts/base  returns base
 * @example /_layouts/text/instances/0  returns text
 * @example /_layouts/image.html  returns image
 * @param  {string} uri
 * @return {string|null}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  const result = /_layouts\/(.+?)[\/\.]/.exec(uri) || /_layouts\/(.*)/.exec(uri);

  return result && result[1];
};
}, {"356":356}];
