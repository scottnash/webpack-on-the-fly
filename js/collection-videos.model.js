window.modules["collection-videos.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _findIndex = require(79),
    _map = require(37),
    _get = require(32),
    queryService = require(49),
    _require = require(43),
    has = _require.has,
    striptags = require(42),
    db = require(69),
    sanitize = require(39),
    log = require(81).setup({
  file: __filename,
  component: 'collection-videos'
}),
    INDEX = 'original-videos-all',
    FIELDS = ['canonicalUrl', 'shortHeadline', 'primaryHeadline', 'feedImgUrl', 'authors', 'pageUri', 'videoId'];
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
 * This will be stored in the component's data and used by cuneiform.
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildSearchQuery(data, locals) {
  var query = queryService.newCuneiformQuery(INDEX),
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

  if (locals && locals.site) {
    setSite(query, data, locals.site);
  }

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

  if (data.overrideUrls.length) {
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
 * @param {object} data
 * @param {object} articleSlot
 * @param {object} article
 */


function assignArticleProperties(data, articleSlot, article) {
  FIELDS.forEach(function (field) {
    return articleSlot[field] = article ? article[field] : '';
  });
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
  }

  return [];
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
        }
      }

      return data;
    });
  } else {
    return Promise.resolve(data);
  }
}

function setHeadline(data) {
  data.cuneiformResults.forEach(function (article) {
    article.headline = article[data.headlineSelected];
  });
}
/**
 * Set the videoId for component when is updated
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


function setVideoId(data, locals) {
  var videoRef = data.contentVideo ? data.contentVideo._ref : '';

  if (videoRef) {
    return db.get(videoRef, locals).then(function (contentVideoData) {
      if (contentVideoData.videoId !== data.articleVideoId) {
        var newData = Object.assign(contentVideoData, {
          videoId: data.articleVideoId
        });
        return db.put(videoRef, newData, locals).then(function () {
          return data;
        });
      }
    });
  }

  return Promise.resolve(data);
}
/**
 * Save article data and retrieve any overridden articles
 * @param {string} ref
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


module.exports.save = function (ref, data, locals) {
  var overrideUrls = [],
      cuneiformVideoId = has(data.cuneiformResults) ? data.cuneiformResults[0].videoId : '';
  data.noArticlesFiller = false;
  convertTagsLowercase(data);

  if (data.articleSlots && data.articleSlots.length) {
    // Retrieve all override URLs and reset saved articles
    for (var i = 0; i < data.articleSlots.length; i++) {
      if (data.articleSlots[i].override && data.articleSlots[i].overrideUrl && !overrideUrls.includes(data.articleSlots[i].overrideUrl)) {
        data.articleSlots[i].overrideUrl = data.articleSlots[i].overrideUrl.replace('https://', 'http://');
        overrideUrls.push(data.articleSlots[i].overrideUrl);
        data.articleSlots[i].overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.articleSlots[i].overrideHeadline) || '');
      } else {
        data.articleSlots[i].overrideUrl = '';
        data.articleSlots[i].overrideHeadline = '';
      }

      assignArticleProperties(data, data.articleSlots[i]);
    }

    return setOverrideArticles(data, overrideUrls, locals).then(function () {
      var firstOverrideArticle = _get(data, 'articleSlots[0].videoId');

      data.cuneiformQuery = buildSearchQuery(data, locals);
      data.cuneiformScopes = getScopes(data.scopes);
      data.articleVideoId = firstOverrideArticle || cuneiformVideoId;
      data.customPlay = true;

      if (data.cuneiformResults) {
        setHeadline(data);
      }

      return setVideoId(data, locals).then(function () {
        return data;
      });
    }).catch(function (err) {
      log('error', "Error saving articles for ".concat(ref), {
        error: err.message
      });
      return data;
    });
  }

  return Promise.resolve(data);
};

}).call(this,"/components/collection-videos/model.js")}, {"32":32,"37":37,"39":39,"42":42,"43":43,"49":49,"69":69,"79":79,"81":81}];
