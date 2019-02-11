window.modules["fashion-shows-bar.model"] = [function(require,module,exports){(function (process){
'use strict';

var get = require(5).get,
    _take = require(113),
    BASE_QUERY_URL = "".concat(window.process.env.AMBROSE_HOST, "/content/components/top-shows"),
    DEFAULT_LIMIT = 5;

module.exports.render = function (ref, data) {
  var limit = data.limit || DEFAULT_LIMIT;
  return get(BASE_QUERY_URL).then(function (showsResponse) {
    var shows = showsResponse.topshows;
    data.shows = _take(shows, limit);
    return data;
  });
};

}).call(this,require(22))}, {"5":5,"22":22,"113":113}];
