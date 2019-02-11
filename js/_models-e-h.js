window.modules["election-graphic-wrapper.model"] = [function(require,module,exports){'use strict';

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
window.modules["embedly.model"] = [function(require,module,exports){(function (process){
'use strict';

var rest = require(5),
    sanitize = require(39),
    isEmpty = require(43).isFieldEmpty,
    EMBEDLY_ENDPOINT = window.process.env.EMBEDLY_ENDPOINT,
    EMBEDLY_KEY = window.process.env.EMBEDLY_KEY;
/**
 * calculate padding for embedded iframes
 * @param {object} embedlyData
 * @returns {string}
 */


function calculatePadding(embedlyData) {
  var width = embedlyData.width,
      height = embedlyData.height;

  if (width && height) {
    // figure out percentage ratio for responsive padding. this is height / width * 100
    return (height / width * 100).toFixed(1) + '%';
  } else {
    return '';
  }
}

function parseEmbedlyData(embedlyData, url) {
  // embed.ly can only handle a certain subset of urls
  // if it can't embed something, `html` will be empty
  if (embedlyData.html) {
    // Strip width and height off of the iframe
    return {
      html: embedlyData.html,
      padding: calculatePadding(embedlyData),
      url: url,
      lastGenerated: url,
      embedValid: true
    };
  } else {
    // embedly does not support it
    return {
      url: url,
      lastGenerated: url
    };
  }
}

module.exports.save = function (ref, data) {
  // remove any HTML tags that may have been carried over when pasting from google docs
  data.url = sanitize.toPlainText(data.url); // clear fields if sanitized url is empty

  if (isEmpty(data.url)) {
    data.html = '';
    data.padding = '';
    data.lastGenerated = '';
    data.embedValid = true;
    return data; // do not generate new html if sanitized url matches url of last html generation
  } else if (data.url === data.lastGenerated) {
    return data;
  } // generate new html


  return rest.get("".concat(EMBEDLY_ENDPOINT, "?key=").concat(EMBEDLY_KEY, "&url=").concat(encodeURIComponent(data.url))).then(function (embedlyData) {
    return parseEmbedlyData(embedlyData, data.url);
  }).catch(function () {
    data.embedValid = false;
    return data;
  });
};

}).call(this,require(22))}, {"5":5,"22":22,"39":39,"43":43}];
window.modules["episode-recap.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    sanitize = require(39),
    queryService = require(49),
    promises = require(46),
    dateFormat = require(52),
    utils = require(43),
    _require = require(39),
    normalizeName = _require.normalizeName,
    rest = require(5),
    index = 'tv-recaps';
/**
 * Extracts the first result with its id set
 * @param {object} result
 * @returns {object}
 */


function formatSearchResult(result) {
  var hits = _get(result, 'hits.hits') || [],
      hit = null;

  if (hits.length) {
    hit = result.hits.hits[0]._source;
    hit.id = result.hits.hits[0]._id;
  }

  return hit;
}
/**
 * Find a single episode which is from this season prior to this episode, or the last in the previous season
 * @param {string} showName
 * @param {integer} seasonNumber
 * @param {integer} episodeNumber
 * @param {object} locals
 * @returns {Promise}
 */


function findPreviousEpisode(showName, seasonNumber, episodeNumber, locals) {
  var query = queryService.newQueryWithCount(index, 1, locals),
      subQuery = queryService(index, locals); // show name

  queryService.addFilter(query, {
    term: {
      'showName.normalized': normalizeName(showName)
    }
  }); // same season, lower episode number than current
  // since this is a compound condition it is built as a separate query, then nested within the main query

  queryService.addMust(subQuery, {
    term: {
      seasonNumber: seasonNumber
    }
  });
  queryService.addMust(subQuery, {
    range: {
      episodeNumber: {
        lt: episodeNumber
      }
    }
  });
  queryService.addShould(query, _get(subQuery, 'body.query', {})); // previous season, highest episode number

  queryService.addShould(query, {
    range: {
      seasonNumber: {
        lt: seasonNumber
      }
    }
  }); // match one of the two previous conditions

  queryService.addMinimumShould(query, 1); // sort so we're always getting the most recent match

  queryService.addSort(query, {
    seasonNumber: 'desc'
  });
  queryService.addSort(query, {
    episodeNumber: 'desc'
  });
  return queryService.searchByQueryWithRawResult(query).then(formatSearchResult);
}

function updatePreviousEpisode(ref, data, locals) {
  return findPreviousEpisode(data.showName, data.seasonNumber, data.episodeNumber, locals).then(function (prevEpisode) {
    var prevEpisodeId = prevEpisode ? prevEpisode.id : '',
        unpublishedVersion = utils.isPublishedVersion(prevEpisodeId) ? prevEpisodeId.replace('@published', '') : ''; // don't keep trying on every update

    data.updatedPrev = true; // set this component's link to the previous episode

    data.previousEpisodeURL = prevEpisode ? prevEpisode.articleURL : '';
    data.previousEpisodeTitle = prevEpisode ? prevEpisode.articleHeadline : '';
    return Promise.all([setNextEpisodeData(prevEpisodeId, data, locals), // Set next episode data to the publish version
    setNextEpisodeData(unpublishedVersion, data, locals) // Set next episode data to the unpublished version
    ]).then(function () {
      return data;
    });
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
}
/**
 * Set information for the next episode to component
 * @param {string} prevEpisodeId
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


function setNextEpisodeData(prevEpisodeId, data, locals) {
  return promises.timeout(rest.get(utils.uriToUrl(prevEpisodeId, locals)).then(function (prevData) {
    prevData.nextEpisodeURL = data.articleURL;
    prevData.nextEpisodeTitle = data.articleHeadline;
    return rest.put(utils.uriToUrl(prevEpisodeId, locals), prevData, true);
  }).then(function () {
    return data;
  }), 1000).catch();
}
/**
 * set the publish date from the locals (even if it's already set),
 * and format it correctly
 * @param  {object} data
 * @param  {object} locals
 */


function formatDate(data, locals) {
  if (_get(locals, 'date')) {
    // if locals and locals.date exists, set the article date (overriding any date already set)
    data.date = dateFormat(locals.date); // ISO 8601 date string
  }
}

module.exports.save = function (ref, data, locals) {
  // sanitize text
  data.showName = sanitize.toSmartText(sanitize.toPlainText(data.showName)).trim();
  data.episodeName = sanitize.toSmartText(sanitize.toPlainText(data.episodeName));
  data.previousEpisodeTitle = sanitize.toPlainText(data.previousEpisodeTitle);
  data.nextEpisodeTitle = sanitize.toPlainText(data.nextEpisodeTitle);
  formatDate(data, locals); // set article's url if it exists

  if (locals && locals.publishUrl) {
    data.articleURL = locals.publishUrl;
  } // once we have a URL, set the previous episode's navigation details


  if (!data.updatedPrev && data.articleURL) {
    return updatePreviousEpisode(ref, data, locals);
  }

  return data;
};
}, {"5":5,"32":32,"39":39,"43":43,"46":46,"49":49,"52":52}];
window.modules["event-list.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44),
    _set = require(87);

module.exports.save = function (uri, data) {
  if (utils.has(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      return _set(data, 'css', css);
    });
  } else {
    return _set(data, 'css', '');
  }
};
}, {"43":43,"44":44,"87":87}];
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
window.modules["feature-links.model"] = [function(require,module,exports){'use strict';

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
window.modules["feeds.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var queryService = require(49),
    bluebird = require(114),
    log = require(81).setup({
  file: __filename,
  component: 'feeds'
});
/**
 * Make sure you have an index, transform and meta property on the
 * data
 * @param  {String} uri
 * @param  {Object} data
 * @return {Promise|Object}
 */


module.exports.save = function (uri, data) {
  var meta = data.meta;

  if (!data.index || !meta) {
    return bluebird.reject(new Error('Feeds component requires an `index` and `meta` property'));
  }

  if (!meta.renderer) {
    return bluebird.reject(new Error('A feed needs to specify which renderer to use'));
  }

  if (!meta.contentType) {
    return bluebird.reject(new Error('A feed needs to indicate the `Content-Type` a component\'s final data will be served in'));
  }

  if (!meta.fileExtension) {
    return bluebird.reject(new Error('A feed needs a `fileExtension` property to indicate the file type of the scraped feed'));
  }

  return data;
};
/**
 * This render function's pure function is to execute
 * an Elastic query stored in the data.
 *
 * @param  {String} ref
 * @param  {Object} data
 * @param  {Object} locals
 * @return {Promise|Object}
 */


module.exports.render = function (ref, data, locals) {
  var ES_QUERY,
      meta = data.meta;

  if (!data.index) {
    log('error', 'Feed cmpt requires an `index` and `transform` property in the data');
    return data;
  } // If the query param `skipQuery` is present, don't query.
  // Handy for only fetching metadata


  if (locals && locals.skipQuery) {
    return data;
  }

  ES_QUERY = queryService(data.index, locals); // Build the appropriate query obj for the env

  ES_QUERY.body.query = data.query.query; // Just replace all the properties in query with the data

  ES_QUERY.body.size = data.query.size;
  ES_QUERY.body.sort = data.query.sort;
  ES_QUERY.body._source = data.query._source;

  if (meta.rawQuery) {
    return queryService.searchByQueryWithRawResult(ES_QUERY).then(function (results) {
      data.results = results.hits.hits; // Attach results and return data

      return data;
    });
  } else {
    return queryService.searchByQuery(ES_QUERY).then(function (results) {
      data.results = results; // Attach results and return data

      return data;
    });
  }
};

}).call(this,"/components/feeds/model.js")}, {"49":49,"81":81,"114":114}];
window.modules["fill-in-the-blank-quiz-questions.model"] = [function(require,module,exports){'use strict';

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
window.modules["flip-card-shoppable.model"] = [function(require,module,exports){'use strict';

var productsService = require(77),
    mediaPlay = require(53);

module.exports.save = function (uri, data, locals) {
  var product = {
    url: data.shopNowURL,
    text: data.productName
  };

  if (data.mobileFrontImage) {
    data.mobileFrontImage = mediaPlay.getRenditionUrl(data.mobileFrontImage, {
      w: 137,
      h: 213,
      r: '2x'
    }, false);
  }

  if (data.frontImage) {
    data.frontImage = mediaPlay.getRenditionUrl(data.frontImage, {
      w: 200,
      h: 200,
      r: '2x'
    }, false);
  }

  if (data.backImage) {
    data.backImage = mediaPlay.getRenditionUrl(data.backImage, {
      w: 96,
      h: 96,
      r: '2x'
    }, true);
  }

  if (data.shopNowURL) {
    return productsService.addProductIdToProduct(product, locals).then(function (product) {
      data.productId = product.productId;
      return data;
    }).then(function (data) {
      data.buyUrlWithSubtag = productsService.generateBuyUrlWithSubtag(data.shopNowURL, data.productId, locals);
      return data;
    });
  }

  return data;
};
}, {"53":53,"77":77}];
window.modules["flip-cards.model"] = [function(require,module,exports){'use strict';

var _find = require(71),
    _require = require(56),
    getComponentName = _require.getComponentName;

module.exports.save = function (ref, data) {
  data.containsShoppable = !!_find(data.flipCardsContent, function (cmpt) {
    return getComponentName(cmpt._ref) === 'flip-card-shoppable';
  });
  return data;
};
}, {"56":56,"71":71}];
window.modules["general-content.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _filter = require(51),
    _includes = require(33),
    striptags = require(42),
    dateFormat = require(52),
    utils = require(43),
    has = utils.has,
    isFieldEmpty = utils.isFieldEmpty,
    // convenience
sanitize = require(39),
    mediaplay = require(53);
/**
 * only allow emphasis, italic, and strikethroughs in headlines
 * @param  {string} oldHeadline
 * @returns {string}
 */


function stripHeadlineTags(oldHeadline) {
  var newHeadline = striptags(oldHeadline, ['em', 'i', 'strike']); // if any tags include a trailing space, shift it to outside the tag

  return newHeadline.replace(/ <\/(i|em|strike)>/g, '</$1> ');
}
/**
 * sanitize headlines and teaser
 * @param  {object} data
 */


function sanitizeInputs(data) {
  if (has(data.primaryHeadline)) {
    data.primaryHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.primaryHeadline));
  }

  if (has(data.shortHeadline)) {
    data.shortHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.shortHeadline));
  }

  if (has(data.overrideHeadline)) {
    data.overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.overrideHeadline));
  }

  if (has(data.teaser)) {
    data.teaser = sanitize.toSmartText(stripHeadlineTags(data.teaser));
  }
}
/**
 * add extra stuff to the page title on certain sites
 * @param {string} title
 * @param {object} locals
 * @returns {string}
 */


function addSiteTitle(title, locals) {
  // add '-- Science of Us' if we're on that site
  if (_get(locals, 'site.slug') === 'scienceofus') {
    return "".concat(title, " -- Science of Us");
  } else if (_get(locals, 'site.slug') === 'press') {
    // add '-- New York Media Press Room' if we're on that site
    return "".concat(title, " -- New York Media Press Room");
  } else {
    return title;
  }
}
/**
 * generate plaintext pageTitle / twitterTitle / ogTitle
 * @param {object} data
 * @param {object} locals
 */


function generatePageTitles(data, locals) {
  if (has(data.shortHeadline) || has(data.primaryHeadline)) {
    var plaintextTitle = sanitize.toPlainText(data.shortHeadline || data.primaryHeadline); // published to pageTitle

    data.pageTitle = addSiteTitle(plaintextTitle, locals);
  }

  if (has(data.primaryHeadline)) {
    // published to ogTitle
    data.plaintextPrimaryHeadline = sanitize.toPlainText(data.primaryHeadline);
  }

  if (has(data.shortHeadline)) {
    // published to twitterTitle
    data.plaintextShortHeadline = sanitize.toPlainText(data.shortHeadline);
  }
}
/**
 * add extra stuff to the description on sponsored stories
 * @param {string} desc
 * @param {object} data
 * @returns {string}
 */


function addSponsoredDescription(desc, data) {
  if (_get(data, 'featureTypes["Sponsor Story"]')) {
    return "PAID STORY: ".concat(desc);
  } else {
    return desc;
  }
}
/**
 * generate pageDescription from teaser
 * @param {object} data
 */


function generatePageDescription(data) {
  if (has(data.teaser)) {
    var plaintextDesc = sanitize.toPlainText(data.teaser); // published to pageDescription

    data.pageDescription = addSponsoredDescription(plaintextDesc, data); // published to socialDescription (consumed by share components and og:description/twitter:description)

    data.socialDescription = addSponsoredDescription(plaintextDesc, data);
  }
}
/**
 * set the publish date from the locals (even if it's already set),
 * and format it correctly
 * @param  {object} data
 * @param  {object} locals
 */


function formatDate(data, locals) {
  if (_get(locals, 'date')) {
    // if locals and locals.date exists, set the article date (overriding any date already set)
    data.date = locals.date;
  }

  if (has(data.date)) {
    data.date = dateFormat(data.date); // ISO 8601 date string
  }
}
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
 * strip out ad dummies (placeholders to show where generated in-article ads will go)
 * @param  {object} data
 */


function stripAdDummies(data) {
  if (has(data.content)) {
    data.content = _filter(data.content, function (component) {
      return !_includes(component._ref, 'components/ad-dummy/');
    });
  }
}
/**
 * ensure feed image is using the correct rendition
 * @param {object} data
 */


function setFeedImageRendition(data) {
  if (has(data.feedImgUrl)) {
    data.feedImgUrl = mediaplay.getRendition(data.feedImgUrl, 'og:image');
  }
}
/**
 * generate the primary headline from the overrideHeadline
 * if the primary headline is empty and the overrideHeadline is less than 80 characters
 * @param  {object} data
 */


function generatePrimaryHeadline(data) {
  if (isFieldEmpty(data.primaryHeadline) && has(data.overrideHeadline) && data.overrideHeadline.length < 80) {
    // note: this happens AFTER overrideHeadline is sanitized
    data.primaryHeadline = data.overrideHeadline;
  }
}

module.exports.save = function (uri, data, locals) {
  sanitizeInputs(data); // do this before using any headline/teaser/etc data

  generatePrimaryHeadline(data);
  generatePageTitles(data, locals);
  generatePageDescription(data);
  formatDate(data, locals);
  setCanonicalUrl(data, locals);
  stripAdDummies(data);
  setFeedImageRendition(data);
  return data;
};
}, {"32":32,"33":33,"39":39,"42":42,"43":43,"51":51,"52":52,"53":53}];
window.modules["generic-list.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    yaml = require(115),
    queryService = require(49),
    _require = require(110),
    sendError = _require.sendError,
    elasticCatch = _require.elasticCatch,
    _require2 = require(43),
    formatStart = _require2.formatStart,
    isPublishedVersion = _require2.isPublishedVersion,
    _require3 = require(109),
    hypensToSpaces = _require3.hypensToSpaces,
    titleCase = _require3.titleCase,
    TABS_RE = /\t/g;
/**
 * Builds and executes the query.
 * @param {object} data
 * @param {object} locals
 * @return {object}
 */


function buildAndExecuteQuery(data) {
  var locals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var from = formatStart(parseInt(locals.start, 10)),
      // can be undefined or NaN,
  query = queryService(data.index, locals),
      size = data.size;
  query.body = {};

  if (data.query) {
    query.body = data.jsonQuery || {};
  }

  query.body.size = size;
  query.body.from = from;
  query.body._source = data._source;
  return queryService.searchByQueryWithRawResult(query).then(function (results) {
    var _results$hits = results.hits,
        hits = _results$hits === void 0 ? {} : _results$hits;
    data.total = hits.total;
    data.entries = _map(hits.hits, '_source');
    data.from = from;
    data.start = from + size;
    data.moreEntries = data.total > data.start;
    return data;
  });
}
/**
 * Gets the text value from a simple list
 * @param {Object[]} arr
 * @return {string[]}
 */


function getSimpleListValues() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return arr.map(function (element) {
    return element.text;
  });
}
/**
 * Gets entries and saves them in the data object.
 * @param {string} ref
 * @param {Object} data
 * @param {Object} locals
 * @returns {Object}
 */


function getEntries(ref, data) {
  var locals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return buildAndExecuteQuery(data, locals).then(function (data) {
    // If we're not in edit mode and
    // the page is published and
    // we've got no results, the page should 404
    if (!data.entries.length && !locals.edit && isPublishedVersion(ref)) {
      sendError('No results', 404);
    }

    return data;
  }).catch(function (e) {
    if (!locals.edit) {
      elasticCatch(e);
    }

    return data;
  });
}

module.exports.render = function (ref, data, locals) {
  return getEntries(ref, data, locals).then(function (data) {
    return data;
  });
};

module.exports.save = function (ref, data, locals) {
  data.index = data.index || 'published-articles';
  data._source = data.source && data.source.length ? getSimpleListValues(data.source) : [];
  data.title = data.index ? titleCase(hypensToSpaces(data.index)) : ''; // make sure all of the numbers we need to save aren't strings

  data.size = parseInt(data.size, 10) || 10;
  data.adIndex = parseInt(data.adIndex, 10) || 9;

  if (data.query) {
    // js-yaml doesn't like tabs so we replace them with 2 spaces
    data.query = data.query.replace(TABS_RE, '  ');
    data.jsonQuery = yaml.safeLoad(data.query);
  }

  return getEntries(ref, data, locals).then(function (data) {
    return data;
  });
};
}, {"37":37,"43":43,"49":49,"109":109,"110":110,"115":115}];
window.modules["giphy.model"] = [function(require,module,exports){(function (process,__filename){
'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _get = require(32),
    log = require(81).setup({
  file: __filename,
  component: 'giphy'
}),
    rest = require(5),
    GIPHY_KEY = window.process.env.GIPHY_KEY,
    GIPHY_ENDPOINT = 'https://api.giphy.com/v1/gifs/',
    URL_PATTERN = /(?:https?:)?(?:\/\/)?(?:media)?\.?giphy\.com\/(embed|media|gifs)\/([\w\-]+)(?:\/[\w.\-]+)?/;
/**
 * Get giphy Id
 *
 * @param {string} url - giphy full url
 * @return {string} giphy id
 */


function getIdFromURLPattern(url) {
  var _ref = URL_PATTERN.exec(url) || [null, null, ''],
      _ref2 = _slicedToArray(_ref, 3),
      id = _ref2[2];

  if (id.includes('-')) {
    id = id.substring(id.lastIndexOf('-') + 1);
  }

  return id;
}
/**
 * Get giphy video and image url. API docs: https://developers.giphy.com/docs/#rendition-guide
 *
 * @param {Object} data - component data
 * @return {Promise}
 */


function getEmbedLinks(data) {
  var id = getIdFromURLPattern(data.url),
      request = "".concat(GIPHY_ENDPOINT).concat(id, "?api_key=").concat(GIPHY_KEY);
  return rest.get(request).then(function (jsonRes) {
    return {
      author: _get(jsonRes, 'data.user.display_name') || '',
      imgLinkDesktop: _get(jsonRes, 'data.images.original_still.url') || '',
      videoLinkDesktop: _get(jsonRes, 'data.images.original.mp4') || '',
      imgLinkMobile: _get(jsonRes, 'data.images.fixed_height_still.url') || '',
      videoLinkMobile: _get(jsonRes, 'data.images.fixed_height.mp4') || ''
    };
  }).then(function (embedLinks) {
    data.author = embedLinks.author;
    data.imgLinkDesktop = embedLinks.imgLinkDesktop;
    data.videoLinkDesktop = embedLinks.videoLinkDesktop;
    data.imgLinkMobile = embedLinks.imgLinkMobile;
    data.videoLinkMobile = embedLinks.videoLinkMobile;
    return data;
  }).catch(function (error) {
    log(error); // Invalid if error

    data.giphyUrlValid = false;
    return data;
  });
}

module.exports.save = function (uri, data) {
  var dataURL = data.url || '';
  var url = ''; // Assume valid at first

  data.giphyUrlValid = true;

  if (dataURL) {
    var _URL_PATTERN$exec = URL_PATTERN.exec(dataURL);

    var _URL_PATTERN$exec2 = _slicedToArray(_URL_PATTERN$exec, 1);

    url = _URL_PATTERN$exec2[0];
    data.url = url;
    return getEmbedLinks(data);
  } else {
    return data;
  }
};

}).call(this,require(22),"/components/giphy/model.js")}, {"5":5,"22":22,"32":32,"81":81}];
window.modules["google-standout.model"] = [function(require,module,exports){'use strict';
/**
 * set component reference url if it's passed in through the locals
 * @param {object} data
 * @param {object} [locals]
 */

function setUrl(data, locals) {
  if (locals && locals.publishUrl) {
    data.referenceUrl = locals.publishUrl;
  }
}
/**
 *
 * @param {string} ref
 * @param {object} data
 * @param {object} [locals]
 * @returns {{type: string, key: string, value: {}}}
 */


module.exports.save = function (ref, data, locals) {
  setUrl(data, locals);
  return data;
};
}, {}];
window.modules["governors-graphic-2018.model"] = [function(require,module,exports){'use strict';

var states = require(91);

module.exports.save = function (ref, data) {
  var stateList = states.statesToArray(),
      i,
      stateName,
      stateNameLower;
  data.repStates = [];
  data.demStates = [];
  data.indStates = [];

  for (i = 0; i < stateList.length; i++) {
    stateName = stateList[i];
    stateNameLower = stateList[i].toLowerCase().split(' ').join('');

    if (data[stateNameLower]) {
      // Only 36 states have a field in the schema (those with elections in 2018).
      switch (data[stateNameLower]) {
        case 'republican':
          data.repStates.push(stateName);
          break;

        case 'democrat':
          data.demStates.push(stateName);
          break;

        case 'independent':
          data.indStates.push(stateName);
          break;

        default:
          break;
      }
    }
  }

  return data;
};
}, {"91":91}];
window.modules["governors-table-2018.model"] = [function(require,module,exports){'use strict';

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
window.modules["greatest-hit.model"] = [function(require,module,exports){'use strict';

var _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    ELASTIC_FIELDS = ['primaryHeadline', 'feedImgUrl', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    title: data.overrideTitle || result.primaryHeadline,
    image: data.overrideImage || result.feedImgUrl,
    pageUri: result.pageUri,
    urlIsValid: result.urlIsValid
  }));

  if (data.title) {
    data.plaintextTitle = toPlainText(data.title);
  }

  return data;
}

module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
}; // export for upgrade.js


module.exports.assignToData = assignToData;
}, {"39":39,"57":57,"59":59,"103":103}];
window.modules["gtm-page.model"] = [function(require,module,exports){'use strict';

var gtm = require(120),
    _get = require(32),
    _require = require(43),
    isPublishedVersion = _require.isPublishedVersion;
/**
 *
 * @param {string} uri
 * @param {object} data
 * @param {object} [locals]
 * @returns {object}
 */


module.exports.save = function (uri, data, locals) {
  // when first published, date is often only in locals
  data.publishDate = data.publishDate || _get(locals, 'date'); // transform logic in a service so that gtm-page plugin can also call on it

  gtm.transformPageData(data); // ensure pageUri is @published version since kiln only sees the versionless pageUri.

  if (isPublishedVersion(uri) && data.pageUri) {
    data.pageUri += '@published';
  }

  return data;
};
}, {"32":32,"43":43,"120":120}];
window.modules["head-link-newsfeed-next-prev.model"] = [function(require,module,exports){'use strict';

var _clone = require(58),
    _omit = require(121),
    urlParse = require(38),
    queryService = require(49),
    index = 'published-articles';
/**
 * @param {object} locals
 * @returns {object}
 */


function getNormalizedUrlParts(locals) {
  var site = locals.site,
      urlParts = urlParse(locals.url, true);

  if (site.protocol) {
    urlParts.protocol = site.protocol;
  }

  if (site.port && (site.port.toString() === '80' || site.port.toString() === '443')) {
    delete urlParts.port;
  } else if (site.port) {
    urlParts.port = site.port;
  }

  delete urlParts.search;
  return urlParts;
}
/**
 * @param {object} urlParts
 * @param {number} start
 * @returns {object}
 */


function getNormalizedUrlQueryByStart(urlParts, start) {
  var newParts = _clone(urlParts);

  if (start === 0) {
    // business logic: if at home page start, always use default size
    newParts.query = _omit(newParts.query, ['start', 'size']);
  } else {
    newParts.query.start = start;
  }

  return newParts.toString();
}
/**
 * @param {object} site
 * @param {object} locals
 * @returns {Promise}
 */


function getNewsfeedCount(site, locals) {
  var query = queryService(index, locals);
  queryService.onlyWithinThisSite(query, site);
  queryService.addFilter(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  return queryService.getCount(query).catch(function () {
    return 0;
  });
}
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @param {string} locals.url
 * @param {string} locals.start
 * @param {string} locals.size
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var urlParts = getNormalizedUrlParts(locals),
      sizeDefault = 50,
      start = parseInt(locals.start, 10) || 0,
      size = parseInt(locals.size, 10) || sizeDefault,
      nextStart = Math.max(start - size, 0),
      // lower number
  prevStart = Math.max(start + size, 0); // higher number
  // if start is 0 or less, there is no next a

  if (nextStart > -1 && start !== 0) {
    data.nextUrl = getNormalizedUrlQueryByStart(urlParts, nextStart);
  }

  return getNewsfeedCount(locals.site).then(function (count) {
    if (prevStart > -1 && prevStart < count) {
      data.prevUrl = getNormalizedUrlQueryByStart(urlParts, prevStart);
    }

    return data;
  });
};
}, {"38":38,"49":49,"58":58,"121":121}];
window.modules["homepage-article-bar.model"] = [function(require,module,exports){'use strict';

var mediaplay = require(53),
    cuneiformCmpt = require(95),
    _cloneDeep = require(47);

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals); // Warning: Never mutate objects in cuneiformResults. If you do, Cuneiform will
  // think the results are outdated and issue unnecessary PUTs

  data.articles = (data.cuneiformResults ? _cloneDeep(data.cuneiformResults) : data.articles) || [];
  data.articles.forEach(function (article) {
    if (article.feedImgUrl) {
      article.feedImgUrl = mediaplay.getRendition(article.feedImgUrl, 'homepage-article-bar');
    }
  });
  return data;
};

module.exports.render = cuneiformCmpt.render;
}, {"47":47,"53":53,"95":95}];
window.modules["homepage-article-list.model"] = [function(require,module,exports){'use strict';

var cuneiformCmpt = require(95),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    _set = require(87),
    _cloneDeep = require(47);
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  if (result.pageUri) {
    data.pageUri = result.pageUri;
  }

  if (data.primaryHeadline) {
    data.plaintextPrimaryHeadline = toPlainText(data.primaryHeadline);
  }

  if (Array.isArray(data.featureTypes)) {
    data.featureTypes = data.featureTypes.reduce(function (prev, curr) {
      return _set(prev, curr, true);
    }, {});
  }

  return data;
}

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals); // Warning: Never mutate objects in cuneiformResults. If you do, Cuneiform will
  // think the results are outdated and issue unnecessary PUTs

  data.articles = (data.cuneiformResults ? _cloneDeep(data.cuneiformResults) : data.articles) || [];
  data.callouts = data.articles.map(cuneiformCmpt.getCallout); // retrieve article metadata from elastic if cuneiform bot is toggled off,
  // as would be the case when we have paradiseSquare putting to most-popular

  if (data.botIgnore) {
    return Promise.all(data.articles.map(function (articleData) {
      articleData.url = articleData.canonicalUrl;
      return recircCmpt.getArticleDataAndValidate(ref, articleData, locals, ['pageUri']).then(function (result) {
        return assignToData(articleData, result);
      });
    })).then(function (articles) {
      data.articles = articles;
      return data;
    });
  }

  return data;
};

module.exports.render = cuneiformCmpt.render;
}, {"39":39,"47":47,"87":87,"95":95,"103":103}];
window.modules["homepage-article-promo.model"] = [function(require,module,exports){'use strict';

var cuneiformCmpt = require(95);

function getDynamicFeedImg(data) {
  if (!(data.variation && data.article && data.article.feedImgUrl)) {
    return undefined;
  }

  return {
    url: data.article.feedImgUrl,
    mobile: data.callout === 'video' ? // at small screen size videos have a special aspect ratio
    'homepage-article-promo-video-small' : "homepage-article-promo-".concat(data.variation, "-small"),
    tablet: "homepage-article-promo-".concat(data.variation, "-medium"),
    desktop: "homepage-article-promo-".concat(data.variation, "-large")
  };
}

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals);
  data.article = data.cuneiformResults ? data.cuneiformResults[0] : data.article;
  data.callout = cuneiformCmpt.getCallout(data.article);
  data.dynamicFeedImg = getDynamicFeedImg(data); // Prevent microservice from placing an article into
  // this spot if it is showing an ad

  data.botIgnore = !!data.showAd;
  return data;
};

module.exports.render = cuneiformCmpt.render;
}, {"95":95}];
window.modules["homepage-config.model"] = [function(require,module,exports){(function (process){
'use strict';

var cuneiformCmpt = require(95),
    INDEX = 'published-articles',
    ELASTIC_PREFIX = window.process.env.ELASTIC_PREFIX,
    DEFAULT_ELASTIC_INDEX = (ELASTIC_PREFIX ? ELASTIC_PREFIX + '_' : '') + INDEX;

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals);
  data.cuneiformQuery.index = data.elasticIndex || DEFAULT_ELASTIC_INDEX;
  return data;
};

module.exports.render = cuneiformCmpt.render;

}).call(this,require(22))}, {"22":22,"95":95}];
window.modules["homepage-excerpt.model"] = [function(require,module,exports){'use strict';

var cuneiformCmpt = require(95);

module.exports.render = cuneiformCmpt.render;

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals);
  data.article = data.cuneiformResults ? data.cuneiformResults[0] : data.article;
  return data;
};
}, {"95":95}];
window.modules["homepage-flex.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  if (data.tabletOrder && typeof data.tabletOrder === 'string') {
    data.tabletOrder = data.tabletOrder.split(',').map(function (value) {
      return parseInt(value.trim(), 10);
    });

    if (data.tabletOrder.some(isNaN)) {
      throw new Error('Invalid value in homepage-flex for tabletOrder');
    }
  }

  if (data.desktopOrder && typeof data.desktopOrder === 'string') {
    data.desktopOrder = data.desktopOrder.split(',').map(function (value) {
      return parseInt(value.trim(), 10);
    });

    if (data.desktopOrder.some(isNaN)) {
      throw new Error('Invalid value in homepage-flex for desktopOrder');
    }
  }

  return data;
};
}, {}];
window.modules["homepage-latest-news.model"] = [function(require,module,exports){'use strict';

var cuneiformCmpt = require(95);

module.exports.render = cuneiformCmpt.render;

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals);
  data.articles = (data.cuneiformResults ? data.cuneiformResults : data.articles) || [];
  data.callouts = data.articles.map(cuneiformCmpt.getCallout);
  return data;
};
}, {"95":95}];
window.modules["homepage-package.model"] = [function(require,module,exports){'use strict';

var striptags = require(42),
    sanitize = require(39);

module.exports.save = function (ref, data) {
  if (data.title) {
    data.title = sanitize.toSmartHeadline(striptags(data.title));
  }

  if (data.description) {
    data.description = sanitize.toSmartHeadline(striptags(data.description));
  }

  data.cuneiformIgnore = data.disabled;
  return data;
};
}, {"39":39,"42":42}];
window.modules["homepage-section.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  if (data.tabletOrder && typeof data.tabletOrder === 'string') {
    data.tabletOrder = data.tabletOrder.split(',').map(function (value) {
      return parseInt(value.trim());
    });
  }

  if (data.desktopOrder && typeof data.desktopOrder === 'string') {
    data.desktopOrder = data.desktopOrder.split(',').map(function (value) {
      return parseInt(value.trim());
    });
  }

  return data;
};
}, {}];
window.modules["homepage-text-promo.model"] = [function(require,module,exports){'use strict';

var cuneiformCmpt = require(95);

module.exports.save = cuneiformCmpt.save;

module.exports.render = function (ref, data, locals) {
  cuneiformCmpt.render(ref, data, locals);
  data.article = data.cuneiformResults ? data.cuneiformResults[0] : data.article;
  return data;
};
}, {"95":95}];
window.modules["homepage-top-lede.model"] = [function(require,module,exports){'use strict';

var mediaplay = require(53),
    cuneiformCmpt = require(95),
    _get = require(32);

function getHeadline(data) {
  if (data.overrideHeadline) {
    return data.overrideHeadline;
  }

  if (data.article && data.headlineVariation) {
    return data.article[data.headlineVariation];
  }

  return '';
}

function getHeadlineSize(data) {
  if (data.headline) {
    var fullHeadline = data.headline;

    if (_get(data, 'show.teaser') && _get(data, 'article.teaser')) {
      fullHeadline += ' ' + data.article.teaser;
    }

    return fullHeadline.length > 100 ? 'long' : 'short';
  }

  return '';
}

function getImgUrl(data) {
  if (data.article && data.article.feedImgUrl) {
    return mediaplay.getRenditionUrl(data.article.feedImgUrl, {
      w: 620,
      h: 620
    });
  }

  return '';
}

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals);
  data.article = data.cuneiformResults ? data.cuneiformResults[0] : data.article;
  data.imgUrl = getImgUrl(data);
  data.callout = cuneiformCmpt.getCallout(data.article);
  data.headline = getHeadline(data);
  data.headlineSize = getHeadlineSize(data);
  return data;
};

module.exports.render = cuneiformCmpt.render;
}, {"32":32,"53":53,"95":95}];
window.modules["house-scrollviz-2018.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  // passthrough to enable client-side re-rendering
  // todo: remove this file once all of the server.js files are converted to model.js
  return data;
};
}, {}];
window.modules["house-table-2018.model"] = [function(require,module,exports){'use strict';

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
