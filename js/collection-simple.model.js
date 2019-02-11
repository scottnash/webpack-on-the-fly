window.modules["collection-simple.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _findIndex = require(79),
    _map = require(37),
    striptags = require(42),
    sanitize = require(39),
    INDEX = 'published-articles',
    FIELDS = ['authors', 'canonicalUrl', 'featureTypes', 'feedImgUrl', 'primaryHeadline', 'shortHeadline', 'pageUri', 'tags'],
    ASSIGN_ARTICLE_FIELDS = ['canonicalUrl', 'siloImgUrl', 'primaryHeadline', 'authors', 'shortHeadline'],
    log = require(81).setup({
  file: __filename,
  component: 'collection-articles-lede'
}),
    queryService = require(49),
    styles = require(44),
    utils = require(43);
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
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function buildCuneiformQuery(data, locals) {
  var query = queryService.newCuneiformQuery(INDEX),
      numSlotsOpen = data.articleSlots.length - data.overrideUrls.length;
  queryService.addMust(query, {
    term: {
      'feeds.newsfeed': true
    }
  });

  if (locals && locals.site) {
    setSite(query, data, locals.site);
  }

  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, numSlotsOpen);

  if (data.includeTags && data.includeTags.length > 0) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, data.matchAllIncludeTags ? data.includeTags.length : 1);
  }

  if (data.excludeTags && data.excludeTags.length > 0) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
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

function processSass(data, ref) {
  var hasCss = utils.has(data.css),
      hasSass = utils.has(data.sass);

  if (hasSass) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return;
    });
  } // reset per-instance styling


  if (!hasSass && hasCss) {
    data.css = '';
    return;
  }

  return;
}
/**
 * Get and save article details for all overridden slots.
 * Also stores a final list of override urls on the component data.
 * @param {object} data
 * @param {array} overrideUrls
 * @param {object} locals
 * @returns {Promise}
 */


function queryOverrides(data, overrideUrls, locals) {
  var overrideQuery = queryService(INDEX, locals);
  data.overrideUrls = [];

  if (overrideUrls.length) {
    // Find articles with given URLs and assign to correct slot
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

      data.noArticlesFiller = true;
    });
  } else {
    return Promise.resolve();
  }
}

function setHeadline(data) {
  data.cuneiformResults.forEach(function (article) {
    article.headline = article[data.headlineSelected];
  });
}
/**
 * Given an article search result, assign required properties to an article slot.
 * When the article doesn't exist, article slot properties are reset.
 * @param {object} data
 * @param {object} articleSlot
 * @param {object} article
 */


function assignArticleProperties(data, articleSlot, article) {
  ASSIGN_ARTICLE_FIELDS.forEach(function (field) {
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
  } else {
    return [];
  }
}

module.exports.save = function (ref, data, locals) {
  var overrideUrls = [];
  convertTagsLowercase(data);
  data.title = sanitize.toSmartText(data.title || '');
  data.noArticlesFiller = false;

  if (data.articleSlots && data.articleSlots.length) {
    // Retrieve all override URLs and reset saved articles
    for (var i = 0; i < data.articleSlots.length; i++) {
      if (data.articleSlots[i].override && data.articleSlots[i].overrideUrl && !overrideUrls.includes(data.articleSlots[i].overrideUrl)) {
        // allow component to find articles when user enter a https url, since elastic is indexed with http ( at the moment )
        data.articleSlots[i].overrideUrl = data.articleSlots[i].overrideUrl.replace('https://', 'http://');
        overrideUrls.push(data.articleSlots[i].overrideUrl);
        data.articleSlots[i].overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.articleSlots[i].overrideHeadline));
      } else {
        data.articleSlots[i].overrideUrl = '';
        data.articleSlots[i].overrideHeadline = '';
      }

      assignArticleProperties(data, data.articleSlots[i]);
    }

    return queryOverrides(data, overrideUrls, locals).then(processSass(data, ref)).then(function () {
      data.cuneiformQuery = buildCuneiformQuery(data, locals);
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

}).call(this,"/components/collection-simple/model.js")}, {"37":37,"39":39,"42":42,"43":43,"44":44,"49":49,"79":79,"81":81}];
