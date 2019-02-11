window.modules["collection-package.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _findIndex = require(79),
    _map = require(37),
    striptags = require(42),
    sanitize = require(39),
    INDEX = 'published-articles',
    utils = require(43),
    endOfDay = require(85),
    isFuture = require(82),
    isPast = require(84),
    isBefore = require(86),
    isWithinRange = require(83),
    has = utils.has,
    FIELDS = ['authors', 'canonicalUrl', 'featureTypes', 'feedImgUrl', 'primaryHeadline', 'pageUri', 'tags'],
    log = require(81).setup({
  file: __filename,
  component: 'collection-articles-lede'
}),
    queryService = require(49);
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
    queryService.withinThisSiteAndCrossposts(query, locals.site);
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
/**
 * Given an article search result, assign required properties to an article slot.
 * When the article doesn't exist, article slot properties are reset.
 * @param {object} articleSlot
 * @param {object} article
 */


function assignArticleProperties(articleSlot, article) {
  articleSlot.canonicalUrl = article ? article.canonicalUrl : '';
  articleSlot.featureTypes = article ? article.featureTypes : '';
  articleSlot.feedImgUrl = article ? article.feedImgUrl : '';
  articleSlot.primaryHeadline = article ? article.primaryHeadline : '';
  articleSlot.authors = article ? article.authors : '';
  articleSlot.pageUri = article ? article.pageUri : '';
  articleSlot.tags = article ? article.tags : '';
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
          assignArticleProperties(data.articleSlots[slotIndex], results[i]);
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
    });
  } else {
    return Promise.resolve();
  }
}
/**
 * sanitize title and teasers
 * @param  {object} data
 */


function sanitizeInputs(data) {
  if (has(data.title)) {
    data.title = sanitize.toSmartText(data.title || '');
  }

  if (has(data.teaser)) {
    data.teaser = sanitize.toSmartText(stripHeadlineTags(data.teaser));
  }
}

function shouldComponentBeDisplayed(_ref) {
  var endDate = _ref.endDate,
      startDate = _ref.startDate;
  var today = new Date(),
      end = endOfDay(endDate);

  if (startDate && endDate) {
    return isWithinRange(today, startDate, end);
  }

  return !startDate && !endDate || startDate && isPast(startDate) || endDate && isFuture(end);
}

function validateDateRange(data) {
  var isEndDateBefore = data.startDate && data.endDate ? !isBefore(data.startDate, data.endDate) : false;

  if (isEndDateBefore) {
    data.isPrior = true;
  }

  return !isEndDateBefore;
}

module.exports.save = function (ref, data, locals) {
  var overrideUrls = [];
  sanitizeInputs(data);
  data.noArticlesFiller = false;
  convertTagsLowercase(data);

  if (data.articleSlots.length) {
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

      assignArticleProperties(data.articleSlots[i]);
    }

    return setOverrideArticles(data, overrideUrls, locals).then(function () {
      data.cuneiformQuery = buildCuneiformQuery(data, locals);
      data.cuneiformScopes = getScopes(data.scopes);
      return data;
    }).catch(function (err) {
      log('error', "Error saving articles for ".concat(ref), {
        error: err.message
      });
      return data;
    });
  }

  return data;
};

module.exports.render = function (ref, data) {
  data.displaySelf = null;
  data.isPrior = false;

  if (!data.active) {
    data.startDate = '';
    data.endDate = '';
    return data;
  }

  if (validateDateRange(data)) data.displaySelf = shouldComponentBeDisplayed(data) || null;

  if (data.cuneiformResults && data.overrideUrls) {
    data.minimumArticlesPublished = Object.keys(data.cuneiformResults).length + Object.keys(data.overrideUrls).length >= 3;
  }

  return data;
};

}).call(this,"/components/collection-package/model.js")}, {"37":37,"39":39,"42":42,"43":43,"49":49,"79":79,"81":81,"82":82,"83":83,"84":84,"85":85,"86":86}];
