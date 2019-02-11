window.modules["memo-pixel.model"] = [function(require,module,exports){'use strict';

var get = require(69).get,
    _require = require(56),
    isPublished = _require.isPublished;

module.exports.save = function (uri, data, locals) {
  // memo pixel relies on the tracked url staying the same for the page even if it changes over time
  if (!isPublished(uri)) {
    return data;
  }

  return get(uri).then(function (response) {
    data.url = response.url;
    return data;
  }).catch(function () {
    // Catch happens on first publication, after publication we use the url returned from the get(uri) call, so that we always return the original url
    if (isPublished(uri) && locals.publishUrl) {
      data.url = locals.publishUrl;
    }

    return data;
  });
};
}, {"56":56,"69":69}];
