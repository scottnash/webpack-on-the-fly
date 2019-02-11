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
