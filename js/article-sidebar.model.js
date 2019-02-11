window.modules["article-sidebar.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    styles = require(44),
    utils = require(43);
/**
 * Update and sanitize headline.
 * @param {object} data
 * @returns {object}
 */


function updateHeadline(data) {
  // Add smart quotes, etc to wysiwyg headlines
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.headline)) {
    data.headline = sanitize.toSmartHeadline(striptags(data.headline, ['em', 'i', 'strike', 'span']));
  }

  return data;
}
/**
 * Update and sanitize teaser.
 * @param {object} data
 * @returns {object}
 */


function updateTeaser(data) {
  // Add smart quotes, etc to teaser
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.teaser)) {
    data.teaser = sanitize.toSmartText(striptags(data.teaser, ['a', 'em', 'i', 'strike', 'span']));
  }

  return data;
}
/**
 * save subheader
 * @param  {string} uri
 * @param  {object} data
 * @return {Promise}
 */


module.exports.save = function (uri, data) {
  updateHeadline(data);
  updateTeaser(data); // compile styles if they're not empty

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"39":39,"42":42,"43":43,"44":44}];
