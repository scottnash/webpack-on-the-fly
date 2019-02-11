window.modules["344"] = [function(require,module,exports){'use strict';

const isUriStringCheck = require(356),
  isPage = require(353);

/**
 * First test if argument is a String. If true, test if '/_pages/:id/meta' is in the string.
 * Otherwise, throw an error.
 * @param  {string}  uri
 * @return {Boolean}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  return isPage(uri) && !!uri.match(/\/meta$/i);
};
}, {"353":353,"356":356}];
