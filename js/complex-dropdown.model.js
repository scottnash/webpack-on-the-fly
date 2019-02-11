window.modules["complex-dropdown.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    purify = require(90),
    styles = require(44);
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
/**
 * Set SASS from CSS.
 * @param {object} ref
 * @param {object} data
 * @returns {object}
 */


function setSass(ref, data) {
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
    return Promise.resolve(data);
  }
}

module.exports.save = function (ref, data) {
  if (!utils.isFieldEmpty(data.indicatorSvg)) {
    data.indicatorSvg = filterNonSVG(purify(data.indicatorSvg.trim()));
  }

  return setSass(ref, data);
};
}, {"43":43,"44":44,"90":90}];
