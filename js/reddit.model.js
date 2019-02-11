window.modules["reddit.model"] = [function(require,module,exports){'use strict';

var rest = require(5),
    redditBaseUrl = 'https://www.reddit.com/oembed?omitscript=true&url=';
/**
 * determine if an embed should show its parent
 * @param {object} data
 * @returns {string}
 */


function parent(data) {
  return data.showParent ? '&parent=true' : '';
}
/**
 * determine if an embed should show live edits
 * @param {object} data
 * @returns {string}
 */


function live(data) {
  return data.showEdits ? '&live=true' : '';
}
/**
 * grab html for post/comment
 * @param {string} uri
 * @param {object} data
 * @returns {Promise}
 */


module.exports.save = function (uri, data) {
  if (data.url) {
    // note: we're using the un-authenticated api endpoint. don't abuse this
    return rest.getJSONP(redditBaseUrl + encodeURI(data.url) + parent(data) + live(data)).then(function (json) {
      // get oembed html, without the script tag
      data.html = json.html;
      return data;
    }).catch(function (e) {
      console.warn(e.message, e.stack);
      return data; // no html
    });
  } else {
    data.html = ''; // clear the html if there's no url

    return data;
  }
};
}, {"5":5}];
