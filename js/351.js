window.modules["351"] = [function(require,module,exports){'use strict';

const isUriStringCheck = require(356);

/**
 * First test if argument is a String. If true, test if '/_users/' is in the string.
 * Otherwise, throw an error.
 * @param  {string}  uri
 * @return {Boolean}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);

  return uri.toLowerCase().indexOf('/_users/') > -1;
};
}, {"356":356}];
