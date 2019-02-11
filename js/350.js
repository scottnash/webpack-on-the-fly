window.modules["350"] = [function(require,module,exports){'use strict';

const isUriStringCheck = require(356);

/**
 * First test if argument passed in is a String. If true, get component name
 * from uri. Otherwise throw an error.
 * @example /_components/base  returns base
 * @example /_components/text/instances/0  returns text
 * @example /_components/image.html  returns image
 * @param  {string} uri
 * @return {string|null}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  const result = /_components\/(.+?)[\/\.]/.exec(uri) || /_components\/(.*)/.exec(uri);

  return result && result[1];
};
}, {"356":356}];
