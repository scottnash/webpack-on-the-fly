window.modules["magazine-article.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    striptags = require(42),
    INDEXABLE_CONTENT = 'published-articles',
    internals = {
  ALLOWED_TAGS: ['strong', 'em', 'i', 's', 'span', 'a'],
  HEADLINE_ALLOWED_TAGS: ['i', 's']
},
    sanitize = require(39),
    QUERY_FIELDS = ['primaryHeadline', 'teaser', 'feedImgUrl'];
/**
 * Set data teaser
 *
 * @param {Object} customData - component data
 * @param {Object} articleData - fetched article data
 * @returns {string}
 */


internals.setTeaser = function (customData, articleData) {
  var teaser = customData.customTeaser ? customData.customTeaser : articleData.teaser;
  teaser = sanitize.toSmartText(striptags(teaser, internals.ALLOWED_TAGS));
  return teaser || '';
};
/**
 * Set data image
 *
 * @param {Object} customData - component data
 * @param {Object} articleData - fetched article data
 * @returns {string}
 */


internals.setImage = function (customData, articleData) {
  return customData.customImageUrl || articleData.feedImgUrl || '';
};
/**
 * Set data headline
 *
 * @param {Object} customData - component data
 * @param {Object} articleData - fetched article data
 * @returns {string}
 */


internals.setHeadline = function (customData, articleData) {
  var headline = customData.customHeadline ? customData.customHeadline : articleData.primaryHeadline;
  headline = sanitize.toSmartHeadline(striptags(headline, internals.HEADLINE_ALLOWED_TAGS));
  return headline || '';
};
/**
 * Update Multiple data fields
 *
 * @param {Object} customData - data object
 * @param {Object} articleData - fetched article data
 * @returns {Object} updated data object
 */


internals.updateData = function () {
  var customData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var articleData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var result = {};
  result.teaser = internals.setTeaser(customData, articleData);
  result.feedImgUrl = internals.setImage(customData, articleData);
  result.headline = internals.setHeadline(customData, articleData);
  return result;
};
/**
 * Component save method
 *
 * @param {string} uri - component uri
 * @param {Object} data - component data object
 * @param {Object} locals - locals object
 * @returns {Object} data object
 */


module.exports.save = function (uri, data, locals) {
  var articleData;

  if (data.articleUrl) {
    var query = queryService(INDEXABLE_CONTENT, locals);
    queryService.addFilter(query, {
      term: {
        canonicalUrl: data.articleUrl.replace('https:', 'http:')
      }
    });
    queryService.onlyWithTheseFields(query, QUERY_FIELDS);
    return queryService.searchByQuery(query).then(function (results) {
      articleData = results.length ? results[0] : {};
      return Object.assign({}, data, internals.updateData(data, articleData));
    }).catch(function (e) {
      queryService.logCatch(e, uri);
      data.articleUrl = '';
      return data;
    });
  } else {
    return Object.assign({}, data, internals.updateData(data));
  }
};

module.exports.__internals__ = internals; // This pattern is just for testing purposes
}, {"39":39,"42":42,"49":49}];
window.modules["magazine-features-article.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    striptags = require(42),
    INDEXABLE_CONTENT = 'published-articles',
    internals = {
  ALLOWED_TAGS: ['strong', 'em', 'i', 's', 'span', 'a'],
  HEADLINE_ALLOWED_TAGS: ['i', 's']
},
    sanitize = require(39),
    QUERY_FIELDS = ['primaryHeadline', 'teaser', 'authors', 'feedImgUrl'];
/**
 * Set data teaser
 *
 * @param {Object} customData - component data
 * @param {Object} articleData - fetched article data
 * @returns {string}
 */


internals.setTeaser = function (customData, articleData) {
  var teaser = customData.customTeaser ? customData.customTeaser : articleData.teaser;
  teaser = sanitize.toSmartText(striptags(teaser, internals.ALLOWED_TAGS));
  return teaser || '';
};
/**
 * Set data image
 *
 * @param {Object} customData - component data
 * @param {Object} articleData - fetched article data
 * @returns {string}
 */


internals.setImage = function (customData, articleData) {
  return customData.customImageUrl || articleData.feedImgUrl || '';
};
/**
 * Set data headline
 *
 * @param {Object} customData - component data
 * @param {Object} articleData - fetched article data
 * @returns {string}
 */


internals.setHeadline = function (customData, articleData) {
  var headline = customData.customHeadline ? customData.customHeadline : articleData.primaryHeadline;
  headline = sanitize.toSmartHeadline(striptags(headline, internals.HEADLINE_ALLOWED_TAGS));
  return headline || '';
};
/**
 * Set data authors
 *
 * @param {Object} customData - component data
 * @param {Object} articleData - fetched article data
 * @returns {string}
 */


internals.setAuthors = function (customData, articleData) {
  var authors = customData.customAuthors && customData.customAuthors.length ? customData.customAuthors : null;

  if (!authors && articleData.authors && articleData.authors.length) {
    authors = articleData.authors.map(function (author) {
      return {
        text: author
      };
    });
  }

  return authors || [];
};
/**
 * Update Multiple data fields
 *
 * @param {Object} customData - data object
 * @param {Object} articleData - fetched article data
 * @returns {Object} updated data object
 */


internals.updateData = function () {
  var customData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var articleData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var result = {};
  result.teaser = internals.setTeaser(customData, articleData);
  result.feedImgUrl = internals.setImage(customData, articleData);
  result.headline = internals.setHeadline(customData, articleData);
  result.authors = internals.setAuthors(customData, articleData);
  return result;
};
/**
 * Component save method
 *
 * @param {string} uri - component uri
 * @param {Object} data - component data object
 * @param {Object} locals - locals object
 * @returns {Object} data object
 */


module.exports.save = function (uri, data, locals) {
  var articleData;

  if (data.articleUrl) {
    var query = queryService(INDEXABLE_CONTENT, locals);
    queryService.addFilter(query, {
      term: {
        canonicalUrl: data.articleUrl.replace('https:', 'http:')
      }
    });
    queryService.onlyWithTheseFields(query, QUERY_FIELDS);
    return queryService.searchByQuery(query).then(function (results) {
      articleData = results.length ? results[0] : {};
      return Object.assign({}, data, internals.updateData(data, articleData));
    }).catch(function (e) {
      queryService.logCatch(e, uri);
      data.articleUrl = '';
      return data;
    });
  } else {
    return Object.assign({}, data, internals.updateData(data));
  }
};

module.exports.__internals__ = internals; // This pattern is just for testing purposes
}, {"39":39,"42":42,"49":49}];
window.modules["magazine-features-section.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    sanitize = require(39);
/**
 * Component save method
 *
 * @param {string} ref - component ref
 * @param {Object} data - component data object
 * @returns {Object} data object
 */


module.exports.save = function (ref, data) {
  // run titles through headline quotes
  if (!utils.isFieldEmpty(data.title)) {
    data.title = sanitize.toSmartHeadline(data.title);
  }

  return data;
};
}, {"39":39,"43":43}];
window.modules["magazine-issue-header.model"] = [function(require,module,exports){'use strict';

var formatTime = require(154),
    sanitize = require(39),
    socialDescription = {
  toc: 'The complete table of contents for the {date} issues of New York Magazine.',
  issueArchive: 'All {date} issues of New York Magazine.'
},
    pageTitle = {
  toc: 'New York Magazine: {date} Issue',
  issueArchive: 'New York Magazine: {date} Issues'
};
/**
 * Is ToC section page
 *
 * @param {Object} data - component data
 * @returns {boolean} true if ToC section | false if not
 */


function isToC() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return data.section === 'toc';
}
/**
 * Is Issue Archive
 *
 * @param {Object} data - component data
 * @returns {boolean} true if Issue Archive section | false if not
 */


function isIssueArchive() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return data.section === 'issueArchive';
}
/**
 * Format date from numerical representation of 'MM-DD-YYYY'
 * to alphanumerical representation
 *
 * @param {Object} data - component data
 */


function setFormatDate() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (data.magazineIssueDateFrom) {
    data.formattedDate = formatTime.formatDateRange(data.magazineIssueDateFrom, data.magazineIssueDateTo) || '';
  }
}
/**
 * Set Page title
 *
 * @param {Object} data - component data
 */


function setPageTitle() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _pageTitle = pageTitle[data.section] ? pageTitle[data.section] : '',
      issueArchiveTitle = _pageTitle.replace('{date}', formatTime.formatDateRange(data.magazineIssueDateFrom, '', 'YYYY'));

  if (isToC(data)) {
    if (data.overrideTitle) {
      data.pageTitle = _pageTitle.replace('{date}', data.overrideTitle);
    } else if (data.formattedDate) {
      data.pageTitle = _pageTitle.replace('{date}', data.formattedDate);
    }
  }

  if (isIssueArchive(data) && issueArchiveTitle) {
    data.pageTitle = issueArchiveTitle;
  }
}
/**
 * Set Page social description
 *
 * @param {Object} data - component data
 */


function setSocialDescription() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _pageSocialDescription = socialDescription[data.section] ? socialDescription[data.section] : '',
      sectionDate = data.section === 'toc' ? data.formattedDate : formatTime.formatDateRange(data.magazineIssueDateFrom, '', 'YYYY');

  if (_pageSocialDescription && sectionDate) {
    data.socialDescription = _pageSocialDescription.replace('{date}', sectionDate);
  }
}
/**
 * Set Page Keywords
 *
 * @param {Object} data - component data
 */


function setPageKeywords() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var keywords = {
    toc: ['table of contents', 'toc', 'new york magazine'],
    issueArchive: ['issue archive', 'new york magazine']
  },
      _keywords = keywords[data.section] || [],
      sectionTag = isToC(data) ? data.formattedDate : formatTime.formatDateRange(data.magazineIssueDateFrom, '', 'YYYY');

  if (_keywords.length && sectionTag && !_keywords.includes(sectionTag)) {
    _keywords.push(sectionTag);

    data.keywords = _keywords;
  }
}
/**
 * Set Issue Archive Page image
 *
 * @param {Object} data - component data
 */


function setPageImage() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (isIssueArchive(data)) {
    data.feedImgUrl = 'http://pixel.nymag.com/imgs/daily/nymag/2017/09/Careers-Mobile-BG.jpg';
  }
}
/**
 * Generates the slug from the fromDate or OverrideTitle
 * @param {object} data
 */


function generateSlug() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var slugProperty = data.overrideTitle ? 'overrideTitle' : 'magazineIssueDateFrom';
  data.slug = sanitize.cleanSlug(data[slugProperty]);
}
/**
 * Generates the primary headline from the overrideTitle
 * if the primary headline is empty and the overrideHeadline is less than 80 characters
 * @param {object} data
 */


function generatePrimaryHeadline() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  data.primaryHeadline = data.overrideTitle || data.formattedDate;
}
/**
 * This function handles the special ToC property based on the overrideTitle.
 * It is used for elastic filtering purposes.
 * @param {object} data
 */


function setSpecialToc() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  data.specialToc = !!data.overrideTitle;
}
/**
 * Set Publication date for ToC and Issue archive pages
 * @param {Object} data - component data
 */


function setPublishingDate(data) {
  if (data.magazineIssueDateFrom) {
    data.date = new Date(data.magazineIssueDateFrom).toISOString();
  }
}
/**
 * Save component data
 *
 * @param {string} uri - component uri
 * @param {Object} data - component data
 * @param {Object} locals - request page data
 * @returns {Object} Mutated component data
 */


module.exports.save = function (uri, data) {
  setFormatDate(data);
  generatePrimaryHeadline(data);
  setSpecialToc(data);
  setPageTitle(data);
  generateSlug(data);
  setSocialDescription(data);
  setPageKeywords(data);
  setPageImage(data);
  setPublishingDate(data);
  return data;
};
}, {"39":39,"154":154}];
window.modules["magazine-section.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    sanitize = require(39);
/**
 * Component save method
 *
 * @param {string} ref - component ref
 * @param {Object} data - component data object
 * @returns {Object} data object
 */


module.exports.save = function (ref, data) {
  // run titles through headline quotes
  if (!utils.isFieldEmpty(data.title)) {
    data.title = sanitize.toSmartHeadline(data.title);
  }

  return data;
};
}, {"39":39,"43":43}];
window.modules["magazine-toc-cover.model"] = [function(require,module,exports){'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var striptags = require(42),
    queryService = require(49),
    sanitize = require(39),
    index = 'published-articles',
    fields = ['overrideHeadline', 'pageUri', 'plaintextPrimaryHeadline', 'teaser', 'authors'],
    internals = {
  ALLOWED_TAGS: ['strong', 'em', 'i', 'strike', 'span', 'a']
};
/**
 * Set data headline
 *
 * @param {Object} componentData - component data
 * @param {Object} articleData - fetched article data
 * @returns {{headline: string}}
 */


internals.setHeadline = function (componentData, articleData) {
  var result = {
    headline: ''
  };
  var headline, headlineWithoutTags;

  if (!componentData.customHeadline && !articleData.overrideHeadline) {
    return result;
  }

  headline = componentData.customHeadline ? componentData.customHeadline : articleData.overrideHeadline;
  headlineWithoutTags = striptags(headline || '');

  if (headline) {
    result.headline = sanitize.toSmartHeadline(striptags(headline, internals.ALLOWED_TAGS));
  }

  result.plainTextPrimaryHeadline = headlineWithoutTags ? "In this issue: ".concat(headlineWithoutTags) : '';
  return result;
};
/**
 * Set data teaser
 *
 * @param {Object} componentData - component data
 * @param {Object} articleData - fetched article data
 * @returns {{teaser: string}}
 */


internals.setTeaser = function (componentData, articleData) {
  var result = {
    teaser: ''
  };

  if (!componentData.customTeaser && !articleData.teaser) {
    return result;
  }

  var teaser = componentData.customTeaser ? componentData.customTeaser : articleData.teaser;
  result.teaser = sanitize.toSmartText(striptags(teaser, internals.ALLOWED_TAGS));
  return result;
};
/**
 * Set data authors
 *
 * @param {Object} componentData - component data
 * @param {Object} articleData - fetched article data
 * @returns {{authors: Array}}
 */


internals.setAuthors = function (componentData, articleData) {
  var customByline = componentData.customByline || [],
      result = {
    authors: []
  };

  if (customByline.length) {
    result.authors = customByline;
  } else if (articleData.authors && articleData.authors.length) {
    result.authors = articleData.authors.map(function (author) {
      return {
        text: author
      };
    });
  }

  return result;
};
/**
 * Sanitize specific fields from the data object
 *
 * @param {Object} data - data object
 * @param {string} field - field to be sanitize
 * @returns {Object} object with the field sanitized
 */


internals.sanitizeFields = function (data, field) {
  if (!data[field]) {
    return {};
  }

  return Object.assign({}, _defineProperty({}, field, sanitize.toSmartText(striptags(data[field], internals.ALLOWED_TAGS))));
};
/**
 * Sets page canonical URL in the component data
 * @param {Object} data - component data
 * @param {Object} [locals={}] - locals config object
 * @return {Object} Object copying data and assigning canonicalUrl property
 */


internals.setCanonical = function (data) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$publishUrl = _ref.publishUrl,
      publishUrl = _ref$publishUrl === void 0 ? '' : _ref$publishUrl;

  return {
    canonicalUrl: publishUrl.replace('https:', 'http:')
  };
};
/**
 * Update Multiple data fields
 *
 * @param {Object} [data] - component data
 * @param {Object} [locals] - locals config object
 * @param {Object} articleData - fetched article data
 * @returns {Object} updated data object
 */


function updateData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var locals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var articleData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return Object.assign({}, internals.setHeadline(data, articleData), internals.setTeaser(data, articleData), internals.setAuthors(data, articleData), internals.sanitizeFields(data, 'coverImageDescription'), internals.sanitizeFields(data, 'coverAditionalContent'), internals.setCanonical(data, locals));
}
/**
 * Component save method
 *
 * @param {string} uri - component uri
 * @param {Object} data - component data object
 * @param {Object} locals - locals object
 * @returns {Object} data object
 */


module.exports.save = function (uri, data, locals) {
  var articleData;

  if (data.coverArticleUrl) {
    var query = queryService(index, locals);
    queryService.addFilter(query, {
      term: {
        canonicalUrl: data.coverArticleUrl
      }
    });
    queryService.onlyWithTheseFields(query, fields);
    return queryService.searchByQuery(query).then(function (results) {
      articleData = results.length ? results[0] : {};
      return Object.assign({}, data, updateData(data, locals, articleData));
    }).catch(function (e) {
      queryService.logCatch(e, uri);
      return Object.assign({}, data, updateData(data, locals));
    });
  } else {
    return Object.assign({}, data, updateData(data, locals));
  }
};

module.exports.__internals__ = internals; // This pattern is just for testing purposes
}, {"39":39,"42":42,"49":49}];
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
window.modules["mediaplay-image.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _assign = require(57),
    striptags = require(42),
    slideshow = require(147),
    utils = require(43),
    sanitize = require(39),
    mediaplay = require(53),
    styles = require(44),
    log = require(81).setup({
  file: __filename,
  action: 'mediaplay-image'
}),
    allowedTags = ['strong', 'em', 'a']; // tags allowed in caption, credit, creditOverride

/**
 * compile styles if they're not empty
 * @param {string} uri
 * @param  {object} data
 * @return {Promise|object}
 */


function resolveStyles(uri, data) {
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = null; // unset any compiled css

    return data;
  }
}
/**
 * get image type and credit from mediaplay
 * @param  {object} data
 * @return {Promise|object}
 */


function resolveMetadata(data) {
  if (!utils.isFieldEmpty(data.url)) {
    return mediaplay.getMediaplayMetadata(data.url).then(function (metadata) {
      /**
       * We do not know for how long Ratio was calculated incorrectly, so we should leave it like this
       * and decide later if it needs to be fixed.
       */
      data.ratio = null;

      try {
        var renditionDimensions = mediaplay.getCalculatedRenditionDimensionsFromMetadata(data.rendition, metadata);
        data.imageRenditionWidth = renditionDimensions.width;
        data.imageRenditionHeight = renditionDimensions.height;
      } catch (err) {
        log('error', 'Failed to Calculate Rendition Width/Height for Mediaplay Image', {
          message: err.message,
          uri: data.uri,
          rendition: data.rendition
        });
        data.imageRenditionWidth = null;
        data.imageRenditionHeight = null;
      } // get image type, e.g. 'Photo'


      data.imageType = metadata.imageType; // override the credit if user has set an override,
      // otherwise use the credit grabbed from mediaplay

      if (!utils.isFieldEmpty(data.creditOverride)) {
        data.credit = data.creditOverride; // already sanitized
      } else {
        // make sure we sanitize the data coming from mediaplay
        data.credit = sanitize.toSmartText(striptags(metadata.credit, allowedTags));
      }

      return data;
    });
  } else {
    data.imageType = null;
    data.credit = null;
    return data;
  }
}
/**
 * merge the results from our resolved values:
 * styles, ratio, and metadata
 * @param  {object} data
 * @return {function}
 */


function mergeResolvedValues(data) {
  return function (results) {
    return _assign(data, results[0], results[1]);
  };
} // /**
//  * provide zoom renditions for three breakpoints:
//  * @param  {object} data
//  * @return {function}
//  */


function getZoomImg(data) {
  if (!(data.rendition && data.url)) {
    return;
  }

  return {
    url: data.url,
    mobile: data.rendition,
    tablet: data.rendition,
    desktop: data.rendition,
    alt: data.alt
  };
}
/**
 * set mediaplay rendition, fetch and sanitize metadata, render custom styles
 * @param  {string} uri
 * @param  {object} data
 * @return {Promise}
 */


module.exports.save = function (uri, data) {
  // default to horizontal rendition
  if (utils.isFieldEmpty(data.rendition)) {
    data.rendition = 'horizontal';
  } // default to no slideshow type


  if (utils.isFieldEmpty(data.slideshowType)) {
    data.slideshowType = 'none';
  } // sanitize url and get proper rendition


  if (!utils.isFieldEmpty(data.url)) {
    data.url = mediaplay.getRendition(sanitize.toPlainText(data.url), data.rendition);
  } // sanitize caption


  if (!utils.isFieldEmpty(data.caption)) {
    data.caption = sanitize.toSmartText(striptags(data.caption, allowedTags));
  } // sanitize credit override


  if (!utils.isFieldEmpty(data.creditOverride)) {
    data.creditOverride = sanitize.toSmartText(striptags(data.creditOverride, allowedTags));
  } // resolve promises for styles, ratio, and mediaplay metadata


  return Promise.all([resolveStyles(uri, data), resolveMetadata(data)]).then(mergeResolvedValues(data));
};
/**
 * add slideshow link
 * @param  {string} uri
 * @param  {object} data
 * @param {object} locals
 * @return {object}
 */


module.exports.render = function (uri, data, locals) {
  data.zoomImg = getZoomImg(data);

  if (data.slideshowLocation && data.slideshowLocation === 'CQ') {
    return slideshow.addSlideshowLink(locals)(data);
  }

  return data;
};

}).call(this,"/components/mediaplay-image/model.js")}, {"39":39,"42":42,"43":43,"44":44,"53":53,"57":57,"81":81,"147":147}];
window.modules["megaphone.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  var url = data.url,
      embedCode = url && url.match(/src=['"](.*?)['"]/i); // find first src="(url)"
  // if they pasted in a full embed code, parse out the url

  if (embedCode) {
    data.url = embedCode[1];
  }

  return data;
};
}, {}];
window.modules["memo-pixel.model"] = [function(require,module,exports){'use strict';

var get = require(69).get,
    _require = require(56),
    isPublished = _require.isPublished;

module.exports.save = function (uri, data, locals) {
  // memo pixel relies on the tracked url staying the same for the page even if it changes over time
  if (!isPublished(uri)) {
    return data;
  }

  return get(uri).then(function (response) {
    data.url = response.url;
    return data;
  }).catch(function () {
    // Catch happens on first publication, after publication we use the url returned from the get(uri) call, so that we always return the original url
    if (isPublished(uri) && locals.publishUrl) {
      data.url = locals.publishUrl;
    }

    return data;
  });
};
}, {"56":56,"69":69}];
window.modules["meta-authors.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _get = require(32),
    _set = require(87),
    _last = require(24),
    _require = require(39),
    normalizeName = _require.normalizeName,
    queryService = require(49),
    log = require(81).setup({
  file: __filename,
  component: 'meta-author'
}),
    INDEX = 'authors';
/**
 * Munge elastic data into a standardized format
 * @param {Array<Object>} res
 * @returns {Object}
 */


function mungeData(res) {
  return res.map(function (author) {
    var twitter = author.twitter,
        facebook = author.facebook;
    author.social = author.social || {}; // make sure this exists if (for some reason) it doesn't

    if (twitter) {
      _set(author, 'social.twitter', twitter.replace(/^@/, '')); // remove @ sign if it exists

    }

    if (facebook) {
      _set(author, 'social.facebook', _last(facebook.split('/'))); // remove any url business and grab the username

    }

    return author;
  });
}
/**
 * Query elastic to get social media stuff for an author
 * @param {Object} query
 * @param {Array} names
 * @returns {Promise}
 */


function getAuthorData(query, names) {
  names.forEach(function (name) {
    queryService.addShould(query, {
      match: {
        'name.normalized': normalizeName(name)
      }
    });
  });
  queryService.addMinimumShould(query, 1);
  return queryService.searchByQuery(query).catch(function () {
    log('error', 'Error searching the author by query', {
      authors: names
    });
    return names.map(function (name) {
      return {
        name: name
      };
    });
  }).then(mungeData);
}

module.exports.save = function (ref, data, locals) {
  var query = queryService(INDEX, locals); // Normalize "authors" value; if saved from a Kiln form, it will be of the form
  // [{text: string}].

  data.authors = data.authors.map(function (author) {
    return typeof author === 'string' ? author : _get(author, 'text', '');
  });
  return getAuthorData(query, data.authors) // get social stuff for each author, returns array of promises
  .then(function (authorSocials) {
    data.authorSocials = authorSocials;
    return data;
  });
};

module.exports.render = function (ref, data) {
  // Transforms "authors" value into form [{text: string}] so it can be edited in
  // simple-list Kiln field.
  data.authors = data.authors.map(function (author) {
    return {
      text: author
    };
  });
  return data;
};

}).call(this,"/components/meta-authors/model.js")}, {"24":24,"32":32,"39":39,"49":49,"81":81,"87":87}];
window.modules["most-popular.model"] = [function(require,module,exports){'use strict';

var recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    callout = require(80),
    _set = require(87),
    ELASTIC_FIELDS = ['pageUri', 'tags', 'authors'];
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

  if (result.tags) {
    data.tags = result.tags;
  }

  if (result.authors) {
    data.authors = result.authors;
  }

  data.callout = callout(data);
  return data;
}

module.exports.save = function (ref, data, locals) {
  return Promise.all(data.articles.map(function (articleData) {
    articleData.url = articleData.canonicalUrl;
    return recircCmpt.getArticleDataAndValidate(ref, articleData, locals, ELASTIC_FIELDS).then(function (result) {
      return assignToData(articleData, result);
    });
  })).then(function (articles) {
    data.articles = articles;
    data.limit = parseInt(data.limit, 10) || 5;
    return data;
  });
};
}, {"39":39,"80":80,"87":87,"103":103}];
window.modules["multiple-choice-quiz.model"] = [function(require,module,exports){'use strict';

var _require = require(56),
    isComponent = _require.isComponent;

module.exports.render = function (uri, data, locals) {
  if (locals.url && !isComponent(locals.url)) {
    data.canonicalUrl = locals.url.replace('/amp', '').replace('.amp', '.html');
  }

  return data;
};
}, {"56":56}];
window.modules["nav-link.model"] = [function(require,module,exports){'use strict';

var _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    ELASTIC_FIELDS = ['plaintextPrimaryHeadline', 'authors', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    plaintextPrimaryHeadline: result.plaintextPrimaryHeadline,
    authors: result.authors,
    pageUri: result.pageUri,
    urlIsValid: result.urlIsValid
  }));

  return data;
} // save is also imported into nav-link/upgrade.js


module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
};
}, {"57":57,"59":59,"103":103}];
window.modules["navigation-categories.model"] = [function(require,module,exports){'use strict';

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
    data.css = ''; // unset any compiled css

    return data;
  }
};
}, {"43":43,"44":44}];
window.modules["newsfeed.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var queryService = require(49),
    formatStart = require(43).formatStart,
    _pickBy = require(59),
    _clone = require(58),
    _assign = require(57),
    _get = require(32),
    _map = require(37),
    clayUtils = require(56),
    log = require(81).setup({
  file: __filename,
  component: 'newsfeed'
}),
    index = 'published-articles';
/**
 *
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var from = formatStart(parseInt(locals.start, 10)),
      // can be undefined or NaN,
  size = parseInt(locals.size, 10) || data.size || 10,
      body = _pickBy({
    from: from,
    size: size
  }),
      query = queryService(index, locals);

  query.body = _clone(body); // lose the reference

  queryService.withinThisSiteAndCrossposts(query, locals.site);

  if (data.newsfeedArticlesOnly) {
    queryService.addMust(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
  }

  queryService.addSort(query, {
    date: 'desc'
  });

  if (data.tags && data.tags.length > 0) {
    data.tags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, 1);
  } // Log the query


  log('debug', 'query for newsfeed cmpt', {
    query: query,
    ref: ref
  });
  return queryService.searchByQueryWithRawResult(query).then(function (results) {
    _assign(data, body);

    data.total = _get(results, 'hits.total');
    data.articles = _map(_get(results, 'hits.hits'), '_source');
    data.from = from;
    data.start = from + size;

    var _ref = locals.query || {},
        bypass = _ref.bypass,
        edit = _ref.edit,
        publishUrl = _ref.publishUrl,
        shouldThrow404 = !data.articles.length && !edit && !bypass && !publishUrl && !clayUtils.isComponent(locals.url);

    if (shouldThrow404) {
      var err = new Error('No results!');
      err.status = 404;
      throw err;
    }

    return data;
  });
};

module.exports.save = function (ref, data) {
  // make sure all of the numbers we need to save aren't strings
  if (data.size) {
    data.size = parseInt(data.size, 10);
  }

  if (data.promoFrequency) {
    data.promoFrequency = parseInt(data.promoFrequency, 10);
  }

  if (data.adFrequency) {
    data.adFrequency = parseInt(data.adFrequency, 10);
  }

  if (data.spotlightAdFrequency) {
    data.spotlightAdFrequency = parseInt(data.spotlightAdFrequency, 10);
  }

  return data;
};

}).call(this,"/components/newsfeed/model.js")}, {"32":32,"37":37,"43":43,"49":49,"56":56,"57":57,"58":58,"59":59,"81":81}];
window.modules["newsletter-ad.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (uri, data) {
  return data;
};
}, {}];
window.modules["newsletter-button.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    _require = require(43),
    has = _require.has;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.buttonText)) data.buttonText = sanitize.toSmartText(data.buttonText);
}
/**
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  sanitizeInputs(data);
  return data;
};
}, {"39":39,"43":43}];
window.modules["newsletter-column-alert.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    _compact = require(165),
    _get = require(32),
    _require = require(53),
    getRendition = _require.getRendition,
    _require2 = require(43),
    has = _require2.has,
    sanitize = require(39),
    FIELDS = ['canonicalUrl', 'content', 'feedImgUrl', 'primaryHeadline', 'shortHeadline'],
    QUERY_INDEX = 'published-content';
/**
 * Resolve object values, e.g. [{text:content}{text:content}] becomes [content, content]
 * @param {[{}]} items
 * @returns {Array}
 */


function resolveObj(items) {
  if (items.length) {
    return items.reduce(function (arr, item) {
      if (typeof item.data !== 'undefined') {
        return arr.concat(JSON.parse(item.data).text);
      }
    }, []);
  }
}
/**
 * Pulls in the latest articles
 * @param {Object} data
 * @param {Object} locals
 * @returns {Array|Object}
 */


function mostRecentArticle(data, locals) {
  var query = queryService(QUERY_INDEX, locals);

  if (has(data.tags) && data.tags.length > 0) {
    data.tags.forEach(function (tag) {
      queryService.addMust(query, {
        term: {
          tags: tag.text
        }
      });
    });
  }

  queryService.addFilter(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  queryService.addFilter(query, {
    term: {
      site: locals.site.slug
    }
  });
  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, 1);
  return queryService.searchByQuery(query).then(function (article) {
    var feedImgUrl = _get(article, '[0].feedImgUrl', '');

    data.imgUrl = data.imageRendition ? getRendition(feedImgUrl, data.imageRendition, true) : feedImgUrl;
    data.title = _get(article, '[0].primaryHeadline', '');
    data.articleUrl = _get(article, '[0].canonicalUrl', '');
    data.articleContent = _compact(resolveObj(_get(article, '[0].content', '')));
    data.paragraphs = data.articleContent.slice(0, data.minParagraphs);
    return data;
  });
}
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.columnAlertName)) data.columnAlertName = sanitize.toSmartText(data.columnAlertName);
  if (has(data.buttonText)) data.buttonText = sanitize.toSmartText(data.buttonText);
}
/**
 * @param {string} ref
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise|Object}
 */


module.exports.render = function (ref, data, locals) {
  return mostRecentArticle(data, locals);
};
/**
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  sanitizeInputs(data);
  return data;
};
}, {"32":32,"39":39,"43":43,"49":49,"53":53,"165":165}];
window.modules["newsletter-feed.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    sanitize = require(39),
    _get = require(32),
    _join = require(166),
    _isEqual = require(167),
    _map = require(37),
    _trim = require(168),
    _reduce = require(124),
    _require = require(53),
    getRendition = _require.getRendition,
    _require2 = require(43),
    has = _require2.has,
    FIELDS = ['canonicalUrl', 'primaryHeadline', 'teaser', 'feedImgUrl', 'site', 'byline'],
    QUERY_INDEX = 'published-articles',
    SITES_NAMES = {
  nymag: 'New York Magazine',
  grubstreet: 'Grub Street',
  di: 'Daily Intelligencer',
  intelligencer: 'Intelligencer',
  selectall: 'Select All',
  strategist: 'The Strategist',
  vulture: 'Vulture',
  wwwthecut: 'The Cut'
};
/**
 * Returns the proper rendition based on the current site. This will allow the feed to have the proper rendition 
 * even when using bootstrap data and not the first run's. 
 * @param {Object} locals
 * @param {Object} data
 * @returns {string}
 */


function getImageRendition(locals, data) {
  // eslint-disable-line complexity
  var siteSlug = data.optionalBranding || _get(locals, 'site.slug', '');

  var rendition;

  switch (siteSlug) {
    case 'di':
    case 'intelligencer':
      rendition = 'newsletter-horizontal-medium';
      break;

    case 'nymag':
      rendition = 'newsletter-horizontal-large-alt';
      break;

    case 'nyxny':
    case 'wwwthecut':
    case 'designhunting':
      rendition = 'newsletter-square-medium';
      break;

    case 'grubstreet':
    case 'selectall':
    case 'vulture':
      rendition = 'newsletter-square-small';
      break;

    case 'strategist':
      rendition = 'newsletter-horizontal-large';
      break;

    default:
      rendition = 'newsletter-square-small';
  }

  return rendition;
}
/**
 * Get plain text authors with its prefix
 * @param {Object} authors
 * @returns {string}
 */


function getPlainTextAuthors(authors) {
  var plainTextAuthors = _reduce(authors, function (bylineString, byline) {
    var plainAuthors = _map(byline.names, function (name) {
      return name.text;
    }),
        plainTextByLine = '',
        lastAuthor = '';

    if (plainAuthors.length === 0) {
      return '';
    } else if (plainAuthors.length === 1) {
      plainTextByLine = plainAuthors[0];
    } else {
      lastAuthor = "and ".concat(plainAuthors.pop());
      plainTextByLine = "".concat(_join(plainAuthors, ', '), " ").concat(lastAuthor);
    }

    return "".concat(bylineString, " ").concat(byline.prefix, " ").concat(plainTextByLine);
  }, '');

  return _trim(plainTextAuthors);
}
/**
 * Gets the lastest x articles to be used in the newsletter feed.
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


function pullLatestArticles(data, locals) {
  var query = queryService(QUERY_INDEX, locals),
      slug = data.siteSlugOverride || _get(locals, 'site.slug', '');

  if (has(data.tags)) {
    data.tags.forEach(function (tag) {
      queryService.addMust(query, {
        term: {
          tags: tag.text
        }
      });
    });
  }

  if (data.siteFiltered) {
    queryService.addFilter(query, {
      term: {
        site: slug
      }
    });
  }

  queryService.addFilter(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, data.articleLimit);
  return queryService.searchByQuery(query).then(function (latestArticles) {
    var articles = _map(latestArticles, function (article) {
      data.imageRendition = getImageRendition(locals, data);
      article.authors = getPlainTextAuthors(article.byline);
      article.feedImgUrl = data.imageRendition ? getRendition(article.feedImgUrl, data.imageRendition, true) : article.feedImgUrl;
      article.type = 'article';
      article.brand = SITES_NAMES[article.site] || '';
      return article;
    });

    data.feedElements = articles;
    return data;
  });
}
/**
 * Takes articles inserted manually and sets their brand property
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


function handleExtraArticles(data, locals) {
  var query = queryService(QUERY_INDEX, locals),
      articles = data.feedElements;

  if (has(articles)) {
    queryService.addFilter(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
    var articlePromises = articles.map(function (article) {
      return queryService.searchByQuery(queryService.onePublishedArticleByUrl(article.canonicalUrl)).then(function (articleProperties) {
        article.site = _get(articleProperties, '[0].site', '');
        article.brand = SITES_NAMES[article.site];
        if (!article.type) article.type = 'article';
        return article;
      });
    });
    return Promise.all(articlePromises).then(function () {
      return data;
    });
  }

  return Promise.resolve(data);
}
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {Object} data
 */


function sanitizeInputs(data) {
  if (has(data.headerText)) data.headerText = sanitize.toSmartText(data.headerText);

  if (has(data.feedElements)) {
    data.feedElements = data.feedElements.map(function (element) {
      if (has(element.authors)) element.authors = sanitize.toSmartText(element.authors);
      if (has(element.primaryHeadline)) element.primaryHeadline = sanitize.toSmartText(element.primaryHeadline);
      if (has(element.rubric)) element.rubric = sanitize.toSmartText(element.rubric);
      if (has(element.teaser)) element.teaser = sanitize.toSmartText(element.teaser);
      return element;
    });
  }
}
/**
 * Verifies if the feed should be updated or not based on the previous tags/limit values.
 * @param {Object} data
 * @returns {boolean}
 */


function shouldFeedUpdate(data) {
  var shouldUpdate = false,
      currentTags = _get(data, 'tags', []).sort(),
      previousTags = _get(data, 'previousTags', []).sort();

  if (data.articleLimit !== data.previousArticleLimit || !_isEqual(currentTags, previousTags)) {
    data.previousArticleLimit = data.articleLimit;
    data.previousTags = data.tags;
    shouldUpdate = true;
  }

  return shouldUpdate;
}
/**
 * @param {string} ref
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise|Object}
 */


module.exports.render = function (ref, data, locals) {
  data.articleLimit = data.articleLimit || 10;
  data.previousArticleLimit = data.articleLimit;
  data.previousTags = data.tags;

  if (!has(data.feedElements)) {
    return pullLatestArticles(data, locals);
  }

  return data;
};
/**
 * @param {string} ref
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


module.exports.save = function (ref, data, locals) {
  sanitizeInputs(data);
  return shouldFeedUpdate(data) ? pullLatestArticles(data, locals) : handleExtraArticles(data, locals);
};

module.exports.sanitizeInputs = sanitizeInputs; // exported for testing
}, {"32":32,"37":37,"39":39,"43":43,"49":49,"53":53,"124":124,"166":166,"167":167,"168":168}];
window.modules["newsletter-flex-text.model"] = [function(require,module,exports){'use strict';

var _find = require(71),
    sanitize = require(39);

module.exports.save = function save(ref, data) {
  var tvShow = {},
      sanitizedShowName = '';

  if (data.pageShowName && data.subscriptionOption === 'tv recap') {
    tvShow = _find(data.tvShowsList, function (show) {
      sanitizedShowName = sanitize.toSmartText(sanitize.toPlainText(show.name));
      return sanitizedShowName.toLowerCase() === data.pageShowName.toLowerCase();
    }) || {};
  }

  data.title = tvShow.title || data.defaultTitle;
  data.description = tvShow.description || data.defaultDescription || data.description;
  data.newsletterId = tvShow.newsletterId || data.defaultNewsletterId;
  return data;
};
}, {"39":39,"71":71}];
window.modules["newsletter-image.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var striptags = require(42),
    utils = require(43),
    sanitize = require(39),
    mediaplay = require(53),
    styles = require(44),
    logger = require(81),
    log = logger.setup({
  file: __filename
}),
    allowedTags = ['strong', 'em', 'a']; // tags allowed in caption, credit, creditOverride

/**
 * Compiles styles if they're not empty
 * @param {string} uri
 * @param  {object} data
 * @return {Promise|object}
 */


function resolveStyles(uri, data) {
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }

  data.css = null;
  return data;
}
/**
 * Gets image type and credit from mediaplay
 * @param  {object} data
 * @return {Promise|object}
 */


function resolveMetadata(data) {
  if (!utils.isFieldEmpty(data.url)) {
    return mediaplay.getMediaplayMetadata(data.url).then(function (metadata) {
      // get image type, e.g. 'Photo'
      data.imageType = metadata.imageType; // override the credit if user has set an override,
      // otherwise use the credit grabbed from mediaplay

      if (!utils.isFieldEmpty(data.creditOverride)) {
        data.credit = data.creditOverride; // already sanitized
      } else {
        // make sure we sanitize the data coming from mediaplay
        data.credit = sanitize.toSmartText(striptags(metadata.credit, allowedTags));
      }

      return data;
    });
  }
}
/**
 * Sets mediaplay rendition, fetch and sanitize metadata, render custom styles
 * @param  {string} uri
 * @param  {object} data
 * @return {Promise}
 */


module.exports.save = function (uri, data) {
  // default to horizontal rendition
  if (utils.isFieldEmpty(data.rendition)) {
    data.rendition = 'horizontal';
  } // sanitize url and get proper rendition


  if (!utils.isFieldEmpty(data.url)) {
    data.url = mediaplay.getRendition(sanitize.toPlainText(data.url), data.rendition);
  } // sanitize caption


  if (!utils.isFieldEmpty(data.caption)) {
    data.caption = sanitize.toSmartText(striptags(data.caption, allowedTags));
  } // sanitize credit override


  if (!utils.isFieldEmpty(data.creditOverride)) {
    data.creditOverride = sanitize.toSmartText(striptags(data.creditOverride, allowedTags));
  } // resolve promises for styles, and mediaplay metadata


  return Promise.all([resolveStyles(uri, data), resolveMetadata(data)]).then(function () {
    return data;
  }).catch(log);
};

}).call(this,"/components/newsletter-image/model.js")}, {"39":39,"42":42,"43":43,"44":44,"53":53,"81":81}];
window.modules["newsletter-internal-promotion.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    _require = require(43),
    has = _require.has;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.rubric)) data.rubric = sanitize.toSmartText(data.rubric);
}
/**
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  sanitizeInputs(data);
  return data;
};
}, {"39":39,"43":43}];
window.modules["newsletter-mini-subheader.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    _require = require(43),
    has = _require.has;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.title)) data.title = sanitize.toSmartText(data.title);
}
/**
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  sanitizeInputs(data);
  return data;
};
}, {"39":39,"43":43}];
window.modules["newsletter-paragraph.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    productsService = require(77),
    utils = require(43);

module.exports.save = function (ref, data, locals) {
  data.text = sanitize.validateTagContent(sanitize.toSmartText(data.text || '')); // only add the inline product link attributes on publish
  // this ensures that kiln never sees the data-attributes
  // also improves the editing experience by only checking for links on publish, not on save

  return utils.isPublishedVersion(ref) ? productsService.addAmazonLinkTrackingAttributes(data, locals) : data;
};
}, {"39":39,"43":43,"77":77}];
window.modules["newsletter-product.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    _require = require(43),
    has = _require.has;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.rubric)) data.rubric = sanitize.toSmartText(data.rubric);
  if (has(data.title)) data.title = sanitize.toSmartText(data.title);
  if (has(data.description)) data.description = sanitize.toSmartText(data.description);
}
/**
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  sanitizeInputs(data);
  return data;
};
}, {"39":39,"43":43}];
window.modules["newsletter-quote.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    _require = require(43),
    has = _require.has;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.attribution)) data.attribution = sanitize.toSmartText(data.attribution);
}
/**
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  sanitizeInputs(data);
  return data;
};
}, {"39":39,"43":43}];
window.modules["newsletter-recirc.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    _require = require(53),
    getRendition = _require.getRendition,
    _get = require(32),
    _require2 = require(43),
    has = _require2.has,
    FIELDS = ['byline', 'canonicalUrl', 'feedImgUrl', 'teaser', 'primaryHeadline', 'tags'],
    QUERY_INDEX = 'published-articles';
/**
 * Gets the latest X articles to be used in the recirc unit
 * @param {Object} data
 * @param {Object} locals
 * @returns {Object}
 */


function pullLatestArticles(data, locals) {
  var query = queryService(QUERY_INDEX, locals),
      slug = _get(locals, 'site.slug', '');

  if (has(data.tags)) {
    data.tags.forEach(function (tag) {
      queryService.addMust(query, {
        term: {
          tags: tag.text
        }
      });
    });
  }

  queryService.addFilter(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  queryService.addFilter(query, {
    term: {
      site: slug
    }
  });
  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, data.articleLimit + data.excludeLimit);
  return queryService.searchByQuery(query).then(function (latestArticles) {
    if (data.excludeLatestStory) latestArticles.shift(); // Removes the latest story if true;

    var articles = latestArticles.map(function (article) {
      article.feedImgUrl = data.imageRendition ? getRendition(article.feedImgUrl, data.imageRendition, true) : article.feedImgUrl;
      return article;
    });
    data.feedElements = articles;
    return data;
  });
}
/**
 * Ensures that the feed always pulls the right amount of articles.
 * @param {Object} data
 */


function handleArticleLimit(data) {
  data.excludeLimit = data.excludeLatestStory ? 1 : 0;
}

;
/**
 * @param {string} ref
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise|Object}
 */

module.exports.render = function (ref, data, locals) {
  return pullLatestArticles(data, locals);
};
/**
 * @param {string} ref
 * @param {object} data
 * @param {Object} locals
 * @returns {object}
 */


module.exports.save = function (ref, data, locals) {
  handleArticleLimit(data);
  pullLatestArticles(data, locals);
  return data;
};
}, {"32":32,"43":43,"49":49,"53":53}];
window.modules["newsletter-section-header.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    _require = require(43),
    has = _require.has;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.headline)) data.headline = sanitize.toSmartText(data.headline);
  if (has(data.rubric)) data.rubric = sanitize.toSmartText(data.rubric);
  if (has(data.teaser)) data.teaser = sanitize.toSmartText(data.teaser);
}
/**
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  sanitizeInputs(data);
  return data;
};
}, {"39":39,"43":43}];
window.modules["newsletter-slideout.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (uri, data) {
  if (!!data.source && !data.source.includes('slideout')) {
    data.source = data.source + ' slideout';
  }

  return data;
};
}, {}];
window.modules["newsletter-story.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    _require = require(43),
    has = _require.has;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.readMoreUrl)) data.readMoreUrl = sanitize.toSmartText(data.readMoreUrl);
  if (has(data.readMoreTitle)) data.readMoreTitle = sanitize.toSmartText(data.readMoreTitle);
}
/**
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  sanitizeInputs(data);
  return data;
};
}, {"39":39,"43":43}];
window.modules["newsletter-subheader.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    _require = require(43),
    has = _require.has;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.title)) data.title = sanitize.toSmartText(data.title);
  if (has(data.subTitle)) data.subTitle = sanitize.toSmartText(data.subTitle);
}
/**
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  sanitizeInputs(data);
  return data;
};
}, {"39":39,"43":43}];
window.modules["nymag-latest-feed.model"] = [function(require,module,exports){'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _find = require(71),
    striptags = require(42),
    sanitize = require(39),
    queryService = require(49),
    callout = require(80),
    INDEX = 'published-articles',
    FIELDS = ['canonicalUrl', 'date', 'primaryHeadline', 'teaser', 'authors', 'pageUri', 'tags', 'featureTypes'],
    SITE_FIELDS = ['canonicalUrl', 'date', 'teaser', 'shortHeadline', 'primaryHeadline', 'authors', 'pageUri', 'tags', 'featureTypes'],
    allowedTags = ['em', 'i', 'strike', 's'];

function addCallout(article) {
  article.callout = callout(article);
  return article;
}
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
 * Sanitizes user-editable fields, and replaces with original text if empty
 * @param {array} articles
 */


function updateArticles(articles) {
  articles.forEach(function (article) {
    article.headline = sanitizeHeadline(article.headline) || article.origHeadline;
    article.teaser = sanitizeText(article.teaser) || article.origTeaser;
  });
}
/**
 * Creates a new article with fields for editing from a search result
 * @param {object} article
 * @returns {object}
 */


function createArticle(article) {
  return {
    canonicalUrl: article.canonicalUrl,
    origHeadline: article.primaryHeadline,
    headline: article.primaryHeadline,
    origTeaser: article.teaser,
    teaser: article.teaser,
    authors: article.authors,
    pageUri: article.pageUri,
    callout: callout(article),
    date: article.date
  };
}

function updateManualArticles(data, locals) {
  var query = queryService(INDEX, locals); // sanitize inputs

  updateArticles(data.manualArticles); // reset our list of current urls (accounts for any deleted)

  data.manualArticleUrls = data.manualArticles.map(function (article) {
    return article.canonicalUrl;
  }); // add any new articles to our list and dedupe

  if (data.newManualArticles && data.newManualArticles.length) {
    var _data$manualArticleUr;

    (_data$manualArticleUr = data.manualArticleUrls).unshift.apply(_data$manualArticleUr, _toConsumableArray(data.newManualArticles.split(',')));

    data.manualArticleUrls = _toConsumableArray(new Set(data.manualArticleUrls));
    data.newManualArticles = '';
  } // build query to fetch articles


  queryService.addFilter(query, {
    terms: {
      canonicalUrl: data.manualArticleUrls
    }
  });
  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSize(query, data.manualArticleUrls.length);
  return queryService.searchByQuery(query).then(function (results) {
    // sort the results in ascending order
    results.sort(function (a, b) {
      return a.date > b.date ? 1 : -1;
    }); // add results to our list only if we don't already have them
    // new results are added to the top in reverse-chronological order

    results.forEach(function (result) {
      if (!_find(data.manualArticles, function (article) {
        return article.canonicalUrl === result.canonicalUrl;
      })) {
        data.manualArticles.unshift(createArticle(result));
      }
    }); // if we're over the limit, trim from the end of the list

    if (data.articleLimit && data.manualArticles.length > data.articleLimit) {
      data.manualArticles = data.manualArticles.slice(0, data.articleLimit);
    } // reset our list of current urls


    data.manualArticleUrls = data.manualArticles.map(function (article) {
      return article.canonicalUrl;
    });
    return data;
  });
}

function buildTabQueries(data) {
  var queries = {};
  data.tabs.forEach(function (tab) {
    var query = queryService.newCuneiformQuery(INDEX);
    queryService.addSize(query, data.articleLimit);
    queryService.onlyWithTheseFields(query, SITE_FIELDS);
    queryService.addMust(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
    queryService.onlyWithinThisSite(query, {
      slug: tab.siteSlug
    });
    queryService.addSort(query, {
      date: 'desc'
    });

    if (tab.excludeTags && tab.excludeTags.length) {
      tab.excludeTags.forEach(function (tag) {
        queryService.addMustNot(query, {
          match: {
            tags: tag.text
          }
        });
      });
    }

    queries[tab.siteSlug] = query;
  });
  data.cuneiformQueries = queries;
}

function addArticleResultsToTabs(data) {
  data.tabs.forEach(function (tab) {
    tab.articles = data.cuneiformResults[tab.siteSlug].map(addCallout);
  });
}

module.exports.save = function (ref, data, locals) {
  if (data.mobileArticleLimit && data.tabletArticleLimit && data.desktopArticleLimit) {
    data.articleLimit = Math.max(data.mobileArticleLimit + 5, data.tabletArticleLimit, data.desktopArticleLimit);
  }

  return updateManualArticles(data, locals).then(function () {
    buildTabQueries(data, locals);

    if (data.cuneiformResults) {
      addArticleResultsToTabs(data);
    }

    return data;
  });
};
}, {"39":39,"42":42,"49":49,"71":71,"80":80}];
window.modules["nymag-lede-container.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  data.styleVariation = data.componentVariation || 'nymag-lede-container'; // // don't allow more than 3 articles on the default variation

  if (data.componentVariation === 'nymag-lede-container' && data.manualArticles.length > 3) {
    data.manualArticles = data.manualArticles.slice(0, 3);
  }

  return data;
};
}, {}];
window.modules["one-column-overflow.model"] = [function(require,module,exports){'use strict';
/**
 * update one-column-overflow
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */

module.exports.save = function (ref, data) {
  if (data.widthSpecifics) {
    data.width = data.widthSpecifics;
    data.widthSpecifics = null;
  }

  return data;
};
}, {}];
window.modules["ooyala-recirc-lede.model"] = [function(require,module,exports){(function (process,__filename){
'use strict';

var _get = require(32),
    // _isEmpty = require('lodash/isEmpty'),
_map = require(37),
    _set = require(87),
    querystring = require(171),
    toPlainText = require(39).toPlainText,
    rest = require(5),
    recircCmpt = require(103),
    videoServiceUrl = "".concat(window.process.env.VIDEO_FEED, "/popular"),
    queryService = require(49),
    originalVideoIndex = 'original-videos-all',
    fields = ['primaryHeadline', 'plaintextPrimaryHeadline', 'canonicalUrl', 'feedImgUrl', 'tags'],
    logger = require(81),
    log = logger.setup({
  file: __filename
}),
    ELASTIC_FIELDS = ['pageUri'];
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
/**
 * gather a set of video page links for display that are based on Ooyala's 'Most Popular'
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function getMostPopular(data, locals) {
  var params = {
    count: _get(data, 'links', 5),
    site: _get(locals, 'site.slug')
  }; // if (window.process.env.ELASTIC_PREFIX && !_isEmpty(window.process.env.ELASTIC_PREFIX)) {
  //  params.prefix = window.process.env.ELASTIC_PREFIX;
  // }

  return rest.get("".concat(videoServiceUrl, "?").concat(querystring.stringify(params)), {
    timeout: 4000
  }).then(function (items) {
    return _map(items, function (item) {
      return {
        primaryHeadline: item.primaryHeadline,
        plaintextPrimaryHeadline: toPlainText(item.primaryHeadline),
        canonicalUrl: item.canonicalUrl,
        feedImgUrl: item.feedImgUrl
      };
    });
  }).catch(function (err) {
    return log(err);
  });
}
/**
 * Get from elastic videos that match all the tags
 * requested in the tags filter
 * @param {Object} data
 * @param {Object} locals
 * @return {Promise}
 */


function getVideosByTags(data, locals) {
  var tags = data.filteredTags || [],
      query = queryService(originalVideoIndex, locals),
      order = data.orderDesc ? 'desc' : 'asc',
      site = _get(locals, 'site', {});

  queryService.addSize(query, data.links || 5);
  queryService.onlyWithinThisSite(query, site);
  queryService.onlyWithTheseFields(query, fields);
  tags.forEach(function (tag) {
    queryService.addShould(query, {
      match: {
        tags: tag.text
      }
    });
  });
  queryService.addMinimumShould(query, tags.length);
  queryService.addSort(query, {
    date: order
  });
  return queryService.searchByQuery(query).catch(function (err) {
    return log(err);
  });
}

module.exports.save = function (ref, data) {
  return Promise.resolve(data); // returning with a Promise for easier testing
};

module.exports.render = function (ref, data, locals) {
  var getVideoPromise = data.filter === 'filtered-by-tag' ? getVideosByTags : getMostPopular;
  return getVideoPromise(data, locals).then(function (results) {
    if (results && results.length) {
      return Promise.all( // wait for all articles to process
      results.map(function (articleData) {
        articleData.url = articleData.canonicalUrl; // add page URI for GA tracking

        return recircCmpt.getArticleDataAndValidate(ref, articleData, locals, ELASTIC_FIELDS).then(function (result) {
          return assignToData(articleData, result);
        });
      }));
    }

    return Promise.resolve([]);
  }).then(function (articles) {
    // update results before sending to view
    data.articles = articles;
    return data;
  });
};

}).call(this,require(22),"/components/ooyala-recirc-lede/model.js")}, {"5":5,"22":22,"32":32,"37":37,"39":39,"49":49,"81":81,"87":87,"103":103,"171":171}];
window.modules["ooyala-recirc.model"] = [function(require,module,exports){(function (process){
'use strict';

var _get = require(32),
    // _isEmpty = require('lodash/isEmpty'),
_lowerCase = require(172),
    _map = require(37),
    _set = require(87),
    toPlainText = require(39).toPlainText,
    querystring = require(171),
    queryService = require(49),
    rest = require(5),
    recircCmpt = require(103),
    videoServiceUrl = "".concat(window.process.env.VIDEO_FEED, "/popular"),
    index = 'original-videos-all',
    ELASTIC_FIELDS = ['pageUri'];
/**
 * translate UI labels from radio button options to related site values found in indexes and document stores
 * some labels, like `vulture`, do not require translation
 * @param {object} data
 * @returns {object}
 */


function setSiteFromSiteLabel(data) {
  var siteLabelsToSites = {
    'daily intelligencer': 'di',
    'grub street': 'grubstreet',
    'science of us': 'scienceofus',
    'select all': 'selectall',
    'the cut': 'wwwthecut'
  };
  data.site = siteLabelsToSites[data.siteLabel] || data.siteLabel;
  return data;
}
/**
 * calculate display count total based on number of rows and items per row
 * @param {object} data
 * @param {number} factor
 * @param {int} [minCount]
 * @returns {number}
 */


function getCount(data) {
  var linksPerRow = _get(data, 'linksPerRow', 1),
      rowCount = _get(data, 'rowCount', 1);

  return Math.ceil(linksPerRow * rowCount);
}
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
/**
 * gather a set of video page links for display that are based on Ooyala's 'Most Popular'
 * @param {object} data
 * @returns {object}
 */


function getMostPopular(data) {
  var params = {
    count: getCount(data)
  }; // if (window.process.env.ELASTIC_PREFIX && !_isEmpty(window.process.env.ELASTIC_PREFIX)) {
  //  params.prefix = window.process.env.ELASTIC_PREFIX;
  // }

  return rest.get("".concat(videoServiceUrl, "?").concat(querystring.stringify(params)), {
    timeout: 4000
  }).then(function (items) {
    data.articles = _map(items, function (item) {
      return {
        primaryHeadline: item.primaryHeadline,
        canonicalUrl: item.canonicalUrl,
        feedImgUrl: item.feedImgUrl
      };
    });
    return data;
  }).catch(function () {
    return data;
  });
}
/**
 * gather a set of links for the the most recently published video pages for a site
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function getLatestBySite(data, locals) {
  var count = getCount(data);
  var query = queryService.newQueryWithCount(index, count, locals);
  queryService.addFilter(query, {
    term: {
      site: data.site
    }
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query).then(function (results) {
    data.articles = results;
    return data;
  });
}

module.exports.save = function (ref, data) {
  data = setSiteFromSiteLabel(data);
  return Promise.resolve(data); // returning with a Promise for easier testing
};

module.exports.render = function (ref, data, locals) {
  var recircData = _lowerCase(_get(data, 'site', 'most popular')) === 'most popular' ? getMostPopular(data) : getLatestBySite(data, locals);
  return recircData.then(function () {
    var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      articles: []
    };
    return Promise.all( // wait for all articles to process
    results.articles.map(function (articleData) {
      articleData.url = articleData.canonicalUrl; // add page URI for GA tracking

      return recircCmpt.getArticleDataAndValidate(ref, articleData, locals, ELASTIC_FIELDS).then(function (result) {
        return assignToData(articleData, result);
      });
    }));
  }).then(function (articles) {
    // update results before sending to view
    data.articles = articles;
    return data;
  });
};

}).call(this,require(22))}, {"5":5,"22":22,"32":32,"37":37,"39":39,"49":49,"87":87,"103":103,"171":171,"172":172}];
window.modules["oscar-future.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    utils = require(43),
    mediaplay = require(53);
/**
 * Update and sanitize text
 * @param {object} data
 */


function updateText(data) {
  // Add smart quotes, etc to text
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.title)) {
    data.title = sanitize.toSmartText(striptags(data.title, ['em']));
  }

  if (!utils.isFieldEmpty(data.text)) {
    data.text = sanitize.toSmartText(striptags(data.text, ['em', 'strong', 'a']));
  }
}
/**
 * format image with a small square rendition
 * @param  {object} data
 */


function updateImage(data) {
  if (!utils.isFieldEmpty(data.imageUrl)) {
    data.imageUrl = mediaplay.getRendition(data.imageUrl, 'square-small');
  }
}

module.exports.save = function (uri, data) {
  updateText(data);
  updateImage(data);
  return data;
};
}, {"39":39,"42":42,"43":43,"53":53}];
window.modules["oscar-futures-grid.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    utils = require(43);

module.exports.save = function (uri, data) {
  // Add smart quotes, etc to text
  // Also strip out unwanted html tags
  if (!utils.isFieldEmpty(data.currentPrediction)) {
    data.currentPrediction = sanitize.toSmartText(striptags(data.currentPrediction, ['em', 'strong', 'a']));
  }

  return data;
};
}, {"39":39,"42":42,"43":43}];
window.modules["package-list.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    _map = require(37),
    _take = require(113),
    callout = require(80),
    _require = require(56),
    isComponent = _require.isComponent,
    index = 'published-articles',
    fields = ['primaryHeadline', 'plaintextPrimaryHeadline', 'canonicalUrl', 'featureTypes', 'tags', 'pageUri'];
/**
 * Add video/gallery callouts to each result
 *
 * @param {Array} results
 * @returns {Array}
 */


function decorateResults(results) {
  return _map(results, function (result) {
    return Object.assign({}, result, {
      callout: callout(result)
    });
  });
}
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var query = queryService.newQueryWithCount(index, 6, locals);
  var cleanUrl;

  if (!data.tag || !locals) {
    return data;
  }

  queryService.withinThisSiteAndCrossposts(query, locals.site);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addShould(query, {
    match: {
      tags: data.tag
    }
  });
  queryService.addMinimumShould(query, 1);
  queryService.addSort(query, {
    date: 'desc'
  }); // exclude the current page in results

  if (locals.url && !isComponent(locals.url)) {
    cleanUrl = locals.url.split('?')[0].replace('https://', 'http://');
    queryService.addMustNot(query, {
      match: {
        canonicalUrl: cleanUrl
      }
    });
  }

  return queryService.searchByQuery(query).then(function (results) {
    var limit = data.limit || 3;
    data.articles = decorateResults(_take(results, limit)); // show a maximum of <limit> links

    data.hasMore = results.length > limit;
    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"37":37,"49":49,"56":56,"80":80,"113":113}];
window.modules["package-navigation.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'published-articles',
    fields = ['plaintextShortHeadline', 'plaintextPrimaryHeadline', 'canonicalUrl', 'feedImgUrl', 'tags'];
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var query = queryService.newQueryWithCount(index, parseInt(data.count, 10) || 50, locals);
  queryService.withinThisSiteAndCrossposts(query, locals.site);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addFilter(query, {
    prefix: {
      tags: data.tag
    }
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query).then(function (results) {
    if (data.tag) {
      data.articles = results;
    }

    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"49":49}];
window.modules["page-message.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44),
    sanitize = require(39),
    striptags = require(42);

module.exports.save = function (ref, data) {
  data.text = sanitize.toSmartText(striptags(data.text, ['em', 'i', 'strong', 'b', 'span', 'a']));

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
}, {"39":39,"42":42,"43":43,"44":44}];
window.modules["page-subheader.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);
/**
 * save subheader
 * @param  {string} uri
 * @param  {object} data
 * @return {Promise}
 */


module.exports.save = function (uri, data) {
  var text = data.text || ''; // sanitize text input

  data.text = sanitize.validateTagContent(sanitize.toSmartText(text));
  return data;
};
}, {"39":39}];
window.modules["paginated-feed.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var queryService = require(49),
    formatStart = require(43).formatStart,
    INDEX = 'published-articles',
    _get = require(32),
    _map = require(37),
    _require = require(56),
    isPage = _require.isPage,
    _take = require(113),
    _require2 = require(110),
    sendError = _require2.sendError,
    _require3 = require(39),
    removeNonAlphanumericCharacters = _require3.removeNonAlphanumericCharacters,
    normalizeName = _require3.normalizeName,
    logger = require(81),
    log = logger.setup({
  file: __filename
}),
    fields = ['canonicalUrl', 'feedLayout', 'date', 'rubric', 'primaryHeadline', 'teaser', 'authors', 'secondaryAttribution', 'byline', 'feedImgUrl', 'tags', 'featureTypes', 'pageUri', 'syndicationStatus', 'crosspost', 'site'],
    siteFilterResolver = {
  current: queryService.withinThisSiteAndCrossposts,
  domain: queryService.onlyWithinThisDomain
};

function formatSize(locals, data) {
  return parseInt(locals.size, 10) || parseInt(data.size, 10) || 10;
}

function validateDataOffset(data) {
  return Math.max(data.offset || 0, 0);
}

function filterIncludeTags(query, data) {
  if (data.includeTags && data.includeTags.length) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, data.matchAllTags ? data.includeTags.length : 1);
  }
}

function filterExcludeTags(query, data) {
  if (data.excludeTags && data.excludeTags.length) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
    });
  }
}

function filterNormalizeTags(query, data, locals) {
  if (data.populationBehavior === 'route' && data.routeParam && locals) {
    var routeParamValue;

    if (isPage(locals.url)) {
      routeParamValue = locals[data.routeParam] || '';
    } else {
      routeParamValue = locals.params ? locals.params[data.routeParam] : '';
    }

    queryService.addMust(query, {
      match: {
        normalizedTags: removeNonAlphanumericCharacters(routeParamValue).toLowerCase()
      }
    });
  }
}

function buildSearchQuery(data, locals, isCuneiform) {
  var offset = validateDataOffset(data),
      from = locals ? formatStart(parseInt(locals.start, 10)) + offset : 0,
      size = locals ? formatSize(locals, data) : 10,
      query = isCuneiform ? queryService.newCuneiformQuery(INDEX) : queryService(INDEX, locals); // This is a hack to determine if the "Show More" button should appear.
  // Cuneiform does not return the total count of results that match the
  // query. If Cuneiform is able to return 1 more than the required # (size) of
  // results, then there is more to show.

  if (isCuneiform) {
    size++;
  }

  queryService.addSize(query, size);
  queryService.addFrom(query, from);

  if (locals && locals.site && siteFilterResolver[data.site]) {
    siteFilterResolver[data.site](query, locals.site);
  }

  if (data.authorName) {
    queryService.addShould(query, {
      match_phrase: {
        'secondaryAttribution.normalized': normalizeName(data.authorName)
      }
    });
    queryService.addShould(query, {
      match_phrase: {
        'authors.normalized': normalizeName(data.authorName)
      }
    });
    queryService.addMinimumShould(query, 1);
  }

  filterNormalizeTags(query, data, locals);
  filterIncludeTags(query, data);
  filterExcludeTags(query, data);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addSort(query, {
    date: 'desc'
  });

  if (!data.nonFeedArticles) {
    queryService.addMust(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
  }

  return query;
}

function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  }

  return [];
}

module.exports.render = function (uri, data, locals) {
  var offset = validateDataOffset(data),
      query,
      from = formatStart(parseInt(locals.start, 10)),
      isFirstPage = from === 0;
  var size = locals ? formatSize(locals, data) : 10;

  if (isFirstPage) {
    from += offset;
  } // if the `start` property is 0 and the populated behavior is not dynamic, use Cuneiform if not use Elastic. If `from`
  // is not zero, it means that a url parameter was set. Cuneiform doesn't
  // handle url params, which is why we're falling back to Elastic for paginated
  // results. Dynamic behavior will use an Elastic query. Static behavior will use a Cuneiform for the results


  if (!isFirstPage || data.populationBehavior !== 'static') {
    // query Elastic
    query = buildSearchQuery(data, locals);
    queryService.addSize(query, size);
    queryService.addFrom(query, from);
    return queryService.searchByQueryWithRawResult(query).then(function (results) {
      if (data.populationBehavior === 'route' && !results.hits.total && !locals.edit && locals.params) {
        return Promise.reject({
          routeNoResult: true
        });
      }

      data.total = _get(results, 'hits.total');
      data.articles = _map(_get(results, 'hits.hits'), '_source');
      data.from = from;
      data.start = from + size;
      data.showMoreArticles = data.total > data.start;
      return data;
    }).catch(function (error) {
      if (error.routeNoResult) {
        sendError("No results for tag: ".concat(locals.params[data.routeParam]), 404);
      }

      log('error', error, {
        action: 'render',
        uri: uri
      });
      return data;
    });
  } else {
    // use Cuneiform results
    if (_get(data, 'cuneiformResults', []).length) {
      data.articles = _take(data.cuneiformResults, size); // If Cuneiform is able to return more results than the required #, then
      // there are more articles to show.

      data.showMoreArticles = data.cuneiformResults.length > size;
    } else {
      data.articles = [];
      data.showMoreArticles = false;
      log('warn', "No articles from Cuneiform for ".concat(uri), {
        action: 'render',
        uri: uri
      });
    }

    data.start = from + size;
    return data;
  }
};

module.exports.save = function (ref, data, locals) {
  if (data.size && !isNaN(data.size)) {
    data.size = data.size;
  }

  if (data.adFrequency) {
    data.adFrequency = data.adFrequency;
  }

  if (data.populationBehavior === 'static') {
    data.cuneiformScopes = getScopes(data.scopes);
    data.cuneiformQuery = buildSearchQuery(data, locals, true);
  } else if (data.cuneiformScopes || data.cuneiformQuery) {
    delete data.cuneiformScopes;
    delete data.cuneiformQuery;
  }

  return data;
};

}).call(this,"/components/paginated-feed/model.js")}, {"32":32,"37":37,"39":39,"43":43,"49":49,"56":56,"81":81,"110":110,"113":113}];
window.modules["panotour.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  var url = data.url,
      embedCode = url && url.match(/src=['"](.*?)['"]/i); // find first src="(url)"
  // if they pasted in a full embed code, parse out the url

  if (embedCode) {
    data.url = embedCode[1];
  }

  return data;
};
}, {}];
window.modules["picks-link.model"] = [function(require,module,exports){'use strict';

var _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    ELASTIC_FIELDS = ['primaryHeadline', 'authors', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    authors: result.authors,
    plaintextTitle: toPlainText(result.primaryHeadline),
    pageUri: result.pageUri
  }));

  return data;
}

module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
};
}, {"39":39,"57":57,"59":59,"103":103}];
window.modules["picks-links-container.model"] = [function(require,module,exports){'use strict';

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
window.modules["product-generator-product.model"] = [function(require,module,exports){'use strict';

var mediaPlay = require(53);

module.exports.save = function (uri, data) {
  if (data.productImage) {
    data.productImage = mediaPlay.getRenditionUrl(data.productImage, {
      w: 220,
      h: 250,
      r: '2x'
    }, false);
  }

  return data;
};
}, {"53":53}];
window.modules["product-hit.model"] = [function(require,module,exports){'use strict';

var productsService = require(77);

module.exports.save = function (uri, data, locals) {
  var product = {
    url: data.buyUrl,
    text: data.title
  };

  if (data.buyUrl) {
    return productsService.addProductIdToProduct(product, locals).then(function (product) {
      data.productId = product.productId;
      return data;
    }).then(function (data) {
      data.buyUrlWithSubtag = productsService.generateBuyUrlWithSubtag(data.buyUrl, data.productId, locals);
      return data;
    });
  }

  ;
  return data;
};
}, {"77":77}];
window.modules["product.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var striptags = require(42),
    _includes = require(33),
    _isString = require(164),
    _get = require(32),
    _head = require(25),
    _intersection = require(173),
    _map = require(37),
    _filter = require(51),
    _assign = require(57),
    _pickBy = require(59),
    _has = require(105),
    mediaPlay = require(53),
    productsService = require(77),
    rest = require(5),
    sanitize = require(39),
    utils = require(43),
    queryService = require(49),
    log = require(81).setup({
  file: __filename,
  action: 'product'
});
/**
 * removes html tags froms strings
 * @param {string} text
 * @param {array} allowTags
 * @returns {string}
 */


function cleanText(text, allowTags) {
  var allowedTags = ['strong', 'em', 'a', 'i'];
  return sanitize.toSmartText(striptags(text, allowTags ? allowedTags : []));
}
/**
 * removes empty paragraphs
 * @param  {object} description
 * @param {string} uri
 * @param {string} variation
 * @returns {Promise}
 */


function removeEmptyParagraphs(description, uri, variation) {
  if (variation !== 'product_mini') return description;
  return rest.get(utils.uriToUrl(uri + '.json')).then(function (resp) {
    var validComponents = _map(resp.description, function (data) {
      var ref = data._ref,
          isClayParagraph = ref && ref.indexOf('/clay-paragraph/') > -1;
      if (isClayParagraph ? !!data.text : true) return ref;
    });

    return _filter(description, function (data) {
      return validComponents.indexOf(data._ref) > -1;
    });
  }).catch(function () {
    return description;
  });
}

;
/**
 * sanitizes text labels and pads prices
 * @param {object} data
 */

function updateText(data) {
  // all text labels (except for image captions) are stripped of html tags
  _assign(data, _pickBy({
    name: cleanText(data.name, true),
    vendor: cleanText(data.vendor, false),
    imageCaption: cleanText(data.imageCaption, true),
    imageCreditOverride: cleanText(data.imageCreditOverride, true)
  }, Boolean));
}
/**
 * sets product image rendition
 * @param {object} data
 */


function updateImage(data) {
  if (!utils.isFieldEmpty(data.imageUrl)) {
    if (utils.isFieldEmpty(data.imageRendition)) {
      data.imageRendition = 'horizontal';
    }

    data.imageUrl = mediaPlay.getRendition(data.imageUrl, data.imageRendition);
  }
}
/**
 * sets product images credit and caption
 * @param {object} data
 * @returns {Promise}
 */


function updateImageMetadata(data) {
  return mediaPlay.getMediaplayMetadata(data.imageUrl).then(function (metadata) {
    try {
      var renditionDimensions = mediaPlay.getCalculatedRenditionDimensionsFromMetadata(data.imageRendition, metadata);
      data.imageRenditionWidth = renditionDimensions.width;
      data.imageRenditionHeight = renditionDimensions.height;
    } catch (err) {
      log('error', 'Failed to Calculate Rendition Width/Height for Product Image', {
        message: err.message,
        uri: data.uri,
        rendition: data.imageRendition
      });
      data.imageRenditionWidth = null;
      data.imageRenditionHeight = null;
    }

    data.imageType = metadata.imageType;

    if (_isString(data.imageCreditOverride) && !utils.isFieldEmpty(data.imageCreditOverride)) {
      data.imageCredit = data.imageCreditOverride;
    } else {
      data.imageCredit = metadata.credit;
    }

    return data;
  });
}
/**
 * Appends newly added unique buy urls to the buyUrlHistory property
 * We look to the published version for the buyUrlHistory,
 * because there is no reason to store all of the url's entered in edit mode
 * @param  {object} data
 * @param  {object} prevPublishedData
 * @return {{buyUrlHistory: Array}}
 */


function updateBuyUrlHistory(data, prevPublishedData) {
  var buyUrl = data.buyUrl;
  data.buyUrlHistory = prevPublishedData.buyUrlHistory || [];

  if (buyUrl && !_includes(data.buyUrlHistory, buyUrl)) {
    data.buyUrlHistory.push(buyUrl);
  }

  return data;
}
/**
 * adds a product id on publish if it does not already exist
 * @param  {object} data
 * @param  {object} prevPublishedData
 * @param  {object} locals
 * @return {Promise.<object>}
 */


function updateProductId(data, prevPublishedData, locals) {
  var previousBuyUrl = _get(prevPublishedData, 'buyUrl'),
      newBuyUrl = _get(data, 'buyUrl');

  if (previousBuyUrl === newBuyUrl) {
    // the buyUrl has not changed, so do not update productId
    data.productId = prevPublishedData.productId;
    return Promise.resolve(data);
  }

  if (!data.buyUrl) {
    // there is no buyUrl, so do not attempt to set the productId
    return Promise.resolve(data);
  } // get the id based on the buyUrl


  return productsService.getProductIdFromUrl(data.buyUrl, locals).then(function (idFromUrl) {
    return idFromUrl || productsService.generateId(locals);
  }).then(function (productId) {
    data.productId = productId;
    return data;
  });
}
/**
 * creationDate should be set the first time a product id is created
 * creationDate should be reset the first time it is published
 * once creationDate is set on the published version, it should not change
 * @param {string} uri
 * @param {object} data
 * @param {object} prevPublishedData
 * @returns {object}
 */


function setCreationDate(uri, data, prevPublishedData) {
  var isNewEditableProductId = data.productId && !data.creationDate,
      buyUrlChanged = prevPublishedData.buyUrl && data.buyUrl !== prevPublishedData.buyUrl; // do not change the published creation date if buyUrl has not been changed

  if (prevPublishedData.creationDate && !buyUrlChanged) {
    data.creationDate = prevPublishedData.creationDate;
  } else if (isNewEditableProductId || utils.isPublishedVersion(uri) || buyUrlChanged) {
    data.creationDate = Date.now(); // UTC
  }

  return data;
}
/**
 * set the canonical url from the locals
 * @param {object} data
 * @param {object} locals
 */


function setCanonicalUrl(data, locals) {
  if (_get(locals, 'publishUrl')) {
    data.canonicalUrl = locals.publishUrl;
  }
}
/**
 * set sale percentage (discount off original price)
 * @param {object} data
 */


function setSalePercentage(data) {
  var salePercentage;

  if (!data.salePrice || !parseInt(data.salePrice)) {
    data.salePercentage = '';
    return;
  }

  salePercentage = Math.round(100 - 100 * Math.round(parseFloat(data.salePrice)) / Math.round(parseFloat(data.priceLow)));

  if (salePercentage > 0 && salePercentage < 100) {
    data.salePercentage = salePercentage;
  } else {
    data.salePrice = '';
    data.salePercentage = '';
  }
}
/**
 * clear the value of the priceOverride property with the original or sale price
 * @param {object} data
 * @param {object} prevPublishedData
 */


function removePriceOverride(data, prevPublishedData) {
  if (!!data.priceOverride && data.priceLow) {
    if (data.priceLow !== prevPublishedData.priceLow || data.salePrice !== prevPublishedData.salePrice) {
      data.priceOverride = '';
    }
  }
}

function updateProductData(uri, data, locals) {
  return rest.get(utils.uriToUrl(utils.ensurePublishedVersion(uri), locals)) // it is ok if published version does not exist yet
  .catch(function () {
    return {};
  }).then(function (prevPublishedData) {
    updateBuyUrlHistory(data, prevPublishedData);
    removePriceOverride(data, prevPublishedData);
    return updateProductId(data, prevPublishedData, locals).then(function (data) {
      return setCreationDate(uri, data, prevPublishedData);
    });
  }).then(updateImageMetadata).then(function (data) {
    data.buyUrlWithSubtag = productsService.generateBuyUrlWithSubtag(data.buyUrl, data.productId, locals);

    if (data.buyUrl2) {
      data.buyUrlWithSubtag2 = productsService.generateBuyUrlWithSubtag(data.buyUrl2, data.productId, locals);
    }

    return data;
  });
}

function checkForVendorMatch(data) {
  if (_includes(data.buyUrl, 'amazon.com')) {
    data.vendor = 'Amazon';
  } else if (data.vendor === 'Amazon') {
    data.vendor = '';
  }

  return data;
}
/**
 * @param  {string} url
 * @param  {object} locals
 * @return {Promise}
 */


function getArticleTags(url, locals) {
  var query = queryService.onePublishedArticleByUrl(url, ['tags'], locals);
  return queryService.searchByQuery(query).catch(function () {
    return [];
  }).then(function (result) {
    var headResult = _head(result);

    return headResult && headResult.tags ? headResult.tags : [];
  });
}
/**
 * Only show a Narrativ buy button if the product's vendor is Amazon
 * @param {string} vendor
 * @returns {boolean}
 */


function checkVendorForNarrativBuyButton(vendor) {
  return _isString(vendor) && vendor.toLowerCase() === 'amazon';
}
/**
 * Only show a Narrativ buy button if none of our tags to exclude
 * are found within the article/page's tags
 * @param {array} tags
 * @returns {boolean}
 */


function checkPageTagsForNarrativBuyButton(tags) {
  var tagsToExclude = ['sales sales sales', 'deal of the day', 'amazon', 'printed matter', "people's choice"];
  return _intersection(tags, tagsToExclude).length === 0;
}
/**
 * Set showNarrativBuyButton property based on vendor and tags
 * @param {string} localUrl
 * @param {object} locals
 * @param {object} data
 * @returns {Promise}
 */


function setShowNarrativBuyButton(localUrl, locals, data) {
  return getArticleTags(localUrl, locals).then(function (tags) {
    // set property to show second buy button (for Narrativ)
    data.showNarrativBuyButton = checkVendorForNarrativBuyButton(data.vendor) && checkPageTagsForNarrativBuyButton(tags);
    return data;
  });
}
/**
 * Activates validation requirements for second buy button
 * @param {object} data
 */


function setSecondBuyButtonValidation(data) {
  if (data.priceLow2 || data.vendor2 || data.buyUrl2) {
    data.setSecondBuyButton = true;
  } else {
    data.setSecondBuyButton = false;
  }
}
/**
 * updates disableAmazonSync property based on dealOfTheDay and sets the expiration date
 * @param {object} data
 */


function updateSyncAndSetExpiration(data) {
  var expirationDate;

  if (data.dealOfTheDay) {
    expirationDate = new Date(); // if deal of the day is true, set amazon sync to true

    data.disableAmazonSync = true; // set the expiration date to 3am the next day per amazon deal of the day specifications

    expirationDate.setHours(0, 0, 0, 0);
    expirationDate.setDate(expirationDate.getDate() + 1);
    expirationDate.setHours(expirationDate.getHours() + 3);
    data.dealOfTheDayExpiration = expirationDate;
  } else if (data.dealOfTheDayExpiration) {
    delete data.dealOfTheDayExpiration;
  }
}
/**
 * Checks for dealOfTheDay and if current date is beyond the expiration date, set AmazonSync and dealOfTheDay to false
 * @param {object} data
 */


function checkDealOfTheDayExpiration(data) {
  var currDate, dealOfTheDayExpirationDate;

  if (_has(data, 'dealOfTheDayExpiration')) {
    currDate = new Date(), dealOfTheDayExpirationDate = new Date(data.dealOfTheDayExpiration);

    if (currDate > dealOfTheDayExpirationDate) {
      data.disableAmazonSync = false;
      data.dealOfTheDay = false;
    }
  }
}

module.exports.render = function (uri, data, locals) {
  var localUrl = locals.url,
      isPublishedInstance = utils.isPublishedVersion(uri),
      isBeingPublished = !!_get(locals, 'publishUrl');
  checkDealOfTheDayExpiration(data); // `isBeingPublished` and `isPublishedInstance` are both true when
  // component render is called during the page publishing chain

  if (!localUrl || isBeingPublished || !isPublishedInstance) {
    return data;
  }

  localUrl = utils.urlToCanonicalUrl(localUrl);
  return Promise.all([setShowNarrativBuyButton(localUrl, locals, data), productsService.syncDataFromEntity(data, locals)]).then(function () {
    return data;
  }).catch(function () {
    return data;
  });
};

module.exports.save = function (uri, data, locals) {
  var isBeingPublished = !!_get(locals, 'publishUrl');
  setSecondBuyButtonValidation(data); // only do this stuff for component instances not for component base

  if (utils.isInstance(uri)) {
    updateText(data);
    setSalePercentage(data);
    updateImage(data);
    setCanonicalUrl(data, locals);
    updateSyncAndSetExpiration(data);
    checkForVendorMatch(data);

    if (isBeingPublished) {
      return updateProductData(uri, data, locals);
    } else {
      return Promise.all([updateProductData(uri, data, locals), removeEmptyParagraphs(data.description, uri, data.componentVariation)]).then(function (res) {
        if (res[0].description) res[0].description = res[1];
        return res[0];
      });
    }
  }

  return data;
}; // For testing


module.exports.checkVendorForNarrativBuyButton = checkVendorForNarrativBuyButton;
module.exports.checkForVendorMatch = checkForVendorMatch;
module.exports.checkPageTagsForNarrativBuyButton = checkPageTagsForNarrativBuyButton;
module.exports.removeEmptyParagraphs = removeEmptyParagraphs;
module.exports.checkDealOfTheDayExpiration = checkDealOfTheDayExpiration;

}).call(this,"/components/product/model.js")}, {"5":5,"25":25,"32":32,"33":33,"37":37,"39":39,"42":42,"43":43,"49":49,"51":51,"53":53,"57":57,"59":59,"77":77,"81":81,"105":105,"164":164,"173":173}];
window.modules["products-like-this.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    utils = require(43),
    productsService = require(77),
    _get = require(32),
    _set = require(87),
    _pick = require(174),
    _map = require(37),
    _require = require(56),
    isComponent = _require.isComponent,
    index = 'published-products',
    productIdField = 'productId',
    buyUrlField = 'buyUrl',
    nameField = 'name',
    imgUrlField = 'imageUrl',
    requiredFieldsForItems = [buyUrlField, 'imageUrl', 'imageRendition'],
    fieldsForItems = requiredFieldsForItems.concat([productIdField, nameField, 'suppressSkimLinks', 'imageAlt', 'imageRendition', 'priceOverride', 'priceLow', 'priceHigh', 'vendor']),
    requiredFieldsExistQueries = requiredFieldsForItems.map(function (requiredField) {
  return {
    exists: {
      field: requiredField
    }
  };
}),
    requiredFieldsEmptyStringQueries = requiredFieldsForItems.map(function (requiredField) {
  return {
    term: _set({}, requiredField, '')
  };
}),
    COLORS = ['blue', 'red', 'yellow', 'green', 'black', 'white', 'orange', 'purple'],
    MAXIMUM_PRODUCT_COUNT = 20; // maximum number of products to be queried against in more_like_this

/**
 * adds amazon subtag and associate id to query param of each buy link
 * this component allows for a custom amazon associate ID; therefore this is required
 * if not an amazon link, then the link is copied to buyUrlWithAmazonQuery
 * @param {object} locals
 * @param {object} data
 * @returns {object}
 */


function addAmazonQueryParams(locals, data) {
  data.products = data.products.map(function (product) {
    var productUrl = product[buyUrlField];
    product.buyUrlWithAmazonQuery = productsService.generateBuyUrlWithSubtag(productUrl, product[productIdField], locals, data.amazonId) || productUrl;
    return product;
  });
  return data;
}
/**
 * query elastic search to get products like the products on this article
 * @param {number} size
 * @param {object} data
 * @param {object} locals
 * @param {Array} productsOnThisArticle
 * @returns {Promise.<Array>}
 */


function getProductsLikeThis(size, data, locals, productsOnThisArticle) {
  var query = queryService(index, locals),
      filterByAffiliates = false,
      productIds = productsOnThisArticle.map(function (product) {
    return _pick(product, '_id');
  }).slice(0, MAXIMUM_PRODUCT_COUNT);

  if (!productsOnThisArticle.length) {
    return Promise.resolve([]);
  }

  queryService.addSize(query, size);
  queryService.onlyWithTheseFields(query, fieldsForItems);
  queryService.addShould(query, {
    dis_max: {
      queries: [{
        more_like_this: {
          fields: [nameField],
          like: productIds,
          min_term_freq: 1,
          // words of interest are not expected to occur more than once in name
          max_query_terms: 5,
          // keep low to reduce noise
          min_doc_freq: 2,
          // especially helpful for testing few articles
          boost: 2,
          stop_words: COLORS
        }
      }, {
        more_like_this: {
          fields: ['es_descriptionCombined'],
          like: productIds,
          min_term_freq: 2,
          max_query_terms: 5,
          // keep low to reduce noise
          min_doc_freq: 1,
          // especially helpful for testing few articles
          boost: 1,
          stop_words: COLORS
        }
      }]
    }
  }); // exclude results that have the same productId as the current article
  // NOTE: this has limited filtering efficacy if the index
  // has duplicate entries for a given product

  queryService.addMustNot(query, productsOnThisArticle.map(function (product) {
    return {
      term: _pick(product, productIdField)
    };
  })); // exclude results that have the same buyUrl

  queryService.addMustNot(query, productsOnThisArticle.map(function (product) {
    return {
      term: _pick(product, buyUrlField)
    };
  })); // exclude results that have the same product image url

  queryService.addMustNot(query, productsOnThisArticle.map(function (product) {
    return {
      term: _pick(product, imgUrlField)
    };
  })); // ensure all results have the required fields

  queryService.addMustNot(query, requiredFieldsEmptyStringQueries);
  queryService.addMust(query, requiredFieldsExistQueries); // sometimes we want to display products provided by Amazon

  if (data.showAmazonProducts) {
    filterByAffiliates = true;
    queryService.addShould(query, [{
      wildcard: {
        buyUrl: '*amazon.com*'
      }
    }]);
  } // sometimes we want to display products provided by Narrativ


  if (data.showNarrativProducts) {
    filterByAffiliates = true;
    queryService.addShould(query, [{
      wildcard: {
        buyUrl: '*shop-links.co*'
      }
    }]);
  } // set a minumum number of should statements that should match
  // based on whether any affiliates are selected


  if (filterByAffiliates) {
    queryService.addMinimumShould(query, 2);
  } else {
    // set minimum number of should statements that should match
    // based on the more-like-this query
    queryService.addMinimumShould(query, 1);
  }

  return queryService.searchByQuery(query);
}
/**
 * clear custom field values on save if 'all' is selected
 * @param {object} data
 */


function clearCustom(data) {
  if (data.showAffiliates === 'all') {
    data.showAmazonProducts = false;
    data.showNarrativProducts = false;
  }
}
/**
 * query the product index for products that are on this article
 * NOTE: products are matched by canonicalUrl, and therefore returns
 * no products before the page has been published
 * @param {object} locals
 * @returns {Promise.<[{_id: string, productId: string, buyUrl: string, imageUrl: string, name: string}]>}
 */


function getProductsOnThisArticle(locals) {
  var query = queryService(index, locals);
  queryService.onlyWithTheseFields(query, [productIdField, buyUrlField, imgUrlField]);
  queryService.addSize(query, 100); // retrieve up to 100 products on an article

  queryService.addMust(query, {
    term: {
      canonicalUrl: utils.urlToCanonicalUrl(locals.url)
    }
  });
  return queryService.searchByQueryWithRawResult(query).then(function (productUrisResult) {
    return _get(productUrisResult, 'hits.hits', []).map(function (product) {
      return Object.assign(_pick(product, '_id'), _pick(_get(product, '_source'), [productIdField, buyUrlField, imgUrlField, nameField]));
    });
  });
}
/**
 * set all products to display horizontal image-rendition
 * @param {array} products
 * @returns {array}
 */


function setHorizontalRendition(products) {
  return _map(products, function (product) {
    return _set(product, 'imageRendition', 'horizontal');
  });
}
/**
 * gets products like the one on the article of the current page
 * note: this uses canonicalUrl from locals, so requesting any url other than the canonical url will return different results
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise|object}
 */


function render(ref, data, locals) {
  var size = 5; // return early if request is not for a page, or is edit mode

  if (isComponent(locals.url) || locals.edit) {
    return data;
  }

  return getProductsOnThisArticle(locals).then(function (productsOnThisArticle) {
    return getProductsLikeThis(size * 2, data, locals, productsOnThisArticle);
  }).then(function (productsLikeThis) {
    return productsService.removeDuplicateProducts(productsLikeThis);
  }).then(setHorizontalRendition).then(function (productsLikeThis) {
    data.products = productsLikeThis.slice(0, size);
    return addAmazonQueryParams(locals, data);
  }).catch(function (e) {
    return queryService.logCatch(e, "".concat(ref, ": {e.message}")) || data;
  }); // log es error, but still render component
}

module.exports.save = function (ref, data) {
  clearCustom(data); // if custom is selected but neither amazon or narrativ is checked
  // default showAffilates back to all

  if (data.showAffiliates === 'custom') {
    if (!data.showAmazonProducts && !data.showNarrativProducts) {
      data.showAffiliates = 'all';
    }
  }

  return data;
};

module.exports.render = render;
}, {"32":32,"37":37,"43":43,"49":49,"56":56,"77":77,"87":87,"174":174}];
window.modules["pubble.model"] = [function(require,module,exports){'use strict';

var rest = require(5),
    PUBBLE_ENDPOINT = 'https://www.pubble.io/api/init.htm';
/**
 * send a request to the pubble api to grab info for the specific embed
 * @param {object} data
 * @param {string} data.id
 * @returns {Promise}
 */


function addPubbleInfo(data) {
  var url = "".concat(PUBBLE_ENDPOINT, "?v=1467363787626&appID=").concat(data.id);
  return rest.getJSONP(url).then(function (res) {
    data.name = res.appName;
    data.startDate = new Date(res.startDate.time).toISOString();
    return data;
  });
}

module.exports.save = function (ref, data) {
  var id = data.id; // if the ID is empty, pass it on
  // if the ID is a 5-digit number, pass it on
  // otherwise, assume it's a pasted embed code and parse that for the ID
  // note: we assume all pebble ids are 5-digit numbers

  if (!id) {
    return data;
  } else if (id.length && !id.match(/^\d{5}$/)) {
    var matches = id.match(/\d{5}/);

    if (matches) {
      data.id = matches[0];
    } else {
      throw new Error('Cannot find Pubble ID!');
    }
  } // if there's an id, grab data from pubble's api. otherwise, just save it


  return data.id && data.id.length ? addPubbleInfo(data) : data;
};
}, {"5":5}];
window.modules["pubexchange.model"] = [function(require,module,exports){'use strict';

var _values = require(60),
    rest = require(5),
    utils = require(43),
    cachePromise = require(175),
    PUB_EXCHANGE_ENDPOINT = 'https://cdn2.pubexchange.com/json/',
    CACHE_TTL = 1000 * 60 * 30; // 30 minutes


var cachedGetArticles = cachePromise.init(getArticles, CACHE_TTL);
/**
 * grab articles from the PubExchange API
 * @param {string} apiPath - the path that appends the PubExchange API url
 * @returns {array}
 */

function getArticles(apiPath) {
  var requestUrl = PUB_EXCHANGE_ENDPOINT + apiPath;
  return rest.get(requestUrl).then(function (res) {
    return res.external.partners.map(getArticle);
  }).catch(function () {
    return [];
  });
}

;
/**
 * From a partner object as it appears in the PubExchange API response,
 * derive an article object to be stored in this component.
 * @param {object} partner
 * @returns {object}
 */

function getArticle(partner) {
  var article = _values(partner.articles)[0];

  article.publication_name = partner.name;
  return article;
}

module.exports.render = function (ref, data, locals) {
  if (locals && locals.edit || data.disabled) {
    data.articles = [];
    return data;
  }

  return cachedGetArticles(data.apiPath).then(function (articles) {
    // Truncate articles in excess of articleNumber
    if (utils.has(data.articleNumber)) {
      data.articles = articles.slice(0, data.articleNumber);
    } else {
      data.articles = articles;
    }

    return data;
  });
};

module.exports.save = function (ref, data) {
  return data;
}; // for testing only; allows resetting cache


module.exports.clearCache = function () {
  cachedGetArticles = cachePromise.init(getArticles, CACHE_TTL);
};
}, {"5":5,"43":43,"60":60,"175":175}];
window.modules["pull-quote.model"] = [function(require,module,exports){'use strict';

var prettyQuotes = require(176);

module.exports.save = function (uri, data) {
  // goes through the quote and replaces quotation marks with the html entity
  // then remove those HTML entities while setting a field 'hasQuoteMarks' to true
  // so that the template will render the appropriate quotation mark graphic
  data.quote = prettyQuotes.quotesToEntities(data.quote);

  if (prettyQuotes.hasQuoteMarks(data.quote)) {
    data.hasQuoteMarks = true;
    data.quote = prettyQuotes.removeQuoteEntities(data.quote, '').updatedString;
  }

  return data;
};
}, {"176":176}];
