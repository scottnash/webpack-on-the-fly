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
