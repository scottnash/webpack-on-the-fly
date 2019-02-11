window.modules["collection-articles.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _findIndex = require(79),
    _map = require(37),
    callout = require(80),
    queryService = require(49),
    striptags = require(42),
    sanitize = require(39),
    log = require(81).setup({
  file: __filename,
  component: 'collection-articles'
}),
    INDEX = 'published-articles',
    FIELDS = ['canonicalUrl', 'primaryHeadline', 'shortHeadline', 'teaser', 'feedImgUrl', 'rubric', 'authors', 'featureTypes', 'tags', 'pageUri'],
    ASSIGN_ARTICLE_FIELDS = ['canonicalUrl', 'primaryHeadline', 'shortHeadline', 'teaser', 'feedImgUrl', 'rubric', 'authors'];
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
 * only allow emphasis, italic, and strikethroughs in headlines
 * @param  {string} oldHeadline
 * @returns {string}
 */


function stripHeadlineTags(oldHeadline) {
  var newHeadline = striptags(oldHeadline || '', ['em', 'i', 'strike', 's']);
  return newHeadline;
}
/**
 * Build up the search query used to populate article slots.
 * This will (eventually) be stored in the component's data and used by cuneiform.
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildSearchQuery(data, locals) {
  var from = 0,
      query = queryService.newCuneiformQuery(INDEX),
      numSlotsOpen = data.articleSlots.length - data.overrideUrls.length;
  queryService.addMust(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, numSlotsOpen);
  queryService.addFrom(query, from);
  setSite(query, data, locals.site);

  if (data.includeTags && data.includeTags.length) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, data.matchAllIncludeTags ? data.includeTags.length : 1);
  }

  if (data.excludeTags && data.excludeTags.length) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
    });
  }

  if (data.includeStoryCharacteristics && data.includeStoryCharacteristics.length) {
    data.includeStoryCharacteristics.forEach(function (char) {
      var filter = {
        term: {}
      };
      filter.term["storyCharacteristics.".concat(char.text)] = true;
      queryService.addFilter(query, filter);
    });
  }

  if (data.overrideUrls.length > 0) {
    data.overrideUrls.forEach(function (url) {
      queryService.addMustNot(query, {
        term: {
          canonicalUrl: url
        }
      });
    });
  }

  return query;
}
/**
 * Given an article search result, assign required properties to an article slot.
 * When the article doesn't exist, article slot properties are reset.
 * @param {Object} data
 * @param {Object} articleSlot
 * @param {Object} article
 */


function assignArticleProperties(data, articleSlot, article) {
  ASSIGN_ARTICLE_FIELDS.forEach(function (field) {
    return articleSlot[field] = article ? article[field] : '';
  });
  articleSlot.callout = article ? callout(article) : '';
  articleSlot.headline = article ? article[data.headlineSelected] : '';
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
 * Get and save article details for all overridden slots.
 * Also stores a final list of override urls on the component data.
 * @param {object} data
 * @param {array} overrideUrls
 * @param {object} locals
 * @returns {Promise}
 */


function setOverrideArticles(data, overrideUrls, locals) {
  var overrideQuery = queryService(INDEX, locals);
  data.overrideUrls = [];

  if (overrideUrls.length) {
    queryService.addFilter(overrideQuery, {
      terms: {
        canonicalUrl: overrideUrls
      }
    });
    queryService.onlyWithTheseFields(overrideQuery, FIELDS);
    return queryService.searchByQuery(overrideQuery).then(function (results) {
      var slotIndex; // Assign returned articles to the correct slot

      var _loop = function _loop(i) {
        slotIndex = _findIndex(data.articleSlots, function (s) {
          return s.overrideUrl === results[i].canonicalUrl;
        });

        if (slotIndex >= 0 && data.articleSlots[slotIndex] && data.articleSlots[slotIndex].override) {
          data.overrideUrls.push(results[i].canonicalUrl);
          assignArticleProperties(data, data.articleSlots[slotIndex], results[i]);
          data.noArticlesFiller = true;
        }
      };

      for (var i = 0; i < results.length; i++) {
        _loop(i);
      } // Go back through the list and reset any that couldn't be found in elastic


      for (var i = 0; i < data.articleSlots.length; i++) {
        if (data.articleSlots[i].override && !data.articleSlots[i].primaryHeadline) {
          data.articleSlots[i].overrideUrl = '';
          data.articleSlots[i].overrideHeadline = '';
          data.articleSlots[i].overrideAuthors = '';
          data.articleSlots[i].overrideTeaser = '';
        }
      }

      return data;
    });
  } else {
    return Promise.resolve();
  }
}
/**
 * Save article data and retrieve any overridden articles
 * @param {string} ref
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


module.exports.save = function (ref, data, locals) {
  var overrideUrls = [];
  data.title = sanitize.toSmartText(data.title || '');
  data.noArticlesFiller = false;
  convertTagsLowercase(data);

  if (data.articleSlots && data.articleSlots.length) {
    // Retrieve all override URLs and reset saved articles
    for (var i = 0; i < data.articleSlots.length; i++) {
      if (data.articleSlots[i].override && data.articleSlots[i].overrideUrl && !overrideUrls.includes(data.articleSlots[i].overrideUrl)) {
        // allow component to find articles when user enter a https url, since elastic is indexed with http ( at the moment )
        data.articleSlots[i].overrideUrl = data.articleSlots[i].overrideUrl.replace('https://', 'http://');
        overrideUrls.push(data.articleSlots[i].overrideUrl);
        data.articleSlots[i].overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.articleSlots[i].overrideHeadline));
        data.articleSlots[i].overrideAuthors = data.articleSlots[i].overrideAuthors;
        data.articleSlots[i].overrideTeaser = sanitize.toSmartText(stripHeadlineTags(data.articleSlots[i].overrideTeaser));
      } else {
        data.articleSlots[i].overrideUrl = '';
        data.articleSlots[i].overrideHeadline = '';
        data.articleSlots[i].overrideTeaser = '';
        data.articleSlots[i].overrideAuthors = '';
      }

      assignArticleProperties(data, data.articleSlots[i]);
    }

    return setOverrideArticles(data, overrideUrls, locals).then(function () {
      data.cuneiformQuery = buildSearchQuery(data, locals);
      data.cuneiformScopes = getScopes(data.scopes);

      if (data.cuneiformResults) {
        setHeadline(data);
      }

      return data;
    }).catch(function (err) {
      log('error', "Error saving articles for ".concat(ref), {
        error: err.message
      });
      return data;
    });
  }

  return Promise.resolve(data);
};

}).call(this,"/components/collection-articles/model.js")}, {"37":37,"39":39,"42":42,"49":49,"79":79,"80":80,"81":81}];
