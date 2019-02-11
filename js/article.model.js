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
