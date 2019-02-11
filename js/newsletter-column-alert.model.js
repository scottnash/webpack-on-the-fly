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
