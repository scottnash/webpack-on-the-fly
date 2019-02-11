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
