window.modules["340"] = [function(require,module,exports){'use strict';

const isUriStringCheck = require(356),
  isLayout = require(336),
  getLayoutInstance = require(347);

/**
 * First test if argument is a String. If true, test if '/_layouts/:name/instances/:id/meta' is in the string.
 * Otherwise, throw an error.
 * @param  {string}  uri
 * @return {Boolean}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  return isLayout(uri) && !!getLayoutInstance(uri) && !!uri.match(/\/meta$/i);
};
}, {"336":336,"347":347,"356":356}];
