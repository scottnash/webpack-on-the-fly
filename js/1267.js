window.modules["1267"] = [function(require,module,exports){'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var htmlWordCount = require(603),
    COMPONENTS_WITH_WORDS = {
  article: null,
  // just trigger recount
  'article-sidebar': null,
  blockquote: 'text',
  // trigger recount, AND count text in this property
  'clay-paragraph': 'text',
  'clay-paragraph-designed': 'text',
  'clay-subheader': 'text',
  'pull-quote': 'quote',
  subsection: null
},
    _require = require(56),
    getComponentName = _require.getComponentName;
/**
 * determine if mutation uri is a component that we care about
 * @param  {string}  uri
 * @return {Boolean}
 */


function isComponentWithWords(uri) {
  return COMPONENTS_WITH_WORDS[getComponentName(uri)] !== undefined;
}
/**
 * get the component field that contains the text we should count
 * @param  {string} uri
 * @return {string|null}
 */


function getComponentField(uri) {
  return COMPONENTS_WITH_WORDS[getComponentName(uri)];
}
/**
 * Given an object mapping component URIs to their data or an array of
 * components with _ref attributes, return an array of components in the latter
 * format.
 * @param {Object} cmptSrc
 * @return {Object[]}
 */


function normalizeCmptSrc(cmptSrc) {
  if (Array.isArray(cmptSrc)) {
    return cmptSrc;
  } else if (_typeof(cmptSrc) === 'object') {
    return Object.keys(cmptSrc).map(function (key) {
      return Object.assign({}, cmptSrc[key], {
        _ref: key
      });
    });
  }

  return [];
}
/**
 * count words in components we care about
 * @param  {Object|Object[]} components Object mapping URI to data or
 * array of cmpts with _ref
 * @return {number}
 */


function count(components) {
  return normalizeCmptSrc(components).filter(function (cmpt) {
    return isComponentWithWords(cmpt._ref);
  }).map(function (cmpt) {
    return cmpt[getComponentField(cmpt._ref)];
  }).reduce(function (acc, fieldValue) {
    return acc + htmlWordCount(fieldValue || '');
  }, 0);
}

module.exports.count = count;
module.exports.isComponentWithWords = isComponentWithWords; // for testing

module.exports.setComponentsWithWords = function (i) {
  return COMPONENTS_WITH_WORDS = i;
};
}, {"56":56,"603":603}];
