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
