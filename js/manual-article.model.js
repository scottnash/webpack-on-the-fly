window.modules["manual-article.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    striptags = require(42),
    urlParse = require(38),
    sanitize = require(39),
    bylineFormat = require(155),
    callout = require(80),
    FIELDS = ['canonicalUrl', 'primaryHeadline', 'teaser', 'feedImgUrl', 'rubric', 'authors', 'pageUri', 'tags', 'featureTypes'],
    allowedTags = ['em', 'i', 'strike', 's'];
/**
 * Sanitizes user input with headline rules
 * @param {string} str
 * @returns {string}
 */


function sanitizeHeadline(str) {
  return sanitize.toSmartHeadline(striptags(str || '', allowedTags));
}
/**
 * Sanitizes user input with body text rules
 * @param {string} str
 * @returns {string}
 */


function sanitizeText(str) {
  return sanitize.toSmartText(striptags(str || '', allowedTags));
}
/**
 * Formats an array of authors into a single string prefixed with "By"
 * @param {array} authors
 * @returns {string}
 */


function formatAuthors(authors) {
  return authors && authors.length ? "By ".concat(bylineFormat.byline(authors)) : '';
}
/* eslint-disable complexity */

/**
 * Sets all article-related data to the provided info
 * @param {object} data
 * @param {object} article
 */


function resetArticleDetails(data, article) {
  data.article = article;
  data.originalImageUrl = article ? article.feedImgUrl : '';
  data.imageUrl = article ? article.feedImgUrl : '';
  data.rubric = article ? article.rubric : '';
  data.headline = article ? article.primaryHeadline : '';
  data.canonicalUrl = article ? article.canonicalUrl : '';
  data.teaser = article ? article.teaser : '';
  data.plainTeaser = article ? striptags(article.teaser) : '';
  data.authors = article ? formatAuthors(article.authors) : '';
  data.callout = article ? callout(article) : '';
}
/* eslint-enable complexity */

/* eslint complexity: ["error", 9] */

/**
 * Sanitizes user-editable fields, and replaces with original text if empty
 * @param {object} data
 */


function updateArticleDetails(data) {
  if (data.article) {
    data.imageUrl = data.imageUrl || data.article.feedImgUrl;
    data.rubric = striptags(data.rubric, []) || data.article.rubric;
    data.headline = sanitizeHeadline(data.headline) || data.article.primaryHeadline;
    data.canonicalUrl = data.canonicalUrl || data.article.canonicalUrl;
    data.teaser = sanitizeText(data.teaser) || data.article.teaser;
    data.plainTeaser = striptags(data.teaser || data.article.teaser);
    data.authors = data.authors || formatAuthors(data.article.authors);
    data.callout = callout(data.article);
  }
}
/**
 * Determines whether two urls are the same, ignoring the protocols
 * @param {string} first
 * @param {string} second
 * @returns {bool}
 */


function isSameArticleUrl(first, second) {
  var firstParsed = urlParse(first),
      secondParsed = urlParse(second);
  firstParsed.set('protocol', 'http');
  secondParsed.set('protocol', 'http');
  return firstParsed.href === secondParsed.href;
}

function setStyleVariation(ref, data) {
  if (data.styleVariation && data.styleVariation.includes('_')) {
    data.componentVariation = "manual-article_".concat(data.styleVariation.split('_').pop());
  } else if (data.styleVariation) {
    // handles the case where the parent switches from a variation to the default variation
    data.componentVariation = 'manual-article';
  }
}

module.exports.save = function (ref, data, locals) {
  var promise = Promise.resolve();
  setStyleVariation(ref, data);

  if (!data.articleUrl) {
    // Article url is empty, clear any details
    resetArticleDetails(data);
    return data;
  } else if (!data.article || !isSameArticleUrl(data.articleUrl, data.article.canonicalUrl)) {
    var query = queryService.onePublishedArticleByUrl(data.articleUrl, FIELDS, locals);
    promise = queryService.searchByQuery(query).then(function (results) {
      resetArticleDetails(data, results[0]);
    });
  }

  return promise.then(function () {
    // Sanitize edits
    updateArticleDetails(data);
    data.headlineClass = striptags(data.headline || '').length > 50 ? 'long-headline' : 'short-headline';
    return data;
  });
};
}, {"38":38,"39":39,"42":42,"49":49,"80":80,"155":155}];
