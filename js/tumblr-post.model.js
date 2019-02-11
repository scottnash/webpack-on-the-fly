window.modules["tumblr-post.model"] = [function(require,module,exports){'use strict';

var rest = require(5),
    utils = require(43),
    TUMBLR_ENDPOINT = 'https://www.tumblr.com/oembed/1.0/';

module.exports.save = function (ref, data) {
  if (utils.isFieldEmpty(data.url)) {
    // if we remove the url, remove the html
    delete data.html;
    return data;
  } // note: we're using the un-authenticated api endpoint. don't abuse this


  return rest.getJSONP("".concat(TUMBLR_ENDPOINT, "?url=").concat(encodeURI(data.url))).then(function (res) {
    var html = res.response && res.response.html;

    if (html) {
      data.html = html.replace(/<script.*?script>/, '');
    }

    return data;
  }).catch(function (e) {
    if (!utils.isFieldEmpty(data.html)) {
      // something went wrong with the api call (e.g. the post was deleted), but we already have the html
      return data;
    } else {
      throw new Error("Unable to embed tumblr post: ".concat(e.message));
    }
  });
};
}, {"5":5,"43":43}];
