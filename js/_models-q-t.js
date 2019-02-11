window.modules["quiz-personality.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    parser = require(177).parse;

function parseQuestions(questions) {
  return parser(questions);
} // turns the score markdown into an object


function parseScore(scoreMarkdown) {
  var splitData,
      finalScoreObject = {
    results: {}
  },
      resultTxt;
  splitData = encodeURIComponent(scoreMarkdown).split('%0A');
  splitData.forEach(function (data) {
    var splitData2 = data.split('%7D%20'),
        values = [],
        lastValue; // maps each score range or category to an array that contains the result text and corresponding social share message

    if (splitData2.length > 1) {
      resultTxt = decodeURIComponent(splitData2[1]).replace(/\*/, '<span>').replace(/\*/, '</span>');
      values.push(resultTxt);
      finalScoreObject.results[splitData2[0].replace('%7B', '')] = values;
    } else {
      lastValue = finalScoreObject.results[Object.keys(finalScoreObject.results)[Object.keys(finalScoreObject.results).length - 1]];

      if (Array.isArray(lastValue)) {
        lastValue.push(decodeURIComponent(splitData2));
      }
    }
  });
  return JSON.stringify(finalScoreObject);
}

function render(ref, data) {
  data.transformedData = parseQuestions(data.questions);

  if (utils.has(data.results)) {
    data.transformedScore = parseScore(data.results);
  }

  return data;
}

module.exports.render = render; // TODO: convert to module.exports.save
}, {"43":43,"177":177}];
window.modules["quote-generator.model"] = [function(require,module,exports){'use strict';

var styles = require(44),
    utils = require(43);

module.exports.save = function (uri, data) {
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"43":43,"44":44}];
window.modules["read-more.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"43":43,"44":44}];
window.modules["reddit.model"] = [function(require,module,exports){'use strict';

var rest = require(5),
    redditBaseUrl = 'https://www.reddit.com/oembed?omitscript=true&url=';
/**
 * determine if an embed should show its parent
 * @param {object} data
 * @returns {string}
 */


function parent(data) {
  return data.showParent ? '&parent=true' : '';
}
/**
 * determine if an embed should show live edits
 * @param {object} data
 * @returns {string}
 */


function live(data) {
  return data.showEdits ? '&live=true' : '';
}
/**
 * grab html for post/comment
 * @param {string} uri
 * @param {object} data
 * @returns {Promise}
 */


module.exports.save = function (uri, data) {
  if (data.url) {
    // note: we're using the un-authenticated api endpoint. don't abuse this
    return rest.getJSONP(redditBaseUrl + encodeURI(data.url) + parent(data) + live(data)).then(function (json) {
      // get oembed html, without the script tag
      data.html = json.html;
      return data;
    }).catch(function (e) {
      console.warn(e.message, e.stack);
      return data; // no html
    });
  } else {
    data.html = ''; // clear the html if there's no url

    return data;
  }
};
}, {"5":5}];
window.modules["refresher-course.model"] = [function(require,module,exports){'use strict';

var styles = require(44),
    utils = require(43);

module.exports.save = function (uri, data) {
  // compile styles if they're not empty
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = ''; // unset any compiled css

    return data;
  }
};
}, {"43":43,"44":44}];
window.modules["related-listings.model"] = [function(require,module,exports){(function (__filename){
'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var queryService = require(49),
    _isEmpty = require(75),
    _flatten = require(150),
    _forIn = require(179),
    log = require(81).setup({
  file: __filename,
  component: 'related-listings'
}),
    _require = require(152),
    mapDollarSigns = _require.mapDollarSigns,
    setRatingAdjective = _require.setRatingAdjective,
    FIELDS = ['barTypes', 'cuisines', 'criticsRating', 'feedImgUrl', 'markAsNew', 'name', 'neighborhood', 'canonicalUrl', 'teaser', 'slug', 'listingType'],
    INDEX = 'listings-restaurants-and-bars';
/**
 * Generates an object for use with the dynamicImage helper
 *
 * @param {String} imageUrl
 * @returns {Object}
 */


function createResposiveImage(imageUrl) {
  return {
    url: imageUrl,
    mobile: 'square-small',
    tablet: 'horizontal-less-medium',
    desktop: 'horizontal-less-medium'
  };
}

;
/**
 * Search for a listing via its slug
 *
 * @param {Object} data - passed in via the model
 * @param {Object} locals
 * @returns {Promise}
 */

function createOverrideQuery(data, locals) {
  var parentListingSlug = data.parentListingSlug,
      listingsOverride = data.listingsOverride,
      overrideQuery = queryService(INDEX, locals);
  queryService.onlyWithTheseFields(overrideQuery, FIELDS);
  queryService.addMinimumShould(overrideQuery, 1);

  if (parentListingSlug) {
    queryService.addMustNot(overrideQuery, {
      match: {
        slug: parentListingSlug
      }
    });
  }

  listingsOverride.forEach(function (override) {
    queryService.addShould(overrideQuery, {
      match: {
        canonicalUrl: override.listingUrl
      }
    });
  });
  return queryService.searchByQuery(overrideQuery).then(function (result) {
    data.displayOverrideError = result.length < listingsOverride.length;
    return result;
  });
}
/**
 * Adds Filter Types to the ES query
 *
 * @param {Object} query - ES query
 * @param {Object} data
 * @param {string} propertyName
 */


function addFilterType(query, data, propertyName) {
  if (!data[propertyName]) return;
  var queryFilter;

  _forIn(data[propertyName], function (value, key) {
    // ignore cuisines that are set to 'false'
    if (value) {
      queryFilter = queryFilter || [];
      queryFilter.push({
        term: _defineProperty({}, "".concat(propertyName, ".").concat(key), value)
      });
      queryService.addShould(query, queryFilter);
    }
  });

  if (queryFilter) {
    queryService.addMinimumShould(query, 1);
  }
}
/** 
 * Update the Elastic query according to available properties from the parent listing
 *
 * @param {Object} data - passed in by the model
 * @param {Object} locals - passed in by the model
 * @param {Integer} size
 * @returns {Promise}
 */


function createQuery(data, locals, size) {
  var parentListingSlug = data.parentListingSlug,
      neighborhood = data.neighborhood,
      _data$listingsOverrid = data.listingsOverride,
      listingsOverride = _data$listingsOverrid === void 0 ? [] : _data$listingsOverrid,
      query = queryService(INDEX, locals);
  queryService.addSort(query, {
    criticsRating: 'asc'
  });
  queryService.addSize(query, size);

  if (parentListingSlug) {
    queryService.addMustNot(query, {
      match: {
        slug: parentListingSlug
      }
    });
  }

  addFilterType(query, data, 'cuisines');
  addFilterType(query, data, 'barTypes');

  if (neighborhood) {
    // using match_phrase here because we don't want partial matches (ie we want West Village, not Midtown West)
    queryService.addMust(query, {
      match_phrase: {
        neighborhood: neighborhood
      }
    });
  }

  if (listingsOverride.length) {
    listingsOverride.forEach(function (override) {
      queryService.addMustNot(query, {
        match: {
          canonicalUrl: override.listingUrl
        }
      });
    });
  }

  return !_isEmpty(query.body.query) ? queryService.searchByQuery(query) : Promise.resolve([]);
}

;
/**
 * Formats listings responses
 *
 * @param {Array<Object>} responses
 * @param {Object} data
 * @returns {Object} mutated data with fetchedListings
 */

function formatResponse(responses, data) {
  var results = responses.sort(function (a, b) {
    return a.criticsRating - b.criticsRating;
  }).reverse();
  data.fetchedListings = results.map(function (listing) {
    listing.ratingAdjective = listing.criticsRating ? setRatingAdjective(listing.criticsRating) : '';
    listing.price = listing.price ? mapDollarSigns(listing.price) : '';
    listing.image = listing.feedImgUrl ? createResposiveImage(listing.feedImgUrl) : '';
    return listing;
  });
  return data;
}
/**
 * Merges override and automatic results from ES queries
 *
 * @param {integer} size
 * @returns {Function}
 */


function mergeResults(size) {
  return function () {
    var responses = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var _responses = _slicedToArray(responses, 2),
        _responses$ = _responses[0],
        normalQuery = _responses$ === void 0 ? [] : _responses$,
        _responses$2 = _responses[1],
        overrideQuery = _responses$2 === void 0 ? [] : _responses$2,
        results = _flatten([].concat(_toConsumableArray(overrideQuery), _toConsumableArray(normalQuery)));

    return results.slice(0, size);
  };
}

module.exports.render = function (ref, data, locals) {
  var _data$size = data.size,
      size = _data$size === void 0 ? 2 : _data$size,
      promises = [createQuery(data, locals, size)];

  if (data.listingsOverride && data.listingsOverride.length) {
    promises.push(createOverrideQuery(data, locals));
  }

  return Promise.all(promises).then(mergeResults(size)).then(function (responses) {
    return formatResponse(responses, data);
  }).catch(function (error) {
    log('error', 'Something went wrong with Elastic.', {
      error: error.message
    });
    data.fetchedListings = [];
    return data;
  });
};

module.exports.save = function (ref, data) {
  var _data$listingsOverrid2 = data.listingsOverride,
      listingsOverride = _data$listingsOverrid2 === void 0 ? [] : _data$listingsOverrid2;
  /**
   * Remove any empty element from the listingsOverride property
   */

  data.listingsOverride = listingsOverride.filter(function (listing) {
    return listing.listingUrl;
  });
  return data;
};

}).call(this,"/components/related-listings/model.js")}, {"49":49,"75":75,"81":81,"150":150,"152":152,"179":179}];
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
window.modules["related-stories.model"] = [function(require,module,exports){'use strict';

var toPlainText = require(39).toPlainText;

module.exports.save = function (ref, data) {
  if (data.title) {
    data.plaintextTitle = toPlainText(data.title);
  }

  return data;
};
}, {"39":39}];
window.modules["related-story-detailed.model"] = [function(require,module,exports){'use strict';

var _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    ELASTIC_FIELDS = ['primaryHeadline', 'teaser', 'feedImgUrl', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    title: data.overrideTitle || result.primaryHeadline,
    image: data.overrideImage || result.feedImgUrl,
    teaser: data.overrideTeaser || result.teaser,
    pageUri: result.pageUri,
    urlIsValid: result.urlIsValid
  }));

  if (data.title) {
    data.plaintextTitle = toPlainText(data.title);
  }

  return data;
}

module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
}; // export for upgrade.js


module.exports.assignToData = assignToData;
}, {"39":39,"57":57,"59":59,"103":103}];
window.modules["related-story.model"] = [function(require,module,exports){'use strict';

var _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    ELASTIC_FIELDS = ['primaryHeadline', 'feedImgUrl', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    title: data.overrideTitle || result.primaryHeadline,
    image: data.overrideImage || result.feedImgUrl,
    pageUri: result.pageUri,
    urlIsValid: result.urlIsValid
  }));

  if (data.title) {
    data.plaintextTitle = toPlainText(data.title);
  }

  return data;
}

module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
}; // export for upgrade.js


module.exports.assignToData = assignToData;
}, {"39":39,"57":57,"59":59,"103":103}];
window.modules["related.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    callout = require(80),
    ELASTIC_FIELDS = ['primaryHeadline', 'feedImgUrl', 'pageUri', 'tags', 'featureTypes'];

module.exports.save = function (ref, data, locals) {
  if (!data.items.length || !locals) {
    return data;
  }

  return Promise.all(_map(data.items, function (item) {
    item.urlIsValid = item.ignoreValidation ? 'ignore' : null;
    return recircCmpt.getArticleDataAndValidate(ref, item, locals, ELASTIC_FIELDS).then(function (result) {
      var article = Object.assign(item, {
        title: item.overrideTitle || result.primaryHeadline,
        image: item.overrideImage || result.feedImgUrl,
        pageUri: result.pageUri,
        urlIsValid: result.urlIsValid,
        callout: callout(result)
      });

      if (article.title) {
        article.plaintextTitle = toPlainText(article.title);
      }

      return article;
    });
  })).then(function (items) {
    data.items = items;
    return data;
  });
};
}, {"37":37,"39":39,"80":80,"103":103}];
window.modules["restaurant-and-bar-listing.model"] = [function(require,module,exports){(function (__filename){
'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _get = require(32),
    _isEmpty = require(75),
    _camelCase = require(180),
    _head = require(25),
    _pickBy = require(59),
    dateFormat = require(52),
    _require = require(43),
    has = _require.has,
    keyObjectToArray = _require.keyObjectToArray,
    listingHelper = require(152),
    queryService = require(49),
    maps = require(181),
    sanitize = require(39),
    log = require(81).setup({
  file: __filename
}),
    GOOGLE_MAPS_API_KEY = 'AIzaSyCuiNryBQshlTJ0XIWvg96SKoxWwr_Vmu4',
    INDEX = 'nyc-neighborhoods',
    BOROUGHS = ['manhattanNeighborhoods', 'brooklynNeighborhoods', 'queensNeighborhoods', 'westchesterNeighborhoods'],
    QUERY_INDEX = 'published-articles',
    RELATED_ARTICLES_FIELDS = ['canonicalUrl', 'plaintextPrimaryHeadline'],
    REVIEW_ARTICLE_FIELDS = ['date'],
    GOOGLE_MAPS_ENDPOINT = 'https://www.google.com/maps/search/?api=1',
    googleMapsClient = maps.createClient({
  key: GOOGLE_MAPS_API_KEY,
  Promise: Promise
}),
    OPEN_TABLE_RE = /^(?:https?:\/\/)?(?:w{3}\.)?opentable\.com/g;
/**
 * Formats price
 *
 * @param {Object} data
 */


function mapDollarSigns(data) {
  data.priceFormatted = listingHelper.mapDollarSigns(data.price);
}
/**
 * Check if latitude and longitude are not empty, and if state is NY (don't need to query neighborhood)
 * @param {Object} data
 * @returns {boolean}
 */


function hasCompleteCoords(_ref) {
  var latitude = _ref.latitude,
      longitude = _ref.longitude,
      state = _ref.state;
  return latitude && longitude && state === 'NY';
}
/**
 * Sets lat/long coordinates from Google Maps Geocoding API
 * @param {Object} data
 * @returns {Promise}
 */


function setCoordinates(data) {
  var address = data.address,
      city = data.city,
      state = data.state;

  if (address && city && state) {
    return googleMapsClient.geocode({
      address: "".concat(address, " ").concat(city, " ").concat(state)
    }).asPromise().then(function (result) {
      data.latitude = _get(result, 'json.results[0].geometry.location.lat') || '';
      data.longitude = _get(result, 'json.results[0].geometry.location.lng') || '';
      return data;
    }).catch(function (error) {
      log(error);
      return Promise.resolve(data);
    });
  } else {
    data.latitude = '';
    data.longitude = '';
    return Promise.resolve(data);
  }
}
/**
 * Gets NYC neighborhood data
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


function getNeighborhoodData(data, locals) {
  var query = queryService(INDEX, locals),
      coordinates = [data.longitude, data.latitude];

  if (!data.overrideNeighborhood && hasCompleteCoords(data)) {
    queryService.addGeo(query, coordinates);
    queryService.addSize(query, 1);
    return queryService.searchByQuery(query).then(function (result) {
      data.borough = _get(result, '0.borough', '');
      data.neighborhood = _get(result, '0.neighborhood', '');
      return data;
    });
  } else if (data.overrideNeighborhood) {
    setOverrideNeighborhood(data);
  } else {
    data.borough = '';
    data.neighborhood = '';
  }

  return Promise.resolve(data);
}
/**
 * Cleans previous selected neighborhoods so when a user selects a neighborhood
 * the first option is set to 'None'
 *
 * @param {Object} data
 */


function cleanPreviousNeighborhood(data) {
  var _data$overriddenBorou = data.overriddenBorough,
      overriddenBorough = _data$overriddenBorou === void 0 ? '' : _data$overriddenBorou;
  BOROUGHS.forEach(function (_borough) {
    if ("".concat(_camelCase(overriddenBorough), "Neighborhoods") !== _borough && data[_borough]) {
      data[_borough] = null;
    }
  });
}
/**
 * Sets neighborhood field
 *
 * @param {Object} data
 */


function setOverrideNeighborhood(data) {
  var _data$overriddenBorou2 = data.overriddenBorough,
      overriddenBorough = _data$overriddenBorou2 === void 0 ? '' : _data$overriddenBorou2;

  if (overriddenBorough) {
    data.borough = overriddenBorough;
    cleanPreviousNeighborhood(data, overriddenBorough);
    data.neighborhood = data["".concat(_camelCase(overriddenBorough), "Neighborhoods")] || '';
  } else {
    data.borough = '';
    data.neighborhood = '';
  }
}
/**
 * Formats the listing related articles data
 * @param {Object[]} articles
 * @param {Object} overrideHeadlines
 * @returns {Object[]}
 */


function createRelatedArticlesObjects() {
  var articles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var overrideHeadlines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return articles.map(function () {
    var article = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return {
      headline: overrideHeadlines[article.canonicalUrl] || article.plaintextPrimaryHeadline || '',
      url: article.canonicalUrl || '',
      overrideHeadline: overrideHeadlines[article.canonicalUrl] || ''
    };
  });
}
/**
 * Gets the listing related articles data
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


function getRelatedArticlesData(data, locals) {
  var relatedArticles = data.relatedArticles,
      query = queryService(QUERY_INDEX, locals),
      overrideHeadlines = {};
  relatedArticles.forEach(function (article) {
    overrideHeadlines[article.url] = article.overrideHeadline;
    queryService.addShould(query, {
      match: {
        canonicalUrl: article.url
      }
    });
  });
  queryService.addMinimumShould(query, 1);
  queryService.onlyWithTheseFields(query, RELATED_ARTICLES_FIELDS);
  return queryService.searchByQuery(query).then(function (articles) {
    if (articles.length) {
      data.relatedArticles = createRelatedArticlesObjects(articles, overrideHeadlines);
    }

    return data;
  }).catch(function (error) {
    return log(error);
  });
}
/**
 * Gets the listing review article data
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


function getReviewArticleData(data, locals) {
  var query = queryService(QUERY_INDEX, locals);
  queryService.addShould(query, {
    match: {
      canonicalUrl: data.reviewUrl
    }
  });
  queryService.onlyWithTheseFields(query, REVIEW_ARTICLE_FIELDS);
  return queryService.searchByQuery(query).then(function (result) {
    var headResult = _head(result);

    data.reviewArticleYear = dateFormat(_get(headResult, 'date'), 'YYYY');
    return data;
  });
}
/**
 * Check if data has all the necessary Google Maps URL query parameters
 * @param {Object} data
 * @returns {boolean}
 */


function hasMapsParams(_ref2) {
  var _ref2$name = _ref2.name,
      name = _ref2$name === void 0 ? '' : _ref2$name,
      _ref2$address = _ref2.address,
      address = _ref2$address === void 0 ? '' : _ref2$address,
      _ref2$city = _ref2.city,
      city = _ref2$city === void 0 ? '' : _ref2$city,
      _ref2$state = _ref2.state,
      state = _ref2$state === void 0 ? '' : _ref2$state;
  return name && address && city && state;
}
/**
 * Sets the Google Maps URL link for restaurant/map search
 *
 * @param {Object} data
 */


function setMapsUrl(data) {
  var _data$name = data.name,
      name = _data$name === void 0 ? '' : _data$name,
      _data$address = data.address,
      address = _data$address === void 0 ? '' : _data$address,
      _data$city = data.city,
      city = _data$city === void 0 ? '' : _data$city,
      _data$state = data.state,
      state = _data$state === void 0 ? '' : _data$state,
      _name = name.replace('&', 'and');

  data.mapsUrl = hasMapsParams(data) ? "".concat(GOOGLE_MAPS_ENDPOINT, "&query=").concat(encodeURI(_name), "+").concat(encodeURI(address), "+").concat(encodeURI(city), "+").concat(encodeURI(state)) : '';
}
/**
 * Sets a plain version of byline
 *
 * @param {Object} data
 */


function setPlainAuthorsList(data) {
  var _data$byline = data.byline,
      byline = _data$byline === void 0 ? [] : _data$byline;
  data.authors = byline.map(function (Obj) {
    return Obj.text;
  });
}
/**
 * Sets the primaryHeadline based on the listing name and neighborhood or use the circulation one.
 * @param {Object} data
 */


function setPrimaryHeadline(data) {
  if (has(data.name) && !has(data.overrideHeadline)) {
    data.primaryHeadline = "".concat(data.name, " | New York Magazine | The Thousand Best");
  }
}
/**
* Sets the slug of the listing based on the listing name.
* @param {Object} data
*/


function setSlug(data) {
  if (has(data.name)) {
    data.slug = sanitize.cleanSlug(data.name, {
      replaceAccentCharacters: true
    });
  }
}
/**
* Sets the adjective that describes the numerical critic's rating
* @param {Object} data
*/


function setRatingAdjective(data) {
  data.ratingAdjective = listingHelper.setRatingAdjective(data.criticsRating);
}
/**
 * Sets listing description property in order to publish
 * to `meta-description` component
 *
 * @param {Object} data
 */


function setPageDescription(data) {
  var _data$name2 = data.name,
      name = _data$name2 === void 0 ? '' : _data$name2,
      _data$teaser = data.teaser,
      teaser = _data$teaser === void 0 ? '' : _data$teaser;

  if (name && teaser) {
    data.listingDescription = "".concat(name, " | ").concat(teaser);
  } else {
    data.listingDescription = '';
  }
}
/**
 * Sets listing pageTags property in order to publish
 * to `meta-keywords` component
 *
 * @param {Object} data
 */


function setPageTags(data) {
  var _data$hiddenTags = data.hiddenTags,
      hiddenTags = _data$hiddenTags === void 0 ? [] : _data$hiddenTags,
      _data$name3 = data.name,
      name = _data$name3 === void 0 ? '' : _data$name3,
      _data$neighborhood = data.neighborhood,
      neighborhood = _data$neighborhood === void 0 ? '' : _data$neighborhood,
      hiddenTagsArray = hiddenTags.map(function (tag) {
    return tag.text;
  }),
      pageTags = [name, neighborhood].concat(_toConsumableArray(keyObjectToArray(data.listingFeatures || {})), _toConsumableArray(hiddenTagsArray)).filter(Boolean) || [];
  data.pageTags = pageTags;
}
/*
 * Sanitizes curly quotes, dashes, and ellipses inputs in Clay.
 * @param {Object} data
 */


function sanitizeInputs(data) {
  var directInputProperties = [// Direct inputs of properties in Clay.
  'name', 'cuisineFormatted', 'teaser', 'neighborhood', 'tips', 'recommendedDishes'],
      relatedArticlesHeadlines = ['headline', 'overrideHeadline'];
  propertiesToSmartText(data, directInputProperties); // Applies the smart text function to direct Clay inputs

  arrayPropertyToSmartText(data.relatedArticles, relatedArticlesHeadlines); // Applies the smart text function to related articles

  arrayPropertyToSmartText(data.authors, ['text']); // Applies the smart text function to authors that get generated from the byline property which is a simple-list.
}
/**
 * Checks if the array is empty, and applies the smartText function to its properties.
 * @param {Object[]} arrayProperty
 * @param {string[]} properties
 */


function arrayPropertyToSmartText(arrayProperty, properties) {
  if (has(arrayProperty)) {
    arrayProperty.forEach(function (property) {
      propertiesToSmartText(property, properties);
      return property;
    });
  }
}
/**
 * Iterates through the array of properties and
 * verifies that a property exists in the data object, if it exists, it applies the toSmartText function to it.
 * @param {Object} data
 * @param {Object} properties
 */


function propertiesToSmartText(data, properties) {
  properties.forEach(function (field) {
    if (has(data[field])) data[field] = sanitize.toSmartText(data[field]);
  });
}
/**
 * Syncs up the cuisine/barTypes based on the listing type
 *
 * @param {Object} data
 */


function syncCuisineAndbarTypes(data) {
  if (data.listingType === 'restaurant') {
    data.barTypes = null;
  } else if (data.listingType === 'bar') {
    data.cuisines = null;
  }
}
/*
 * Sets reservation link label
 *
 * @param {Object} data
 */


function setReservationLinkLabel(data) {
  var reservationLink = (data.reservationLink || '').trim();

  if (reservationLink) {
    data.reservationLinkLabel = OPEN_TABLE_RE.test(reservationLink) ? 'Reserve on OpenTable' : 'Reserve a table';
  } else {
    data.reservationLinkLabel = '';
  }
}
/**
 * set the canonical url from the locals (even if it's already set)
 * @param {object} data
 * @param {object} locals
 */


function setCanonicalUrl(data, locals) {
  if (_get(locals, 'publishUrl')) {
    data.canonicalUrl = locals.publishUrl;
  }
}

module.exports.save = function (uri, data, locals) {
  var promises = [];
  mapDollarSigns(data);
  setPlainAuthorsList(data);
  setMapsUrl(data);
  setSlug(data);
  setRatingAdjective(data);
  setPageDescription(data);
  setPageTags(data);
  syncCuisineAndbarTypes(data);
  setReservationLinkLabel(data);
  setCanonicalUrl(data, locals);

  if (!_isEmpty(data.relatedArticles)) {
    promises.push(getRelatedArticlesData(data, locals));
  }

  if (!_isEmpty(data.reviewUrl)) {
    promises.push(getReviewArticleData(data, locals));
  }

  return setCoordinates(data).then(function () {
    promises.push(getNeighborhoodData(data, locals));
  }).then(function () {
    return Promise.all(promises);
  }).then(function () {
    setPrimaryHeadline(data);
    sanitizeInputs(data);
    return data;
  });
};
/**
 *
 * @param {object} [data]
 * @param {string} [prop]
 * @returns {string[]}
 */


function trueKeys(data, prop) {
  return Object.keys(_pickBy(_get(data, prop)));
}
/**
 * combines several fields -- logic cleaner here than in template
 * @param {object} data
 * @returns {string[]}
 */


function getParselyKeywords(data) {
  var neighborhood = _get(data, 'neighborhood');

  var parselyKeywords = trueKeys(data, 'cuisines').concat(trueKeys(data, 'listingFeatures')).concat(trueKeys(data, 'barTypes'));

  if (neighborhood) {
    parselyKeywords.push(neighborhood);
  }

  return parselyKeywords;
}
/**
 *
 * @param {string} uri
 * @param {object} data
 * @returns {object}
 */


module.exports.render = function (uri, data) {
  data.parselyKeywords = getParselyKeywords(data);
  return data;
}; // Exposed for testing


module.exports.sanitizeInputs = sanitizeInputs;
module.exports.propertiesToSmartText = propertiesToSmartText;
module.exports.arrayPropertyToSmartText = arrayPropertyToSmartText;
module.exports.getRelatedArticlesData = getRelatedArticlesData;
module.exports.setMapsUrl = setMapsUrl;
module.exports.setReservationLinkLabel = setReservationLinkLabel;
module.exports.OPEN_TABLE_RE = OPEN_TABLE_RE; // Keeps the regex centralized (model / upgrade)

}).call(this,"/components/restaurant-and-bar-listing/model.js")}, {"25":25,"32":32,"39":39,"43":43,"49":49,"52":52,"59":59,"75":75,"81":81,"152":152,"180":180,"181":181}];
window.modules["scenario.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (uri, data) {
  return normalizeMinMax(data);
};
/**
 * Modifies scenario model to accept pageviewCount min/max values
 * @param {object} data - scenario model
 * @returns {object} - scenario model
 */


function normalizeMinMax(data) {
  var min = 1,
      max = null;

  if (data.pageviewCountLogic === 'range') {
    min = data.pageviewCountMinimum;
    max = data.pageviewCountMaximum;
  } else if (data.pageviewCountLogic === 'minimum') {
    min = data.pageviewCountMinimum;
    max = null;
  }

  data.pageviewCount = {
    min: min,
    max: max
  };
  return data;
}
}, {}];
window.modules["search-results.model"] = [function(require,module,exports){(function (process,__filename){
'use strict';

var _require = require(43),
    formatStart = _require.formatStart,
    swiftypeService = require(153),
    _isEmpty = require(75),
    _reduce = require(124),
    _get = require(32),
    camelCase = require(183),
    log = require(81).setup({
  file: __filename,
  component: 'search-results'
}),
    swiftypeEngine = window.process.env.SWIFTYPE_PUBLISHED_ARTICLES_ENGINE || 'qa-published-articles',
    swiftypeHost = window.process.env.SWIFTYPE_HOST,
    swiftypeSearchKey = window.process.env.SWIFTYPE_SEARCH_KEY;

require(182);

function buildSwiftypeQuery(data, locals) {
  var query = _get(locals, 'query.q'),
      pageSize = parseInt(_get(locals, 'query.size'), 10) || data.size || 10,
      queryBody = swiftypeService.buildQuery(query);

  var currentPage = formatStart(parseInt(_get(locals, 'query.page'), 10)); // can be undefined or NaN

  queryBody.sort = {
    _score: 'desc'
  };
  swiftypeService.setPage(queryBody, currentPage);
  swiftypeService.setSize(queryBody, pageSize);

  if (data.onlyThisSite) {
    swiftypeService.addFilter(queryBody, 'site', _get(locals, 'site.slug'));
  }

  if (!_isEmpty(data.excludeTags)) {
    queryBody.filters.none = [];

    for (var excludeTagsIndex = 0; excludeTagsIndex < data.excludeTags.length; excludeTagsIndex++) {
      queryBody.filters.none.push({
        tags: data.excludeTags[excludeTagsIndex].text
      });
    }
  }

  return queryBody;
}

function convertRawArticleData(article) {
  return _reduce(article, function (accumulator, value, key) {
    // Change to camelCase
    var camelCaseKey = camelCase(key);

    if (!_isEmpty(value) && !_isEmpty(value.raw)) {
      try {
        // Swiftype returns objects as JSON strings
        accumulator[camelCaseKey] = JSON.parse(value.raw);
      } catch (e) {
        // Arrays, strings, and dates are returned normally
        accumulator[camelCaseKey] = value.raw;
      }
    }

    return accumulator;
  }, {});
}

module.exports.render = function (ref, data, locals) {
  var q = _get(locals, 'query.q');

  var skipQuery = false,
      swiftypeQueryBody;

  if (_isEmpty(locals)) {
    log('debug', 'No locals provided, skipping search query');
    skipQuery = true;
  }

  if (_isEmpty(q)) {
    log('debug', 'No `q` query parameter provided, skipping search query');
    skipQuery = true;
  }

  if (_isEmpty(swiftypeEngine)) {
    log('error', 'No swiftypeEngine set in environment, skipping search query');
    skipQuery = true;
  }

  if (_isEmpty(swiftypeHost)) {
    log('error', 'No SWIFTYPE_HOST environment variable set, skipping search query');
    skipQuery = true;
  }

  if (_isEmpty(swiftypeSearchKey)) {
    log('error', 'No SWIFTYPE_SEARCH_KEY environment variable set, skipping search query');
    skipQuery = true;
  }

  if (skipQuery) {
    data.articles = [];
    return data;
  }

  swiftypeQueryBody = buildSwiftypeQuery(data, locals); // Log the query

  log('debug', 'swiftype query for search-results cmpt', {
    query: swiftypeQueryBody,
    ref: ref
  });
  return swiftypeService.query(swiftypeQueryBody, {
    host: swiftypeHost,
    token: swiftypeSearchKey,
    engine: swiftypeEngine
  }).then(function (response) {
    data.articles = _get(response, 'results', []).map(convertRawArticleData);
    data.totalPages = _get(response, 'meta.page.total_pages');
    data.currentPage = _get(response, 'meta.page.current');
    data.nextPage = data.currentPage + 1;
    return data;
  });
};

module.exports.save = function (ref, data) {
  // make sure all of the numbers we need to save aren't strings
  if (data.size) {
    data.size = parseInt(data.size, 10);
  }

  return data;
};

}).call(this,require(22),"/components/search-results/model.js")}, {"22":22,"32":32,"43":43,"75":75,"81":81,"124":124,"153":153,"182":182,"183":183}];
window.modules["senate-table-2018.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"43":43,"44":44}];
window.modules["share-button.model"] = [function(require,module,exports){'use strict';
/**
 * set component canonical url if it's passed in through the locals
 * @param {object} data
 * @param {object} [locals]
 */

function setUrl(data, locals) {
  if (locals && locals.publishUrl) {
    data.url = locals.publishUrl;
  }
}

module.exports.save = function (ref, data, locals) {
  setUrl(data, locals);
  return data;
};
}, {}];
window.modules["share-video.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data, locals) {
  if (locals && locals.publishUrl) {
    data.url = locals.publishUrl;
  }

  return data;
};
}, {}];
window.modules["single-related-story-video.model"] = [function(require,module,exports){'use strict';

var _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    ELASTIC_FIELDS = ['primaryHeadline', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    title: data.overrideTitle || result.primaryHeadline,
    pageUri: result.pageUri,
    urlIsValid: data.url === '' || result.urlIsValid
  }));

  if (data.title) {
    data.plaintextTitle = toPlainText(data.title);
  }

  return data;
}

module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
}; // export for upgrade.js


module.exports.assignToData = assignToData;
}, {"39":39,"57":57,"59":59,"103":103}];
window.modules["single-related-story.model"] = [function(require,module,exports){'use strict';

var _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    ELASTIC_FIELDS = ['primaryHeadline', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    title: data.overrideTitle || result.primaryHeadline,
    pageUri: result.pageUri,
    urlIsValid: result.urlIsValid
  }));

  if (data.title) {
    data.plaintextTitle = toPlainText(data.title);
  }

  return data;
}

module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
}; // export for use in upgrade.js


module.exports.assignToData = assignToData;
}, {"39":39,"57":57,"59":59,"103":103}];
window.modules["slideshow-button.model"] = [function(require,module,exports){'use strict';

var slideshow = require(147);

module.exports.save = function (ref, data, locals) {
  if (data.slideshowLocation === 'CQ') {
    return slideshow.addSlideshowLink(locals)(data);
  }

  return data;
};
}, {"147":147}];
window.modules["soundcloud.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  var embedCode = data.embedCode && data.embedCode.match(/\/(tracks|playlists)\/(\d+)/i),
      srcLink = data.embedCode.match(/src=['"](.*?)['"]/i);
  data.embedType = '';
  data.soundcloudId = '';

  if (embedCode) {
    data.embedType = embedCode[1];
    data.soundcloudId = embedCode[2];

    if (srcLink) {
      // replace the <iframe> embed code in the field with just the src link
      data.embedCode = srcLink[1];
    }
  }

  return data;
};
}, {}];
window.modules["space-logic.model"] = [function(require,module,exports){'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _get = require(32),
    _uniq = require(163),
    utils = require(43),
    has = utils.has,
    // `venience
logicChecker = require(185),
    timeLogic = require(186),
    dateFormat = require(52),
    dateParse = require(54);
/**
 * NOTE: There's some craziness in here. Whenever we want to reload
 * just one Logic component (or all) and not the whole page we
 * need access to the url that the user is currently on. Kiln passes
 * this in as a encoded parameter of the `locals.url` property,
 * so if it's there then we decode it and use that as the context.
 *
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


function get(ref, data, locals) {
  var localUrl = locals.url,
      queryParamKeys = _typeof(locals.query) === 'object' ? Object.keys(locals.query) : [],
      renderer = _get(locals, 'params.ext', null);

  if (!localUrl) {
    return data;
  }

  localUrl = utils.urlToCanonicalUrl(localUrl);

  if (localUrl && renderer === 'amp') {
    /**
     * AMP Urls will contain this special 'amp' string
     * in the URL so we should parse it out before proceeding
     * otherwise we will not get the appropriate URL to
     * check space logic against.
     */
    localUrl = localUrl.replace('/amp/', '/');
  } // Initialize displaySelf to false
  // (logic modules are responsible for setting true when applicable)


  data.displaySelf = false; // Check for no logic at all, this sometimes gets bypassed
  // at different stages in edit mode, but it's great in view
  // mode because it quickly identifies 'blank' logic components
  // and returns quickly.

  if (!logicChecker.noLogicCheck(data)) {
    data.displaySelf = true;
    return data;
  } // Run through the logic checker, which returns component data,
  // with displaySelf set to true if applicable


  return logicChecker(data, localUrl, queryParamKeys, locals);
}
/**
 * no duplicates, uppercase, or trailing spaces
 * @param {string} tagString
 * @returns {string}
 */


function cleanTags(tagString) {
  return _uniq(tagString.split(',').map(function (tag) {
    return tag && tag.trim().toLowerCase();
  })).join(',');
}
/**
 * set the start and end date
 * and format it correctly
 * @param  {object} data
 * @returns {Object}
 */


function formatDate(data) {
  if (has(data.startDay) || has(data.endDay)) {
    // make sure both date and time are set. if the user only set one, set the other to today / right now
    data.startDay = has(data.startDay) ? data.startDay : dateFormat(new Date(), 'YYYY-MM-DD');
    data.endDay = has(data.endDay) ? data.endDay : dateFormat(new Date(), 'YYYY-MM-DD');
    data.startTime = has(data.startTime) ? data.startTime : dateFormat(new Date(), 'HH:mm');
    data.endTime = has(data.endTime) ? data.endTime : dateFormat(new Date(), 'HH:mm'); // generate the `date` data from these two fields

    data.startDate = dateFormat(dateParse(data.startDay + ' ' + data.startTime)); // ISO 8601 date string

    data.endDate = dateFormat(dateParse(data.endDay + ' ' + data.endTime)); // ISO 8601 date string
  }

  return data;
}
/**
 * update space logic
 * @param {string} ref
 * @param {object} data
 * @returns {Promise}
 */


function updateSelf(ref, data) {
  if (data) {
    // Check if the times are formatted properly
    data = formatDate(data);
    data = timeLogic.onUpdate(data);

    if (data.tags) {
      data.tags = cleanTags(data.tags); // clean tags on PUT for efficiency
    }
  }

  return data;
}

module.exports.render = get;
module.exports.save = updateSelf;
}, {"32":32,"43":43,"52":52,"54":54,"163":163,"185":185,"186":186}];
window.modules["spiderman-map.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"43":43,"44":44}];
window.modules["splash-container.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _filter = require(51),
    _includes = require(33),
    striptags = require(42),
    dateFormat = require(52),
    utils = require(43),
    has = utils.has,
    sanitize = require(39),
    mediaplay = require(53);
/**
 * only allow emphasis, italic, and strikethroughs in headlines
 * @param  {string} oldHeadline
 * @returns {string}
 */


function stripHeadlineTags(oldHeadline) {
  var newHeadline = striptags(oldHeadline, ['em', 'i', 'strike']); // if any tags include a trailing space, shift it to outside the tag

  return newHeadline.replace(/ <\/(i|em|strike)>/g, '</$1> ');
}
/**
 * sanitize headlines and teaser
 * @param  {object} data
 */


function sanitizeInputs(data) {
  if (has(data.primaryHeadline)) {
    data.primaryHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.primaryHeadline));
  }

  if (has(data.shortHeadline)) {
    data.shortHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.shortHeadline));
  }

  if (has(data.overrideHeadline)) {
    data.overrideHeadline = sanitize.toSmartHeadline(stripHeadlineTags(data.overrideHeadline));
  }

  if (has(data.teaser)) {
    data.teaser = sanitize.toSmartText(stripHeadlineTags(data.teaser));
  }
}
/**
 * add extra stuff to the page title on certain sites
 * @param {string} title
 * @param {object} locals
 * @returns {string}
 */


function addSiteTitle(title, locals) {
  // add '-- Science of Us' if we're on that site
  if (_get(locals, 'site.slug') === 'scienceofus') {
    return "".concat(title, " -- Science of Us");
  } else if (_get(locals, 'site.slug') === 'press') {
    // add '-- New York Media Press Room' if we're on that site
    return "".concat(title, " -- New York Media Press Room");
  } else {
    return title;
  }
}
/**
 * generate plaintext pageTitle / twitterTitle / ogTitle
 * @param {object} data
 * @param {object} locals
 */


function generatePageTitles(data, locals) {
  if (has(data.shortHeadline) || has(data.primaryHeadline)) {
    var plaintextTitle = sanitize.toPlainText(data.shortHeadline || data.primaryHeadline); // published to pageTitle

    data.pageTitle = addSiteTitle(plaintextTitle, locals);
  }

  if (has(data.primaryHeadline)) {
    // published to ogTitle
    data.plaintextPrimaryHeadline = sanitize.toPlainText(data.primaryHeadline);
  }

  if (has(data.shortHeadline)) {
    // published to twitterTitle
    data.plaintextShortHeadline = sanitize.toPlainText(data.shortHeadline);
  }
}
/**
 * add extra stuff to the description on sponsored stories
 * @param {string} desc
 * @param {object} data
 * @returns {string}
 */


function addSponsoredDescription(desc, data) {
  if (_get(data, 'featureTypes["Sponsor Story"]')) {
    return "PAID STORY: ".concat(desc);
  } else {
    return desc;
  }
}
/**
 * generate pageDescription from teaser
 * @param {object} data
 */


function generatePageDescription(data) {
  if (has(data.teaser)) {
    var plaintextDesc = sanitize.toPlainText(data.teaser); // published to pageDescription

    data.pageDescription = addSponsoredDescription(plaintextDesc, data); // published to socialDescription (consumed by share components and og:description/twitter:description)

    data.socialDescription = addSponsoredDescription(plaintextDesc, data);
  }
}
/**
 * set the publish date from the locals (even if it's already set),
 * and format it correctly
 * @param  {object} data
 * @param  {object} locals
 */


function formatDate(data, locals) {
  if (_get(locals, 'date')) {
    // if locals and locals.date exists, set the article date (overriding any date already set)
    data.date = locals.date;
  }

  if (has(data.date)) {
    data.date = dateFormat(data.date); // ISO 8601 date string
  }
}
/**
 * set the canonical url from the locals (even if it's already set)
 * @param {object} data
 * @param {object} locals
 */


function setCanonicalUrl(data, locals) {
  if (_get(locals, 'publishUrl')) {
    data.canonicalUrl = locals.publishUrl;
  }
}
/**
 * strip out ad dummies (placeholders to show where generated in-article ads will go)
 * @param  {object} data
 */


function stripAdDummies(data) {
  if (has(data.content)) {
    data.content = _filter(data.content, function (component) {
      return !_includes(component._ref, 'components/ad-dummy/');
    });
  }
}
/**
 * ensure feed image is using the correct rendition
 * @param {object} data
 */


function setFeedImageRendition(data) {
  if (has(data.feedImgUrl)) {
    data.feedImgUrl = mediaplay.getRendition(data.feedImgUrl, 'og:image');
  }
}

module.exports.save = function (uri, data, locals) {
  sanitizeInputs(data); // do this before using any headline/teaser/etc data

  generatePageTitles(data, locals);
  generatePageDescription(data);
  formatDate(data, locals);
  setCanonicalUrl(data, locals);
  stripAdDummies(data);
  setFeedImageRendition(data);
  return data;
};
}, {"32":32,"33":33,"39":39,"42":42,"43":43,"51":51,"52":52,"53":53}];
window.modules["sponsor-callout.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44),
    _set = require(87);

module.exports.save = function (uri, data) {
  if (utils.has(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      return _set(data, 'css', css);
    });
  } else {
    return _set(data, 'css', '');
  }
};
}, {"43":43,"44":44,"87":87}];
window.modules["sponsored-product.model"] = [function(require,module,exports){'use strict';

var striptags = require(42),
    _isString = require(164),
    _set = require(87),
    mediaPlay = require(53),
    sanitize = require(39),
    utils = require(43),
    styles = require(44);
/**
 * removes html tags froms strings
 * @param {string} text
 * @param {array} allowTags
 * @returns {string}
 */


function cleanText(text, allowTags) {
  var allowedTags = ['strong', 'em', 'a'];
  return sanitize.toSmartText(striptags(text, allowTags ? allowedTags : []));
}
/**
 * sanitizes text labels
 * @param {object} data
 */


function updateText(data) {
  // all text labels (except for image captions) are stripped of html tags
  data.imageCaption = cleanText(data.imageCaption, true);
  data.imageCreditOverride = cleanText(data.imageCreditOverride, true);
}
/**
 * sets product image rendition
 * @param {object} data
 */


function updateImage(data) {
  if (!utils.isFieldEmpty(data.imageUrl)) {
    data.imageUrl = mediaPlay.getRendition(data.imageUrl, data.imageRendition);
  }
}
/**
 * sets product images credit and caption
 * @param {object} data
 * @returns {Promise}
 */


function updateImageMetadata(data) {
  return mediaPlay.getMediaplayMetadata(data.imageUrl).then(function (metadata) {
    data.imageType = metadata.imageType;

    if (_isString(data.imageCreditOverride) && !utils.isFieldEmpty(data.imageCreditOverride)) {
      data.imageCredit = data.imageCreditOverride;
    } else {
      data.imageCredit = metadata.credit;
    }

    return data;
  });
}

function setPerInstanceStyling(data, uri) {
  if (utils.has(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      return _set(data, 'css', css);
    });
  } else {
    return _set(data, 'css', '');
  }
}

module.exports.save = function (uri, data) {
  // only do this stuff for component instances not for component base
  if (utils.isInstance(uri)) {
    updateText(data);
    updateImage(data);
    setPerInstanceStyling(data, uri);
    return updateImageMetadata(data).then(function (data) {
      return data;
    });
  }

  return data;
};
}, {"39":39,"42":42,"43":43,"44":44,"53":53,"87":87,"164":164}];
window.modules["sponsored-pull-quote.model"] = [function(require,module,exports){'use strict';

var prettyQuotes = require(176),
    styles = require(44),
    utils = require(43),
    _set = require(87);

module.exports.save = function (uri, data) {
  // goes through the quote and replaces quotation marks with the html entity
  // then remove those HTML entities while setting a field 'hasQuoteMarks' to true
  // so that the template will render the appropriate quotation mark graphic
  data.quote = prettyQuotes.quotesToEntities(data.quote);

  if (prettyQuotes.hasQuoteMarks(data.quote)) {
    data.hasQuoteMarks = true;
    data.quote = prettyQuotes.removeQuoteEntities(data.quote, '').updatedString;
  }

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      return _set(data, 'css', css);
    });
  } else {
    return data;
  }
};
}, {"43":43,"44":44,"87":87,"176":176}];
window.modules["sponsored-shopping-product.model"] = [function(require,module,exports){'use strict';

var _isString = require(164),
    _padEnd = require(193),
    _trimEnd = require(192);
/**
 * pad a number out to two decimal points
 * note: you must pass this a string, not a number
 * @param {string} price
 * @returns {string}
 */


function padPrice(price) {
  if (_isString(price)) {
    var priceParts = price.split('.');

    if (priceParts.length === 2) {
      priceParts[1] = _padEnd(_trimEnd(priceParts[1], '0'), 2, '0');
      return priceParts.join('.');
    }
  }

  return price;
}

function updateText(data) {
  data.priceLow = padPrice(data.priceLow);
  data.priceHigh = padPrice(data.priceHigh);
  return data;
}
/**
 * Things to do every time this component updates.
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  return updateText(data);
};
}, {"164":164,"192":192,"193":193}];
window.modules["sponsored-tag.model"] = [function(require,module,exports){'use strict';

var mediaPlay = require(53);

module.exports.save = function (uri, data) {
  var height = data.logoHeight || 25;

  if (data.brandUrl) {
    data.brandUrl = mediaPlay.getRenditionUrl(data.brandUrl, {
      w: 2147483647,
      h: height,
      r: '2x'
    }, false);
  }

  if (data.brandUrlMobile) {
    data.brandUrlMobile = mediaPlay.getRenditionUrl(data.brandUrlMobile, {
      w: 2147483647,
      h: height,
      r: '2x'
    }, false);
  }

  return data;
};
}, {"53":53}];
window.modules["spotify.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39); // gets the embed type (album, artist, playlist, or track) and the Spotify URI Code from the url pasted in


function getEmbedDetails(data) {
  var embedUrl = data.url,
      // playlists have a different URL format than albums, tracks, and artist embeds
  // if isAlbumOrArtistOrTrack is not null, it parses out the type of embed (album, artist or track)
  isAlbumOrArtistOrTrack = embedUrl.match(/open\.spotify\.com\/(album|track|artist)\//i),
      // grabs the album, artist or track's Spotify URI from the url pasted in
  spotifyUriCode = embedUrl.match(/(album|artist|track|playlist)\/(.*)/i),
      // parses out playlist creator since Spotify playlist links include the creator of the playlist
  // e.g., open.spotify.com/user/spotify/playlist/... or open.spotify.com/user/hamiltonmusical/playlist/...
  playlistCreator = embedUrl.match(/\/user\/(.*)\/playlist/i);

  if (isAlbumOrArtistOrTrack) {
    data.embedType = isAlbumOrArtistOrTrack[1];
  } else {
    data.embedType = 'playlist';
    data.playlistCreator = playlistCreator[1];
  }

  data.spotifyUriCode = spotifyUriCode[2];
}

module.exports.render = function (ref, data) {
  // TODO: convert to module.exports.save
  if (data.url) {
    // remove any HTML tags that may have been carried over when pasting from google docs
    data.url = sanitize.toPlainText(data.url);
    getEmbedDetails(data);
  }

  return data;
};
}, {"39":39}];
window.modules["state-table-2018.model"] = [function(require,module,exports){'use strict';

var _forEach = require(27),
    striptags = require(42),
    utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  // Allow line breaks in the lengthy piece of text
  _forEach(data.dataEntries, function (entry) {
    if (utils.has(entry.whyItsInPlay)) {
      entry.whyItsInPlay = striptags(entry.whyItsInPlay, ['br']).replace(/\n/g, '<br/>');
    }

    if (utils.has(entry.whyItMatters)) {
      entry.whyItMatters = striptags(entry.whyItMatters, ['br']).replace(/\n/g, '<br/>');
    }

    if (utils.has(entry.toSwingSenate)) {
      entry.toSwingSenate = striptags(entry.toSwingSenate, ['br']).replace(/\n/g, '<br/>');
    }

    if (utils.has(entry.toSwingHouse)) {
      entry.toSwingHouse = striptags(entry.toSwingHouse, ['br']).replace(/\n/g, '<br/>');
    }
  }); // Per-instance styles


  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"27":27,"42":42,"43":43,"44":44}];
window.modules["subscription-account-setup-header.model"] = [function(require,module,exports){'use strict';

var _require = require(43),
    has = _require.has,
    sanitize = require(39);
/**
 * sanitize headlines and teasers
 * @param  {object} data
 */


function sanitizeInputs(data) {
  if (has(data.accountSettingsHeadline)) {
    data.accountSettingsHeadline = sanitize.toSmartHeadline(data.accountSettingsHeadline);
  }

  if (has(data.subDescription)) {
    data.subDescription = sanitize.toSmartHeadline(data.subDescription);
  }
}

module.exports.save = function (uri, data) {
  sanitizeInputs(data);
  return data;
};
}, {"39":39,"43":43}];
window.modules["subscription-form-header.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (uri, data) {
  if (data.headerText) {
    data.headerText = sanitize.toSmartHeadline(data.headerText);
  }

  return data;
};
}, {"39":39}];
window.modules["subscription-plan.model"] = [function(require,module,exports){'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var planCodes = {
  Digital: 'D',
  'Digital and Print': 'B'
},
    _require = require(43),
    has = _require.has,
    sanitize = require(39),
    planOptions = {
  Digital: {
    planName: 'Digital',
    planHeadline: 'Try free for a month',
    unselectedButtonText: 'Start your free trial now!'
  },
  'Digital and Print': {
    planName: 'Digital and Print',
    planHeadline: 'Enjoy 12 issues for $12',
    unselectedButtonText: 'Subscribe to Print & Digital'
  },
  'NY x NY Membership': {
    planName: 'NY x NY Membership',
    planHeadline: 'Try free for a month',
    unselectedButtonText: 'Start your free trial now!'
  }
};
/**
 * sanitize headlines and teasers
 * @param  {object} data
 */


function sanitizeInputs(data) {
  if (has(data.planHeadline)) {
    data.planHeadline = sanitize.toSmartHeadline(data.planHeadline);
  }

  if (has(data.planSubHeadline)) {
    data.planSubHeadline = sanitize.toSmartHeadline(data.planSubHeadline);
  }
}

function prefillPlanDetails(data) {
  var planType = data.planType,
      planData = planOptions[planType],
      keys = _typeof(planData) === 'object' ? Object.keys(planData) : [];
  keys.forEach(function (key) {
    if (!data[key]) {
      data[key] = planData[key];
    }
  });
}

module.exports.save = function (ref, data) {
  prefillPlanDetails(data);
  sanitizeInputs(data);
  data.planCode = planCodes[data.planType];
  ['planSourceKey', 'planTerms'].forEach(function (property) {
    if (data[property]) {
      data[property] = data[property].trim();
    }
  });
  return data;
};
}, {"39":39,"43":43}];
window.modules["subscription-tier-option.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (uri, data) {
  if (data.tierMessage) {
    data.tierMessage = sanitize.toSmartHeadline(data.tierMessage);
  }

  return data;
};
}, {"39":39}];
window.modules["subsection.model"] = [function(require,module,exports){'use strict';

var _includes = require(33),
    utils = require(43),
    styles = require(44),
    sanitize = require(39);

module.exports.save = function (ref, data) {
  // run titles through headline quotes
  if (!utils.isFieldEmpty(data.title)) {
    data.title = sanitize.toSmartHeadline(data.title); // generate ID for in-page anchors

    data.titleId = sanitize.toPlainText(data.title);
  }

  if (_includes(data.title, '<a')) {
    data.hasLink = true;
  } // add per-instance styles


  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"33":33,"39":39,"43":43,"44":44}];
window.modules["svg.model"] = [function(require,module,exports){'use strict';

var purify = require(90),
    utils = require(43);
/**
 * Return the first svg element in an html string
 * @param {string} content
 * @returns {string}
 */


function filterNonSVG(content) {
  var openingTag = content.match('<svg'),
      closingTag = content.match('</svg>');
  if (!openingTag) return '';
  return content.substring(openingTag.index, closingTag && closingTag.index + '</svg>'.length || content.length);
}

module.exports.save = function (ref, data) {
  if (utils.has(data.svgContent)) {
    data.svgContent = filterNonSVG(purify(data.svgContent.trim())); // remove any bad stuff first
  }

  return data;
};
}, {"43":43,"90":90}];
window.modules["tags.model"] = [function(require,module,exports){'use strict';

var _find = require(71),
    _map = require(37),
    _assign = require(57),
    _set = require(87),
    _includes = require(33),
    _require = require(43),
    normalizeTags = _require.normalizeTags,
    invisibleTags = [// invisible tags will be rendered to the page but never visible outside of edit mode
'cut section lede', 'cut homepage lede', 'vulture section lede', 'vulture homepage lede', 'strategist homepage lede', 'no video promo', 'sponsored', 'breaking', 'exclusive', 'top story', 'image gallery', 'fashion week schedule', 'expired sale'];
/**
 * get the rubric from the items
 * @param {array} items
 * @returns {string}
 */


function getRubric(items) {
  var rubric = _find(items, {
    isRubric: true
  });

  return rubric && rubric.text;
}
/**
 * make sure all tags are lowercase and have trimmed whitespace
 * @param  {array} items
 * @return {array}
 */


function clean(items) {
  return _map(items || [], function (item) {
    return _assign({}, item, {
      text: item.text.toLowerCase().trim()
    });
  });
}
/**
 * set an 'invisible' boolean on tags, if they're in the list above
 * @param {array} items
 * @return {array}
 */


function setInvisible(items) {
  return _map(items || [], function (item) {
    return _set(item, 'invisible', _includes(invisibleTags, item.text));
  });
}

module.exports.save = function (uri, data) {
  var items = data.items;
  items = clean(items); // first, make sure everything is lowercase and has trimmed whitespace

  data.normalizedTags = normalizeTags(items);
  items = setInvisible(items); // then figure out which tags should be invisible

  data.featureRubric = getRubric(items); // also grab the feature rubric

  data.items = items;
  return data;
};
}, {"33":33,"37":37,"43":43,"57":57,"71":71,"87":87}];
window.modules["text-list.model"] = [function(require,module,exports){'use strict';

var _forEach = require(27),
    striptags = require(42),
    utils = require(43),
    styles = require(44),
    sanitize = require(39);

module.exports.save = function (uri, data) {
  if (utils.has(data.items)) {
    data.items = _forEach(data.items, function (itm) {
      itm.text = sanitize.toSmartText(striptags(itm.text, ['strong', 'em', 's', 'a', 'span']));
    });
  }

  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"27":27,"39":39,"42":42,"43":43,"44":44}];
window.modules["tidal.model"] = [function(require,module,exports){'use strict';

module.exports.render = function (ref, data) {
  if (data.embedType) {
    switch (data.embedType) {
      case 'a':
        data.embedClass = 'album';
        break;

      case 'p':
        data.embedClass = 'playlist';
        break;

      case 't':
        data.embedClass = 'track';
        break;

      case 'v':
        data.embedClass = 'video';
        break;

      default:
        data.embedClass = 'track';
    }
  }

  return data;
};

module.exports.save = function (ref, data) {
  // Tidal urls come in the format https://tidal.com/embedType/embedId
  var tidalRegex = /https?:\/\/tidal.com\/(track|album|playlist|video)\/(\S+)/;
  var regexMatch;
  data.embedType = '';
  data.embedId = '';

  if (data.itemUrl) {
    regexMatch = data.itemUrl.match(tidalRegex); // if we have a match, it should consist of [full url, type, id]

    if (regexMatch && regexMatch.length === 3) {
      // we only want to use the first letter of the matched type (e.g. 't' for 'track')
      data.embedType = regexMatch[1].slice(0, 1); // grab the full id - this is generally a number or guid

      data.embedId = regexMatch[2];
    }
  }

  return data;
};
}, {}];
window.modules["top-picks-item.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    mediaPlay = require(53),
    _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    ELASTIC_FIELDS = ['primaryHeadline', 'authors', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    plaintextTitle: toPlainText(result.primaryHeadline),
    authors: result.authors,
    pageUri: result.pageUri
  }));

  if (utils.has(data.imageUrl)) {
    data.imageUrl = mediaPlay.getRendition(data.imageUrl, 'square');
  }

  return data;
}

module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
};
}, {"39":39,"43":43,"53":53,"57":57,"59":59,"103":103}];
window.modules["top-stories-desktop.model"] = [function(require,module,exports){'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _pickBy = require(59),
    _keys = require(128),
    queryService = require(49),
    ELASTIC_INDEX = 'published-articles',
    ELASTIC_FIELDS = ['plaintextPrimaryHeadline', 'primaryHeadline', 'canonicalUrl', 'pageUri'];
/**
 * Given an Elastic query object, add a should clause matching
 * articles that have the specified tag.
 * @param {object} query
 * @param {string} tag
 * @return {object}
 */


function shouldHaveTag(query, tag) {
  queryService.addShould(query, {
    bool: {
      filter: {
        prefix: {
          tags: tag
        }
      }
    }
  });
  return query;
}
/**
 * Given an Elastic query object, add a should clause matching
 * articles that have ALL of the specified story characteristics.
 * @param {object} query
 * @param {string[]} checkedCharacteristics
 * @return {object}
 */


function shouldHaveStoryCharacteristics(query, checkedCharacteristics) {
  var clauses = checkedCharacteristics.map(function (char) {
    return {
      term: _defineProperty({}, "storyCharacteristics.".concat(char), true)
    };
  });
  queryService.addShould(query, {
    bool: {
      filter: clauses
    }
  });
  return query;
}
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var query = queryService.newQueryWithCount(ELASTIC_INDEX, data.size, locals);

  if (data.tag) {
    shouldHaveTag(query, data.tag);
  }

  if (data.storyCharacteristics) {
    shouldHaveStoryCharacteristics(query, _keys(_pickBy(data.storyCharacteristics)));
  }

  if (data.tag || data.storyCharacteristics) {
    queryService.addMinimumShould(query, 1);
  }

  queryService.withinThisSiteAndCrossposts(query, locals.site);
  queryService.onlyWithTheseFields(query, ELASTIC_FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query).then(function (results) {
    data.articles = results;
    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"49":49,"59":59,"128":128}];
window.modules["top-stories.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    index = 'published-articles',
    NUM_ARTICLES = 3,
    AUTO_FEED = 'use most recent with filter tag';

function getTopStoriesQuery(site, tag, locals) {
  var topStoriesQuery = queryService.newQueryWithCount(index, NUM_ARTICLES, locals),
      fields = ['canonicalUrl', 'plaintextPrimaryHeadline', 'shortHeadline', 'feedImgUrl', 'pageUri'];

  if (tag && tag.length) {
    fields.push('tags');
    queryService.addFilter(topStoriesQuery, {
      term: {
        tags: tag
      }
    });
  }

  queryService.withinThisSiteAndCrossposts(topStoriesQuery, site);
  queryService.onlyWithTheseFields(topStoriesQuery, fields);
  queryService.addSort(topStoriesQuery, {
    date: 'desc'
  });
  return topStoriesQuery;
}
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  if (data.storySourcing === AUTO_FEED) {
    // feed-driven, so get the most recently published articles (optionally filtered)
    var query = getTopStoriesQuery(locals.site, data.feedTag, locals);
    return queryService.searchByQuery(query).then(function (results) {
      // if we filtered by tag and didn't find enough stories, revert to no filtering
      if (results && results.length < NUM_ARTICLES && data.feedTag && data.feedTag.length) {
        query = getTopStoriesQuery(locals.site, '');
        return queryService.searchByQuery(query);
      } else {
        return results;
      }
    }).then(function (results) {
      data.articles = results;
      return data;
    }).catch(function (e) {
      queryService.logCatch(e, ref);
      return data;
    });
  } else {
    // use the articles we have manually set (handled by child components)
    data.articles = [];
    return Promise.resolve(data);
  }
};
}, {"49":49}];
window.modules["top-story.model"] = [function(require,module,exports){'use strict';

var _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    ELASTIC_FIELDS = ['shortHeadline', 'feedImgUrl', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    shortHeadline: result.shortHeadline,
    feedImgUrl: result.feedImgUrl,
    plaintextPrimaryHeadline: toPlainText(result.shortHeadline),
    pageUri: result.pageUri,
    urlIsValid: result.urlIsValid
  }));

  if (data.title) {
    data.plaintextTitle = toPlainText(data.title);
  }

  return data;
}

module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
}; // export for upgrade.js


module.exports.assignToData = assignToData;
}, {"39":39,"57":57,"59":59,"103":103}];
window.modules["tumblr-post.model"] = [function(require,module,exports){'use strict';

var rest = require(5),
    utils = require(43),
    TUMBLR_ENDPOINT = 'https://www.tumblr.com/oembed/1.0/';

module.exports.save = function (ref, data) {
  if (utils.isFieldEmpty(data.url)) {
    // if we remove the url, remove the html
    delete data.html;
    return data;
  } // note: we're using the un-authenticated api endpoint. don't abuse this


  return rest.getJSONP("".concat(TUMBLR_ENDPOINT, "?url=").concat(encodeURI(data.url))).then(function (res) {
    var html = res.response && res.response.html;

    if (html) {
      data.html = html.replace(/<script.*?script>/, '');
    }

    return data;
  }).catch(function (e) {
    if (!utils.isFieldEmpty(data.html)) {
      // something went wrong with the api call (e.g. the post was deleted), but we already have the html
      return data;
    } else {
      throw new Error("Unable to embed tumblr post: ".concat(e.message));
    }
  });
};
}, {"5":5,"43":43}];
window.modules["tv-recap-feed.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    queryService = require(49),
    sanitize = require(39),
    _require = require(39),
    normalizeName = _require.normalizeName,
    index = 'tv-recaps',
    fields = ['articleURL', 'articleImageURL', 'showName', 'seasonNumber', 'episodeNumber', 'pageUri', 'date', 'articleHeadline', 'articleTeaser', 'showCoverageURL'];

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
  var size = data.numberOfArticles,
      query = queryService.newCuneiformQuery(index);
  data.title = sanitize.toSmartText(data.title || '');
  data.cuneiformScopes = getScopes(data.scopes);

  if (locals) {
    // for vulture we want to query for itself and recaps that are crossposted
    // for other sites using this component, we want to pull directly from vultue
    if (locals.site === 'vulture') {
      queryService.withinThisSiteAndCrossposts(query, locals.site);
    } else {
      queryService.onlyWithinThisSite(query, {
        slug: 'vulture'
      });
    }
  }

  queryService.addSize(query, size);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addSort(query, {
    date: 'desc'
  });

  if (data.showName) {
    var normalizeShowName = normalizeName(data.showName);
    queryService.addFilter(query, {
      term: {
        'showName.normalized': normalizeShowName
      }
    });
  }

  data.cuneiformQuery = query; // Strip show name and recap text from article headline

  for (var i = 0; i < data.cuneiformResults.length; i++) {
    if (data.cuneiformResults[i].articleHeadline) {
      data.cuneiformResults[i].articleHeadline = data.cuneiformResults[i].articleHeadline.replace(/(.*?\Recap:\s)/, '');
    }
  }

  return data;
};
}, {"37":37,"39":39,"49":49}];
window.modules["tv-show.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var queryService = require(49),
    INDEX = 'tv-recaps',
    _require = require(39),
    normalizeName = _require.normalizeName,
    _get = require(32),
    _maxBy = require(61),
    logger = require(81),
    log = logger.setup({
  file: __filename
}),
    productsService = require(77),
    fields = ['articleImageURL', 'episodeNumber', 'episodeName', 'articleHeadline', 'articleTeaser', 'articleURL', 'seasonNumber', 'isDoubleEpisode'];

function setImageFeedUrl(data) {
  var latestSeasonEpisodes = data.episodesSplitBySeason[data.latestSeason],
      latestEpisode = _maxBy(latestSeasonEpisodes, function (episode) {
    return episode.episodeNumber;
  }); // returns the latest season episode based on the episode number


  if (data.showImageURL !== latestEpisode.articleImageURL) {
    data.showImageURL = latestEpisode.articleImageURL;
  }
}

function getDynamicFeedImg(allEpisodes) {
  allEpisodes.forEach(function (episode) {
    if (!episode.articleImageURL) {
      return;
    }

    episode.dinamycImage = {
      url: episode.articleImageURL,
      mobile: 'tv-show-small',
      tablet: 'tv-show-medium',
      desktop: 'tv-show-large'
    };
  });
  return allEpisodes;
}
/**
 * takes in an array, removes duplicates and returns a reversed version
 * @param {Array} data
 * @returns {Array}
 */


function grabSeasons(data) {
  var result = data.map(function (a) {
    return parseInt(a.seasonNumber);
  });
  return Array.from(new Set(result)).reverse();
}
/**
 * set the show url from the locals (even if it's already set)
 * @param {object} data
 * @param {object} locals
 */


function setShowUrl(data, locals) {
  if (_get(locals, 'publishUrl')) {
    data.showUrl = locals.publishUrl;
  }
}
/**
 * groups items together which share a similar property, the seasonNumber
 * @param {Array} everyEpisode
 * @returns {object}
 */


function groupBySeasons(everyEpisode) {
  return everyEpisode.reduce(function (groupSeasons, episode) {
    groupSeasons[episode['seasonNumber']] = groupSeasons[episode['seasonNumber']] || [];
    groupSeasons[episode['seasonNumber']].push(episode);
    return groupSeasons;
  }, {});
}

function getEpisodeCount(data, locals) {
  var query = buildSearchQuery(data, locals, false);
  return queryService.getCount(query).catch(function () {
    return 0;
  });
}

function buildSearchQuery(data, locals, isSearchByQuery) {
  var query = queryService(INDEX, locals);
  queryService.addFilter(query, {
    term: {
      'showName.normalized': data.normalizeShowName
    }
  }); // getCount doesn't accept these fields in its query but searchByQuery does

  if (isSearchByQuery) {
    queryService.addSort(query, {
      seasonNumber: 'desc'
    });
    queryService.addSort(query, {
      episodeNumber: 'desc'
    });
    queryService.onlyWithTheseFields(query, fields);
  }

  return query;
}

function setCirculationData(data) {
  data.formattedShowName = "".concat(data.showName, " \u2014 TV Episode Recaps & News");
  data.formattedTeaser = "The latest tv recaps and news from ".concat(data.showName, ".");
}
/**
 * adds amazon subtag and associate id to query param of each buy link
 * this component allows for a custom amazon associate ID; therefore this is required
 * if not an amazon link, then the link is copied to buyUrlWithAmazonQuery
 * @param {object} locals
 * @param {object} data
 */


function addAmazonQueryParams(locals, data) {
  data.streamingServices.forEach(function (streamingService) {
    if (streamingService.streamingService === 'primeVideo') {
      streamingService.url = productsService.generateBuyUrlWithSubtag(streamingService.url, null, locals);
    }
  });
}

module.exports.save = function (ref, data, locals) {
  if (data.showName) {
    data.normalizeShowName = normalizeName(data.showName);
    setCirculationData(data);
  }

  setShowUrl(data, locals);
  return data;
};

module.exports.render = function (uri, data, locals) {
  if (data.showName) {
    var query = buildSearchQuery(data, locals, true);
    return getEpisodeCount(data, locals).then(function (count) {
      queryService.addSize(query, count);
      return queryService.searchByQuery(query).then(function (results) {
        data.allEpisodes = results;
        getDynamicFeedImg(data.allEpisodes);
        data.seasonNumbers = grabSeasons(data.allEpisodes);
        data.latestSeason = Math.max.apply(null, data.seasonNumbers);
        data.episodesSplitBySeason = groupBySeasons(data.allEpisodes);
        addAmazonQueryParams(locals, data);
        setImageFeedUrl(data);
        return data;
      }).catch(function (err) {
        log(err);
        return data;
      });
    });
  }

  return data;
};

}).call(this,"/components/tv-show/model.js")}, {"32":32,"39":39,"49":49,"61":61,"77":77,"81":81}];
window.modules["twitter-list-timeline.model"] = [function(require,module,exports){'use strict';

var parse = require(38);

module.exports.save = function (ref, data) {
  if (data.url) {
    var url = parse(data.url),
        parts = url.pathname.split('/'),
        screenName = parts[1],
        listName = parts[3];

    if (url.host === 'twitter.com' && screenName && listName && parts[2] === 'lists') {
      data.screenName = screenName;
      data.listName = listName;
    } else {
      throw new Error('invalid URL');
    }
  } else {
    delete data.screenName;
    delete data.listName;
  }

  return data;
};
}, {"38":38}];
