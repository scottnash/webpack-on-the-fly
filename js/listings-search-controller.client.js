window.modules["listings-search-controller.client"] = [function(require,module,exports){'use strict';

var listingSearch = require(148),
    store = listingSearch.store,
    _require = require(149),
    mapDollarSigns = _require.mapDollarSigns,
    whitelistedParams = ['neighborhood', 'cuisines', 'bar_type', 'listing_features', 'price'];
/**
 * parse the query params and set them as active filters in the store
 * @param {obj} searchParams - URLSearchParams object
 */


function parseSearchString(searchParams) {
  var filters, filterObj;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var key = _step.value;
      var isWhitelistedKey = whitelistedParams.some(function (param) {
        return key.includes(param);
      }); // keyword and listing_type search param is not a search filter

      if (isWhitelistedKey) {
        filters = searchParams.get(key).split(','); // create a filter object from each search param and add it to the relevant
        // active filter group via the store action

        filters.forEach(function (filter) {
          filterObj = {
            type: key,
            value: filter
          }; // if it's a price filter, make sure to add the displayValue. Vue will get
          // confused if the created filter object is not exactly equal to filters
          // generated from the facets (see getFacets)

          if (key === 'price') {
            filterObj.displayValue = mapDollarSigns(filter);
          }

          store.actions.updateFilter(filterObj, 'ADD');
        });
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
}

module.exports = function () {
  var searchParams, keywordParam, listingTypeParam, doFilteredSearch;

  if (window.location.search.length) {
    searchParams = new URLSearchParams(decodeURIComponent(window.location.search));
    keywordParam = searchParams.get('keyword') || '';
    listingTypeParam = searchParams.get('listing_type') || false;
    listingSearch.fetchFacets().then(function (res) {
      listingSearch.setAllFilters(res.facets);
    });
    parseSearchString(searchParams); // if there are more than one filters OR a listing_type is set, do a filtered search

    doFilteredSearch = store.state.activeFilters.length > 0 || listingTypeParam; // if there is a keyword search param, set it in the store so `vue-search-bar`
    // can access it

    if (keywordParam.length) {
      store.actions.setKeywordParam(keywordParam);
    }

    ;

    if (listingTypeParam.length) {
      // if `listing_type` is a search param, make sure that it's also reflected in the UI
      store.actions.setListingTypeToggle(listingTypeParam);
    } // if the only search param is a keyword, search only by text


    if (keywordParam.length && !doFilteredSearch) {
      listingSearch.searchByText(keywordParam);
    } else {
      // NOTE: when we implement hydration via the server, we won't have to make
      // this call to Swiftype.
      // run a filtered search after we have set the relevant active filters
      listingSearch.searchByFilter(keywordParam);
    }

    ;
  } else {
    listingSearch.fetchAll().then(function (res) {
      listingSearch.setAllFilters(res.facets);
    });
  }
};
}, {"148":148,"149":149}];
