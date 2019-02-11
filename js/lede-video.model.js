window.modules["lede-video.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
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
    circulationService = require(55),
    rest = require(5),
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
 * generate pageDescription from seoDescription / teaser
 * @param  {object} data
 */


function generatePageDescription(data) {
  if (has(data.seoDescription) || has(data.teaser)) {
    // published to pageDescription
    data.pageDescription = sanitize.toPlainText(data.seoDescription || data.teaser);
  }

  if (has(data.teaser)) {
    // published to socialDescription (consumed by share components and og:description/twitter:description)
    data.socialDescription = sanitize.toPlainText(data.teaser);
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
 * ensure the feed image is using the original rendition.
 * anything consuming the image is expected to apply the correct rendition at time of use.
 * @param  {object} data
 * @param  {object|null} mediaplayImage
 */


function setFeedImage(data) {
  if (has(data.feedImgUrl)) {
    // make sure the feed image is using the original rendition
    data.feedImgUrl = mediaplay.getRendition(data.feedImgUrl, 'original');
  }
}
/**
 * set the site for ES indexing
 * @param {object} data
 * @param {object} locals
 */


function setSite(data, locals) {
  if (locals && locals.site && locals.site.slug) {
    data.site = locals.site.slug;
  }
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
    return rest.get(utils.uriToUrl(utils.replaceVersion(uri), locals)).catch(function () {
      return null;
    }); // eat any errors (e.g. if there isn't previously-saved data)
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
    return rest.get(utils.uriToUrl(utils.replaceVersion(uri, 'published'), locals)).catch(function () {
      return null;
    }); // eat any errors (e.g. if there isn't previously-published data)
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

module.exports.render = function (ref, data, locals) {
  if (locals && !locals.edit) {
    return data;
  } // only need parselyApiKey for amp pages (gtm handles our non-amp pages)


  if (_get(locals, 'params.ext') === 'amp') {
    data.parselyApiKey = getParselySiteId(locals);
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
  // first, let's get all the synchronous stuff out of the way:
  // sanitizing inputs, setting fields, etc
  sanitizeInputs(data); // do this before using any headline/teaser/etc data

  generatePrimaryHeadline(data);
  generatePageTitles(data, locals);
  generatePageDescription(data);
  formatDate(data, locals);
  setCanonicalUrl(data, locals);
  setFeedImage(data);
  setSite(data, locals); // now that we have some initial data (and inputs are sanitized),
  // do the api calls necessary to update the page and authors list and slug

  return promises.props({
    prevData: getPrevData(uri, data, locals),
    publishedData: getPublishedData(uri, data, locals)
  }).then(function (resolved) {
    // once async calls are done, use their resolved values to update some more data
    setSlugAndLock(data, resolved.prevData, resolved.publishedData);
    return data;
  });
};
}, {"5":5,"32":32,"39":39,"42":42,"43":43,"46":46,"48":48,"52":52,"53":53,"54":54,"55":55}];
