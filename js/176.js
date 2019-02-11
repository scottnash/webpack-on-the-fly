window.modules["176"] = [function(require,module,exports){'use strict';

var smartyPants = require(1180).smartypants;
/**
 * replaces all pretty quotes added by typogr
 * @param {string} str
 * @param {string} newSubstr
 * @returns {{quoteMarksFound: number, updatedString: string}}
 */


function removeQuoteEntities(str, newSubstr) {
  // keeping span in regex to support instances previously saved
  // TODO: write an upgrade.js files to update data for components previously saved -Jon
  var smartQuoteRegExp = /^(“|"|&quot;|&#8220;|<span class="dquo">(&#8220;|“)<\/span>)|(”|"|&quot;|&#8221;)$/ig,
      quoteMarksFound = 0,
      updatedString = str.replace(smartQuoteRegExp, function () {
    return ++quoteMarksFound && newSubstr;
  });
  return {
    quoteMarksFound: quoteMarksFound,
    updatedString: updatedString
  };
}
/**
 * removes old typogrify and adds new pretty quotes (HTML entity)
 * @param {string} string
 * @returns {string}
 */


function quotesToEntities(string) {
  return smartyPants(removeQuoteEntities(string, '"').updatedString);
}
/**
 * checks if a string has the right # of quote marks
 * quotes need to be a setting so that they can be styled
 * @param {string} string
 * @returns {boolean}
 */


function hasQuoteMarks(string) {
  var _removeQuoteEntities = removeQuoteEntities(string, ''),
      quoteMarksFound = _removeQuoteEntities.quoteMarksFound;

  if (quoteMarksFound === 2) {
    return true;
  } else {
    return false;
  }
}

;
module.exports.removeQuoteEntities = removeQuoteEntities;
module.exports.quotesToEntities = quotesToEntities;
module.exports.hasQuoteMarks = hasQuoteMarks;
}, {"1180":1180}];
