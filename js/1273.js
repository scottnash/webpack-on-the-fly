window.modules["1273"] = [function(require,module,exports){'use strict';

var truncate = require(602);
/**
 * truncateText
 *
 * Truncates text or text + HTML at a specified limit without breaking up inner HTML tags. If the text is truncated, return a button with the shortened and full text
 * (expansion behavior should be handled in client-side js and showing/hiding should be handled in css)
 *
 * @param {String} innerText the contents of the element to expand. Can be text or a mix of HTML + text
 * @param {Number} limit where in the string to start truncation
 * @returns {String} truncated HTML
 */


function truncateText(innerText, limit) {
  var truncated = truncate(innerText, limit);
  var fullText;

  if (truncated.length !== innerText.length) {
    fullText = "\n    <div class=\"attribution truncated\">\n      <span class=\"shortened\">".concat(truncated, " <button class=\"more-trigger\">more</button></span>\n      <span class=\"full\">").concat(innerText, "</span>\n    </div>\n    ");
  } else {
    fullText = "\n    <div class=\"attribution\">\n      <span class=\"full\">".concat(innerText, "</span>\n    </div>\n    ");
  }

  return fullText;
}

module.exports.truncateText = truncateText;
}, {"602":602}];
