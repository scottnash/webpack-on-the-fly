window.modules["related-shows.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _findIndex = require(79),
    striptags = require(42),
    sanitize = require(39),
    _require = require(39),
    normalizeName = _require.normalizeName,
    INDEX = 'tv-show',
    utils = require(43),
    has = utils.has,
    FIELDS = ['showUrl', 'showImageURL', 'showName', 'tags', '_score'],
    log = require(81).setup({
  file: __filename,
  component: 'related-shows'
}),
    queryService = require(49),
    headlineTags = ['em', 'i', 'strike', 's'];
/**
 * only allow emphasis, italic, and strikethroughs in headlines
 * @param  {string} oldHeadline
 * @returns {string}
 */


function stripHeadlineTags(oldHeadline) {
  return striptags(oldHeadline || '', headlineTags);
}
/**
 * Build up the search query used to populate article slots.
 * @param {object} data
 * @param {object} locals
 * @param {boolean} hasOverrideUrl
 * @returns {object}
 */


function buildSearchQuery(data, locals, hasOverrideUrl) {
  var query = queryService(INDEX, locals),
      numSlotsOpen,
      overrideMoreLikeThis,
      captureTags;

  if (hasOverrideUrl) {
    numSlotsOpen = data.articleSlots.length - data.overrideUrls.length;
  }

  if (data.overrideUrls && data.overrideUrls.length) {
    data.overrideUrls.forEach(function (url) {
      queryService.addMustNot(query, {
        term: {
          showUrl: url
        }
      });
    });
  }

  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSize(query, numSlotsOpen);
  captureTags = data.tags.map(function (d) {
    return d.text;
  });
  overrideMoreLikeThis = {
    like: captureTags
  }; // dev note: second param doesnt matter since it gets overrideen by 3rd param. Since its required by the function, I still included it

  queryService.addShould(query, queryService.moreLikeThis(query, 'show', overrideMoreLikeThis));
  queryService.addSort(query, {
    _score: 'desc'
  });
  queryService.addSort(query, {
    'showName.normalized': 'asc'
  });
  queryService.addMustNot(query, {
    term: {
      'showName.normalized': normalizeName(data.currentPageShow)
    }
  });
  queryService.addMinimumShould(query, 1);
  return query;
}
/**
 * Given an article search result, assign required properties to an article slot.
 * When the article doesn't exist, article slot properties are reset.
 * @param {object} articleSlot
 * @param {object} article
 */


function assignArticleProperties(articleSlot, article) {
  FIELDS.forEach(function (field) {
    return articleSlot[field] = article ? article[field] : '';
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
        showUrl: overrideUrls
      }
    });
    queryService.onlyWithTheseFields(overrideQuery, FIELDS);
    return queryService.searchByQuery(overrideQuery).then(function (results) {
      var slotIndex; // Assign returned articles to the correct slot

      var _loop = function _loop(i) {
        slotIndex = _findIndex(data.articleSlots, function (s) {
          return s.overrideUrl === results[i].showUrl;
        });

        if (slotIndex >= 0 && data.articleSlots[slotIndex] && data.articleSlots[slotIndex].override) {
          data.overrideUrls.push(results[i].showUrl);
          assignArticleProperties(data.articleSlots[slotIndex], results[i]);
          data.noArticlesFiller = true;
        }
      };

      for (var i = 0; i < results.length; i++) {
        _loop(i);
      } // Go back through the list and reset any that couldn't be found in elastic


      for (var i = 0; i < data.articleSlots.length; i++) {
        if (data.articleSlots[i].override && !data.articleSlots[i].showName) {
          data.articleSlots[i].overrideUrl = '';
          data.articleSlots[i].overrideHeadline = '';
        }
      }

      return data;
    });
  }

  return Promise.resolve();
}
/**
 * sanitize title
 * @param  {object} data
 */


function sanitizeInputs(data) {
  if (has(data.title)) {
    data.title = sanitize.toSmartText(data.title || '');
  }
}

module.exports.render = function (uri, data, locals) {
  if (data.tags && data.tags.length) {
    var query = buildSearchQuery(data, locals, false);
    return queryService.searchByQuery(query).then(function (results) {
      data.newShows = results;
      return data;
    }).catch(function (err) {
      log(err);
      return data;
    });
  }

  return data;
};

module.exports.save = function (ref, data, locals) {
  var overrideUrls = [];
  sanitizeInputs(data);
  data.noArticlesFiller = false;

  if (data.articleSlots.length) {
    // Retrieve all override URLs and reset saved articles
    Object.keys(data.articleSlots).forEach(function (slot) {
      var currentSlot = data.articleSlots[slot];

      if (currentSlot.override && currentSlot.overrideUrl && !overrideUrls.includes(currentSlot.overrideUrl)) {
        // allow component to find articles when user enter a https url, since elastic is indexed with http ( at the moment )
        currentSlot.overrideUrl = currentSlot.overrideUrl.replace('https://', 'http://'); // if theres an override url, we push into this array

        overrideUrls.push(currentSlot.overrideUrl);
        currentSlot.overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(currentSlot.overrideHeadline));
      } else {
        // we replace everything
        currentSlot.overrideUrl = '';
        currentSlot.overrideHeadline = '';
      }

      assignArticleProperties(currentSlot);
    });
    return setOverrideArticles(data, overrideUrls, locals).then(function () {
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

}).call(this,"/components/related-shows/model.js")}, {"39":39,"42":42,"43":43,"49":49,"79":79,"81":81}];
