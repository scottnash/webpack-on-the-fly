window.modules["212"] = [function(require,module,exports){(function (process,__filename){
'use strict';

var rest = require(5),
    querystring = require(1128),
    _get = require(32),
    moment = require(190),
    YT_API = 'https://www.googleapis.com/youtube/v3',
    log = require(81).setup({
  file: __filename
});

function getDurationInSeconds(duration) {
  return moment.duration(duration, moment.ISO_8601).asSeconds();
}

function getVideoDetails(videoId) {
  var videoSearchUrl = "".concat(YT_API, "/videos"),
      qs = querystring.stringify({
    part: 'snippet,contentDetails',
    id: videoId,
    key: window.process.env.YOUTUBE_API_KEY
  });
  return rest.get("".concat(videoSearchUrl, "?").concat(qs)).then(function (res) {
    return Object.assign(_get(res, 'items[0].snippet', {}), {
      duration: getDurationInSeconds(_get(res, 'items[0].contentDetails.duration', 0))
    });
  }).catch(function (err) {
    return log('error', "Error fetching video details for video id ".concat(videoId, ": ").concat(err.message));
  });
}

module.exports.getVideoDetails = getVideoDetails;

}).call(this,require(22),"/services/universal/youtube.js")}, {"5":5,"22":22,"32":32,"81":81,"190":190,"1128":1128}];
