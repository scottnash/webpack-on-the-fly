window.modules["cspan-video.model"] = [function(require,module,exports){(function (process){
'use strict';

var _includes = require(33),
    rest = require(5),
    sanitize = require(39),
    videos = require(98),
    nonVideoRegex = require(97),
    EMBEDLY_ENDPOINT = window.process.env.EMBEDLY_ENDPOINT,
    EMBEDLY_KEY = window.process.env.EMBEDLY_KEY;
/**
 * parse the the response from embedly
 * @param  {string} url
 * @return {function}
 */


function parseEmbedlyData(url) {
  return function (data) {
    // embed.ly can only handle a certain subset of urls
    // if it can't embed something, it'll return a `link` instead of `video`
    if (data.html) {
      // Strip width and height off of the iframe, so we can make it responsive
      return {
        html: data.html.replace(/width=\"[0-9]+\"/ig, '').replace(/height=\"[0-9]+\"/ig, ''),
        url: url
      };
    } else {
      // we'll have to deal with it ourselves. it's probably a straight-up embed url
      // this will dump it into a generic (responsive) iframe in the template
      return {
        url: url
      };
    }
  };
}
/**
 * generate embed html
 * @param {string} url
 * @returns {Promise}
 */


function generateEmbedHtml(url) {
  // handle our own, custom video embeds
  if (_includes(url, 'youtube.com') || _includes(url, 'youtu.be')) {
    return Promise.resolve({
      html: videos.youtube(url),
      url: url
    });
  } else if (_includes(url, 'videos.nymag.com') || _includes(url, 'video.vulture.com')) {
    // we handle our magnify/wayfire embeds ourselves, since their oembed implementation doesn't play nice with others
    return Promise.resolve({
      html: videos.magnify(url),
      url: url
    });
  } else if (nonVideoRegex.match(url)) {
    // the url matches something embedly knows is NOT a video!
    throw new Error('Trying to embed non-video url in video component!' + url);
  } else {
    // try to get the video from embedly
    return rest.get(EMBEDLY_ENDPOINT + '?key=' + EMBEDLY_KEY + '&url=' + url).then(parseEmbedlyData(url));
  }
}
/**
 * embed youtube/nymag, embedly-compatible, or straight-up iframed videos
 * @param  {string} uri
 * @param  {object} data
 * @return {Promise}
 */


module.exports.save = function (uri, data) {
  var url = data.url,
      embedCode = url && url.match(/src=['"](.*?)['"]/i); // find first src="(url)"
  // if they pasted in a full embed code, parse out the url

  if (embedCode) {
    url = embedCode[1];
  }

  if (url) {
    // remove any HTML tags that may have been carried over when pasting from google docs
    url = sanitize.toPlainText(url);
    return generateEmbedHtml(url);
  } else {
    data.html = '';
    return Promise.resolve(data);
  }
};

}).call(this,require(22))}, {"5":5,"22":22,"33":33,"39":39,"97":97,"98":98}];
