window.modules["55"] = [function(require,module,exports){'use strict';

var _get = require(32),
    striptags = require(42),
    dateFormat = require(52),
    dateParse = require(54),
    differenceInCalendarDays = require(484),
    utils = require(43),
    has = utils.has,
    // convenience
isFieldEmpty = utils.isFieldEmpty,
    // convenience
sanitize = require(39),
    promises = require(46),
    rest = require(5),
    queryService = require(49),
    PUBLISHED_ARTICLES_INDEX = 'published-articles';
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
 * generate pageDescription from seoDescription / teaser
 * @param  {object} data
 */


function generatePageDescription(data) {
  var plaintextDesc = sanitize.toPlainText(data.seoDescription || data.teaser),
      isSubscriptionPage = has(data.contentType) && data.contentType === 'subscriptionPage';

  if (has(data.seoDescription) || has(data.teaser)) {
    // published to pageDescription
    data.pageDescription = addSponsoredDescription(plaintextDesc, data);

    if (has(data.teaser)) {
      // published to socialDescription (consumed by share components and og:description/twitter:description)
      data.socialDescription = addSponsoredDescription(isSubscriptionPage ? plaintextDesc : sanitize.toPlainText(data.teaser), data);
    }
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
 * generate the slug from the tvShowName (this is for the TV show pages), seoHeadline or shortHeadline
 * note: they should already have been sanitized
 * @param  {object} data
 */


function generateSlug(data) {
  var fieldForSlug = data.tvShowName || data.seoHeadline || data.shortHeadline || '';
  data.slug = sanitize.cleanSlug(fieldForSlug);
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

function getRollingStandoutArticles(locals) {
  var rollingStandoutArticlesQuery = queryService(PUBLISHED_ARTICLES_INDEX, locals),
      site = locals.site,
      uriPrefix = utils.uriToUrl(site.prefix, {
    site: {
      protocol: site.proto || 'http',
      port: site.port
    }
  });
  queryService.addMust(rollingStandoutArticlesQuery, [{
    prefix: {
      canonicalUrl: uriPrefix
    }
  }, {
    term: {
      shouldBeGoogleStandout: true
    }
  }, {
    range: {
      date: {
        gt: 'now-7d'
      }
    }
  }]);
  return queryService.searchByQuery(rollingStandoutArticlesQuery).catch(function () {
    return [];
  });
}

function setGoogleStandoutHelpers(data, publishedData, rollingCount) {
  var publishDate = _get(publishedData, 'date', null),
      now = new Date(),
      daysSincePublish = differenceInCalendarDays(dateFormat(now), dateFormat(publishDate || now));

  data.canBeMarkedGoogleStandout = rollingCount < 7 && daysSincePublish < 2;
  data.availableStandoutArticleInventory = rollingCount < 7;
  data.articleWithinGoogleStandoutPublishDateLimit = daysSincePublish < 2;
  data.rollingStandoutCount = rollingCount;
}

module.exports.generatePageDescription = generatePageDescription;
module.exports.setCanonicalUrl = setCanonicalUrl;
module.exports.formatDate = formatDate;
module.exports.getPrevData = getPrevData;
module.exports.getPublishedData = getPublishedData;
module.exports.getRollingStandoutArticles = getRollingStandoutArticles;
module.exports.setGoogleStandoutHelpers = setGoogleStandoutHelpers;
module.exports.setSlugAndLock = setSlugAndLock;
module.exports.stripHeadlineTags = stripHeadlineTags;
}, {"5":5,"32":32,"39":39,"42":42,"43":43,"46":46,"49":49,"52":52,"54":54,"484":484}];
