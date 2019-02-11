window.modules["vertical-navigation.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"43":43,"44":44}];
window.modules["vertical-timeline.model"] = [function(require,module,exports){'use strict';

var _sortBy = require(102),
    _pick = require(174),
    utils = require(43),
    rest = require(5);
/**
 * combine the left and right component lists and sort the child objects by year, ascending
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


function render(ref, data, locals) {
  var allItems = data.left.concat(data.right);
  return Promise.all(allItems.map(function (item) {
    return rest.get(utils.uriToUrl(item._ref, locals)).then(function (retreivedData) {
      retreivedData._ref = item._ref;
      return retreivedData;
    });
  })).then(function (retreivedItems) {
    var sortedItems = _sortBy(retreivedItems, 'year');

    data.combinedItems = sortedItems.map(function (sortedItem) {
      return _pick(sortedItem, '_ref');
    });
    return data;
  });
}

module.exports.render = render; // TODO: convert to module.exports.save
}, {"5":5,"43":43,"102":102,"174":174}];
window.modules["video-promo.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'published-articles',
    fields = ['primaryHeadline', 'canonicalUrl', 'feedImgUrl'];
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var query = queryService.newQueryWithCount(index, 1, locals);
  queryService.onlyWithinThisSite(query, locals.site);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addFilter(query, {
    term: {
      tags: 'science of us animations'
    }
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query).then(function (results) {
    return {
      banner: data.banner,
      videoSeriesTitle: data.videoSeriesTitle,
      callToActionLink: data.callToActionLink,
      articles: results
    };
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"49":49}];
window.modules["video.model"] = [function(require,module,exports){(function (process){
'use strict';

var _includes = require(33),
    parse = require(38),
    rest = require(5),
    sanitize = require(39),
    videos = require(98),
    nonVideoRegex = require(209),
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
        url: url,
        videoValid: true
      };
    } else {
      // we'll have to deal with it ourselves. it's probably a straight-up embed url
      // this will dump it into a generic (responsive) iframe in the template
      return {
        url: url,
        videoValid: true
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
      url: url,
      videoValid: true
    });
  } else if (_includes(url, 'videos.nymag.com') || _includes(url, 'video.vulture.com')) {
    // we handle our magnify/wayfire embeds ourselves, since their oembed implementation doesn't play nice with others
    return Promise.resolve({
      html: videos.magnify(url),
      url: url,
      videoValid: true
    });
  } else if (nonVideoRegex.match(url)) {
    // the url matches something embedly knows is NOT a video!
    return Promise.resolve({
      html: '',
      url: url,
      videoValid: false
    });
  } else {
    // try to get the video from embedly
    return rest.get(EMBEDLY_ENDPOINT + '?key=' + EMBEDLY_KEY + '&url=' + url).then(parseEmbedlyData(url)).catch(function () {
      return {
        html: '',
        url: url,
        videoValid: false
      };
    });
  }
}

module.exports.render = function (uri, data) {
  var url = data.url,
      parsed = parse(url, true),
      query = parsed.query;

  try {
    if (!parsed || !parsed.hostname) {
      throw new Error('Video URL was unparseable');
    }

    if (!_includes(parsed.hostname, 'youtu')) {
      throw new Error('URL was not a Youtube url');
    }

    data.youtubeId = videos.getYoutubeID(parsed, query);
  } catch (err) {
    data.youtubeId = '';
  }

  return data;
};
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
    url = sanitize.toPlainText(url); // Do not change data.html if the current url matches the url that previously generated data.html

    if (data.lastGenerated === url) {
      return Promise.resolve(data);
    } // Generate new html


    return generateEmbedHtml(url).then(function (data) {
      if (data.videoValid) {
        data.lastGenerated = url;
      }

      return data;
    });
  } else {
    data.html = '';
    data.lastGenerated = '';
    data.videoValid = true;
    return Promise.resolve(data);
  }
};

}).call(this,require(22))}, {"5":5,"22":22,"33":33,"38":38,"39":39,"98":98,"209":209}];
window.modules["voice-syndication.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    sanitize = require(39);
/**
 * set the canonical url from the locals (even if it's already set)
 * @param {object} data
 * @param {object} locals
 */


function setCanonicalUrl(data, locals) {
  if (_get(locals, 'publishUrl')) {
    data.canonicalUrl = locals.publishUrl;
  }
}
/**
 * Remove a .mp3 text if the user enters one for the ids
 * @param {Object} data
 * @returns {Object}
 */


function sanitizeMp3Inputs(data) {
  data.recordingId = (data.recordingId || '').trim().replace(/\.mp3$/, '');
  data.appleSponsorId = (data.appleSponsorId || '').trim().replace(/\.mp3$/, '');
  return data;
}

module.exports.save = function (uri, data, locals) {
  setCanonicalUrl(data, locals); // voice headline shouldn't have any html

  data.headline = sanitize.toPlainText(sanitize.stripUnicode(data.headline));
  data.dek = sanitize.toPlainText(sanitize.stripUnicode(data.dek));
  return sanitizeMp3Inputs(data);
};
}, {"32":32,"39":39}];
window.modules["vulture-header.model"] = [function(require,module,exports){'use strict';

var striptags = require(42),
    sanitize = require(39),
    _startCase = require(111);

module.exports.save = function (uri, data) {
  data.sectionLinks.forEach(function (link) {
    link.text = link.text ? sanitize.toSmartText(link.text) : '';
  });
  data.hotTopics.forEach(function (topic) {
    topic.text = topic.text ? sanitize.toSmartText(striptags(topic.text, ['em', 'i', 's', 'strike'])) : '';
  });
  return data;
};

module.exports.render = function (uri, data, locals) {
  data.sectionHeading = '';

  if (locals && locals.params && data.pageType === 'Section Page') {
    data.sectionHeading = _startCase(locals.params.name);
  }

  return data;
};
}, {"39":39,"42":42,"111":111}];
window.modules["waypoint.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44),
    _set = require(87);

module.exports.save = function (uri, data) {
  if (utils.has(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      return _set(data, 'css', css);
    });
  } else {
    delete data.css;
    return data;
  }
};
}, {"43":43,"44":44,"87":87}];
window.modules["youtube.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _require = require(212),
    getVideoDetails = _require.getVideoDetails,
    defaultPlayerBorderTopCTA = 'Watch';
/**
 * Override various settings by type of video
 * @param {object} data
 */


function updateSettingsByType(data) {
  switch (data.videoType) {
    case 'related':
      // By default, display borders and CTA when `related` type is first selected, afterwards accept user's selection
      data.playerBorderTopCTA = !data.previousTypeRelated && !data.playerBorderTopCTA ? defaultPlayerBorderTopCTA : data.playerBorderTopCTA;
      data.playerBorderTop = !data.previousTypeRelated ? true : data.playerBorderTop;
      data.playerBorderBottom = !data.previousTypeRelated ? true : data.playerBorderBottom;
      data.previousTypeRelated = true;
      break;

    case 'sponsored':
      data.autoPlay = false;
      data.autoPlayNextVideo = false;

    default:
      // Toggle borders off if user previously selected `related` type. `sponsored` and `editorial` types share defaults
      data.playerBorderTop = data.previousTypeRelated ? false : data.playerBorderTop;
      data.playerBorderBottom = data.previousTypeRelated ? false : data.playerBorderBottom;
      data.previousTypeRelated = false;
  }
}

function clearVideoId(data) {
  data.videoId = (data.videoId || '').split('&')[0];
  return data;
}

function setVideoDetails(data, videoDetails) {
  var maxResThumb;

  if (!videoDetails.title) {
    data.videoValid = false;
    return data;
  }

  maxResThumb = _get(videoDetails, 'thumbnails.maxres.url');
  data.videoValid = true;
  data.channelName = videoDetails.channelTitle;
  data.videoTitle = videoDetails.title;
  data.videoThumbnail = maxResThumb ? maxResThumb : _get(videoDetails, 'thumbnails.high.url'); // get the maxres if available, otherwise get the high res which we know will be there

  data.videoDuration = videoDetails.duration;
  return data;
}

function getDefaultPlaylistBySite(data, locals) {
  switch (locals.site.slug) {
    case 'wwwthecut':
      return 'PL4B448958847DA6FB';
      break;

    case 'vulture':
      return 'PLZQfnFyelTBOQ15kmHSgEbdjzLMWzZpL7';
      break;

    case 'grubstreet':
      return 'PLtmzdzCeRsyG_td56GV9JtS3yif177lfK';
      break;

    case 'di':
      return 'PLtmzdzCeRsyHbGTxOX4BZvSgXBh20n-_4';
      break;

    case 'selectall':
      return 'PLtmzdzCeRsyHh67c-VlEj8Nqpj5nL8pf6';
      break;

    default:
      return 'PLtmzdzCeRsyFQ64kOTZS7eBLQ1fH2feu7'; // if its a site without a default playlist, use the 'latest from new york' playlist

      break;
  }
}

module.exports.save = function (uri, data, locals) {
  clearVideoId(data);
  updateSettingsByType(data);

  if (data.videoId && !data.videoPlaylist) {
    data.videoPlaylist = getDefaultPlaylistBySite(data, locals);
  }

  if (data.videoId) {
    return getVideoDetails(data.videoId).then(function (videoDetails) {
      return setVideoDetails(data, videoDetails);
    });
  }

  data.videoValid = true; // technically not an invalid video because no videoId so we don't want to show an error message in edit mode

  return data;
};
}, {"32":32,"212":212}];
