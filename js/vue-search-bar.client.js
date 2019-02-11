window.modules["vue-search-bar.client"] = [function(require,module,exports){// Note: this component is currently (loosely) coupled with listings search but it
// doesn't have to be! If you are refactoring this component to use with other
// types of search, you'll need to figure out how to pass in the service and store
// you want. One way might be to define a store in the window and accessing that
// variable in this client.js.
'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _debounce = require(107),
    service = require(148),
    // assumes that there is a controller component that will populat the store
// with data
store = service.store,
    Vue = require(151),
    Autocomplete = require(210),
    TYPE_DISPLAY_LABELS = {
  neighborhood: 'Neighborhood',
  listing_features: 'Known For',
  cuisines: 'Type',
  bar_types: 'Type'
},
    MOBILE_SCREEN_LIMIT = 1179; // initialize 3rd party component


Vue.use(Autocomplete.default);

module.exports = function () {
  // Vue logic for autocomplete-result
  var autocompleteItemTmpl = Vue.component('autocomplete-item', {
    template: '#autocomplete-item-tmpl',
    // using different delimiters so Vue and Handlerbars don't collide
    delimiters: ['${', '}'],
    props: {
      item: {
        required: true
      },
      searchText: {
        required: true
      }
    }
  }),
      SearchBar = new Vue({
    // eslint-disable-line
    el: '.vue-search-bar-container',
    template: '#search-bar-tmpl',
    delimiters: ['${', '}'],
    data: {
      shared: store.state,
      autocompleteResults: [],
      // attributes to pass to the autocomplete text input $el
      // Reference: https://github.com/paliari/v-autocomplete#properties
      autocompleteAttrs: {
        class: 'freetext-input',
        placeholder: 'Try “Italian” or “Williamsburg”...',
        type: 'search'
      },
      // passing in template for autocomplete result
      autocompleteResultTmpl: autocompleteItemTmpl,
      textQuery: '',
      // text that has successfully been queried, is represented as a filter
      // in the UI (but is not really a filter that we use for search)
      queriedText: ''
    },
    computed: {
      isMobile: function isMobile() {
        return window.innerWidth <= MOBILE_SCREEN_LIMIT;
      },
      redirect: function redirect() {
        // this is set on the component level via Kiln. If it is set to true
        // then the when the user submits a search, they are redirected to the
        // search page
        return this.$el.dataset.forward === 'true';
      },
      showFilters: function showFilters() {
        return this.shared.activeFilters.length || this.queriedText.length;
      },
      reOrderedFilters: function reOrderedFilters() {
        if (this.isMobile) {
          return _toConsumableArray(this.shared.activeFilters).reverse();
        }

        return this.shared.activeFilters;
      }
    },
    mounted: function mounted() {
      // if the search bar is redirecting to a search page, assume that there
      // is no controller component to set the filters. So set the filters on
      // mount.
      if (this.redirect) {
        service.fetchFacets().then(function (res) {
          return service.setAllFilters(res.facets, true);
        });
      }

      if (this.shared.keywordParam.length) {
        this.queriedText = this.shared.keywordParam;
      }
    },
    watch: {
      // watch for any changes in search filters and text searches because
      // we want to trigger a search depending on the parameters selected by
      // the user
      'shared.activeFilters': function sharedActiveFilters() {
        this.whichSearch();
      }
    },
    methods: {
      clearFilter: function clearFilter(target) {
        store.actions.updateFilter(target, 'REMOVE');
      },
      clearFilters: function clearFilters() {
        store.actions.clearFilters();
        store.actions.clearGroup();
        this.resetLocalState();
      },
      clearQueriedText: function clearQueriedText() {
        this.resetLocalState();
        this.whichSearch();
      },
      submitHandler: function submitHandler() {
        var _this = this;

        var selectedItemEl = this.$el.querySelector('.v-autocomplete-item-active'),
            cleanTextQuery = this.textQuery.trim(); // prevent users from looking for empty strings

        var selectedItem; // if a user has highlighted an autocomplete option and hits the Enter
        // key, this ensures we are triggering the handler for selecting items
        // instead of triggering a free text search.

        if (selectedItemEl) {
          selectedItem = this.autocompleteResults.find(function (item) {
            return item.value === selectedItemEl.querySelector('.label').textContent;
          });
          this.itemSelectedHandler(selectedItem);
          return;
        }

        if (this.redirect && cleanTextQuery.length && !selectedItemEl) {
          this.redirectHandler({
            value: cleanTextQuery,
            type: 'keyword'
          });
          return;
        }

        if (cleanTextQuery.length && !this.shared.activeFilters.length && !this.redirect) {
          service.searchByText(cleanTextQuery).then(function () {
            _this.queriedText = cleanTextQuery;
          });
          return;
        }
      },
      changeHandler: _debounce(function (string) {
        // make sure textQuery is updated so that search by text works
        this.textQuery = string; // if the string entered is less than 3 characters, clear the
        // autocomplete results

        if (this.autocompleteResults.length > 0 && string.length < 3) {
          this.autocompleteResults = [];
        }
      }, 100),
      itemSelectedHandler: _debounce(function (item) {
        // This handler is also bound to item-selected event emitted by
        // the autocomplete component. That event is triggered when the mouse
        // is used to select an item.
        if (this.redirect) {
          this.redirectHandler(item);
        } else if (item.url) {
          // if the item has a url, go to the url when the user selects it
          window.location.assign(item.url);
        } else {
          // make sure we don't search for any text we typed in to trigger
          // the autocomplete
          this.textQuery = '';
          this.queriedText = '';
          store.actions.updateFilter(item, 'ADD');
        }
      }, 500),
      // only show the item.value in the text input. prevents [Object object]
      // from flashing
      getLabelHandler: function getLabelHandler(item) {
        return item.value;
      },
      resetLocalState: function resetLocalState() {
        this.autocompleteResults = [];
        this.queriedText = '';
        this.textQuery = '';
      },
      updateItemsHandler: function updateItemsHandler(string) {
        var _this2 = this;

        var cleanString = string.trim(),
            findMatch = function findMatch(item) {
          // comparator function that looks for a match between the
          // autocomplete input and a filter
          return item.value.toLowerCase().startsWith(cleanString.toLowerCase());
        },
            sharedState = this.shared,
            results = []; // only show autocomplete results if the string is not empty


        if (cleanString.length) {
          // Loop through each group of search filters. We want to show only one
          // autocomplete result from each filter group.
          store.ui.sortedAutocompleteGroups.forEach(function (val) {
            var match = sharedState.allFilters[val].find(findMatch);

            if (match) {
              results.push(match);
            }
          });
          results = results.map(function (item) {
            item.displayLabel = TYPE_DISPLAY_LABELS[item.type] || item.type;
            return item;
          }); // NOTE: this will need to change if we're decoupling this component
          // from listings search

          return service.searchByListingName(cleanString).then(function (res) {
            _this2.autocompleteResults = results.concat(res.results.map(function (res) {
              return {
                value: res.name,
                displayLabel: res.bar_types ? 'Bar' : 'Restaurant',
                url: res.canonical_url
              };
            }));
          });
        } else {
          return;
        }
      },
      redirectHandler: function redirectHandler(query) {
        // NOTE: this will need to change if we're decoupling this component
        // from listings search
        var base = '/listings/search';

        if (query.url) {
          window.location.assign(query.url);
        } else {
          window.location.assign("".concat(base, "?").concat(query.type).concat(encodeURIComponent("=".concat(query.value))));
        }
      },
      whichSearch: _debounce(function () {
        // if the search bar is redirecting to a search page, there's no need
        // to query Swiftype
        if (!this.redirect) {
          if (this.shared.activeFilters.length) {
            // if there are filters, do a filtered search
            service.searchByFilter(this.queriedText);
          } else if (!this.queriedText.length && !this.shared.activeFilters.length) {
            // if there are no filters and no previously queried text (aka
            // keyword "filter"), get all listings
            service.fetchAll();
          } else if (this.queriedText && !this.shared.activeFilters.length) {
            // if there is a previously queriedText/keyword "filter" and no
            // selected filters, do a free text search
            service.searchByText(this.queriedText);
          }
        }
      }, 500)
    }
  }); // The url is being manipulated by window.pushState after each search. Setting
  //  the url to document.referrer prevents any bugs when the user uses the
  //  browser's Back button.

  window.onpopstate = function () {
    window.location.assign(document.referrer);
  };
};
}, {"107":107,"148":148,"151":151,"210":210}];
