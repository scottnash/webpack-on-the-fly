window.modules["svg.model"] = [function(require,module,exports){'use strict';

var purify = require(90),
    utils = require(43);
/**
 * Return the first svg element in an html string
 * @param {string} content
 * @returns {string}
 */


function filterNonSVG(content) {
  var openingTag = content.match('<svg'),
      closingTag = content.match('</svg>');
  if (!openingTag) return '';
  return content.substring(openingTag.index, closingTag && closingTag.index + '</svg>'.length || content.length);
}

module.exports.save = function (ref, data) {
  if (utils.has(data.svgContent)) {
    data.svgContent = filterNonSVG(purify(data.svgContent.trim())); // remove any bad stuff first
  }

  return data;
};
}, {"43":43,"90":90}];
