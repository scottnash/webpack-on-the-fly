window.modules["collection-articles-lede.model"] = [function(require,module,exports){'use strict';

var _findIndex = require(79),
    _map = require(37),
    callout = require(80),
    queryService = require(49),
    striptags = require(42),
    sanitize = require(39),
    INDEX = 'published-articles',
    FIELDS = ['canonicalUrl', 'primaryHeadline', 'shortHeadline', 'teaser', 'feedImgUrl', 'rubric', 'authors', 'featureTypes', 'tags', 'pageUri'];
/**
 * Convert include and exclude tags to lowercase
 * @param {object} data
 */


function convertTagsLowercase(data) {
  if (data.includeTags) {
    data.includeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }

  if (data.excludeTags) {
    data.excludeTags.forEach(function (tag) {
      tag.text = tag.text.toLowerCase();
    });
  }
}
/**
 * Only allow emphasis, italic, and strikethroughs in headlines
 * @param {string} oldHeadline
 * @returns {string}
 */


function stripHeadlineTags(oldHeadline) {
  var newHeadline = striptags(oldHeadline || '', ['em', 'i', 'strike', 's']);
  return newHeadline;
}
/**
 * Given an article search result, assign required properties to an article slot.
 * When the article doesn't exist, article slot properties are reset.
 * @param {object} data
 * @param {object} articleSlot
 * @param {object} article
 */


function assignArticleProperties(data, articleSlot, article) {
  if (article) {
    articleSlot.canonicalUrl = article.canonicalUrl;
    articleSlot.primaryHeadline = article.primaryHeadline;
    articleSlot.shortHeadline = article.shortHeadline;
    articleSlot.teaser = article.teaser;
    articleSlot.feedImgUrl = article.feedImgUrl;
    articleSlot.rubric = article.rubric;
    articleSlot.shortHeadline = article.shortHeadline;
    articleSlot.authors = article.authors;
    articleSlot.callout = callout(article);
    articleSlot.pageUri = article.pageUri;
    articleSlot.headline = article[data.headlineSelected];
  } else {
    articleSlot.canonicalUrl = '';
    articleSlot.primaryHeadline = '';
    articleSlot.shortHeadline = '';
    articleSlot.teaser = '';
    articleSlot.feedImgUrl = '';
    articleSlot.rubric = '';
    articleSlot.authors = '';
    articleSlot.callout = '';
    articleSlot.pageUri = '';
    articleSlot.headline = '';
  }
}
/**
 * Restrict the query by site depending on the behavior selected
 * @param {object} query
 * @param {object} data
 * @param {string} site
 */


function setSite(query, data, site) {
  if (!data.site || !site) {
    return;
  }

  switch (data.site) {
    case 'current':
      queryService.withinThisSiteAndCrossposts(query, site);
      break;

    case 'domain':
      queryService.onlyWithinThisDomain(query, site);
      break;

    case 'other':
      if (data.siteSlug) {
        queryService.onlyWithinThisSite(query, {
          slug: data.siteSlug
        });
      }

      break;

    default:
      break;
  }
}
/**
 * Builds the query used to retrieve overridden article details
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildOverrideQuery(data, locals) {
  var overrideQuery = queryService.newCuneiformQuery(INDEX, locals);
  queryService.addFilter(overrideQuery, {
    terms: {
      canonicalUrl: data.overrideUrls
    }
  });
  queryService.onlyWithTheseFields(overrideQuery, FIELDS);
  queryService.addSize(overrideQuery, data.articleSlots.length);
  return overrideQuery;
}
/**
 * Builds the query used to auto-fill with articles matching the specified criteria
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildFeedQuery(data, locals) {
  var feedQuery = queryService.newCuneiformQuery(INDEX, locals);
  queryService.addMust(feedQuery, {
    term: {
      'feeds.newsfeed': true
    }
  });

  if (locals && locals.site) {
    setSite(feedQuery, data, locals.site);
  }

  if (data.includeTags && data.includeTags.length > 0) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(feedQuery, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(feedQuery, data.matchAllIncludeTags ? data.includeTags.length : 1);
  }

  if (data.excludeTags && data.excludeTags.length > 0) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(feedQuery, {
        match: {
          tags: tag.text
        }
      });
    });
  }

  return feedQuery;
}
/**
 * Build up the search query used to populate article slots.
 * This will pull both overrides and auto-filled articles, and will be run by cuneiform.
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildQuery(data, locals) {
  var query;

  if (data.overrideUrls.length === data.articleSlots.length) {
    // All slots are overridden
    query = buildOverrideQuery(data, locals);
  } else if (data.overrideUrls.length) {
    // Some are overridden, some need auto-filling
    query = queryService.combineFunctionScoreQueries(buildOverrideQuery(data, locals), buildFeedQuery(data, locals));
  } else {
    // All auto-filled
    query = buildFeedQuery(data, locals);
  } // Common requirements on any query


  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, data.articleSlots.length);
  queryService.onlyWithTheseFields(query, FIELDS);
  return query;
}
/**
 * Transform user-entered scope list to a flat array of strings for cuneiform
 * @param {array} scopes
 * @returns {array}
 */


function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  } else {
    return [];
  }
}

function setHeadline(data) {
  data.cuneiformResults.forEach(function (article) {
    article.headline = article[data.headlineSelected];
  });
}
/**
 * Takes results from cuneiform, assigns override articles to the relevant slot,
 * and creates the feed for filling any empty slots on display
 * @param {object} data
 */


function setResults(data) {
  var slotIndex, overrideArticle, i; // Cuneiform results will always have override results at the front of the array,
  // so we want to pull them until we hit non-overrides and then put the rest in the
  // auto-fill array

  for (i = 0; i < data.cuneiformResults.length; i++) {
    slotIndex = _findIndex(data.articleSlots, function (s) {
      return s.overrideUrl === data.cuneiformResults[i].canonicalUrl;
    });

    if (slotIndex >= 0) {
      overrideArticle = data.cuneiformResults[i];
      assignArticleProperties(data, data.articleSlots[slotIndex], overrideArticle);
      data.noArticlesFiller = true;
    } else {
      break;
    }
  }

  data.autoArticles = data.cuneiformResults.slice(i, data.cuneiformResults.length);
}
/**
 * Save article data and retrieve any overridden articles
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.save = function (ref, data, locals) {
  data.noArticlesFiller = false;
  data.overrideUrls = [];
  convertTagsLowercase(data);

  if (data.articleSlots && data.articleSlots.length) {
    // Retrieve all override URLs and reset saved articles
    for (var i = 0; i < data.articleSlots.length; i++) {
      if (data.articleSlots[i].override && data.articleSlots[i].overrideUrl && !data.overrideUrls.includes(data.articleSlots[i].overrideUrl)) {
        // allow component to find articles when user enter a https url, since elastic is indexed with http ( at the moment )
        data.articleSlots[i].overrideUrl = data.articleSlots[i].overrideUrl.replace('https://', 'http://');
        data.overrideUrls.push(data.articleSlots[i].overrideUrl);
        data.articleSlots[i].overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.articleSlots[i].overrideHeadline));
      } else {
        data.articleSlots[i].overrideUrl = '';
        data.articleSlots[i].overrideHeadline = '';
      }

      assignArticleProperties(data, data.articleSlots[i]);
    }

    data.cuneiformQuery = buildQuery(data, locals);
    data.cuneiformScopes = getScopes(data.scopes);

    if (data.cuneiformResults) {
      setResults(data);
      setHeadline(data);
    }

    return data;
  }

  return data;
};
}, {"37":37,"39":39,"42":42,"49":49,"79":79,"80":80}];
