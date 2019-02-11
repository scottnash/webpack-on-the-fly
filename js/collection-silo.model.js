window.modules["collection-silo.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _findIndex = require(79),
    _map = require(37),
    queryService = require(49),
    sanitize = require(39),
    callout = require(80),
    publishedArticlesIndex = 'published-articles',
    fields = ['primaryHeadline', 'canonicalUrl', 'feedImgUrl', 'tags', 'authors', 'siloImgUrl', 'shortHeadline', 'teaser', 'rubric', 'featureTypes'],
    ASSIGN_ARTICLE_FIELDS = ['canonicalUrl', 'siloImgUrl', 'primaryHeadline', 'authors', 'shortHeadline', 'teaser', 'rubric'];
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
* Build the search query used by cuneiform
* @param {Object} data
* @param {Object} locals
* @return {Promise}
*/


function buildSearchQuery(data, locals) {
  var tags = data.tags || [],
      query = queryService.newCuneiformQuery(publishedArticlesIndex),
      site = _get(locals, 'site', {}),
      numSlotsOpen = data.articleSlots.length - data.overrideUrls.length;

  queryService.addSize(query, numSlotsOpen);
  queryService.onlyWithTheseFields(query, fields);
  setSite(query, data, site);

  if (tags.length) {
    tags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, tags.length);
  }

  queryService.addSort(query, {
    date: 'desc'
  });

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

function setHeadline(data) {
  data.cuneiformResults.forEach(function (article) {
    article.headline = article[data.headlineSelected];
  });
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
  articleSlot.headline = article ? article[data.headlineSelected] : '';
  articleSlot.callout = article ? callout(article) : '';
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
  var query = queryService(publishedArticlesIndex, locals);
  data.overrideUrls = [];

  if (overrideUrls.length) {
    queryService.addFilter(query, {
      terms: {
        canonicalUrl: overrideUrls
      }
    });
    queryService.onlyWithTheseFields(query, fields);
    return queryService.searchByQuery(query).then(function (stories) {
      var slotIndex; // assign results to the correct article slot

      stories.forEach(function (story, index) {
        slotIndex = _findIndex(data.articleSlots, function (s) {
          return s.overrideUrl === stories[index].canonicalUrl;
        });

        if (slotIndex >= 0 && data.articleSlots[slotIndex] && data.articleSlots[slotIndex].override) {
          data.overrideUrls.push(story.canonicalUrl);
          assignArticleProperties(data, data.articleSlots[slotIndex], story);
          data.articlesFound = true;
        }
      }); // reset any that couldn't be found

      data.articleSlots.forEach(function (article) {
        if (article.override && !article.primaryHeadline) {
          article.overrideUrl = '';
        }
      });
    });
  } else {
    return Promise.resolve();
  }
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
  }

  return [];
}

module.exports.save = function (ref, data, locals) {
  var overrideUrls = []; // title text

  data.title = sanitize.toSmartText(data.title || ''); // start true until we know we have empty article slots

  data.articlesFound = true; // retrieve all override urls, and reset all article slots

  if (data.articleSlots && data.articleSlots.length) {
    data.articlesFound = false;
    data.articleSlots.forEach(function (article) {
      if (article.override && article.overrideUrl && !overrideUrls.includes(article.overrideUrl)) {
        // allow component to find articles when user enter a https url, since elastic is indexed with http ( at the moment )
        article.overrideUrl = article.overrideUrl.replace('https://', 'http://');
        overrideUrls.push(article.overrideUrl);
      } else {
        article.overrideUrl = '';
      }

      assignArticleProperties(data, article);
    });
  }

  return setOverrideArticles(data, overrideUrls, locals).then(function () {
    data.cuneiformQuery = buildSearchQuery(data, locals);
    data.cuneiformScopes = getScopes(data.scopes);

    if (data.cuneiformResults) {
      setHeadline(data);
    }

    return data;
  }).catch(function (err) {
    queryService.logCatch(err, ref);
    return data;
  });
};
}, {"32":32,"37":37,"39":39,"49":49,"79":79,"80":80}];
