window.modules["337"] = [function(require,module,exports){'use strict';

const isUriStringCheck = require(356);

/**
 * First test if argument passed in is a String. If true, get component instance
 * from uri without the component version. Otherwise, throw an error.
 * @example /_components/text/instances/0@published returns 0
 * @param  {string} uri
 * @return {string|null}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  const result = /\/_components\/.+?\/instances\/([^\.@]+)/.exec(uri);

  return result && result[1];
};
}, {"356":356}];
