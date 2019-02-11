window.modules["109"] = [function(require,module,exports){'use strict'; // This file contains helper functions when working with route params
// from express and translating the values into strings that can be
// used inside of dynamic components

var _capitalize = require(145),
    HYPHEN_RE = /-/g;
/**
 * Title case a string
 * @param  {String} str
 * @return {String}
 */


function titleCase(str) {
  return str.toLowerCase().split(' ').map(_capitalize).join(' ');
}
/**
 * Replace hyphens with spaces
 * @param  {String|Undefined} str
 * @return {String}
 */


function hypensToSpaces(str) {
  return str ? str.replace(HYPHEN_RE, ' ') : '';
}

module.exports.hypensToSpaces = hypensToSpaces;
module.exports.titleCase = titleCase;
}, {"145":145}];
