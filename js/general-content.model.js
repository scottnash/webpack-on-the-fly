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
