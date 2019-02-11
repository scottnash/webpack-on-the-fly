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
