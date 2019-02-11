window.modules["ad-a9.model"] = [function(require,module,exports){(function (process){
'use strict';

module.exports.save = function (ref, data) {
  data.timeoutENV = window.process.env.A9_TIMEOUT;
  return data;
};

}).call(this,require(22))}, {"22":22}];
window.modules["amp-relay.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    parse = require(38);
/**
 * Get the path, including the query string, from a URL
 * @param  {string} canonicalUrl
 * @return {string}
 */


function getPathFromUrl(canonicalUrl) {
  var parsedUrl;

  if (!canonicalUrl) {
    return '';
  }

  parsedUrl = parse(canonicalUrl);
  return parsedUrl.pathname + (parsedUrl.query || '');
}
/**
 * set component canonical url if it's passed in through the locals
 * @param {object} data
 * @param {object} [locals]
 */


function setUrl(data, locals) {
  if (locals && locals.publishUrl) {
    data.canonicalUrl = locals.publishUrl;
    data.articlePath = getPathFromUrl(locals.publishUrl);
  }
}

module.exports.render = function (ref, data, locals) {
  var siteHost = _get(locals, 'site.host', null),
      sitePath = _get(locals, 'site.path', '');

  if (data.canonicalUrl && siteHost) {
    data.internalAmpUrl = data.canonicalUrl.replace("".concat(siteHost).concat(sitePath), "".concat(siteHost).concat(sitePath, "/amp"));
  }

  return data;
};

module.exports.save = function (ref, data, locals) {
  setUrl(data, locals);
  return data;
};

module.exports.getPathFromUrl = getPathFromUrl; // exported for tests

module.exports.setUrl = setUrl; // exported for tests
}, {"32":32,"38":38}];
window.modules["annotation.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  data.text = sanitize.validateTagContent(sanitize.toSmartText(data.text || ''));
  return data;
};
}, {"39":39}];
window.modules["apple-music.model"] = [function(require,module,exports){'use strict';

function getEmbedData(url) {
  var songId = url.match(/\?i=(\d*)/),
      // only song urls will have this query param
  isSongUrl = url.includes('?i='),
      embedCode = url.match(/src=['"](.*?)['"]/i);
  var albumId = url.match(/[^\/]+$/); // if the albumId contains 'id', the user has entered an old url, correctly
  // grab the id from this old url

  if (albumId[0].includes('id')) {
    albumId = albumId[0].match(/id(.*)/)[1];
  } else {
    albumId = albumId[0];
  } // checks if the user pasted in embed code


  if (embedCode) {
    return {
      type: 'embed',
      url: embedCode[1]
    };
  } // grabs the unique album ID in the link, which is the string after the last
  // slash in the url


  if (albumId && !isSongUrl) {
    return {
      type: 'album',
      url: "//tools.applemusic.com/embed/v1/album/".concat(albumId, "?country=us")
    };
  } // grabs the unique song ID in the link, which is denoted by the start of '?i='


  if (songId && isSongUrl) {
    return {
      type: 'song',
      url: "//tools.applemusic.com/embed/v1/song/".concat(songId[1], "?country=us")
    };
  }
}

function generateEmbedLink(data) {
  var embedUrl = data.linkToEmbed,
      embed = getEmbedData(embedUrl);

  if (embed.type === 'embed') {
    // parse out the height from the embed code
    data.embedHeight = embedUrl.match(/height=['"](.*?)['"]/i)[1]; // parse out the width from the embed code

    data.embedWidth = embedUrl.match(/width=['"](.*?)['"]/i)[1]; // replaces the embed code pasted in with just the src url

    data.linkToEmbed = embed.url;
  } else {
    // checks if the linkToEmbed has '/id' in its path and checks if the link does not have '?i=' in its path ('?i=' denotes a song)
    if (embed.type === 'album') {
      // height and width values were taken from Apple Music's standard album embed values
      data.embedHeight = '500px';
    } else if (embed.type === 'song') {
      data.embedHeight = '110px';
    } // if a url was entered, the embedWidth will always be 100%


    data.embedWidth = '100%';
  }

  data.embedUrl = embed.url;
}

module.exports.save = function (ref, data) {
  if (data.linkToEmbed) {
    generateEmbedLink(data);
  }

  return data;
}; // for testing


module.exports.getEmbedData = getEmbedData;
}, {}];
window.modules["article-details.model"] = [function(require,module,exports){'use strict';

module.exports.render = function (ref, data) {
  var variation;

  if (!data.componentVariation) {
    return;
  }

  variation = data.componentVariation.replace('article-details', '');
  data.hasPhoto = variation === '_author' || variation.indexOf('logo') > -1;
  return data;
};
}, {}];
window.modules["article-sidebar.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    styles = require(44),
    utils = require(43);
/**
 * Update and sanitize headline.
 * @param {object} data
 * @returns {object}
 */


function updateHeadline(data) {
  // Add smart quotes, etc to wysiwyg headlines
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.headline)) {
    data.headline = sanitize.toSmartHeadline(striptags(data.headline, ['em', 'i', 'strike', 'span']));
  }

  return data;
}
/**
 * Update and sanitize teaser.
 * @param {object} data
 * @returns {object}
 */


function updateTeaser(data) {
  // Add smart quotes, etc to teaser
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.teaser)) {
    data.teaser = sanitize.toSmartText(striptags(data.teaser, ['a', 'em', 'i', 'strike', 'span']));
  }

  return data;
}
/**
 * save subheader
 * @param  {string} uri
 * @param  {object} data
 * @return {Promise}
 */


module.exports.save = function (uri, data) {
  updateHeadline(data);
  updateTeaser(data); // compile styles if they're not empty

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"39":39,"42":42,"43":43,"44":44}];
window.modules["article.model"] = [function(require,module,exports){'use strict'; // Allow this to pass eslint complexity rule

/* eslint complexity: ["error", 18] */

var _get = require(32),
    _filter = require(51),
    _includes = require(33),
    _unset = require(50),
    _cloneDeep = require(47),
    striptags = require(42),
    dateFormat = require(52),
    dateParse = require(54),
    utils = require(43),
    _require = require(48),
    getParselySiteId = _require.getParselySiteId,
    has = utils.has,
    isFieldEmpty = utils.isFieldEmpty,
    sanitize = require(39),
    promises = require(46),
    rest = require(5),
    circulationService = require(55),
    mediaplay = require(53),
    queryService = require(49),
    QUERY_INDEX = 'authors',
    AUTHOR_FIELDS = ['name', 'twitter', 'facebook', 'instagram', 'socialHandlePreference'];
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
 * sanitize headlines and teasers
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

  if (has(data.seoHeadline)) {
    // seo headline doesn't allow any html, but should get curly quotes, fancy dashes, and ellipses
    data.seoHeadline = sanitize.toSmartHeadline(striptags(data.seoHeadline));
  }

  if (has(data.teaser)) {
    data.teaser = sanitize.toSmartText(stripHeadlineTags(data.teaser));
  }

  if (has(data.seoDescription)) {
    // seo description doesn't allow any html, but should get curly quotes (and decoded entities)
    data.seoDescription = sanitize.toSmartText(striptags(data.seoDescription));
  }

  if (has(data.ledeCreditOverride)) {
    data.ledeCreditOverride = sanitize.toSmartText(striptags(data.ledeCreditOverride, ['strong', 'em', 'a']));
  }

  if (has(data.displayTeaser)) {
    data.displayTeaser = sanitize.toSmartText(stripHeadlineTags(data.displayTeaser));
  }

  if (has(data.ledeCaption)) {
    data.ledeCaption = sanitize.toSmartText(striptags(data.ledeCaption, ['strong', 'em', 'a']));
  }

  if (!has(data.ledeSize)) {
    data.ledeSize = 'inline';
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
 * on every save
 * @param  {object} data
 * @param  {object} locals
 */


function generatePageTitles(data, locals) {
  if (has(data.seoHeadline) || has(data.shortHeadline) || has(data.primaryHeadline)) {
    var plaintextTitle = sanitize.toPlainText(data.seoHeadline || data.shortHeadline || data.primaryHeadline); // published to pageTitle

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
    return "SPONSOR STORY: ".concat(desc);
  } else {
    return desc;
  }
}
/**
 * generate pageDescription from seoDescription / teaser
 * @param  {object} data
 */


function generatePageDescription(data) {
  if (has(data.seoDescription) || has(data.teaser)) {
    var plaintextDesc = sanitize.toPlainText(data.seoDescription || data.teaser); // published to pageDescription

    data.pageDescription = addSponsoredDescription(plaintextDesc, data);
  }

  if (has(data.teaser)) {
    // published to socialDescription (consumed by share components and og:description/twitter:description)
    data.socialDescription = addSponsoredDescription(sanitize.toPlainText(data.teaser), data);
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
    data.date = dateFormat(locals.date); // ISO 8601 date string
  } else if (has(data.articleDate) || has(data.articleTime)) {
    // make sure both date and time are set. if the user only set one, set the other to today / right now
    data.articleDate = has(data.articleDate) ? data.articleDate : dateFormat(new Date(), 'YYYY-MM-DD');
    data.articleTime = has(data.articleTime) ? data.articleTime : dateFormat(new Date(), 'HH:mm'); // generate the `date` data from these two fields

    data.date = dateFormat(dateParse(data.articleDate + ' ' + data.articleTime)); // ISO 8601 date string
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
 * query elastic to get social media stuff for an author
 * @param {Object} query
 * @param {string} name
 * @returns {Promise}
 */


function getAuthorData(query, name) {
  queryService.addShould(query, {
    match: {
      'name.normalized': sanitize.normalizeName(name.text)
    }
  });
  queryService.addMinimumShould(query, 1);
  return queryService.searchByQuery(query).catch(function () {
    return name;
  }).then(function (authors) {
    authors.forEach(function (author) {
      author.text = author.name;
    });
    return authors;
  });
}
/**
 * get article's previously-saved data, if it exists
 * note: only grab the data if we're thinking of updating the slug
 * @param  {string} uri
 * @param {object} data
 * @param {object} locals
 * @return {Promise}
 */


function getPrevData(uri, data, locals) {
  if (has(data.seoHeadline) || has(data.shortHeadline) || has(data.slug)) {
    return promises.timeout(rest.get(utils.uriToUrl(utils.replaceVersion(uri), locals)), 1000).catch(function () {
      return null;
    }); // fail gracefully
  }
}
/**
 * get article's previously-published data, if it exists
 * note: only grab the data if we're thinking of updating the slug
 * @param  {string} uri
 * @param {object} data
 * @param {object} locals
 * @return {Promise}
 */


function getPublishedData(uri, data, locals) {
  if (has(data.seoHeadline) || has(data.shortHeadline) || has(data.slug)) {
    return promises.timeout(rest.get(utils.uriToUrl(utils.replaceVersion(uri, 'published'), locals)), 1000).catch(function () {
      return null;
    }); // fail gracefully
  }
}
/**
 * get url to magazine issue archive, if magazine issue date is provided.
 * if url results in an error, the magazine issue date provided was likely
 * invalid and will be deleted.
 * @param {object} data
 * @param {object} locals
 * @return {Promise}
 */


function getMagazineIssueUrl(data) {
  var issueUrlPath = 'http://nymag.com/nymag/toc/';

  if (has(data.magazineIssueDate)) {
    var url = issueUrlPath + data.magazineIssueDate.split('-').join('');
    return promises.timeout(rest.get(url).then(function () {
      // set the magazine issue url if the fetch succeeds
      data.magazineIssueUrl = url;
    }), 1000).catch(function () {
      // remove the magazine issue url if the fetch fails or times out
      _unset(data, 'magazineIssueUrl');
    });
  } else {
    // if the date is removed, remove the url
    _unset(data, 'magazineIssueUrl');
  }
}
/**
 * determine if user has manually updated the slug
 * note: manually removing the slug (setting it to emptystring)
 * is still considered manually updating the slug
 * note: this checks the new data before any slug would be generated,
 * so we're directly comparing what the user is saving to the old data
 * @param  {object} data
 * @param  {object|null} prevData
 * @return {Boolean}
 */


function manualSlugUpdate(data, prevData) {
  return prevData ? data.slug !== prevData.slug : false;
}
/**
 * determine if user has manually locked the slug (by going into settings)
 * @param  {object} data
 * @param  {object|null} prevData
 * @return {Boolean}
 */


function manualSlugLock(data, prevData) {
  return prevData ? prevData.slugLock === false && data.slugLock === true : false;
}
/**
 * determine if user has manually unlocked the slug (by going into settings)
 * @param  {object} data
 * @param  {object|null} prevData
 * @return {Boolean}
 */


function manualSlugUnlock(data, prevData) {
  return prevData ? prevData.slugLock === true && data.slugLock === false : false;
}
/**
 * generate the slug from the seoHeadline or shortHeadline
 * note: they should already have been sanitized
 * @param  {object} data
 */


function generateSlug(data) {
  if (has(data.seoHeadline)) {
    data.slug = sanitize.cleanSlug(data.seoHeadline);
  } else if (has(data.shortHeadline)) {
    data.slug = sanitize.cleanSlug(data.shortHeadline);
  } // else don't set the slug

}
/**
 * generate and/or lock the slug
 * @param  {object|null} data
 * @param  {object|null} prevData
 * @param  {object} publishedData
 */


function setSlugAndLock(data, prevData, publishedData) {
  if (manualSlugUpdate(data, prevData)) {
    // if you manually updated the slug, sanitize and update it and lock the slug
    data.slug = sanitize.cleanSlug(data.slug);
    data.slugLock = true;
    data.manualSlugUnlock = false; // manually changing the slug ALWAYS locks it again
  } else if (manualSlugLock(data, prevData)) {
    // if you manually locked the slug, don't generate a new slug
    data.slugLock = true;
    data.manualSlugUnlock = false; // manually locking the slug ALWAYS locks it again (of course)
  } else if (manualSlugUnlock(data, prevData)) {
    // if you manually unlocked the slug, generate a new slug
    generateSlug(data);
    data.manualSlugUnlock = true; // manually unlocking the slug means it won't be locked again (even if published)
  } else if (publishedData && (isFieldEmpty(data.manualSlugUnlock) || data.manualSlugUnlock === false)) {
    // if you've already published the article, don't regenerate the slug
    // note: if you publish and manually unlock the slug, it'll stay unlocked
    // until you either manually write a new slug or manually lock the slug again
    data.slugLock = true;
  } else if (isFieldEmpty(data.slugLock) || data.slugLock === false) {
    // if the slug is NOT locked (and no other situation above matches), generate it
    generateSlug(data);
  } // if the slug is locked (and no other situation above matches), do nothing

}
/**
 * Set the feed image to the lede url if it isn't already set
 * @param  {object} data
 */


function generateFeedImage(data) {
  if (data.ledeUrl && !data.feedImgUrl) {
    data.feedImgUrl = mediaplay.getRendition(data.ledeUrl, 'og:image');
  }
}
/**
 * Remove width, height, cropping, and resolution from silo image url.
 * @param  {object} data
 */


function cleanSiloImageUrl(data) {
  if (has(data.siloImgUrl)) {
    data.siloImgUrl = mediaplay.cleanUrl(data.siloImgUrl);
  }
}
/**
 * Gets the authorsAndMeta data if there exists any authors of the article
 * note: the template expects data.authorsAndMeta, so always populate it
 * @param  {Object} query
 * @param  {Object} data
 * @return {Promise}
 */


function getAuthorSocialData(query, data) {
  var firstAuthorsList = _get(data, 'byline[0].names', []),
      authorsList = _cloneDeep(_get(data, 'byline', [])); // if there is exactly one author


  if (firstAuthorsList.length === 1 && authorsList.length === 1) {
    return promises.timeout(getAuthorData(query, firstAuthorsList[0]).then(function (authorsAndMeta) {
      // set the authors & metadata property, using the metadata if it exists
      if (authorsAndMeta.length > 0) {
        authorsList[0].names = authorsAndMeta;
      }

      data.byline = authorsList;
    }), 1000).catch(function () {
      return null;
    });
  }
}

function setPlainAuthorsList(data) {
  var bylineList = _get(data, 'byline', []),
      authors = [];

  if (bylineList.length > 0) {
    bylineList.forEach(function (byline) {
      if (byline.names) {
        byline.names.forEach(function (name) {
          authors.push({
            text: name.text
          });
        });
      }
    });
    data.authors = authors;
  }
}

function getLedeLayoutFromDimensions(ledeSize, dimensions) {
  if (dimensions.width > dimensions.height) {
    // no horizontal layout for inset ledes, so default to square
    return ledeSize === 'inset' ? 'square' : 'horizontal';
  } else if (dimensions.height > dimensions.width) {
    return 'vertical';
  } else if (dimensions.width === dimensions.height) {
    // no square layout for feature ledes, so default to horiz
    return ledeSize === 'feature' || ledeSize === 'special-feature' ? 'horizontal' : 'square';
  }
}

function setOriginalLedeRendition(data) {
  // extra protection against horizontal insets... we dont want em!
  if (data.ledeSize === 'inset' && data.ledeLayout === 'horizontal') {
    data.ledeLayout = 'square';
  } // in case someone switched from inline/inset to feature with a square layout
  // reset to horizontal


  if (data.ledeLayout === 'square' && data.ledeSize.indexOf('feature') > -1) {
    data.ledeLayout = 'horizontal';
  } // return if theres no lede img


  if (!data.ledeUrl) {
    return Promise.resolve({});
  }

  return mediaplay.getMediaplayMetadata(data.ledeUrl).then(function (metadata) {
    data.ledeCredit = sanitize.toSmartText(striptags(metadata.credit, ['strong', 'em', 'a'])); // set the layout to the suggested layout based on dimensions. this can be overridden in settings

    if (data.recommendLedeLayout || !data.ledeLayout) {
      data.ledeLayout = getLedeLayoutFromDimensions(data.ledeSize, metadata.dimensions); // default to inline on vertical images. but only the first time the url is set so as not to override an explicit setting of the lede size

      if (data.ledeUrl !== data.prevLedeUrl) {
        data.ledeSizeUpdated = false;
      }

      if (data.ledeLayout === 'vertical' && data.ledeSize === 'inline' && !data.ledeSizeUpdated) {
        data.ledeSize = 'inset';
        data.ledeSizeUpdated = true;
      }
    }

    data.prevLedeUrl = data.ledeUrl;
    data.ledeImageType = metadata.imageType || 'Photo';
    return {};
  });
}

function getDynamicLedeImage(data) {
  var mobileRendition = data.ledeRendition;

  if (!data.ledeUrl) {
    return {};
  }

  if (data.ledeLayout === 'horizontal') {
    mobileRendition = data.ledeMobileCropOverride ? "".concat(data.ledeSize, "-horizontal") : "".concat(data.ledeSize, "-square");
  }

  return {
    url: data.ledeUrl,
    mobile: mobileRendition,
    tablet: data.ledeRendition,
    desktop: data.ledeRendition,
    alt: data.ledeAlt
  };
}

function shouldHideTeaser(data) {
  var headline = data.overrideHeadline || '',
      teaser = data.displayTeaser || '',
      combined = headline + teaser;
  return striptags(combined).length > 150;
}

function disableFeedOnSaleTag(data) {
  var tags = data.normalizedTags,
      disableFeed = tags && tags.indexOf('dealoftheday') > -1;

  if (disableFeed) {
    data.feeds.newsfeed = false;
  }
}

module.exports.render = function (ref, data, locals) {
  data.hasSecondaryZone = !!_get(data, 'secondaryZone._ref');
  data.dynamicLedeImage = getDynamicLedeImage(data);
  data.hideTeaser = shouldHideTeaser(data);
  data.showBylines = _get(data, 'authors', []).length > 0 || _get(data, 'secondaryAttribution', []).length > 0;
  data.overrideCreditRequired = data.ledeUrl && !data.ledeCredit;

  if (locals && !locals.edit) {
    var siteSlug = _get(locals, 'site.slug', null),
        renderer = _get(locals, 'params.ext', null);

    if (siteSlug && renderer && renderer === 'amp') {
      var uaSlug = '11';

      if (siteSlug == 'di' || siteSlug == 'selectall' || siteSlug == 'intelligencer') {
        uaSlug = '7';
      } else if (siteSlug == 'wwwthecut') {
        uaSlug = '4';
      } else if (siteSlug == 'strategist') {
        uaSlug = '10';
      } else if (siteSlug == 'grubstreet') {
        uaSlug = '6';
      } else if (siteSlug == 'vulture') {
        uaSlug = '5';
      }

      data.uaSlug = uaSlug;
      data.parselyApiKey = getParselySiteId(locals);
    }

    return data;
  }

  return promises.props({
    past: circulationService.getRollingStandoutArticles(locals),
    publishedData: getPublishedData(ref, data, locals)
  }).then(function (resolved) {
    circulationService.setGoogleStandoutHelpers(data, resolved.publishedData, resolved.past.length);
    return data;
  });
};

module.exports.save = function (uri, data, locals) {
  var query = queryService(QUERY_INDEX, locals);
  queryService.onlyWithTheseFields(query, AUTHOR_FIELDS); // first, let's get all the synchronous stuff out of the way:
  // sanitizing inputs, setting fields, etc

  sanitizeInputs(data); // do this before using any headline/teaser/etc data

  generatePrimaryHeadline(data);
  generatePageTitles(data, locals);
  generatePageDescription(data);
  formatDate(data, locals);
  setCanonicalUrl(data, locals);
  stripAdDummies(data);
  cleanSiloImageUrl(data);
  setPlainAuthorsList(data);
  disableFeedOnSaleTag(data); // now that we have some initial data (and inputs are sanitized),
  // do the api calls necessary to update the page and authors list, slug, and feed image

  return promises.props({
    setLedeRendition: setOriginalLedeRendition(data),
    prevData: getPrevData(uri, data, locals),
    publishedData: getPublishedData(uri, data, locals),
    magazineIssueUrl: getMagazineIssueUrl(data),
    authorsAndMeta: getAuthorSocialData(query, data)
  }).then(function (resolved) {
    // once async calls are done, use their resolved values to update some more data
    setSlugAndLock(data, resolved.prevData, resolved.publishedData);
    generateFeedImage(data, resolved.mediaplayImage);

    if (data.ledeUrl) {
      data.ledeRendition = "".concat(data.ledeSize, "-").concat(data.ledeLayout);
    }

    return data;
  });
}; // for testin


module.exports.getDynamicLedeImage = getDynamicLedeImage;
module.exports.shouldHideTeaser = shouldHideTeaser; // for upgrade

module.exports.setOriginalLedeRendition = setOriginalLedeRendition;
}, {"5":5,"32":32,"33":33,"39":39,"42":42,"43":43,"46":46,"47":47,"48":48,"49":49,"50":50,"51":51,"52":52,"53":53,"54":54,"55":55}];
window.modules["articles-like-this.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    _get = require(32),
    index = 'published-articles',
    _require = require(56),
    isComponent = _require.isComponent,
    fieldsForFeedItems = ['plaintextPrimaryHeadline', 'primaryHeadline', 'teaser', 'canonicalUrl', 'feedImgUrl', 'pageUri', 'date'];
/**
 * gets articles like the one on the current page
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise|object}
 */


module.exports.render = function (ref, data, locals) {
  // build query to get the current articleUri
  var thisArticleQuery = queryService.onePublishedArticleByUrl(locals.url, []); // not a page request, so no article to be found and can return early

  if (isComponent(locals.url)) {
    return data;
  }

  return queryService.searchByQueryWithRawResult(thisArticleQuery).then(function (rawResult) {
    var articleUri = _get(rawResult, 'hits.hits[0]._id');

    var articlesLikeThisQuery; // if no articleUri then return early, could be caused by article not being published yet

    if (!articleUri) {
      return;
    } // build query to get more articles like this


    articlesLikeThisQuery = queryService(index, locals);
    queryService.addSize(articlesLikeThisQuery, data.size);
    queryService.onlyWithinThisSite(articlesLikeThisQuery, locals.site);
    queryService.onlyWithTheseFields(articlesLikeThisQuery, fieldsForFeedItems);
    queryService.addShould(articlesLikeThisQuery, queryService.moreLikeThis(articlesLikeThisQuery, articleUri));
    queryService.addMinimumShould(articlesLikeThisQuery, 1);
    return queryService.searchByQuery(articlesLikeThisQuery);
  }).catch(function (e) {
    return queryService.logCatch(e, ref);
  }) // log es error, but still render component
  .then(function (articlesLikeThis) {
    data.articles = articlesLikeThis;
    return data;
  });
};
}, {"32":32,"49":49,"56":56}];
window.modules["author-feed.model"] = [function(require,module,exports){'use strict';

var _pickBy = require(59),
    _clone = require(58),
    _assign = require(57),
    _get = require(32),
    _map = require(37),
    queryService = require(49),
    utils = require(43),
    _require = require(39),
    normalizeName = _require.normalizeName,
    INDEX = 'published-articles',
    ARTICLE_COUNT = 20,
    fields = ['primaryHeadline', 'canonicalUrl', 'feedImgUrl', 'teaser', 'date'];

module.exports.render = function (ref, data, locals) {
  var from = utils.formatStart(parseInt(locals.start, 10)),
      // can be undefined or NaN,
  size = parseInt(locals.size, 10) || ARTICLE_COUNT,
      body = _pickBy({
    from: from,
    size: size
  }),
      query = queryService(INDEX, locals);

  query.body = _clone(body); // lose the reference

  if (data.name) {
    queryService.addMust(query, {
      match_phrase: {
        'authors.normalized': normalizeName(data.name)
      }
    });
    queryService.onlyWithTheseFields(query, fields); // only display articles from the host this feed is on

    queryService.addFilter(query, {
      prefix: {
        canonicalUrl: "http://".concat(locals.site.host)
      }
    });
    queryService.addSort(query, {
      date: 'desc'
    });
    return queryService.searchByQueryWithRawResult(query).then(function (results) {
      _assign(data, body);

      data.total = _get(results, 'hits.total');
      data.articles = _map(_get(results, 'hits.hits'), '_source');
      data.start = from + size;
      data.moreEntries = data.total > data.start;
      return data;
    });
  }

  return data;
};
}, {"32":32,"37":37,"39":39,"43":43,"49":49,"57":57,"58":58,"59":59}];
window.modules["author.model"] = [function(require,module,exports){'use strict';

var _last = require(24);
/**
 * munge data into a standardized format
 * @param {object} data
 * @returns {object}
 */


function mungeData(data) {
  if (data.twitter) {
    data.twitter = data.twitter.replace(/^@/, ''); // remove @ sign if it exists

    data.twitter = _last(data.twitter.split('/')); // remove any url business
  }

  if (data.facebook) {
    data.facebook = _last(data.facebook.split('/')); // remove any url business and grab the username

    data.facebook = _last(data.facebook.split('=')); // remove profile php if it exists
  }

  if (data.instagram) {
    data.instagram = data.instagram.replace(/^@/, ''); // remove @ sign if it exists

    data.instagram = _last(data.instagram.split('/')); // remove any url business
  }

  return data;
}

module.exports.save = function (ref, data) {
  return mungeData(data);
};
}, {"24":24}];
window.modules["back-issues-promo.model"] = [function(require,module,exports){"use strict";
}, {}];
window.modules["bar-line-chart.model"] = [function(require,module,exports){'use strict';

var styles = require(44),
    utils = require(43);

module.exports.save = function (uri, data) {
  // compile styles if they're not empty
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"43":43,"44":44}];
window.modules["blockquote.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  var text = data.text || '';
  data.text = sanitize.validateTagContent(sanitize.toSmartText(text));
  return data;
};
}, {"39":39}];
window.modules["browse-issues.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'magazine-archive',
    yearIntervalAggregation = {
  publication_year: {
    date_histogram: {
      field: 'magazineIssueDateFrom',
      interval: 'year',
      format: 'yyyy-MM-dd'
    }
  }
};
/**
 * Gets years
 * @param {string} [dateStr=''] - publication group date
 * @return {string} year string
 */


function getYear() {
  var dateStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return dateStr.split('-')[0];
}
/**
 * Sets toc issues years
 * @param {Object} data - component data
 * @returns {Function} dateMapper
 */


function assignIssuesYears(data) {
  /**
   * Maps ToC's publication group year in descending order
   * @param {Array<string>} results - elasticsearch aggregation results
   * @return {Object} component data with issueYears property assigned
   */
  return function dateMapper(results) {
    var yearsArray = results.map(getYear).reverse();
    data.issueYears = yearsArray.map(function (year) {
      return {
        link: "/magazine/".concat(year, ".html"),
        label: year
      };
    });
    return data;
  };
}

module.exports.render = function (uri, data, locals) {
  var query = queryService(index, locals);
  queryService.addFilter(query, {
    range: {
      magazineIssueDateFrom: {
        gt: 0,
        format: 'yyyy-MM-dd||yyyy'
      }
    }
  });
  queryService.addAggregation(query, yearIntervalAggregation);
  queryService.addSize(query, 0);
  return queryService.searchByQueryWithRawResult(query).then(queryService.formatAggregationResults('publication_year', 'key_as_string')).then(assignIssuesYears(data)).catch(function (error) {
    return console.log(error.message);
  });
};
}, {"49":49}];
window.modules["chart-data.model"] = [function(require,module,exports){'use strict';

var _forEach = require(27); // Splits the data into an easily readable object


function TSV2Object(data) {
  var finalDataObject = {
    data: {}
  },
      test = encodeURIComponent(data.data).split('%0A');

  _forEach(test, function (spreadsheetData) {
    var splitData = spreadsheetData.split('%09');
    finalDataObject.data[splitData[0]] = splitData[1];
  });

  data.transformedData = JSON.stringify(finalDataObject);
  return Promise.resolve(data);
}

module.exports.save = function (uri, data) {
  return TSV2Object(data);
};
}, {"27":27}];
window.modules["choreographer.model"] = [function(require,module,exports){'use strict';

var _kebabCase = require(70),
    has = require(43).has,
    timeout = require(46).timeout,
    put = require(69).put;

module.exports.save = function (uri, data, locals) {
  if (has(data.touts)) {
    data.touts = data.touts.map(function (tout) {
      tout.value = _kebabCase(tout.name);
      return tout;
    });
  } // when saving, rewrite /_lists/touts with the updated list of touts
  // note: for now, we're assuming /_lists/touts will be unique for each site.
  // change this logic in the future if they become true singletons or we need different
  // lists of touts in different layouts


  if (has(data.touts) && locals && locals.site && locals.site.prefix) {
    return timeout(put("".concat(locals.site.prefix, "/_lists/touts"), data.touts, locals), 1000).catch(console.error).then(function () {
      return data;
    });
  }

  return data;
};
}, {"43":43,"46":46,"69":69,"70":70}];
window.modules["circulation-headlines.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _find = require(71),
    _flowRight = require(72),
    striptags = require(42),
    _require = require(55),
    getPrevData = _require.getPrevData,
    getPublishedData = _require.getPublishedData,
    setSlugAndLock = _require.setSlugAndLock,
    stripHeadlineTags = _require.stripHeadlineTags,
    promises = require(46),
    sanitize = require(39),
    _require2 = require(43),
    has = _require2.has,
    isFieldEmpty = _require2.isFieldEmpty;
/**
 * Formats page title with extra stuff on certain sites.
 * @param {string} title
 * @param {object} locals
 * @returns {string}
 */


function formatSiteTitle(title, locals) {
  if (_get(locals, 'site.slug') === 'press') {
    // adds '-- New York Media Press Room' if we're on that site
    return "".concat(title, " -- New York Media Press Room");
  } else {
    return title;
  }
}
/**
 * Gets the appropriate headline.
 * @param {object} data
 * @return {string}
 */


function getHeadline(data) {
  var headlineFields = ['seoHeadline', 'shortHeadline', 'primaryHeadline'],
      headlineField = _find(headlineFields, function (prop) {
    return has(data[prop]);
  });

  return data[headlineField] || '';
}
/**
 * Sets pageTitle property if there is an available headline.
 * @param {object} data
 * @param {object} locals
 */


function setPageTitle(data, locals) {
  var availableHeadline = getHeadline(data);

  if (availableHeadline) {
    var plaintextTitle = sanitize.toPlainText(availableHeadline); // published to pageTitle

    data.pageTitle = formatSiteTitle(plaintextTitle, locals);
  }
}
/**
 * Overrides the primary headline from the overrideHeadline
 * if the primary headline is empty and the overrideHeadline is less than 80 characters.
 * @param {object} data
 */


function overridePrimaryHeadline(data) {
  if (isFieldEmpty(data.primaryHeadline) && has(data.overrideHeadline) && data.overrideHeadline.length < 80) {
    // note: this happens AFTER overrideHeadline is sanitized
    data.primaryHeadline = data.overrideHeadline;
  }
}
/**
 * Publishes plaintextPrimaryHeadline prop if there is a primary headline.
 * @param {object} data
 */


function setPlainTextPrimaryHeadline(data) {
  if (has(data.primaryHeadline)) {
    // published to ogTitle and pageListTitle
    data.plaintextPrimaryHeadline = sanitize.toPlainText(data.primaryHeadline);
  }
}
/**
 * Generates plaintext twitterTitle on every save.
 * @param {object} data
 */


function setPlaintextShortHeadline(data) {
  if (has(data.shortHeadline)) {
    // published to twitterTitle
    data.plaintextShortHeadline = sanitize.toPlainText(data.shortHeadline);
  }
}
/**
 * Sanitizes headlines.
 * @param {object} data
 */


function sanitizeHeadlines(data) {
  var smartHeadlineSanitizer = _flowRight(sanitize.toSmartHeadline, stripHeadlineTags),
      headlinesSanitizeResolver = {
    primaryHeadline: smartHeadlineSanitizer,
    shortHeadline: smartHeadlineSanitizer,
    overrideHeadline: smartHeadlineSanitizer,
    seoHeadline: _flowRight(sanitize.toSmartHeadline, striptags),
    teaser: _flowRight(sanitize.toSmartText, stripHeadlineTags),
    seoDescription: _flowRight(sanitize.toSmartText, striptags)
  };

  Object.keys(headlinesSanitizeResolver).filter(function (prop) {
    return has(data[prop]);
  }).forEach(function (prop) {
    data[prop] = headlinesSanitizeResolver[prop](data[prop]);
  });
}

module.exports.save = function (uri, data, locals) {
  sanitizeHeadlines(data);
  setPlainTextPrimaryHeadline(data);
  setPlaintextShortHeadline(data);
  overridePrimaryHeadline(data);
  setPageTitle(data, locals);
  return promises.props({
    prevData: getPrevData(uri, data, locals),
    publishedData: getPublishedData(uri, data, locals)
  }).then(function (resolved) {
    setSlugAndLock(data, resolved.prevData, resolved.publishedData);
    return data;
  });
}; // Exposed for testing


module.exports.getHeadline = getHeadline;
module.exports.formatSiteTitle = formatSiteTitle;
module.exports.sanitizeHeadlines = sanitizeHeadlines;
module.exports.overridePrimaryHeadline = overridePrimaryHeadline;
module.exports.setPlaintextShortHeadline = setPlaintextShortHeadline;
}, {"32":32,"39":39,"42":42,"43":43,"46":46,"55":55,"71":71,"72":72}];
window.modules["circulation-image.model"] = [function(require,module,exports){'use strict';

var _require = require(43),
    has = _require.has,
    mediaplay = require(53);
/**
 * Sets image with the correct rendition.
 * @param {object} data
 */


function setFeedImage(data) {
  if (has(data.feedImgUrl)) {
    // make sure the feed image is using the original rendition
    data.feedImgUrl = mediaplay.getRendition(data.feedImgUrl, 'original');
  }
}

module.exports.save = function (uri, data) {
  setFeedImage(data);
  return data;
}; // Exposed for testing


module.exports.setFeedImage = setFeedImage;
}, {"43":43,"53":53}];
window.modules["circulation-listings-headlines-slug.model"] = [function(require,module,exports){'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _flowRight = require(72),
    _get = require(32),
    striptags = require(42),
    _require = require(55),
    getPrevData = _require.getPrevData,
    getPublishedData = _require.getPublishedData,
    setSlugAndLock = _require.setSlugAndLock,
    stripHeadlineTags = _require.stripHeadlineTags,
    sanitize = require(39),
    _require2 = require(43),
    has = _require2.has,
    _require3 = require(73),
    encode = _require3.encode,
    rest = require(5);
/**
 * Checks if the slug is already being used.
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


function isSlugAvailable(data, locals) {
  data.slugMessage = data.slug;

  if (has(data.listingType) && has(data.slug)) {
    var host = _get(locals, 'site.host'),
        uri = "http://".concat(host, "/_uris/").concat(encode("".concat(host, "/listings/").concat(data.listingType, "/").concat(data.slug, ".html")));

    return rest.getHTML(uri).then(function () {
      // if it finds it, then the slug is already in use.
      data.isSlugAvailable = false;
      data.slugMessage = "The slug \"".concat(data.slug, "\" is not available."); // this is used to show a descriptive error.

      data.slugError = undefined; // This will prevent the editor from publishing the page.

      return data;
    }).catch(function () {
      // if it can't find it, then the slug is available.
      data.isSlugAvailable = true;
      data.slugMessage = data.slug;
      data.slugError = true;
      return data;
    });
  }

  return Promise.resolve(data);
}
/**
 * Publishes plaintextPrimaryHeadline prop if there is a primary headline.
 * @param {Object} data
 */


function setPlainTextPrimaryHeadline(data) {
  if (has(data.primaryHeadline)) {
    // published to ogTitle and pageListTitle
    data.plaintextPrimaryHeadline = sanitize.toPlainText(data.primaryHeadline);
  }
}
/**
 * Generates plaintext twitterTitle on every save.
 * @param {Object} data
 */


function setPlaintextShortHeadline(data) {
  if (has(data.shortHeadline)) {
    // published to twitterTitle
    data.plaintextShortHeadline = sanitize.toPlainText(data.shortHeadline);
  }
}
/**
 * Sanitizes headlines.
 * @param {Object} data
 */


function sanitizeHeadlines(data) {
  var smartHeadlineSanitizer = _flowRight(sanitize.toSmartHeadline, stripHeadlineTags),
      headlinesSanitizeResolver = {
    primaryHeadline: smartHeadlineSanitizer,
    shortHeadline: smartHeadlineSanitizer,
    teaser: _flowRight(sanitize.toSmartText, stripHeadlineTags),
    seoHeadline: _flowRight(sanitize.toSmartHeadline, striptags),
    seoDescription: _flowRight(sanitize.toSmartText, striptags),
    slug: sanitize.cleanSlug
  };

  Object.keys(headlinesSanitizeResolver).filter(function (prop) {
    return has(data[prop]);
  }).forEach(function (prop) {
    data[prop] = headlinesSanitizeResolver[prop](data[prop]);
  });
}
/**
 * Helper that uses the defaultValue to set undefined properties of the data object
 * @param {Object} data
 * @param {Object} configProperties
 * @param {Any} defaultValue
 */


function setDefaultValueToProperties(data, configProperties, defaultValue) {
  if (has(defaultValue)) {
    configProperties.filter(function (property) {
      return !data[property];
    }).forEach(function (setProperty) {
      data[setProperty] = defaultValue;
    });
  }
}
/**
 * Sets headlines based on the defaultHeadline that comes from the main listings component.
 * @param {Object} data
 */


function setHeadlines(data) {
  var headlines = ['primaryHeadline', 'shortHeadline', 'seoHeadline'];
  setDefaultValueToProperties(data, headlines, data.defaultHeadline);
}
/**
 * Sets teaser and seoDescription based on the defaultTeaser that comes from the main listings component.
 * @param {object} data
 */


function setTeasers(data) {
  var descriptions = ['teaser', 'seoDescription'];
  setDefaultValueToProperties(data, descriptions, data.defaultTeaser);
}
/**
 * Sets pageTitle property.
 * @param {Object} data
 */


function setPageTitle(data) {
  if (data.pageTitle) {
    var plainTextTitle = sanitize.toPlainText(data.pageTitle),
        prefix = plainTextTitle.startsWith('Listing: ') ? '' : 'Listing: '; // published to pageTitle

    data.pageTitle = "".concat(prefix).concat(plainTextTitle);
  }
}

module.exports.save = function (uri, data, locals) {
  setPageTitle(data);
  setHeadlines(data);
  setTeasers(data);
  sanitizeHeadlines(data);
  setPlainTextPrimaryHeadline(data);
  setPlaintextShortHeadline(data);
  return Promise.all([getPrevData(uri, data, locals), getPublishedData(uri, data, locals)]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        prevData = _ref2[0],
        publishedData = _ref2[1];

    setSlugAndLock(data, prevData, publishedData);
    return isSlugAvailable(data, locals);
  });
}; // Exposed for testing


module.exports.sanitizeHeadlines = sanitizeHeadlines;
module.exports.setDefaultValueToProperties = setDefaultValueToProperties;
module.exports.setPageTitle = setPageTitle;
}, {"5":5,"32":32,"39":39,"42":42,"43":43,"55":55,"72":72,"73":73}];
window.modules["circulation-listings-image.model"] = [function(require,module,exports){'use strict';

var _require = require(43),
    has = _require.has,
    mediaplay = require(53);
/**
 * Sets image with the correct rendition.
 * @param {object} data
 */


function setFeedImage(data) {
  if (has(data.feedImgUrl)) {
    // make sure the feed image is using the original rendition
    data.feedImgUrl = mediaplay.getRendition(data.feedImgUrl, 'og:image');
  }
}

module.exports.save = function (uri, data) {
  setFeedImage(data);
  return data;
}; // Exposed for testing


module.exports.setFeedImage = setFeedImage;
}, {"43":43,"53":53}];
window.modules["circulation-newsletter.model"] = [function(require,module,exports){'use strict';

var _require = require(43),
    has = _require.has,
    _require2 = require(55),
    getPrevData = _require2.getPrevData,
    getPublishedData = _require2.getPublishedData,
    setSlugAndLock = _require2.setSlugAndLock,
    promises = require(46),
    _require3 = require(39),
    toSmartText = _require3.toSmartText;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.previewText)) data.previewText = toSmartText(data.previewText);
  if (has(data.subject)) data.subject = toSmartText(data.subject);
}
/**
 * Sets the SEO headline from the campaign name.
 * This is mainly to better handle the slug function in the circulation service.
 * @param {object} data
 */


function setSeoHeadline(data) {
  if (has(data.campaignName)) data.seoHeadline = data.campaignName;
}

;
/**
 * Formats the page title that appears in the kiln menu.
 * @param {object} data
 */

function formatPageTitle(data) {
  if (has(data.campaignName)) data.pageTitle = "Newsletter: ".concat(data.campaignName);
}

;

module.exports.save = function (uri, data, locals) {
  sanitizeInputs(data);
  setSeoHeadline(data);
  formatPageTitle(data);
  return promises.props({
    prevData: getPrevData(uri, data, locals),
    publishedData: getPublishedData(uri, data, locals)
  }).then(function (resolved) {
    setSlugAndLock(data, resolved.prevData, resolved.publishedData);
    return data;
  });
}; // Exposed for testing


module.exports.setSeoHeadline = setSeoHeadline;
module.exports.sanitizeInputs = sanitizeInputs;
module.exports.formatPageTitle = formatPageTitle;
}, {"39":39,"43":43,"46":46,"55":55}];
window.modules["circulation-page-list-title.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (uri, data) {
  if (!data.pageListTitle && data.circPageListTitle) {
    data.pageListTitle = data.circPageListTitle;
  }

  return data;
};
}, {}];
window.modules["circulation-subscription-page-list-title.model"] = [function(require,module,exports){'use strict';

var _includes = require(33);

module.exports.save = function (uri, data) {
  var pageListTitle = data.pageListTitle || '';

  if (data.prefix && !_includes(pageListTitle.toLowerCase(), data.prefix.toLowerCase())) {
    data.pageListTitle = "".concat(data.prefix, " ").concat(pageListTitle);
  }

  return data;
};
}, {"33":33}];
window.modules["circulation-tv-show.model"] = [function(require,module,exports){'use strict';

var _flowRight = require(72),
    striptags = require(42),
    _require = require(55),
    getPrevData = _require.getPrevData,
    getPublishedData = _require.getPublishedData,
    setSlugAndLock = _require.setSlugAndLock,
    stripHeadlineTags = _require.stripHeadlineTags,
    promises = require(46),
    sanitize = require(39),
    _require2 = require(43),
    has = _require2.has,
    isFieldEmpty = _require2.isFieldEmpty;
/**
 * Sets pageTitle property if there is an available headline.
 * @param {object} data
 * @param {object} locals
 */


function setPageTitle(data) {
  var availableHeadline = data.seoHeadline || data.primaryHeadline;

  if (availableHeadline) {
    // published to pageTitle
    data.pageTitle = sanitize.toPlainText(availableHeadline);
  }
}
/**
 * Overrides the primary headline from the overrideHeadline
 * if the primary headline is empty and the overrideHeadline is less than 80 characters.
 * @param {object} data
 */


function overridePrimaryHeadline(data) {
  if (isFieldEmpty(data.primaryHeadline) && has(data.overrideHeadline) && data.overrideHeadline.length < 80) {
    // note: this happens AFTER overrideHeadline is sanitized
    data.primaryHeadline = data.overrideHeadline;
  }
}
/**
 * Publishes plaintextPrimaryHeadline prop if there is a primary headline.
 * @param {object} data
 */


function setPlainTextPrimaryHeadline(data) {
  if (has(data.primaryHeadline)) {
    // published to ogTitle and pageListTitle
    data.plaintextPrimaryHeadline = sanitize.toPlainText(data.primaryHeadline);
  }
}
/**
 * Generates plaintext twitterTitle on every save.
 * @param {object} data
 */


function setPlaintextShortHeadline(data) {
  if (has(data.shortHeadline)) {
    // published to twitterTitle
    data.plaintextShortHeadline = sanitize.toPlainText(data.shortHeadline);
  }
}
/**
 * Sanitizes headlines.
 * @param {object} data
 */


function sanitizeHeadlines(data) {
  var smartHeadlineSanitizer = _flowRight(sanitize.toSmartHeadline, stripHeadlineTags),
      headlinesSanitizeResolver = {
    primaryHeadline: smartHeadlineSanitizer,
    shortHeadline: smartHeadlineSanitizer,
    overrideHeadline: smartHeadlineSanitizer,
    seoHeadline: _flowRight(sanitize.toSmartHeadline, striptags),
    teaser: _flowRight(sanitize.toSmartText, stripHeadlineTags),
    seoDescription: _flowRight(sanitize.toSmartText, striptags)
  };

  Object.keys(headlinesSanitizeResolver).filter(function (prop) {
    return has(data[prop]);
  }).forEach(function (prop) {
    data[prop] = headlinesSanitizeResolver[prop](data[prop]);
  });
}

module.exports.save = function (uri, data, locals) {
  sanitizeHeadlines(data);
  setPlainTextPrimaryHeadline(data);
  setPlaintextShortHeadline(data);
  overridePrimaryHeadline(data);
  setPageTitle(data, locals);
  return promises.props({
    prevData: getPrevData(uri, data, locals),
    publishedData: getPublishedData(uri, data, locals)
  }).then(function (resolved) {
    setSlugAndLock(data, resolved.prevData, resolved.publishedData);
    return data;
  });
}; // Exposed for testing


module.exports.sanitizeHeadlines = sanitizeHeadlines;
module.exports.overridePrimaryHeadline = overridePrimaryHeadline;
module.exports.setPlaintextShortHeadline = setPlaintextShortHeadline;
}, {"39":39,"42":42,"43":43,"46":46,"55":55,"72":72}];
window.modules["circulation.model"] = [function(require,module,exports){'use strict';

var _require = require(55),
    generatePageDescription = _require.generatePageDescription;

module.exports.save = function (uri, data) {
  generatePageDescription(data);
  return data;
};
}, {"55":55}];
window.modules["clay-facebook-post.model"] = [function(require,module,exports){'use strict';

var rest = require(5),
    utils = require(43),
    FACEBOOK_ENDPOINT = 'https://www.facebook.com/plugins/post/oembed.json';

function getRequestUrl(data) {
  return FACEBOOK_ENDPOINT + "?url=".concat(encodeURI(data.url), "&omitscript=true");
}

module.exports.save = function (uri, data) {
  if (utils.isFieldEmpty(data.url)) {
    delete data.html;
    return data;
  } // first, wrangle the url


  data.url = data.url.match(/(https?:\/\/www\.facebook\.com\/.+)/)[1]; // note: we're using the un-authenticated api endpoint. don't abuse this

  return rest.getJSONP(getRequestUrl(data)).then(function (res) {
    // if facebook gives us an error, throw it
    if (!res.success) {
      throw new Error("Facebook oembed api error for ".concat(data.url));
    } // store facebook oembed html


    data.html = res.html; // update component instance with new html

    return data;
  }).catch(function (e) {
    if (utils.isFieldEmpty(data.html)) {
      // if we've never grabbed html for this post and we can't fetch it from the api, throw an error
      throw new Error("Cannot embed facebook post: ".concat(e.message));
    } else {
      // we have html for this, so it means the post has most likely been deleted (or the privacy settings have changed). display it with the fallback styles
      return data;
    }
  });
};
}, {"5":5,"43":43}];
window.modules["clay-instagram.model"] = [function(require,module,exports){'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var rest = require(5),
    instagramApiBaseUrl = 'https://api.instagram.com/oembed/?omitscript=true&url=',
    INSTAGRAM_POST_URL_RE = /(https?:\/\/(?:www.)?instagram\.com\/(\w+)\/([\w-]+))/;
/**
 * determine if an instagram post should hide its caption
 * @param {object} data
 * @returns {string}
 */


function hideCaption(data) {
  return data.showCaption === false ? '&hidecaption=true' : '';
}

module.exports.render = function (uri, data) {
  var url = data.url,
      _ref = INSTAGRAM_POST_URL_RE.exec(url) || [null, null, null, null],
      _ref2 = _slicedToArray(_ref, 4),
      igPostId = _ref2[3];

  data.igPostId = igPostId;
  return data;
};
/**
 * ask instagram for embed html
 * @param {string} uri
 * @param {object} data
 * @returns {Promise}
 */


module.exports.save = function (uri, data) {
  if (data.url) {
    // note: we're using the un-authenticated api endpoint. don't abuse this
    return rest.get(instagramApiBaseUrl + encodeURI(data.url) + hideCaption(data)).then(function (json) {
      // get instagram oembed html
      data.html = json.html;
      return data;
    }).catch(function () {
      return data;
    }); // fail gracefully
  } else {
    data.html = ''; // clear the html if there's no url

    return Promise.resolve(data);
  }
};
}, {"5":5}];
window.modules["clay-meta-keywords.model"] = [function(require,module,exports){'use strict';

var _isEmpty = require(75),
    _isObject = require(74),
    _head = require(25),
    _map = require(37);

module.exports.save = function (ref, data) {
  // convert array of {text: string} objects into regular array of strings
  if (!_isEmpty(data.tags) && _isObject(_head(data.tags))) {
    data.tags = _map(data.tags, function (tag) {
      return tag.text;
    });
  }

  return data;
};

module.exports.render = function (ref, data, locals) {
  // if we're in edit mode, convert array of strings into {text: string}
  // objects so they can be edited
  if (locals && locals.edit && Array.isArray(data.tags)) {
    data.tags = data.tags.map(function (text) {
      return {
        text: text
      };
    });
  }

  return data;
};
}, {"25":25,"37":37,"74":74,"75":75}];
window.modules["clay-meta-title.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  data = sanitize.recursivelyStripSeperators(data);

  if (!data.kilnTitle) {
    data.kilnTitle = data.ogTitle;
  } else if (!data.ogTitle && !data.title && data.kilnTitle) {
    // If the pagelist has title, but metatag is empty
    data.ogTitle = data.kilnTitle;
    data.title = data.kilnTitle;
  }

  return data;
};
}, {"39":39}];
window.modules["clay-meta-url.model"] = [function(require,module,exports){'use strict';
/**
 * set component canonical url and date if they're passed in through the locals
 * @param {object} data
 * @param {object} [locals]
 */

function setFromLocals(data, locals) {
  if (locals && locals.publishUrl) {
    data.url = locals.publishUrl;
  }

  if (locals && locals.date) {
    data.date = locals.date;
  }
}

module.exports.save = function (ref, data, locals) {
  setFromLocals(data, locals);
  return data;
};
}, {}];
window.modules["clay-paragraph-designed.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  var text = data.text || '';
  data.saveText = sanitize.validateTagContent(sanitize.toSmartText(text));
  return data;
};
}, {"39":39}];
window.modules["clay-paragraph.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    amp = require(76),
    sanitize = require(39),
    productsService = require(77),
    utils = require(43);

module.exports.render = function (ref, data, locals) {
  var renderer = _get(locals, 'params.ext', null);

  if (renderer && renderer === 'amp') {
    data.ampText = amp.sanitizeHtmlForAmp(data.text || '');
  }

  return data;
};

module.exports.save = function (ref, data, locals) {
  data.text = sanitize.validateTagContent(sanitize.toSmartText(data.text || ''));
  data.ampText = amp.sanitizeHtmlForAmp(data.text || ''); // only add the inline product link attributes on publish
  // this ensures that kiln never sees the data-attributes
  // also improves the editing experience by only checking for links on publish, not on save

  if (utils.isPublishedVersion(ref)) {
    return productsService.addAmazonLinkTrackingAttributes(data, locals);
  } else {
    return data;
  }
};
}, {"32":32,"39":39,"43":43,"76":76,"77":77}];
window.modules["clay-share.model"] = [function(require,module,exports){'use strict';
/**
 * set component canonical url if it's passed in through the locals
 * @param {object} data
 * @param {object} [locals]
 */

function setUrl(data, locals) {
  if (locals && locals.publishUrl) {
    data.url = locals.publishUrl;
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
  setUrl(data, locals); // save the canonical url on PUT because on GET locals does not have canonicalUrl.

  return data;
};
}, {}];
window.modules["clay-subheader.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    styles = require(44),
    utils = require(43);
/**
 * save subheader
 * @param  {string} uri
 * @param  {object} data
 * @return {Promise}
 */


module.exports.save = function (uri, data) {
  var text = data.text || ''; // sanitize text input

  data.text = sanitize.validateTagContent(sanitize.toSmartText(text)); // compile styles if they're not empty

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = ''; // unset any compiled css

    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"39":39,"43":43,"44":44}];
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
window.modules["clay-typekit.model"] = [function(require,module,exports){'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var TYPEKIT_KIT_ID_REGEX = /\/(\w+).js/;

module.exports.render = function (uri, data) {
  var kitSrc = data.kitSrc,
      _ref = TYPEKIT_KIT_ID_REGEX.exec(kitSrc || '') || [null, null],
      _ref2 = _slicedToArray(_ref, 2),
      kitId = _ref2[1];

  if (kitId) {
    data.kitId = kitId;
  }

  return data;
};
}, {}];
window.modules["collection-articles-lede.model"] = [function(require,module,exports){'use strict';

var _findIndex = require(79),
    _map = require(37),
    callout = require(80),
    queryService = require(49),
    striptags = require(42),
    sanitize = require(39),
    INDEX = 'published-articles',
    FIELDS = ['canonicalUrl', 'primaryHeadline', 'shortHeadline', 'teaser', 'feedImgUrl', 'rubric', 'authors', 'featureTypes', 'tags', 'pageUri'];
/**
 * Convert include and exclude tags to lowercase
 * @param {object} data
 */


function convertTagsLowercase(data) {
  if (data.includeTags) {
    data.includeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }

  if (data.excludeTags) {
    data.excludeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }
}
/**
 * Only allow emphasis, italic, and strikethroughs in headlines
 * @param {string} oldHeadline
 * @returns {string}
 */


function stripHeadlineTags(oldHeadline) {
  var newHeadline = striptags(oldHeadline || '', ['em', 'i', 'strike', 's']);
  return newHeadline;
}
/**
 * Given an article search result, assign required properties to an article slot.
 * When the article doesn't exist, article slot properties are reset.
 * @param {object} data
 * @param {object} articleSlot
 * @param {object} article
 */


function assignArticleProperties(data, articleSlot, article) {
  if (article) {
    articleSlot.canonicalUrl = article.canonicalUrl;
    articleSlot.primaryHeadline = article.primaryHeadline;
    articleSlot.shortHeadline = article.shortHeadline;
    articleSlot.teaser = article.teaser;
    articleSlot.feedImgUrl = article.feedImgUrl;
    articleSlot.rubric = article.rubric;
    articleSlot.shortHeadline = article.shortHeadline;
    articleSlot.authors = article.authors;
    articleSlot.callout = callout(article);
    articleSlot.pageUri = article.pageUri;
    articleSlot.headline = article[data.headlineSelected];
  } else {
    articleSlot.canonicalUrl = '';
    articleSlot.primaryHeadline = '';
    articleSlot.shortHeadline = '';
    articleSlot.teaser = '';
    articleSlot.feedImgUrl = '';
    articleSlot.rubric = '';
    articleSlot.authors = '';
    articleSlot.callout = '';
    articleSlot.pageUri = '';
    articleSlot.headline = '';
  }
}
/**
 * Restrict the query by site depending on the behavior selected
 * @param {object} query
 * @param {object} data
 * @param {string} site
 */


function setSite(query, data, site) {
  if (!data.site || !site) {
    return;
  }

  switch (data.site) {
    case 'current':
      queryService.withinThisSiteAndCrossposts(query, site);
      break;

    case 'domain':
      queryService.onlyWithinThisDomain(query, site);
      break;

    case 'other':
      if (data.siteSlug) {
        queryService.onlyWithinThisSite(query, {
          slug: data.siteSlug
        });
      }

      break;

    default:
      break;
  }
}
/**
 * Builds the query used to retrieve overridden article details
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildOverrideQuery(data, locals) {
  var overrideQuery = queryService.newCuneiformQuery(INDEX, locals);
  queryService.addFilter(overrideQuery, {
    terms: {
      canonicalUrl: data.overrideUrls
    }
  });
  queryService.onlyWithTheseFields(overrideQuery, FIELDS);
  queryService.addSize(overrideQuery, data.articleSlots.length);
  return overrideQuery;
}
/**
 * Builds the query used to auto-fill with articles matching the specified criteria
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildFeedQuery(data, locals) {
  var feedQuery = queryService.newCuneiformQuery(INDEX, locals);
  queryService.addMust(feedQuery, {
    term: {
      'feeds.newsfeed': true
    }
  });

  if (locals && locals.site) {
    setSite(feedQuery, data, locals.site);
  }

  if (data.includeTags && data.includeTags.length > 0) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(feedQuery, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(feedQuery, data.matchAllIncludeTags ? data.includeTags.length : 1);
  }

  if (data.excludeTags && data.excludeTags.length > 0) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(feedQuery, {
        match: {
          tags: tag.text
        }
      });
    });
  }

  return feedQuery;
}
/**
 * Build up the search query used to populate article slots.
 * This will pull both overrides and auto-filled articles, and will be run by cuneiform.
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildQuery(data, locals) {
  var query;

  if (data.overrideUrls.length === data.articleSlots.length) {
    // All slots are overridden
    query = buildOverrideQuery(data, locals);
  } else if (data.overrideUrls.length) {
    // Some are overridden, some need auto-filling
    query = queryService.combineFunctionScoreQueries(buildOverrideQuery(data, locals), buildFeedQuery(data, locals));
  } else {
    // All auto-filled
    query = buildFeedQuery(data, locals);
  } // Common requirements on any query


  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, data.articleSlots.length);
  queryService.onlyWithTheseFields(query, FIELDS);
  return query;
}
/**
 * Transform user-entered scope list to a flat array of strings for cuneiform
 * @param {array} scopes
 * @returns {array}
 */


function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  } else {
    return [];
  }
}

function setHeadline(data) {
  data.cuneiformResults.forEach(function (article) {
    article.headline = article[data.headlineSelected];
  });
}
/**
 * Takes results from cuneiform, assigns override articles to the relevant slot,
 * and creates the feed for filling any empty slots on display
 * @param {object} data
 */


function setResults(data) {
  var slotIndex, overrideArticle, i; // Cuneiform results will always have override results at the front of the array,
  // so we want to pull them until we hit non-overrides and then put the rest in the
  // auto-fill array

  for (i = 0; i < data.cuneiformResults.length; i++) {
    slotIndex = _findIndex(data.articleSlots, function (s) {
      return s.overrideUrl === data.cuneiformResults[i].canonicalUrl;
    });

    if (slotIndex >= 0) {
      overrideArticle = data.cuneiformResults[i];
      assignArticleProperties(data, data.articleSlots[slotIndex], overrideArticle);
      data.noArticlesFiller = true;
    } else {
      break;
    }
  }

  data.autoArticles = data.cuneiformResults.slice(i, data.cuneiformResults.length);
}
/**
 * Save article data and retrieve any overridden articles
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.save = function (ref, data, locals) {
  data.noArticlesFiller = false;
  data.overrideUrls = [];
  convertTagsLowercase(data);

  if (data.articleSlots && data.articleSlots.length) {
    // Retrieve all override URLs and reset saved articles
    for (var i = 0; i < data.articleSlots.length; i++) {
      if (data.articleSlots[i].override && data.articleSlots[i].overrideUrl && !data.overrideUrls.includes(data.articleSlots[i].overrideUrl)) {
        // allow component to find articles when user enter a https url, since elastic is indexed with http ( at the moment )
        data.articleSlots[i].overrideUrl = data.articleSlots[i].overrideUrl.replace('https://', 'http://');
        data.overrideUrls.push(data.articleSlots[i].overrideUrl);
        data.articleSlots[i].overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.articleSlots[i].overrideHeadline));
      } else {
        data.articleSlots[i].overrideUrl = '';
        data.articleSlots[i].overrideHeadline = '';
      }

      assignArticleProperties(data, data.articleSlots[i]);
    }

    data.cuneiformQuery = buildQuery(data, locals);
    data.cuneiformScopes = getScopes(data.scopes);

    if (data.cuneiformResults) {
      setResults(data);
      setHeadline(data);
    }

    return data;
  }

  return data;
};
}, {"37":37,"39":39,"42":42,"49":49,"79":79,"80":80}];
window.modules["collection-articles.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _findIndex = require(79),
    _map = require(37),
    callout = require(80),
    queryService = require(49),
    striptags = require(42),
    sanitize = require(39),
    log = require(81).setup({
  file: __filename,
  component: 'collection-articles'
}),
    INDEX = 'published-articles',
    FIELDS = ['canonicalUrl', 'primaryHeadline', 'shortHeadline', 'teaser', 'feedImgUrl', 'rubric', 'authors', 'featureTypes', 'tags', 'pageUri'],
    ASSIGN_ARTICLE_FIELDS = ['canonicalUrl', 'primaryHeadline', 'shortHeadline', 'teaser', 'feedImgUrl', 'rubric', 'authors'];
/**
 * Convert include and exclude tags to lowercase
 * @param {object} data
 */


function convertTagsLowercase(data) {
  if (data.includeTags) {
    data.includeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }

  if (data.excludeTags) {
    data.excludeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }
}
/**
 * Restrict the query by site depending on the behavior selected
 * @param {object} query
 * @param {object} data
 * @param {string} site
 */


function setSite(query, data, site) {
  if (!data.site || !site) {
    return;
  }

  switch (data.site) {
    case 'current':
      queryService.withinThisSiteAndCrossposts(query, site);
      break;

    case 'domain':
      queryService.onlyWithinThisDomain(query, site);
      break;

    case 'other':
      if (data.siteSlug) {
        queryService.onlyWithinThisSite(query, {
          slug: data.siteSlug
        });
      }

      break;

    default:
      break;
  }
}
/**
 * only allow emphasis, italic, and strikethroughs in headlines
 * @param  {string} oldHeadline
 * @returns {string}
 */


function stripHeadlineTags(oldHeadline) {
  var newHeadline = striptags(oldHeadline || '', ['em', 'i', 'strike', 's']);
  return newHeadline;
}
/**
 * Build up the search query used to populate article slots.
 * This will (eventually) be stored in the component's data and used by cuneiform.
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildSearchQuery(data, locals) {
  var from = 0,
      query = queryService.newCuneiformQuery(INDEX),
      numSlotsOpen = data.articleSlots.length - data.overrideUrls.length;
  queryService.addMust(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, numSlotsOpen);
  queryService.addFrom(query, from);
  setSite(query, data, locals.site);

  if (data.includeTags && data.includeTags.length) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, data.matchAllIncludeTags ? data.includeTags.length : 1);
  }

  if (data.excludeTags && data.excludeTags.length) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
    });
  }

  if (data.includeStoryCharacteristics && data.includeStoryCharacteristics.length) {
    data.includeStoryCharacteristics.forEach(function (char) {
      var filter = {
        term: {}
      };
      filter.term["storyCharacteristics.".concat(char.text)] = true;
      queryService.addFilter(query, filter);
    });
  }

  if (data.overrideUrls.length > 0) {
    data.overrideUrls.forEach(function (url) {
      queryService.addMustNot(query, {
        term: {
          canonicalUrl: url
        }
      });
    });
  }

  return query;
}
/**
 * Given an article search result, assign required properties to an article slot.
 * When the article doesn't exist, article slot properties are reset.
 * @param {Object} data
 * @param {Object} articleSlot
 * @param {Object} article
 */


function assignArticleProperties(data, articleSlot, article) {
  ASSIGN_ARTICLE_FIELDS.forEach(function (field) {
    return articleSlot[field] = article ? article[field] : '';
  });
  articleSlot.callout = article ? callout(article) : '';
  articleSlot.headline = article ? article[data.headlineSelected] : '';
}
/**
 * Transform user-entered scope list to a flat array of strings for cuneiform
 * @param {array} scopes
 * @returns {array}
 */


function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  } else {
    return [];
  }
}

function setHeadline(data) {
  data.cuneiformResults.forEach(function (article) {
    article.headline = article[data.headlineSelected];
  });
}
/**
 * Get and save article details for all overridden slots.
 * Also stores a final list of override urls on the component data.
 * @param {object} data
 * @param {array} overrideUrls
 * @param {object} locals
 * @returns {Promise}
 */


function setOverrideArticles(data, overrideUrls, locals) {
  var overrideQuery = queryService(INDEX, locals);
  data.overrideUrls = [];

  if (overrideUrls.length) {
    queryService.addFilter(overrideQuery, {
      terms: {
        canonicalUrl: overrideUrls
      }
    });
    queryService.onlyWithTheseFields(overrideQuery, FIELDS);
    return queryService.searchByQuery(overrideQuery).then(function (results) {
      var slotIndex; // Assign returned articles to the correct slot

      var _loop = function _loop(i) {
        slotIndex = _findIndex(data.articleSlots, function (s) {
          return s.overrideUrl === results[i].canonicalUrl;
        });

        if (slotIndex >= 0 && data.articleSlots[slotIndex] && data.articleSlots[slotIndex].override) {
          data.overrideUrls.push(results[i].canonicalUrl);
          assignArticleProperties(data, data.articleSlots[slotIndex], results[i]);
          data.noArticlesFiller = true;
        }
      };

      for (var i = 0; i < results.length; i++) {
        _loop(i);
      } // Go back through the list and reset any that couldn't be found in elastic


      for (var i = 0; i < data.articleSlots.length; i++) {
        if (data.articleSlots[i].override && !data.articleSlots[i].primaryHeadline) {
          data.articleSlots[i].overrideUrl = '';
          data.articleSlots[i].overrideHeadline = '';
          data.articleSlots[i].overrideAuthors = '';
          data.articleSlots[i].overrideTeaser = '';
        }
      }

      return data;
    });
  } else {
    return Promise.resolve();
  }
}
/**
 * Save article data and retrieve any overridden articles
 * @param {string} ref
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


module.exports.save = function (ref, data, locals) {
  var overrideUrls = [];
  data.title = sanitize.toSmartText(data.title || '');
  data.noArticlesFiller = false;
  convertTagsLowercase(data);

  if (data.articleSlots && data.articleSlots.length) {
    // Retrieve all override URLs and reset saved articles
    for (var i = 0; i < data.articleSlots.length; i++) {
      if (data.articleSlots[i].override && data.articleSlots[i].overrideUrl && !overrideUrls.includes(data.articleSlots[i].overrideUrl)) {
        // allow component to find articles when user enter a https url, since elastic is indexed with http ( at the moment )
        data.articleSlots[i].overrideUrl = data.articleSlots[i].overrideUrl.replace('https://', 'http://');
        overrideUrls.push(data.articleSlots[i].overrideUrl);
        data.articleSlots[i].overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.articleSlots[i].overrideHeadline));
        data.articleSlots[i].overrideAuthors = data.articleSlots[i].overrideAuthors;
        data.articleSlots[i].overrideTeaser = sanitize.toSmartText(stripHeadlineTags(data.articleSlots[i].overrideTeaser));
      } else {
        data.articleSlots[i].overrideUrl = '';
        data.articleSlots[i].overrideHeadline = '';
        data.articleSlots[i].overrideTeaser = '';
        data.articleSlots[i].overrideAuthors = '';
      }

      assignArticleProperties(data, data.articleSlots[i]);
    }

    return setOverrideArticles(data, overrideUrls, locals).then(function () {
      data.cuneiformQuery = buildSearchQuery(data, locals);
      data.cuneiformScopes = getScopes(data.scopes);

      if (data.cuneiformResults) {
        setHeadline(data);
      }

      return data;
    }).catch(function (err) {
      log('error', "Error saving articles for ".concat(ref), {
        error: err.message
      });
      return data;
    });
  }

  return Promise.resolve(data);
};

}).call(this,"/components/collection-articles/model.js")}, {"37":37,"39":39,"42":42,"49":49,"79":79,"80":80,"81":81}];
window.modules["collection-package.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _findIndex = require(79),
    _map = require(37),
    striptags = require(42),
    sanitize = require(39),
    INDEX = 'published-articles',
    utils = require(43),
    endOfDay = require(85),
    isFuture = require(82),
    isPast = require(84),
    isBefore = require(86),
    isWithinRange = require(83),
    has = utils.has,
    FIELDS = ['authors', 'canonicalUrl', 'featureTypes', 'feedImgUrl', 'primaryHeadline', 'pageUri', 'tags'],
    log = require(81).setup({
  file: __filename,
  component: 'collection-articles-lede'
}),
    queryService = require(49);
/**
 * Convert include and exclude tags to lowercase
 * @param {object} data
 */


function convertTagsLowercase(data) {
  if (data.includeTags) {
    data.includeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }

  if (data.excludeTags) {
    data.excludeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }
}
/**
 * only allow emphasis, italic, and strikethroughs in headlines
 * @param  {string} oldHeadline
 * @returns {string}
 */


function stripHeadlineTags(oldHeadline) {
  var newHeadline = striptags(oldHeadline || '', ['em', 'i', 'strike', 's']);
  return newHeadline;
}
/**
 * Build up the search query used to populate article slots.
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildCuneiformQuery(data, locals) {
  var query = queryService.newCuneiformQuery(INDEX),
      numSlotsOpen = data.articleSlots.length - data.overrideUrls.length;
  queryService.addMust(query, {
    term: {
      'feeds.newsfeed': true
    }
  });

  if (locals && locals.site) {
    queryService.withinThisSiteAndCrossposts(query, locals.site);
  }

  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, numSlotsOpen);

  if (data.includeTags && data.includeTags.length > 0) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, data.matchAllIncludeTags ? data.includeTags.length : 1);
  }

  if (data.excludeTags && data.excludeTags.length > 0) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
    });
  }

  if (data.overrideUrls.length > 0) {
    data.overrideUrls.forEach(function (url) {
      queryService.addMustNot(query, {
        term: {
          canonicalUrl: url
        }
      });
    });
  }

  return query;
}
/**
 * Given an article search result, assign required properties to an article slot.
 * When the article doesn't exist, article slot properties are reset.
 * @param {object} articleSlot
 * @param {object} article
 */


function assignArticleProperties(articleSlot, article) {
  articleSlot.canonicalUrl = article ? article.canonicalUrl : '';
  articleSlot.featureTypes = article ? article.featureTypes : '';
  articleSlot.feedImgUrl = article ? article.feedImgUrl : '';
  articleSlot.primaryHeadline = article ? article.primaryHeadline : '';
  articleSlot.authors = article ? article.authors : '';
  articleSlot.pageUri = article ? article.pageUri : '';
  articleSlot.tags = article ? article.tags : '';
}
/**
 * Transform user-entered scope list to a flat array of strings for cuneiform
 * @param {array} scopes
 * @returns {array}
 */


function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  } else {
    return [];
  }
}
/**
 * Get and save article details for all overridden slots.
 * Also stores a final list of override urls on the component data.
 * @param {object} data
 * @param {array} overrideUrls
 * @param {object} locals
 * @returns {Promise}
 */


function setOverrideArticles(data, overrideUrls, locals) {
  var overrideQuery = queryService(INDEX, locals);
  data.overrideUrls = [];

  if (overrideUrls.length) {
    queryService.addFilter(overrideQuery, {
      terms: {
        canonicalUrl: overrideUrls
      }
    });
    queryService.onlyWithTheseFields(overrideQuery, FIELDS);
    return queryService.searchByQuery(overrideQuery).then(function (results) {
      var slotIndex; // Assign returned articles to the correct slot

      var _loop = function _loop(i) {
        slotIndex = _findIndex(data.articleSlots, function (s) {
          return s.overrideUrl === results[i].canonicalUrl;
        });

        if (slotIndex >= 0 && data.articleSlots[slotIndex] && data.articleSlots[slotIndex].override) {
          data.overrideUrls.push(results[i].canonicalUrl);
          assignArticleProperties(data.articleSlots[slotIndex], results[i]);
          data.noArticlesFiller = true;
        }
      };

      for (var i = 0; i < results.length; i++) {
        _loop(i);
      } // Go back through the list and reset any that couldn't be found in elastic


      for (var i = 0; i < data.articleSlots.length; i++) {
        if (data.articleSlots[i].override && !data.articleSlots[i].primaryHeadline) {
          data.articleSlots[i].overrideUrl = '';
          data.articleSlots[i].overrideHeadline = '';
        }
      }
    });
  } else {
    return Promise.resolve();
  }
}
/**
 * sanitize title and teasers
 * @param  {object} data
 */


function sanitizeInputs(data) {
  if (has(data.title)) {
    data.title = sanitize.toSmartText(data.title || '');
  }

  if (has(data.teaser)) {
    data.teaser = sanitize.toSmartText(stripHeadlineTags(data.teaser));
  }
}

function shouldComponentBeDisplayed(_ref) {
  var endDate = _ref.endDate,
      startDate = _ref.startDate;
  var today = new Date(),
      end = endOfDay(endDate);

  if (startDate && endDate) {
    return isWithinRange(today, startDate, end);
  }

  return !startDate && !endDate || startDate && isPast(startDate) || endDate && isFuture(end);
}

function validateDateRange(data) {
  var isEndDateBefore = data.startDate && data.endDate ? !isBefore(data.startDate, data.endDate) : false;

  if (isEndDateBefore) {
    data.isPrior = true;
  }

  return !isEndDateBefore;
}

module.exports.save = function (ref, data, locals) {
  var overrideUrls = [];
  sanitizeInputs(data);
  data.noArticlesFiller = false;
  convertTagsLowercase(data);

  if (data.articleSlots.length) {
    // Retrieve all override URLs and reset saved articles
    for (var i = 0; i < data.articleSlots.length; i++) {
      if (data.articleSlots[i].override && data.articleSlots[i].overrideUrl && !overrideUrls.includes(data.articleSlots[i].overrideUrl)) {
        // allow component to find articles when user enter a https url, since elastic is indexed with http ( at the moment )
        data.articleSlots[i].overrideUrl = data.articleSlots[i].overrideUrl.replace('https://', 'http://');
        overrideUrls.push(data.articleSlots[i].overrideUrl);
        data.articleSlots[i].overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.articleSlots[i].overrideHeadline));
      } else {
        data.articleSlots[i].overrideUrl = '';
        data.articleSlots[i].overrideHeadline = '';
      }

      assignArticleProperties(data.articleSlots[i]);
    }

    return setOverrideArticles(data, overrideUrls, locals).then(function () {
      data.cuneiformQuery = buildCuneiformQuery(data, locals);
      data.cuneiformScopes = getScopes(data.scopes);
      return data;
    }).catch(function (err) {
      log('error', "Error saving articles for ".concat(ref), {
        error: err.message
      });
      return data;
    });
  }

  return data;
};

module.exports.render = function (ref, data) {
  data.displaySelf = null;
  data.isPrior = false;

  if (!data.active) {
    data.startDate = '';
    data.endDate = '';
    return data;
  }

  if (validateDateRange(data)) data.displaySelf = shouldComponentBeDisplayed(data) || null;

  if (data.cuneiformResults && data.overrideUrls) {
    data.minimumArticlesPublished = Object.keys(data.cuneiformResults).length + Object.keys(data.overrideUrls).length >= 3;
  }

  return data;
};

}).call(this,"/components/collection-package/model.js")}, {"37":37,"39":39,"42":42,"43":43,"49":49,"79":79,"81":81,"82":82,"83":83,"84":84,"85":85,"86":86}];
window.modules["collection-silo.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _findIndex = require(79),
    _map = require(37),
    queryService = require(49),
    sanitize = require(39),
    callout = require(80),
    publishedArticlesIndex = 'published-articles',
    fields = ['primaryHeadline', 'canonicalUrl', 'feedImgUrl', 'tags', 'authors', 'siloImgUrl', 'shortHeadline', 'teaser', 'rubric', 'featureTypes'],
    ASSIGN_ARTICLE_FIELDS = ['canonicalUrl', 'siloImgUrl', 'primaryHeadline', 'authors', 'shortHeadline', 'teaser', 'rubric'];
/**
 * Restrict the query by site depending on the behavior selected
 * @param {object} query
 * @param {object} data
 * @param {string} site
 */


function setSite(query, data, site) {
  if (!data.site || !site) {
    return;
  }

  switch (data.site) {
    case 'current':
      queryService.withinThisSiteAndCrossposts(query, site);
      break;

    case 'domain':
      queryService.onlyWithinThisDomain(query, site);
      break;

    case 'other':
      if (data.siteSlug) {
        queryService.onlyWithinThisSite(query, {
          slug: data.siteSlug
        });
      }

      break;

    default:
      break;
  }
}
/**
* Build the search query used by cuneiform
* @param {Object} data
* @param {Object} locals
* @return {Promise}
*/


function buildSearchQuery(data, locals) {
  var tags = data.tags || [],
      query = queryService.newCuneiformQuery(publishedArticlesIndex),
      site = _get(locals, 'site', {}),
      numSlotsOpen = data.articleSlots.length - data.overrideUrls.length;

  queryService.addSize(query, numSlotsOpen);
  queryService.onlyWithTheseFields(query, fields);
  setSite(query, data, site);

  if (tags.length) {
    tags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, tags.length);
  }

  queryService.addSort(query, {
    date: 'desc'
  });

  if (data.overrideUrls.length > 0) {
    data.overrideUrls.forEach(function (url) {
      queryService.addMustNot(query, {
        term: {
          canonicalUrl: url
        }
      });
    });
  }

  return query;
}

function setHeadline(data) {
  data.cuneiformResults.forEach(function (article) {
    article.headline = article[data.headlineSelected];
  });
}
/**
 * Given an article search result, assign required properties to an article slot.
 * When the article doesn't exist, article slot properties are reset.
 * @param {Object} data
 * @param {Object} articleSlot
 * @param {Object} article
 */


function assignArticleProperties(data, articleSlot, article) {
  ASSIGN_ARTICLE_FIELDS.forEach(function (field) {
    return articleSlot[field] = article ? article[field] : '';
  });
  articleSlot.headline = article ? article[data.headlineSelected] : '';
  articleSlot.callout = article ? callout(article) : '';
}
/**
 * Get and save article details for all overridden slots.
 * Also stores a final list of override urls on the component data.
 * @param {object} data
 * @param {array} overrideUrls
 * @param {object} locals
 * @returns {Promise}
 */


function setOverrideArticles(data, overrideUrls, locals) {
  var query = queryService(publishedArticlesIndex, locals);
  data.overrideUrls = [];

  if (overrideUrls.length) {
    queryService.addFilter(query, {
      terms: {
        canonicalUrl: overrideUrls
      }
    });
    queryService.onlyWithTheseFields(query, fields);
    return queryService.searchByQuery(query).then(function (stories) {
      var slotIndex; // assign results to the correct article slot

      stories.forEach(function (story, index) {
        slotIndex = _findIndex(data.articleSlots, function (s) {
          return s.overrideUrl === stories[index].canonicalUrl;
        });

        if (slotIndex >= 0 && data.articleSlots[slotIndex] && data.articleSlots[slotIndex].override) {
          data.overrideUrls.push(story.canonicalUrl);
          assignArticleProperties(data, data.articleSlots[slotIndex], story);
          data.articlesFound = true;
        }
      }); // reset any that couldn't be found

      data.articleSlots.forEach(function (article) {
        if (article.override && !article.primaryHeadline) {
          article.overrideUrl = '';
        }
      });
    });
  } else {
    return Promise.resolve();
  }
}
/**
 * Transform user-entered scope list to a flat array of strings for cuneiform
 * @param {array} scopes
 * @returns {array}
 */


function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  }

  return [];
}

module.exports.save = function (ref, data, locals) {
  var overrideUrls = []; // title text

  data.title = sanitize.toSmartText(data.title || ''); // start true until we know we have empty article slots

  data.articlesFound = true; // retrieve all override urls, and reset all article slots

  if (data.articleSlots && data.articleSlots.length) {
    data.articlesFound = false;
    data.articleSlots.forEach(function (article) {
      if (article.override && article.overrideUrl && !overrideUrls.includes(article.overrideUrl)) {
        // allow component to find articles when user enter a https url, since elastic is indexed with http ( at the moment )
        article.overrideUrl = article.overrideUrl.replace('https://', 'http://');
        overrideUrls.push(article.overrideUrl);
      } else {
        article.overrideUrl = '';
      }

      assignArticleProperties(data, article);
    });
  }

  return setOverrideArticles(data, overrideUrls, locals).then(function () {
    data.cuneiformQuery = buildSearchQuery(data, locals);
    data.cuneiformScopes = getScopes(data.scopes);

    if (data.cuneiformResults) {
      setHeadline(data);
    }

    return data;
  }).catch(function (err) {
    queryService.logCatch(err, ref);
    return data;
  });
};
}, {"32":32,"37":37,"39":39,"49":49,"79":79,"80":80}];
window.modules["collection-simple.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _findIndex = require(79),
    _map = require(37),
    striptags = require(42),
    sanitize = require(39),
    INDEX = 'published-articles',
    FIELDS = ['authors', 'canonicalUrl', 'featureTypes', 'feedImgUrl', 'primaryHeadline', 'shortHeadline', 'pageUri', 'tags'],
    ASSIGN_ARTICLE_FIELDS = ['canonicalUrl', 'siloImgUrl', 'primaryHeadline', 'authors', 'shortHeadline'],
    log = require(81).setup({
  file: __filename,
  component: 'collection-articles-lede'
}),
    queryService = require(49),
    styles = require(44),
    utils = require(43);
/**
 * Restrict the query by site depending on the behavior selected
 * @param {object} query
 * @param {object} data
 * @param {string} site
 */


function setSite(query, data, site) {
  if (!data.site || !site) {
    return;
  }

  switch (data.site) {
    case 'current':
      queryService.withinThisSiteAndCrossposts(query, site);
      break;

    case 'domain':
      queryService.onlyWithinThisDomain(query, site);
      break;

    case 'other':
      if (data.siteSlug) {
        queryService.onlyWithinThisSite(query, {
          slug: data.siteSlug
        });
      }

      break;

    default:
      break;
  }
}
/**
 * Convert include and exclude tags to lowercase
 * @param {object} data
 */


function convertTagsLowercase(data) {
  if (data.includeTags) {
    data.includeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }

  if (data.excludeTags) {
    data.excludeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }
}
/**
 * only allow emphasis, italic, and strikethroughs in headlines
 * @param  {string} oldHeadline
 * @returns {string}
 */


function stripHeadlineTags(oldHeadline) {
  var newHeadline = striptags(oldHeadline || '', ['em', 'i', 'strike', 's']);
  return newHeadline;
}
/**
 * Build up the search query used to populate article slots.
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildCuneiformQuery(data, locals) {
  var query = queryService.newCuneiformQuery(INDEX),
      numSlotsOpen = data.articleSlots.length - data.overrideUrls.length;
  queryService.addMust(query, {
    term: {
      'feeds.newsfeed': true
    }
  });

  if (locals && locals.site) {
    setSite(query, data, locals.site);
  }

  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, numSlotsOpen);

  if (data.includeTags && data.includeTags.length > 0) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, data.matchAllIncludeTags ? data.includeTags.length : 1);
  }

  if (data.excludeTags && data.excludeTags.length > 0) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
    });
  }

  if (data.overrideUrls.length > 0) {
    data.overrideUrls.forEach(function (url) {
      queryService.addMustNot(query, {
        term: {
          canonicalUrl: url
        }
      });
    });
  }

  return query;
}

function processSass(data, ref) {
  var hasCss = utils.has(data.css),
      hasSass = utils.has(data.sass);

  if (hasSass) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return;
    });
  } // reset per-instance styling


  if (!hasSass && hasCss) {
    data.css = '';
    return;
  }

  return;
}
/**
 * Get and save article details for all overridden slots.
 * Also stores a final list of override urls on the component data.
 * @param {object} data
 * @param {array} overrideUrls
 * @param {object} locals
 * @returns {Promise}
 */


function queryOverrides(data, overrideUrls, locals) {
  var overrideQuery = queryService(INDEX, locals);
  data.overrideUrls = [];

  if (overrideUrls.length) {
    // Find articles with given URLs and assign to correct slot
    queryService.addFilter(overrideQuery, {
      terms: {
        canonicalUrl: overrideUrls
      }
    });
    queryService.onlyWithTheseFields(overrideQuery, FIELDS);
    return queryService.searchByQuery(overrideQuery).then(function (results) {
      var slotIndex; // Assign returned articles to the correct slot

      var _loop = function _loop(i) {
        slotIndex = _findIndex(data.articleSlots, function (s) {
          return s.overrideUrl === results[i].canonicalUrl;
        });

        if (slotIndex >= 0 && data.articleSlots[slotIndex] && data.articleSlots[slotIndex].override) {
          data.overrideUrls.push(results[i].canonicalUrl);
          assignArticleProperties(data, data.articleSlots[slotIndex], results[i]);
        }
      };

      for (var i = 0; i < results.length; i++) {
        _loop(i);
      } // Go back through the list and reset any that couldn't be found in elastic


      for (var i = 0; i < data.articleSlots.length; i++) {
        if (data.articleSlots[i].override && !data.articleSlots[i].primaryHeadline) {
          data.articleSlots[i].overrideUrl = '';
          data.articleSlots[i].overrideHeadline = '';
        }
      }

      data.noArticlesFiller = true;
    });
  } else {
    return Promise.resolve();
  }
}

function setHeadline(data) {
  data.cuneiformResults.forEach(function (article) {
    article.headline = article[data.headlineSelected];
  });
}
/**
 * Given an article search result, assign required properties to an article slot.
 * When the article doesn't exist, article slot properties are reset.
 * @param {object} data
 * @param {object} articleSlot
 * @param {object} article
 */


function assignArticleProperties(data, articleSlot, article) {
  ASSIGN_ARTICLE_FIELDS.forEach(function (field) {
    return articleSlot[field] = article ? article[field] : '';
  });
  articleSlot.headline = article ? article[data.headlineSelected] : '';
}
/**
 * Transform user-entered scope list to a flat array of strings for cuneiform
 * @param {array} scopes
 * @returns {array}
 */


function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  } else {
    return [];
  }
}

module.exports.save = function (ref, data, locals) {
  var overrideUrls = [];
  convertTagsLowercase(data);
  data.title = sanitize.toSmartText(data.title || '');
  data.noArticlesFiller = false;

  if (data.articleSlots && data.articleSlots.length) {
    // Retrieve all override URLs and reset saved articles
    for (var i = 0; i < data.articleSlots.length; i++) {
      if (data.articleSlots[i].override && data.articleSlots[i].overrideUrl && !overrideUrls.includes(data.articleSlots[i].overrideUrl)) {
        // allow component to find articles when user enter a https url, since elastic is indexed with http ( at the moment )
        data.articleSlots[i].overrideUrl = data.articleSlots[i].overrideUrl.replace('https://', 'http://');
        overrideUrls.push(data.articleSlots[i].overrideUrl);
        data.articleSlots[i].overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.articleSlots[i].overrideHeadline));
      } else {
        data.articleSlots[i].overrideUrl = '';
        data.articleSlots[i].overrideHeadline = '';
      }

      assignArticleProperties(data, data.articleSlots[i]);
    }

    return queryOverrides(data, overrideUrls, locals).then(processSass(data, ref)).then(function () {
      data.cuneiformQuery = buildCuneiformQuery(data, locals);
      data.cuneiformScopes = getScopes(data.scopes);

      if (data.cuneiformResults) {
        setHeadline(data);
      }

      return data;
    }).catch(function (err) {
      log('error', "Error saving articles for ".concat(ref), {
        error: err.message
      });
      return data;
    });
  }

  return Promise.resolve(data);
};

}).call(this,"/components/collection-simple/model.js")}, {"37":37,"39":39,"42":42,"43":43,"44":44,"49":49,"79":79,"81":81}];
window.modules["collection-videos.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _findIndex = require(79),
    _map = require(37),
    _get = require(32),
    queryService = require(49),
    _require = require(43),
    has = _require.has,
    striptags = require(42),
    db = require(69),
    sanitize = require(39),
    log = require(81).setup({
  file: __filename,
  component: 'collection-videos'
}),
    INDEX = 'original-videos-all',
    FIELDS = ['canonicalUrl', 'shortHeadline', 'primaryHeadline', 'feedImgUrl', 'authors', 'pageUri', 'videoId'];
/**
 * Restrict the query by site depending on the behavior selected
 * @param {object} query
 * @param {object} data
 * @param {string} site
 */


function setSite(query, data, site) {
  if (!data.site || !site) {
    return;
  }

  switch (data.site) {
    case 'current':
      queryService.withinThisSiteAndCrossposts(query, site);
      break;

    case 'domain':
      queryService.onlyWithinThisDomain(query, site);
      break;

    case 'other':
      if (data.siteSlug) {
        queryService.onlyWithinThisSite(query, {
          slug: data.siteSlug
        });
      }

      break;

    default:
      break;
  }
}
/**
 * Convert include and exclude tags to lowercase
 * @param {object} data
 */


function convertTagsLowercase(data) {
  if (data.includeTags) {
    data.includeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }

  if (data.excludeTags) {
    data.excludeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }
}
/**
 * only allow emphasis, italic, and strikethroughs in headlines
 * @param  {string} oldHeadline
 * @returns {string}
 */


function stripHeadlineTags(oldHeadline) {
  var newHeadline = striptags(oldHeadline || '', ['em', 'i', 'strike', 's']);
  return newHeadline;
}
/**
 * Build up the search query used to populate article slots.
 * This will be stored in the component's data and used by cuneiform.
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildSearchQuery(data, locals) {
  var query = queryService.newCuneiformQuery(INDEX),
      numSlotsOpen = data.articleSlots.length - data.overrideUrls.length;
  queryService.addMust(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, numSlotsOpen);

  if (locals && locals.site) {
    setSite(query, data, locals.site);
  }

  if (data.includeTags && data.includeTags.length) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, data.matchAllIncludeTags ? data.includeTags.length : 1);
  }

  if (data.excludeTags && data.excludeTags.length) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
    });
  }

  if (data.overrideUrls.length) {
    data.overrideUrls.forEach(function (url) {
      queryService.addMustNot(query, {
        term: {
          canonicalUrl: url
        }
      });
    });
  }

  return query;
}
/**
 * Given an article search result, assign required properties to an article slot.
 * When the article doesn't exist, article slot properties are reset.
 * @param {object} data
 * @param {object} articleSlot
 * @param {object} article
 */


function assignArticleProperties(data, articleSlot, article) {
  FIELDS.forEach(function (field) {
    return articleSlot[field] = article ? article[field] : '';
  });
  articleSlot.headline = article ? article[data.headlineSelected] : '';
}
/**
 * Transform user-entered scope list to a flat array of strings for cuneiform
 * @param {array} scopes
 * @returns {array}
 */


function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  }

  return [];
}
/**
 * Get and save article details for all overridden slots.
 * Also stores a final list of override urls on the component data.
 * @param {object} data
 * @param {array} overrideUrls
 * @param {object} locals
 * @returns {Promise}
 */


function setOverrideArticles(data, overrideUrls, locals) {
  var overrideQuery = queryService(INDEX, locals);
  data.overrideUrls = [];

  if (overrideUrls.length) {
    queryService.addFilter(overrideQuery, {
      terms: {
        canonicalUrl: overrideUrls
      }
    });
    queryService.onlyWithTheseFields(overrideQuery, FIELDS);
    return queryService.searchByQuery(overrideQuery).then(function (results) {
      var slotIndex; // Assign returned articles to the correct slot

      var _loop = function _loop(i) {
        slotIndex = _findIndex(data.articleSlots, function (s) {
          return s.overrideUrl === results[i].canonicalUrl;
        });

        if (slotIndex >= 0 && data.articleSlots[slotIndex] && data.articleSlots[slotIndex].override) {
          data.overrideUrls.push(results[i].canonicalUrl);
          assignArticleProperties(data, data.articleSlots[slotIndex], results[i]);
          data.noArticlesFiller = true;
        }
      };

      for (var i = 0; i < results.length; i++) {
        _loop(i);
      } // Go back through the list and reset any that couldn't be found in elastic


      for (var i = 0; i < data.articleSlots.length; i++) {
        if (data.articleSlots[i].override && !data.articleSlots[i].primaryHeadline) {
          data.articleSlots[i].overrideUrl = '';
          data.articleSlots[i].overrideHeadline = '';
        }
      }

      return data;
    });
  } else {
    return Promise.resolve(data);
  }
}

function setHeadline(data) {
  data.cuneiformResults.forEach(function (article) {
    article.headline = article[data.headlineSelected];
  });
}
/**
 * Set the videoId for component when is updated
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


function setVideoId(data, locals) {
  var videoRef = data.contentVideo ? data.contentVideo._ref : '';

  if (videoRef) {
    return db.get(videoRef, locals).then(function (contentVideoData) {
      if (contentVideoData.videoId !== data.articleVideoId) {
        var newData = Object.assign(contentVideoData, {
          videoId: data.articleVideoId
        });
        return db.put(videoRef, newData, locals).then(function () {
          return data;
        });
      }
    });
  }

  return Promise.resolve(data);
}
/**
 * Save article data and retrieve any overridden articles
 * @param {string} ref
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


module.exports.save = function (ref, data, locals) {
  var overrideUrls = [],
      cuneiformVideoId = has(data.cuneiformResults) ? data.cuneiformResults[0].videoId : '';
  data.noArticlesFiller = false;
  convertTagsLowercase(data);

  if (data.articleSlots && data.articleSlots.length) {
    // Retrieve all override URLs and reset saved articles
    for (var i = 0; i < data.articleSlots.length; i++) {
      if (data.articleSlots[i].override && data.articleSlots[i].overrideUrl && !overrideUrls.includes(data.articleSlots[i].overrideUrl)) {
        data.articleSlots[i].overrideUrl = data.articleSlots[i].overrideUrl.replace('https://', 'http://');
        overrideUrls.push(data.articleSlots[i].overrideUrl);
        data.articleSlots[i].overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.articleSlots[i].overrideHeadline) || '');
      } else {
        data.articleSlots[i].overrideUrl = '';
        data.articleSlots[i].overrideHeadline = '';
      }

      assignArticleProperties(data, data.articleSlots[i]);
    }

    return setOverrideArticles(data, overrideUrls, locals).then(function () {
      var firstOverrideArticle = _get(data, 'articleSlots[0].videoId');

      data.cuneiformQuery = buildSearchQuery(data, locals);
      data.cuneiformScopes = getScopes(data.scopes);
      data.articleVideoId = firstOverrideArticle || cuneiformVideoId;
      data.customPlay = true;

      if (data.cuneiformResults) {
        setHeadline(data);
      }

      return setVideoId(data, locals).then(function () {
        return data;
      });
    }).catch(function (err) {
      log('error', "Error saving articles for ".concat(ref), {
        error: err.message
      });
      return data;
    });
  }

  return Promise.resolve(data);
};

}).call(this,"/components/collection-videos/model.js")}, {"32":32,"37":37,"39":39,"42":42,"43":43,"49":49,"69":69,"79":79,"81":81}];
window.modules["column-container-item.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  data.heading = sanitize.toSmartText(striptags(data.heading, ['strike', 'em', 'a', 'span'])); // compile styles if they're not empty

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"39":39,"42":42,"43":43,"44":44}];
window.modules["column-container.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  data.cta = sanitize.toSmartText(striptags(data.cta, ['strong', 'em', 'span'])); // compile styles if they're not empty

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"39":39,"42":42,"43":43,"44":44}];
window.modules["complex-dropdown.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    purify = require(90),
    styles = require(44);
/**
 * Return the first svg element in an html string
 * @param {string} content
 * @returns {string}
 */


function filterNonSVG(content) {
  var openingTag = content.match('<svg'),
      closingTag = content.match('</svg>');
  if (!openingTag) return '';
  return content.substring(openingTag.index, closingTag && closingTag.index + '</svg>'.length || content.length);
}
/**
 * Set SASS from CSS.
 * @param {object} ref
 * @param {object} data
 * @returns {object}
 */


function setSass(ref, data) {
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
    return Promise.resolve(data);
  }
}

module.exports.save = function (ref, data) {
  if (!utils.isFieldEmpty(data.indicatorSvg)) {
    data.indicatorSvg = filterNonSVG(purify(data.indicatorSvg.trim()));
  }

  return setSass(ref, data);
};
}, {"43":43,"44":44,"90":90}];
window.modules["congress-graphic-2018.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  // passthrough to enable client-side re-rendering
  // todo: remove this file once all of the server.js files are converted to model.js
  return data;
};
}, {}];
window.modules["congress-prediction.model"] = [function(require,module,exports){'use strict';

var states = require(91),
    utils = require(43),
    styles = require(44);
/* eslint complexity: ["error", 9] */


module.exports.save = function (ref, data) {
  var stateList, i, stateName, stateNameLower;
  data.demStates = [];
  data.gopStates = [];
  data.tossupStates = [];
  data.indStates = [];

  if (data.predictionType === 'states') {
    stateList = states.statesToArray();

    for (i = 0; i < stateList.length; i++) {
      stateName = stateList[i];
      stateNameLower = stateList[i].toLowerCase().split(' ').join('');

      if (data[stateNameLower]) {
        switch (data[stateNameLower]) {
          case 'democrat':
            data.demStates.push(stateName);
            break;

          case 'republican':
            data.gopStates.push(stateName);
            break;

          case 'independent':
            data.indStates.push(stateName);
            break;

          case 'tossup':
            data.tossupStates.push(stateName);
            break;

          default:
            break;
        }
      }
    }
  }

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
    return Promise.resolve(data);
  }
};
}, {"43":43,"44":44,"91":91}];
window.modules["contact-form.model"] = [function(require,module,exports){(function (process){
'use strict';

module.exports.render = function (ref, data) {
  data.formEndpoint = window.process.env.CLAY_CONTACT_FORM_ENDPOINT;
  return data;
};

}).call(this,require(22))}, {"22":22}];
window.modules["container-grid.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
  }

  return data;
};
}, {"43":43,"44":44}];
window.modules["container-lede-sidebar.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
  }

  return data;
};
}, {"43":43,"44":44}];
window.modules["container-rail.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  var mainCount = data.main && data.main.length || 1; // Constrain rail width to whole integers within the page size (0 - 1180)

  if (data.railWidth) {
    data.railWidth = parseInt(data.railWidth, 10);

    if (isNaN(data.railWidth)) {
      delete data.railWidth;
    } else {
      data.railWidth = Math.min(Math.max(Math.round(data.railWidth), 0), 1180);
    }
  } // Constrain partial rail indices to a range from 1 to the number of components in main


  if (data.partialRail) {
    data.partialStartIndex = Math.min(Math.max(data.partialStartIndex, 1), mainCount);
    data.partialEndIndex = Math.max(Math.min(data.partialEndIndex, mainCount), data.partialStartIndex);
  } else {
    data.partialStartIndex = 1;
    data.partialEndIndex = 1;
  } // Compile styles


  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
  }

  return data;
};
}, {"43":43,"44":44}];
window.modules["content-feed-article.model"] = [function(require,module,exports){'use strict';

var _findIndex = require(79),
    articleVariationsByContentLength = [[], ['lede'], ['lede', 'large'], ['lede', 'small', 'large'], ['lede', 'small', 'small', 'small'], ['lede', 'medium', 'small', 'small', 'large'], ['lede', 'medium', 'medium', 'large', 'small', 'large']];

var cuneiformCmpt = require(95);

function getDynamicFeedImg(data) {
  if (!(data.displayVariation && data.article && data.article.feedImgUrl)) {
    return undefined;
  }

  return {
    url: data.article.feedImgUrl,
    mobile: "content-feed-article-".concat(data.displayVariation, "-small"),
    tablet: "content-feed-article-".concat(data.displayVariation, "-medium"),
    desktop: "content-feed-article-".concat(data.displayVariation, "-large")
  };
}

function getDisplayVariation(ref, data) {
  var parentContent = data.parentContent || [],
      articleVariations = articleVariationsByContentLength[parentContent.length],
      refIndex = _findIndex(parentContent, ['_ref', ref]);

  if (refIndex > -1 && articleVariations.length) {
    return articleVariations[refIndex];
  }
}

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals); // data.parentContent is provided by a parent `content-feed` component
  // through pub-sub client-side

  if (data.parentContent) {
    data.displayVariation = getDisplayVariation(ref, data);
    delete data.parentContent;
  }

  data.article = data.cuneiformResults ? data.cuneiformResults[0] : data.article;
  data.dynamicFeedImg = getDynamicFeedImg(data);
  return data;
};

module.exports.render = cuneiformCmpt.render;
}, {"79":79,"95":95}];
window.modules["content-feed.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  data.content = data.content || []; // data.content's component list should only contain as many components as the longest articleVariationsByContentLength array
  // If more, its okay just to drop them.

  data.content = data.content.slice(0, 6);
  return data;
};
}, {}];
window.modules["context-card.model"] = [function(require,module,exports){'use strict';

var striptags = require(42),
    utils = require(43),
    sanitize = require(39);

module.exports.save = function (uri, data) {
  if (utils.has(data.headline)) {
    data.headline = sanitize.toSmartText(striptags(data.headline, ['em']));
  }

  if (utils.has(data.subheadline)) {
    data.subheadline = sanitize.toSmartText(striptags(data.subheadline, ['em']));
  }

  return data;
};
}, {"39":39,"42":42,"43":43}];
window.modules["coral-talk.model"] = [function(require,module,exports){(function (process){
'use strict';

module.exports.render = function (ref, data, locals) {
  var site = locals.site;
  data.CORAL_TALK_HOST = "".concat(site.host).concat(window.process.env.TALK_PATH);
  return data;
};

}).call(this,require(22))}, {"22":22}];
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
window.modules["curated-feed.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _get = require(32),
    _sortBy = require(102),
    _includes = require(33),
    DomParser = require(100),
    domParser = new DomParser(),
    recircCmpt = require(103),
    mediaplayService = require(53),
    sanitize = require(39),
    _require = require(101),
    getEmbedHTMLForTweet = _require.getEmbedHTMLForTweet,
    getCleanTweetUrl = _require.getCleanTweetUrl,
    getUsernameFromTweetUrl = _require.getUsernameFromTweetUrl,
    parsers = require(99),
    orderCuratedItemsByDateDesc = function orderCuratedItemsByDateDesc(items) {
  return _sortBy(items || [], ['date']).reverse();
},
    ELASTIC_FIELDS = ['date', 'primaryHeadline', 'feedImgUrl', 'pageUri', 'byline'],
    CONTENT_CHANNEL_SANITIZED_NAMES = {
  'Politics-Domestic': 'Politics',
  'Politics-International': 'International',
  'Internet-Culture': 'The Internet',
  'Products-Apps-Software': 'Software',
  'Products-Consumer-Electronics': 'Gadgets',
  'Tech-Industry': 'Technology',
  'Tech-Society': 'Technology'
};
/**
 * 
 * @param {string[]} tags 
 * @returns {string}
 */


function getArticlePresentationByTags(tags) {
  if (_includes(tags, 'top story')) {
    return 'feature';
  }

  return 'small';
}
/**
 * 
 * @param {object} article 
 * @param {string[]} secondaryRubricTags
 * @returns {string}
 */


function getArticleSecondaryRubric(article, secondaryRubricTags) {
  var tags = article.tags,
      contentChannel = article.contentChannel,
      sanitizedContentChannel = _get(CONTENT_CHANNEL_SANITIZED_NAMES, contentChannel, contentChannel);

  for (var i = 0; i < secondaryRubricTags.length; i++) {
    if (_includes(tags, secondaryRubricTags[i])) {
      return secondaryRubricTags[i];
    }
  }

  return sanitizedContentChannel ? sanitizedContentChannel.replace('-', ' ') : '';
}
/**
 * 
 * @param {object} curatedItem 
 * @param {string} ref 
 * @param {object} locals 
 * @returns {Promise<object>}
 */


function expandRelatedLink(curatedItem, ref, locals) {
  if (!curatedItem.relatedLink) {
    return Promise.resolve(curatedItem);
  } else {
    var request = {
      url: curatedItem.relatedLink
    };
    return recircCmpt.getArticleDataAndValidate(ref, request, locals, ELASTIC_FIELDS).then(function (res) {
      var feedImgUrl = res.feedImgUrl,
          byline = res.byline,
          primaryHeadline = res.primaryHeadline,
          date = res.date;
      curatedItem.relatedDate = new Date(date).toISOString();
      curatedItem.relatedFeedImgUrl = mediaplayService.getRendition(mediaplayService.cleanUrl(feedImgUrl), 'square-small');
      curatedItem.relatedByline = byline;
      curatedItem.relatedHeadline = primaryHeadline;
      return curatedItem;
    }).catch(function () {
      return curatedItem;
    });
  }
}

function sanitizeFields(item) {
  item.remark = sanitize.validateTagContent(sanitize.toSmartText(item.remark || ''));
  item.quickChat = sanitize.validateTagContent(sanitize.toSmartText(item.quickChat || ''));
  item.quote = sanitize.validateTagContent(sanitize.toSmartText(item.quote || ''));
  item.attribution = sanitize.validateTagContent(sanitize.toSmartText(item.attribution || ''));
  item.relatedLinkRemark = sanitize.validateTagContent(sanitize.toSmartText(item.relatedLinkRemark || ''));
  return item;
}
/**
 * Post process curated items to include any additional information
 * that might need to be attached including:
 * 
 * 1. Related Links elements need to be expanded so that they include
 *    enough information about the actual article so that they can
 *    be rendered properly
 * 2. Retrieve mediaplay image metadata for Image type curated items
 * 3. Retrive twitter contents for Tweet type curated items
 * 4. All items need to be sanitized for empty tag content, and usage
 *    of smart quotes and other special typographic characters.
 * 
 * @param {object} curatedItem 
 * @param {string} ref 
 * @param {object} locals 
 * @returns {Promise<object>}
 */


function decorateCuratedItem(curatedItem, ref, locals) {
  return expandRelatedLink(curatedItem, ref, locals).then(function (item) {
    sanitizeFields(item);

    if (item.type === 'image') {
      return decorateImageItem(item);
    } else if (item.type === 'tweet') {
      return decorateTweetItem(item);
    }

    return item;
  });
}
/**
 * Retrieve mediaplay image metadata for Image type curated items
 * 
 * @param {object} item 
 * @returns {Promise<object>}
 */


function decorateImageItem(item) {
  var imageUrl = item.imageUrl;

  if (!imageUrl) {
    delete item.imageCredit;
    delete item.imageType;
    delete item.dynamicImage;
    /* @todo decide on a warning log here */

    return item;
  }

  return mediaplayService.getMediaplayMetadata(imageUrl).catch(function () {
    return {};
  }).then(function (metadata) {
    item.imageCredit = metadata.credit;
    item.imageType = metadata.imageType;
    item.dynamicImage = {
      url: imageUrl,
      mobile: 'curated-feed-image-post',
      tablet: 'curated-feed-image-post',
      desktop: 'curated-feed-image-post'
    };
    return item;
  });
}

function cleanupTweetItem(item) {
  delete item.quote;
  delete item.link;
  delete item.attribution;
  delete item.tweetValid;
  delete item.tweetRetrieved;
}
/**
 * Retrieve Twitter metadata for Tweet type curated items
 * 
 * @param {object} item 
 * @returns {Promise<object>}
 */


function decorateTweetItem(item) {
  var tweetValid = item.tweetValid,
      tweetUrl = item.tweetUrl,
      tweetRetrieved = item.tweetRetrieved;

  if (!tweetUrl) {
    // We don't have a tweet url, possibly because it was deleted
    cleanupTweetItem(item);
    return item;
  } else if (tweetValid && tweetRetrieved === tweetUrl) {
    // We already got this tweet
    return item;
  }

  return getEmbedHTMLForTweet(tweetUrl, true, true).then(function (tweetEmbedHTML) {
    var tweetEmbedDom = domParser.parseFromString(tweetEmbedHTML),
        paragraphs = tweetEmbedDom.getElementsByTagName('p');
    item.quote = paragraphs.length ? paragraphs[0].innerHTML : '';
    item.link = getCleanTweetUrl(tweetUrl);
    item.attribution = '@' + getUsernameFromTweetUrl(tweetUrl);
    item.tweetValid = true;
    item.tweetRetrieved = tweetUrl;
    return item;
  }).catch(function () {
    cleanupTweetItem(item);
    return item;
  });
}
/**
 * Post process whatever is coming out of the Published Articles
 * index so that it can be properly sorted and presented in
 * the template.
 * 
 * @param {object[]} articles 
 * @param {string[]} secondaryRubricTags
 * @returns {object[]}
 */


function processPublishedArticles(articles, secondaryRubricTags) {
  return articles.map(function (article) {
    var presentation = getArticlePresentationByTags(_get(article, 'tags', [])),
        secondaryRubric = getArticleSecondaryRubric(article, secondaryRubricTags);
    article.presentation = presentation;
    article.secondaryRubric = secondaryRubric;
    article.date = new Date(article.date).toISOString();
    article.dynamicImage = {
      url: article.feedImgUrl,
      mobile: presentation === 'feature' ? 'curated-feed-article-feature' : 'square',
      tablet: presentation === 'feature' ? 'curated-feed-article-feature' : 'square',
      desktop: presentation === 'feature' ? 'curated-feed-article-feature-large' : 'curated-feed-article-large'
    };
    return article;
  });
}
/**
 * Given a sorted list of article items and a sorted list of curated items
 * merge the two lists preserving the two sorts.
 * 
 * @param {object[]} articles 
 * @param {object[]} curated 
 * @returns {object[]}
 */


function combineArticlesAndFeed(articles, curated) {
  var feed = [],
      articleIndex = 0,
      curatedIndex = 0;

  while (articleIndex < articles.length && curatedIndex < curated.length) {
    var article = articles[articleIndex],
        curatedItem = curated[curatedIndex];

    if (new Date(article.date).toISOString() < new Date(curatedItem.date).toISOString()) {
      feed.push(curatedItem);
      curatedIndex++;
    } else {
      feed.push(article);
      articleIndex++;
    }
  }

  while (articleIndex < articles.length) {
    var _article = articles[articleIndex];
    feed.push(_article);
    articleIndex++;
  }

  while (curatedIndex < curated.length) {
    var _curatedItem = curated[curatedIndex];
    feed.push(_curatedItem);
    curatedIndex++;
  }

  return feed;
}

function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  } else {
    return [];
  }
}

module.exports.render = function (ref, data, locals) {
  var combinedFeed = data.combinedFeed,
      site = locals.site,
      edit = locals.edit,
      _ref = site || {},
      assetHost = _ref.assetHost;

  data.combinedFeed = (combinedFeed || []).map(function (item) {
    if (item.type && item.type === 'quick-chat') {
      var quickChat = (_get(item, 'quickChat') || '').trim(),
          parsedQuickChat = parsers.slack(quickChat.replace(/<br \/>/g, '\n')).map(function (chat) {
        var handle = chat.handle;
        chat.avatarUrl = "".concat(assetHost, "/media/components/curated-feed/").concat(handle, ".jpg");
        return chat;
      });
      item.parsedQuickChat = parsedQuickChat;
      item.autoCollapse = parsedQuickChat.reduce(function (accum, i) {
        accum += i.messageCount;
        return accum;
      }, 0) > 7;
    }

    if (edit && item.type && item.type === 'tweet') {
      if (!item.tweetUrl) {
        // We don't have any tweet data because there is no URL set
        item.quote = '[WARNING] No tweet URL set. This post will be hidden for readers.';
      } else if (!item.tweetValid) {
        // We were not able to retrieve data for a tweet URL successfully
        item.quote = '[WARNING] Tweet was not available. This post will be hidden for readers.';
      }
    }

    return item;
  });
  data.truncatedCombinedFeed = data.combinedFeed.slice(0, data.articleViewCutoff || 30);
  return data;
};

module.exports.save = function (ref, data, locals) {
  var curatedFeedItems = orderCuratedItemsByDateDesc(_get(data, 'curatedFeedItems', []).map(function (item) {
    item.date = item.date || new Date().toISOString();
    return item;
  })),
      secondaryRubricTags = (_get(data, 'secondaryRubricTags') || []).map(function (item) {
    return item.text;
  }),
      publishedArticles = processPublishedArticles(_get(data, 'cuneiformResults', []) || [], secondaryRubricTags);
  data.cuneiformScopes = getScopes(data.scopes); // these values are set in the template and in render, and can get accidentally saved through kiln
  // these values should never persist in data

  delete data.isOnArticlePage; // set in template

  delete data.feed; // set in template

  delete data.truncatedCombinedFeed; // set in render

  if (publishedArticles && publishedArticles.length > 0) {
    curatedFeedItems = curatedFeedItems.filter(function (curatedItem) {
      return new Date(curatedItem.date).toISOString() > new Date(publishedArticles[publishedArticles.length - 1].date).toISOString();
    });
  }
  /* @todo the curatedFeed could get kind of large (although most are directly resolved promises), maybe should use highland here? */


  return Promise.all(curatedFeedItems.map(function (item) {
    return decorateCuratedItem(item, ref, locals);
  })).then(function (decorated) {
    var combined = combineArticlesAndFeed(publishedArticles, decorated);
    data.curatedFeedItems = decorated;
    data.combinedFeed = combined;
    return data;
  });
};
}, {"32":32,"33":33,"37":37,"39":39,"53":53,"99":99,"100":100,"101":101,"102":102,"103":103}];
window.modules["cut-header.model"] = [function(require,module,exports){'use strict';

module.exports.render = function (ref, data, locals) {
  if (data.useSvgHeader && locals.params) {
    data.sectionKey = locals.params.name.replace('@published', '');
  }

  return data;
};
}, {}];
window.modules["cut-section-feed.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _get = require(32),
    _without = require(104),
    _includes = require(33),
    _head = require(25),
    queryService = require(49),
    INDEX = 'published-articles',
    FIELDS = ['primaryHeadline', 'authors', 'rubric', 'teaser', 'feedImgUrl', 'canonicalUrl', 'date', 'storyCharacteristics', 'tags', 'plaintextPrimaryHeadline', 'pageUri', 'byline'],
    getTopStory = function getTopStory(articles) {
  return articles.find(function (article) {
    return article.storyCharacteristics['top-story'];
  });
},
    ARTICLESPERGROUP = 10;

module.exports.save = function (ref, data) {
  if (!data.tags) {
    data.tags = _map(data.tagList, function (tag) {
      return {
        text: tag
      };
    });
  }

  return data;
};

module.exports.render = function (uri, data, locals) {
  var query = queryService(INDEX, locals),
      from = formatStart(parseInt(locals.start, 10));
  query.body = {
    size: data.size || 50,
    from: from
  };
  queryService.withinThisSiteAndCrossposts(query, locals.site);
  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addMust(query, {
    term: {
      'feeds.newsfeed': true
    }
  });

  if (data.tags && data.tags.length) {
    data.tags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, 1);
  } // exclude results that have specified tags


  if (data.excludeTags && data.excludeTags.length) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
    });
  }

  return getOverrideLede(data.ledeOverrideUrl, data.hideLede, locals.start).then(function (ledeArticle) {
    if (ledeArticle) {
      queryService.addMustNot(query, {
        match: {
          canonicalUrl: ledeArticle.canonicalUrl
        }
      });
    }

    return queryService.searchByQueryWithRawResult(query).then(function (results) {
      var articles = _map(_get(results, 'hits.hits'), '_source');

      if (!data.hideLede && !locals.start) {
        if (ledeArticle && ledeArticle !== '') {
          data.articles = articles;
          data.articles.unshift(ledeArticle);
          data.hasLede = true;
        } else {
          var topStory = getTopStory(articles);

          if (topStory) {
            data.articles = _without(articles, topStory);
            data.articles.unshift(topStory);
            data.hasLede = true;
          } else {
            data.articles = articles;
            data.hasLede = false;
          }
        }
      } else {
        data.articles = articles;
        data.hasLede = false;
      }

      data.articles = markCallouts(data.articles);
      data.total = _get(results, 'hits.total');
      data.articlesPerGroup = ARTICLESPERGROUP;
      data.from = from;
      data.start = from + (data.size || 50);
      return data;
    });
  });
};
/**
 * getOverrideLede
 *
 * @param {string} overrideLede the url of the override lede article
 * @param {boolean} ledeHidden
 * @param {number} start pagination start position (if > 0, we dont show a lede)
 * @returns {Promise} the overrideLede article data or an empty promise
 */


function getOverrideLede(overrideLede, ledeHidden, start) {
  if (overrideLede && !ledeHidden && !start) {
    var query = queryService.newQueryWithCount(INDEX);
    queryService.addFilter(query, {
      term: {
        canonicalUrl: overrideLede
      }
    });
    return queryService.searchByQuery(query).then(function (result) {
      return _head(result);
    });
  }

  return Promise.resolve('');
}
/**
 * formatStart
 *
 * @param {int} n
 * @returns {int}
 */


function formatStart(n) {
  var min = 0,
      max = 100000000;

  if (typeof n === 'undefined' || Number.isNaN(n) || n < min || n > max) {
    return 0;
  } else {
    return n;
  }
}
/**
 * markCallouts
 *
 * @param {array} articles array of articles to be displayed
 * @returns {array} articles decorated with callouts where applicable
 */


function markCallouts(articles) {
  return _map(articles, function (article) {
    if (_includes(article.tags, 'video') || _includes(article.tags, 'original video')) {
      article.callout = 'video';
    } else if (_includes(article.tags, 'gallery')) {
      article.callout = 'gallery';
    }

    return article;
  });
}
}, {"25":25,"32":32,"33":33,"37":37,"49":49,"104":104}];
window.modules["deals-and-sales.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    db = require(69),
    _has = require(105),
    _get = require(32),
    tagToExclude = 'expired sale',
    siteToInclude = 'strategist';

function getDealsAndSalesArticle(tagToFind) {
  var query = queryService.newQueryWithCount('published-content', 1);
  queryService.addMust(query, {
    term: {
      tags: tagToFind
    }
  });
  queryService.addMust(query, {
    term: {
      site: siteToInclude
    }
  });
  queryService.addMustNot(query, {
    term: {
      tags: tagToExclude
    }
  });
  queryService.addSort(query, {
    publishDate: 'desc'
  });
  return queryService.searchByQuery(query);
}

function populateDealsAndSalesProduct(article, data, uri) {
  var expirationDate = new Date(),
      components = _get(article, 'content', []);

  var product = components.reduce(function (accumulator, data) {
    var isClayProduct = data.ref && data.ref.indexOf('/product/') > -1;

    if (isClayProduct) {
      var productData = JSON.parse(data.data),
          buyUrl = productData.buyUrl,
          price = productData.priceLow,
          imageUrl = productData.imageUrl || article.feedImgUrl;

      if (buyUrl && imageUrl && price) {
        accumulator.push(JSON.parse(data.data));
      }
    }

    return accumulator;
  }, []);
  expirationDate.setHours(3, 0, 0);
  expirationDate.setDate(expirationDate.getDate() + 1);

  if (product.length) {
    data.products = product.slice(0, 4);
    data.shortHeadline = article.shortHeadline;
    data.feedImgUrl = article.feedImgUrl;
    data.productExpiration = expirationDate;
    data.publishDate = article.publishDate;
    data.canonicalUrl = article.canonicalUrl;
    data.showDeal = true;
    return db.put(uri, data);
  } else {
    return Promise.resolve(data);
  }
}

module.exports.render = function (uri, data) {
  var currDate = new Date(),
      previousExpirationDate = new Date(),
      variation = data.componentVariation || 'deals-and-sales',
      tagToFind = variation.includes('micro-sales') ? 'micro sales' : 'deal of the day',
      variationChanged = data.rubric !== tagToFind;
  previousExpirationDate.setHours(3, 0, 0);
  return getDealsAndSalesArticle(tagToFind).then(function (result) {
    var article = result[0];

    if (_has(data, 'productExpiration')) {
      var newPubDate = new Date(article.publishDate),
          oldPubDate = new Date(data.publishDate) || new Date(article.date),
          productExpiration = new Date(data.productExpiration); // if article.publishDate is newer than publishDate on component and it is newer than 3am today, update and render component

      if (newPubDate > oldPubDate && newPubDate > previousExpirationDate || variationChanged) {
        // replace product with new product
        data.rubric = tagToFind;
        return populateDealsAndSalesProduct(article, data, uri);
      } else if (currDate > productExpiration || newPubDate < oldPubDate) {
        // hide deal
        data.showDeal = false;
        return data;
      } else {
        return data;
      }
    } else {
      return populateDealsAndSalesProduct(article, data, uri);
    }
  }).catch(function (e) {
    return queryService.logCatch(e, "".concat(uri, ": ").concat(e.message)) || data;
  }); // log es error, but still render component
};

module.exports.populateDealsAndSalesProduct = populateDealsAndSalesProduct;
}, {"32":32,"49":49,"69":69,"105":105}];
window.modules["di-header.model"] = [function(require,module,exports){'use strict';

var mediaPlay = require(53),
    utils = require(43);

module.exports.save = function (ref, data) {
  if (!utils.isFieldEmpty(data.magazineImageUrl) && mediaPlay.isMediaPlay(data.magazineImageUrl)) {
    data.magazineImageUrl = mediaPlay.getRendition(data.magazineImageUrl, 'vertical-subscription');
  }

  return data;
};
}, {"43":43,"53":53}];
window.modules["disclaimer-text.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  var text = data.text || '',
      smartText = sanitize.validateTagContent(sanitize.toSmartText(text));
  return {
    text: smartText
  };
};
}, {"39":39}];
window.modules["divider-short.model"] = [function(require,module,exports){'use strict';

var isFieldEmpty = require(43).isFieldEmpty,
    styles = require(44),
    _set = require(87);

module.exports.save = function (uri, data) {
  return isFieldEmpty(data.sass) ? _set(data, 'css', '') : styles.render(uri, data.sass).then(function (css) {
    return _set(data, 'css', css);
  });
};
}, {"43":43,"44":44,"87":87}];
window.modules["divider.model"] = [function(require,module,exports){'use strict';

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
window.modules["dual-scroll.model"] = [function(require,module,exports){'use strict';

var isFieldEmpty = require(43).isFieldEmpty,
    styles = require(44),
    _set = require(87);

module.exports.save = function (uri, data) {
  return isFieldEmpty(data.sass) ? _set(data, 'css', '') : styles.render(uri, data.sass).then(function (css) {
    return _set(data, 'css', css);
  });
};
}, {"43":43,"44":44,"87":87}];
window.modules["dynamic-list-title.model"] = [function(require,module,exports){'use strict';

var _require = require(109),
    hypensToSpaces = _require.hypensToSpaces,
    titleCase = _require.titleCase;

module.exports.render = function (ref, data, locals) {
  var param = locals && locals.params ? hypensToSpaces(locals.params[data.routeParam]) : '';
  data.title = data.dynamicTitle.replace('${routeParamValue}', titleCase(param));
  return data;
};
}, {"109":109}];
window.modules["dynamic-list.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _clone = require(58),
    _get = require(32),
    _map = require(37),
    queryService = require(49),
    _require = require(56),
    isPage = _require.isPage,
    isComponent = _require.isComponent,
    _require2 = require(110),
    sendError = _require2.sendError,
    elasticCatch = _require2.elasticCatch,
    _require3 = require(43),
    formatStart = _require3.formatStart,
    _require4 = require(39),
    removeNonAlphanumericCharacters = _require4.removeNonAlphanumericCharacters,
    log = require(81).setup({
  file: __filename,
  component: 'dynamic-list'
}),
    index = 'published-articles';
/**
 * Builds and executes the query.
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @param {string} routeParamValue
 * @return {object}
 */


function buildAndExecuteQuery(ref, data, locals, routeParamValue) {
  var from = formatStart(parseInt(locals.start, 10)),
      // can be undefined or NaN,
  size = parseInt(locals.size, 10) || data.size || 20,
      body = {
    from: from,
    size: size
  },
      query = queryService(index, locals),
      host = _get(locals, 'site.host', '');

  var lowerCaseRouteParamValue = '';
  query.body = _clone(body); // lose the reference
  // nymag queries from all sites

  if (host.indexOf('nymag') === -1) {
    queryService.withinThisDomainOrCrossposts(query, locals.site);
  }

  if (routeParamValue) {
    lowerCaseRouteParamValue = removeNonAlphanumericCharacters(routeParamValue).toLowerCase();
    queryService.addFilter(query, {
      match: {
        normalizedTags: lowerCaseRouteParamValue
      }
    });
  } // Log the query


  log('debug', 'tag and normalized tag ', {
    normalizedTag: lowerCaseRouteParamValue,
    tag: routeParamValue,
    ref: ref
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQueryWithRawResult(query).then(function (results) {
    var _results$hits = results.hits,
        hits = _results$hits === void 0 ? {} : _results$hits;
    data.total = hits.total;
    data.entries = _map(hits.hits, '_source');
    data.from = from;
    data.start = from + size;
    data.moreEntries = data.total > data.start;
    log('debug', 'total hits', {
      hits: hits.total,
      ref: ref
    });
    return data;
  });
}

module.exports.render = function (ref, data, locals) {
  var reqUrl = locals.url;
  var routeParamValue;
  log('debug', 'request URL', {
    hits: reqUrl,
    ref: ref
  }); // If we're publishing for a dynamic page, rendering a component directly
  // or trying to render a page route we need a quick return

  if (locals.isDynamicPublishUrl || isComponent(reqUrl) || isPage(reqUrl)) {
    return data;
  }

  routeParamValue = locals && locals.params ? locals.params[data.routeParam] : '';
  return buildAndExecuteQuery(ref, data, locals, routeParamValue).then(function (data) {
    // If we're not in edit mode and we've
    // got no results, the page should 404
    if (!data.entries.length && !locals.edit) {
      sendError("No results for tag: ".concat(routeParamValue), 404);
    }

    return data;
  }).catch(elasticCatch);
};

module.exports.save = function (ref, data) {
  // make sure all of the numbers we need to save aren't strings
  if (data.size) {
    data.size = parseInt(data.size, 10);
  }

  if (!data.routeParam) {
    throw new Error('dynamic-list component requires a `routeParam` property to be defined');
  }

  return data;
};

}).call(this,"/components/dynamic-list/model.js")}, {"32":32,"37":37,"39":39,"43":43,"49":49,"56":56,"58":58,"81":81,"110":110}];
window.modules["dynamic-meta-description.model"] = [function(require,module,exports){'use strict';

var _require = require(109),
    hypensToSpaces = _require.hypensToSpaces;

module.exports.render = function (ref, data, locals) {
  if (data.routeParam && locals && locals.params) {
    data.description = data.description.replace('${paramValue}', hypensToSpaces(locals.params[data.routeParam]));
  }

  return data;
};
}, {"109":109}];
window.modules["dynamic-meta-keywords.model"] = [function(require,module,exports){'use strict';

var _require = require(109),
    hypensToSpaces = _require.hypensToSpaces;

module.exports.render = function (ref, data, locals) {
  var param = locals && locals.params ? hypensToSpaces(locals.params[data.routeParam]) : '',
      variations = data.keywordVariations.map(function (variation) {
    return "".concat(param, " ").concat(variation.text);
  }),
      additionalKeywords = data.additionalKeywords.map(function (keyword) {
    return keyword.text;
  });
  data.keywords = variations.concat(param, additionalKeywords).join(', ');
  return data;
};
}, {"109":109}];
window.modules["dynamic-meta-title.model"] = [function(require,module,exports){'use strict';

var _startCase = require(111);

module.exports.render = function (ref, data, locals) {
  if (data.routeParam && locals && locals.params) {
    data.paramValue = _startCase(locals.params[data.routeParam]);
  }

  return data;
};
}, {"111":111}];
window.modules["dynamic-meta-url.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data, locals) {
  if (locals && locals.publishUrl) {
    data.url = locals.publishUrl;
  }

  return data;
};
}, {}];
