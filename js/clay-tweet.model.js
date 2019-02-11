window.modules["clay-tweet.model"] = [function(require,module,exports){'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _get = require(32),
    rest = require(5),
    promises = require(46),
    utils = require(43),
    TWITTER_ENDPOINT = 'https://api.twitter.com/1/statuses/oembed.json',
    TWEET_URL_RE = /(https?:\/\/twitter\.com\/\w+?\/status(?:es)?\/(\d+))\/?/;

function getRequestUrl(data) {
  var hideMedia = data.showMedia === false ? '&hide_media=true' : '',
      hideThread = data.showThread === false ? '&hide_thread=true' : '';
  return "".concat(TWITTER_ENDPOINT, "?url=").concat(encodeURI(data.url), "&omit_script=true").concat(hideThread).concat(hideMedia);
}

function makeRequest(url, data) {
  return rest.getJSONP(url).then(function (res) {
    // if twitter gives us an error, make the tweet invalid
    if (_get(res, 'errors.length')) {
      data.tweetValid = false;
    } // store tweet oembed html


    data.html = res.html; // update component instance with new html

    return data;
  }).catch(function () {
    if (utils.isFieldEmpty(data.html)) {
      data.tweetValid = false;
    } // we have html for this, so it means the tweet has most likely been deleted. display it with the fallback styles


    return data;
  });
}

module.exports.render = function (ref, data) {
  var _ref = TWEET_URL_RE.exec(data.url) || [null, '', null],
      _ref2 = _slicedToArray(_ref, 3),
      tweetId = _ref2[2];

  data.tweetId = tweetId;
  return data;
};

module.exports.save = function (ref, data) {
  if (utils.isFieldEmpty(data.url)) {
    delete data.html;
    return data;
  } // first, wrangle the url


  var _ref3 = TWEET_URL_RE.exec(data.url) || [null, ''],
      _ref4 = _slicedToArray(_ref3, 2),
      url = _ref4[1];

  data.url = url;
  data.tweetValid = true; // note: we're using the un-authenticated api endpoint. don't abuse this

  return promises.timeout(makeRequest(getRequestUrl(data), data), 1500).catch(function () {
    data.tweetValid = false;
    return data;
  });
}; // for testing only


module.exports.getRequestUrl = getRequestUrl;
}, {"5":5,"32":32,"43":43,"46":46}];
