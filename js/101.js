window.modules["101"] = [function(require,module,exports){'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var rest = require(5),
    promises = require(46),
    TWITTER_ENDPOINT = 'https://api.twitter.com/1/statuses/oembed.json',
    TWEET_URL_RE = /(https?:\/\/twitter\.com\/(\w+?)\/status(?:es)?\/(\d+))\/?/;

function getEmbedRequestUrl(tweetUrl, hideMedia, hideThread) {
  var hideMediaQueryParam = hideMedia ? '&hide_media=true' : '',
      hideThreadQueryParam = hideThread ? '&hide_thread=true' : '';
  return "".concat(TWITTER_ENDPOINT, "?url=").concat(encodeURI(tweetUrl), "&omit_script=true").concat(hideMediaQueryParam).concat(hideThreadQueryParam);
}

function getEmbedHTMLForTweet(tweetUrl, hideMedia, hideThread) {
  var embedRequestUrl = getEmbedRequestUrl(tweetUrl, hideMedia, hideThread);
  /**
   * Our JSONP library has super funky behavior when it comes to
   * receiving a 404 while in browser mode (i.e. if we are retreiving
   * a tweet on save in Kiln).  Instead of actually throwing an
   * error it gets swallowed by the browser and so this request will
   * actually eventually time out.  To handle this we wrap this in
   * a timeout of 1500ms the same way that the clay-tweet component
   * handled this issue.
   */

  return promises.timeout(rest.getJSONP(embedRequestUrl), 1500).then(function (res) {
    return res.html;
  }).catch(function (err) {
    if (err && err.message === 'Timed out!') {
      throw new Error('Tweet unretrievable');
    }

    return '';
  });
}

function getMetadataFromTweetUrl(tweetUrl) {
  var _TWEET_URL_RE$exec = TWEET_URL_RE.exec(tweetUrl),
      _TWEET_URL_RE$exec2 = _slicedToArray(_TWEET_URL_RE$exec, 4),
      cleanTweetUrl = _TWEET_URL_RE$exec2[1],
      twitterUsername = _TWEET_URL_RE$exec2[2],
      tweetId = _TWEET_URL_RE$exec2[3];

  return {
    cleanTweetUrl: cleanTweetUrl,
    twitterUsername: twitterUsername,
    tweetId: tweetId
  };
}

function getCleanTweetUrl(tweetUrl) {
  var _getMetadataFromTweet = getMetadataFromTweetUrl(tweetUrl),
      cleanTweetUrl = _getMetadataFromTweet.cleanTweetUrl;

  return cleanTweetUrl;
}

function getUsernameFromTweetUrl(tweetUrl) {
  var _getMetadataFromTweet2 = getMetadataFromTweetUrl(tweetUrl),
      twitterUsername = _getMetadataFromTweet2.twitterUsername;

  return twitterUsername;
}

function getTweetIdFromTweetUrl(tweetUrl) {
  var _getMetadataFromTweet3 = getMetadataFromTweetUrl(tweetUrl),
      tweetId = _getMetadataFromTweet3.tweetId;

  return tweetId;
}

module.exports = {
  getEmbedHTMLForTweet: getEmbedHTMLForTweet,
  getMetadataFromTweetUrl: getMetadataFromTweetUrl,
  getCleanTweetUrl: getCleanTweetUrl,
  getUsernameFromTweetUrl: getUsernameFromTweetUrl,
  getTweetIdFromTweetUrl: getTweetIdFromTweetUrl
};
}, {"5":5,"46":46}];
