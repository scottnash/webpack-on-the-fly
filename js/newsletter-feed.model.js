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
