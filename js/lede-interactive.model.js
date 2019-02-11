window.modules["lede-interactive.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    styles = require(44),
    utils = require(43);
/**
 * Update and sanitize headline.
 * @param {object} data
 */


function updateHeadline(data) {
  // Add smart quotes, etc to wysiwyg headlines
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.displayHeadline)) {
    data.displayHeadline = sanitize.toSmartHeadline(striptags(data.displayHeadline, ['em', 'i', 'strike', 'span']));
  }
}
/**
 * Update and sanitize teaser.
 * @param {object} data
 */


function updateTeaser(data) {
  // Add smart quotes, etc to teaser
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.displayTeaser)) {
    data.displayTeaser = sanitize.toSmartText(striptags(data.displayTeaser, ['strong', 'em', 'i', 'strike', 'span']));
  }
}

module.exports.save = function (uri, data) {
  updateHeadline(data);
  updateTeaser(data);

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"39":39,"42":42,"43":43,"44":44}];
