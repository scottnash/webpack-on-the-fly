window.modules["148"] = [function(require,module,exports){// This service is responsible for managing state and data of the listings
// search app and querying Swiftype.
'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _cloneDeep = require(47),
    _forIn = require(179),
    // mapping the filter type with its custom dimension
gaDimensions = {
  neighborhood: 'cd61',
  style: 'cd62',
  listing_features: 'cd63',
  price: 'cd73'
},
    gtm = require(41),
    swiftypeCache = {},
    swiftype = require(153),
    utils = require(149),
    // This is the query template. All queries sent by listings search are mostly
// the same, except for size, page, and filters.
baseQuery = function baseQuery() {
  var textQuery = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var SEARCH_FIELDS = {
    name: {},
    neighborhood: {},
    listing_features: {},
    listing_type: {},
    mark_as_new: {},
    bar_types: {},
    style: {},
    cuisines: {},
    price: {},
    teaser: {}
  },
      RESULT_FIELDS = {
    id: {
      raw: {}
    },
    bar_types: {
      raw: {}
    },
    canonical_url: {
      raw: {}
    },
    cuisines: {
      raw: {}
    },
    critics_rating: {
      raw: {}
    },
    feed_img_url: {
      raw: {}
    },
    listing_features: {
      raw: {}
    },
    listing_type: {
      raw: {}
    },
    mark_as_new: {
      raw: {}
    },
    name: {
      raw: {}
    },
    neighborhood: {
      raw: {}
    },
    teaser: {
      raw: {}
    },
    slug: {
      raw: {}
    },
    style: {
      raw: {}
    },
    price: {
      raw: {}
    }
  };
  var query = swiftype.buildQuery(textQuery);
  swiftype.setSize(query, 40);
  swiftype.setPage(query, 1);
  swiftype.setResultsFields(query, RESULT_FIELDS);
  swiftype.setSearchFields(query, SEARCH_FIELDS);
  return query;
},
    FACETS = ['neighborhood', 'listing_features', 'bar_types', 'cuisines', 'price', 'listing_type'],
    // All the Vue components that constitute the listings search app share this
// store, which comprises of state and actions (methods) which mutate the
// state. We're trying to adhere to a Flux design pattern (but without
// requiring the actual Flux library).
// See https://github.com/facebook/flux/tree/master/examples/flux-concepts
// NOTE: Vue.js is our view layer and we are not using a dispatcher.
store = {
  state: {
    // all possible search filters
    allFilters: {
      neighborhood: [],
      cuisines: [],
      features: [],
      price: []
    },
    // selected search filters
    activeFilters: [],
    currentQuery: {},
    // caching the most recent query for pagination/infinite scroll purposes
    activeGroup: '',
    results: [],
    optionalResults: [],
    totalResults: 0,
    filterToggle: 'All',
    labelPrefix: 'All',
    keywordParam: '',
    fetching: true
  },
  // share information about non-stateful elements of the UI
  ui: {
    // Immutable. There's absolutely no reason for Vue components to
    // mutate this. We're storing UI information here to make components more
    // generic.
    get sortedAutocompleteGroups() {
      // we want to sort autocomplete options in this way, per Product
      return ['style', 'neighborhood', 'features', 'price'];
    }

  },
  actions: {
    // In order to keep the logic neat and easier to debug, components should
    // NEVER mutate the state directly. Instead they should call these actions.
    updateFilter: function updateFilter(target, updateType) {
      var newFilters = _cloneDeep(store.state.activeFilters); // mapping the Swiftype label with what it's called in the state


      if (updateType === 'ADD') {
        store.state.activeFilters = [].concat(_toConsumableArray(newFilters), [target]);
      } else if (updateType === 'REMOVE') {
        store.state.activeFilters = store.state.activeFilters.filter(function (value) {
          return value !== target;
        });
      }

      ;
    },
    clearFilters: function clearFilters() {
      // toggle all search filters off
      store.state.activeFilters = [];
    },
    clearGroup: function clearGroup() {
      // when clearing groups, default to having neighborhoods expanded
      store.state.activeGroup = 'neighborhood';
    },
    setActiveGroup: function setActiveGroup(group) {
      // toggle the target filter group on
      if (store.state.activeGroup === group) {
        store.state.activeGroup = '';
      } else {
        store.state.activeGroup = group;
      }
    },
    setFilters: function setFilters(filterGroup, type, data) {
      store.state[type][filterGroup] = data;
    },
    setKeywordParam: function setKeywordParam(string) {
      store.state.keywordParam = string;
    },
    setLabelPrefix: function setLabelPrefix(string) {
      store.state.labelPrefix = string;
    },
    setListingTypeToggle: function setListingTypeToggle(string) {
      store.state.filterToggle = string;
    },
    updateResultsCount: function updateResultsCount(integer) {
      store.state.totalResults = integer;
    },
    updateResults: function updateResults(results) {
      // update the results, usually populated with the response from a
      // Swiftype search
      store.state.results = results;
    },
    updateOptionalResults: function updateOptionalResults(results) {
      store.state.optionalResults = results;
    },
    updateCurrentQuery: function updateCurrentQuery(newQuery) {
      store.state.currentQuery = newQuery;
    }
  }
},
    nameQuery = function nameQuery(query) {
  var search_fields = {
    name: {}
  },
      result_fields = {
    canonical_url: {
      raw: {}
    },
    id: {
      raw: {}
    },
    bar_types: {
      raw: {}
    },
    name: {
      raw: {}
    }
  };
  return {
    query: query,
    search_fields: search_fields,
    result_fields: result_fields
  };
};
/**
 * trigger an event, that then sends the event data as a custom event to GA
 * @param  {string} GA_action - action label of the custom event we're sending to Google Tag manager
 * @param {object} customDimensions
 */


function sendToGA(GA_action, customDimensions) {
  var customEventData = {
    category: 'listings search',
    label: 'on=' + window.location.href,
    sc: 'listings',
    action: GA_action
  };
  gtm.reportCustomEvent(customEventData, customDimensions);
}
/**
 * Query Swiftype for ALL listings. If there are search params in the url,
 * remove them.
 * @return {Promise}
 */


function fetchAllListings() {
  var query = baseQuery();
  swiftype.addFacets(query, FACETS);
  query.sort = {
    critics_rating: 'desc'
  };
  return querySwiftype(query).then(function (res) {
    store.state.currentQuery = query;
    store.state.totalResults = res.totalResults;
    store.state.results = res.results;
    store.state.labelPrefix = 'All';
    store.state.filterToggle = 'All';
    store.state.fetching = false; // if we're fetching for all listings, we're not doing a filtered search,
    // so let's remove the search params from any previous filtered search

    if (window.location.search.length) {
      window.history.pushState(null, '', window.location.pathname);
    }

    return res;
  });
}
/**
 * query Swiftype just to get facets data.
 * @return {Promise}
 */


function fetchFacetsOnly() {
  var query = baseQuery(); // we don't really need any listings

  swiftype.setSize(query, 1);
  swiftype.addFacets(query, FACETS);
  return querySwiftype(query).then(function (res) {
    return res;
  });
}
/**
 * create a query param from a filter
 * @param  {string} filterType
 * @param  {array} arr
 * @return {string} - e.g. neighborhood=East Village, SoHo
 */


function generateQueryParam(filterType, arr) {
  return "".concat(filterType, "=").concat(arr.join(','));
}
/**
 * create a search string and append to the url
 * @param  {array} arr - an array of query params generated by the generateQueryParam()
 */


function pushQueryParams(arr) {
  var encodedArray = arr.map(function (value) {
    return encodeURIComponent(value);
  }),
      queryString;
  var searchParams = new URLSearchParams(decodeURIComponent(window.location.search)); // non-facet url params were being stripped out when trying to access listings searches via url
  // this checks for non facet params and attaches them to the end of the querystring so that they persist

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var key = _step.value;
      var isWhitelistedKey = FACETS.some(function (param) {
        return key.includes(param);
      }); // check for non facet

      if (!isWhitelistedKey) {
        encodedArray.push(encodeURIComponent("".concat(key, "=").concat(searchParams.get(key))));
      }
    };

    for (var _iterator = searchParams.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  queryString = "?".concat(encodedArray.join('&'));
  window.history.pushState(null, '', queryString);
}
/**
 * Build a query with filters
 * @param  {Object} searchString - an optional string to search for, in addition
 * to selected filters
 * @return {Promise}
 */


function searchByFilter(searchString) {
  var eventData = {},
      filteredQuery = baseQuery(searchString),
      selectedFilters = {},
      queryStrings = [],
      listingType = store.state.filterToggle;
  filteredQuery.sort = {
    critics_rating: 'desc'
  };

  if (store.state.activeFilters.length) {
    // go through activeFilters and normalize for Swiftype. Swiftype accepts
    // a list of filters as an array of strings, but in this app, we are
    // storing the filters as an array of objects.
    store.state.activeFilters.forEach(function (filter) {
      var type = filter.type,
          isStyleType = type === 'bar_types' || type === 'cuisines'; // create the style filter type if the filter type is a bar type or cuisine

      if (isStyleType) {
        if (!selectedFilters['style']) {
          selectedFilters['style'] = [];
        }

        selectedFilters['style'].push(filter.value);
      }

      if (!selectedFilters[type]) {
        selectedFilters[type] = [];
      }

      selectedFilters[type].push(filter.value);
    }); // go through normalized filters and add to the query

    _forIn(selectedFilters, function (value, key) {
      // ... also create query params. Do not create a search param for style.
      if (key !== 'style') {
        queryStrings.push(generateQueryParam(key, value));
      } // do not do a filtered search with bar_types or cuisines, use the style
      // property (created above) instead so we can do an OR search


      if (key !== 'bar_types' && key !== 'cuisines') {
        swiftype.addFilter(filteredQuery, key, value);
        eventData[gaDimensions[key]] = value.join(',');
      }
    });
  } // if the user has toggled the listing type, add that filter to the query.
  // listing_type is represented as a radio button in the UI but is considered
  // a 'filter' by Swiftype


  if (listingType !== 'All') {
    swiftype.addFilter(filteredQuery, 'listing_type', listingType); // generate a search param for it

    queryStrings.push(generateQueryParam('listing_type', [listingType])); // also send the event to GA

    eventData['listing_type'] = listingType;
  } // if the user has selected the All toggle, send the event to GA


  if (listingType === 'All') {
    eventData['listing_type'] = 'Restaurants & Bars';
  }

  if (searchString) {
    eventData.q = searchString;
    queryStrings.push(generateQueryParam('keyword', [searchString]));
  }

  return querySwiftype(filteredQuery).then(function (res) {
    sendToGA('keyword search', eventData); // make sure to update the current query and results so

    store.state.currentQuery = filteredQuery;
    store.state.totalResults = res.totalResults;
    store.state.results = res.results;
    store.state.labelPrefix = '';
    store.state.fetching = false; // update the url to reflect params

    pushQueryParams(queryStrings);
  });
}
/**
 * Build a query for searching by text
 * @param  {string} searchText
 * @return {Promise}
 */


function searchByText(searchText) {
  var textQuery = baseQuery(searchText);
  return querySwiftype(textQuery).then(function (res) {
    store.state.currentQuery = textQuery;
    store.state.totalResults = res.totalResults;
    store.state.results = res.results;
    store.state.labelPrefix = '';
    store.state.fetching = false;
    sendToGA('free text search', {
      q: searchText
    });
    pushQueryParams([generateQueryParam('keyword', [searchText])]);
    return res;
  });
}

function searchByListingName(searchText) {
  var query = nameQuery(searchText);
  swiftype.setSize(query, 3);
  return querySwiftype(query);
}
/**
 * A wrapper for swiftype.query but with configuration specific to listings
 * search. Also caches queries and their results so we don't have to query
 * Swiftype all the time.
 *
 * @param  {object} query
 * @return {Promise}
 */


function querySwiftype(query) {
  var SWIFTCONFIG = {
    host: 'https://host-2v4v9v.api.swiftype.com',
    token: 'search-4ihoya2c8q83wr7m353w6gb3',
    engine: 'restaurant-and-bar-listings'
  },
      cacheKey = JSON.stringify(query),
      promise;

  if (swiftypeCache[cacheKey]) {
    promise = Promise.resolve(swiftypeCache[cacheKey]);
  } else {
    promise = swiftype.query(query, SWIFTCONFIG);
  }

  return promise.then(function (res) {
    swiftypeCache[cacheKey] = res;
    return {
      totalResults: res.meta.page.total_results,
      results: res.results.map(function (result) {
        return utils.cleanData(result);
      }),
      facets: res.facets || {},
      labelPrefix: '',
      fetching: false
    };
  }).catch(function (error) {
    console.log('something went wrong:' + error);
  });
}
/**
 * use facets data to set filters (which are also used for autocomplete options)
 * Reference: https://swiftype.com/documentation/app-search/guides/facets
 *
 * @param {Object}  facets - facets data from Swiftype
 * @param {Boolean} setNabes - neighborhoods can be set by the listings-search-filters
 * component but if that component is not available, set this to true to set it
 * with data from Swiftype
 */


function setAllFilters(facets) {
  var setNabes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var availableFacets = facets,
      rawBarTypes = availableFacets.bar_types,
      rawCuisines = availableFacets.cuisines,
      rawFeatures = availableFacets.listing_features,
      rawPrice = availableFacets.price,
      rawNabes = availableFacets.neighborhood,
      barFilters = utils.getFacets(rawBarTypes, 'bar_types'),
      cuisinesFilters = utils.getFacets(rawCuisines, 'cuisines'),
      nabeFilters = utils.getFacets(rawNabes, 'neighborhood'),
      styleFilters = barFilters.concat(cuisinesFilters).sort(utils.alphaSort); // create filters from facets data. we are not setting neighborhood filters
  // via Swiftype. We're manually creating them from user-edited data in the
  // listings-search-filters component.

  store.actions.setFilters('style', 'allFilters', styleFilters);
  store.actions.setFilters('features', 'allFilters', utils.getFacets(rawFeatures, 'listing_features').sort(utils.alphaSort));
  store.actions.setFilters('price', 'allFilters', utils.getFacets(rawPrice, 'price').sort(utils.alphaSort)); // ...but if we're calling this from a page that has the
  // listings-search-filters component (like the section front), we should set
  // the neighbhorhoods

  if (setNabes) {
    store.actions.setFilters('neighborhood', 'allFilters', nabeFilters);
  }
}

module.exports.fetchAll = fetchAllListings;
module.exports.fetchFacets = fetchFacetsOnly;
module.exports.sendToGA = sendToGA;
module.exports.querySwiftype = querySwiftype;
module.exports.store = store;
module.exports.searchByFilter = searchByFilter;
module.exports.searchByText = searchByText;
module.exports.searchByListingName = searchByListingName;
module.exports.setAllFilters = setAllFilters;
}, {"41":41,"47":47,"149":149,"153":153,"179":179}];
