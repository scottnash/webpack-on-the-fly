window.modules["listings-search-results.client"] = [function(require,module,exports){'use strict';

var _cloneDeep = require(47),
    _debounce = require(107),
    _require = require(152),
    setRatingAdjective = _require.setRatingAdjective,
    service = require(148),
    store = service.store,
    swiftype = require(153),
    _throttle = require(23),
    Vue = require(151),
    gtm = require(41);
/**
 * Called each time a portion of listing results are served to the page.
 * Percentage is running current amount over total result count.
 * Analytics did not need parameter, only url
 * @param {Integer} listingsViewed - percentage of listings
 */


function sendResultCountToGA(listingsViewed) {
  var url = window.location.href.split('?')[0];
  var customEventData = {
    category: 'scroll tracking',
    action: listingsViewed + '%',
    label: 'on=' + url
  };
  gtm.reportCustomEvent(customEventData);
}
/**
 * Capture filter types when 0 results are returned.
 * @param {String} typeOfSearch - 'keyword' or 'free text'
 */


function notifyGAofZeroResults(typeOfSearch) {
  var url = window.location.href.split('?')[0];
  var customEventData = {
    category: 'listings search',
    action: typeOfSearch,
    label: 'on=' + url
  };
  gtm.reportCustomEvent(customEventData, {
    CD75: 0
  });
}
/**
 * check that the user has scrolled to the bottom of the search results
 * component and that they are scrolling down
 * @param  {integer} prevScrollY - previous scroll position
 * @return {Boolean}
 */


function checkScroll(prevScrollY) {
  var html = document.documentElement || document.body,
      height = window.innerHeight || html.clientHeight,
      resultsEl = document.querySelector('.listings-search-results'),
      // getting the heights of sibling elements that might come after .listings-search-results
  primaryEl = document.querySelector('.primary').offsetHeight || 0,
      bottomEl = document.querySelector('.bottom').offsetHeight || 0;
  return resultsEl.getBoundingClientRect().bottom < height + primaryEl + bottomEl && window.scrollY > prevScrollY;
} // Allow a higher complexity than normal

/* eslint complexity: ["error", 9] */


module.exports = function () {
  var listingsViewedSent = 0,
      SearchResults = new Vue({
    // eslint-disable-line
    el: '.listings-search-results-container',
    template: '#search-results-tmpl',
    delimiters: ['${', '}'],
    data: {
      shared: store.state,
      // we're using this variable to prevent too many Swiftype calls
      // Reference: https://github.com/ElemeFE/vue-infinite-scroll#options
      loading: false,
      prevScrollY: 0,
      prevActiveGroup: 'neighborhood'
    },
    computed: {
      // copy describing the search results
      resultsCopy: function resultsCopy() {
        var _this$shared = this.shared,
            _this$shared$activeFi = _this$shared.activeFilters,
            activeFilters = _this$shared$activeFi === void 0 ? [] : _this$shared$activeFi,
            labelPrefix = _this$shared.labelPrefix,
            totalResults = _this$shared.totalResults,
            filterToggle = _this$shared.filterToggle,
            currentQuery = _this$shared.currentQuery;
        var prefix = labelPrefix || totalResults,
            failedSearchType = []; // "All bars"

        if (labelPrefix === 'All' && filterToggle !== 'All') {
          return "All ".concat(filterToggle, "s");
        } // "There are no bars."


        if (!totalResults && filterToggle !== 'All') {
          return "There are no ".concat(filterToggle, "s");
        } // All Recommendations. 100 Results. 1 Recommendation.


        if (totalResults) {
          return "".concat(prefix, " ").concat(totalResults === 1 ? 'Recommendation' : 'Recommendations');
        } else {
          if (activeFilters.length) {
            failedSearchType.push('keyword');
          }

          if (currentQuery.query !== '') {
            failedSearchType.push('free text');
          }

          if (failedSearchType.length) {
            notifyGAofZeroResults(failedSearchType.join(' & '));
          }
        }
      },
      hideHeader: function hideHeader() {
        var _this$shared2 = this.shared,
            _this$shared2$activeF = _this$shared2.activeFilters,
            activeFilters = _this$shared2$activeF === void 0 ? [] : _this$shared2$activeF,
            totalResults = _this$shared2.totalResults,
            filterToggle = _this$shared2.filterToggle;
        return activeFilters.length && !totalResults && filterToggle === 'All';
      },
      errorCopy: function errorCopy() {
        // In case there are no results matching the query sent it
        // display a custom error set it in Kiln by the editors
        if (this.hideHeader) {
          var newQuery = swiftype.buildQuery();
          swiftype.setSize(newQuery, 10);
          service.querySwiftype(newQuery).then(function (res) {
            return store.actions.updateOptionalResults(res.results);
          });
          return this.$el.dataset.errorMessage;
        }
      },
      resultsElements: function resultsElements() {
        var _this$shared3 = this.shared,
            filterToggle = _this$shared3.filterToggle,
            _this$shared3$results = _this$shared3.results,
            results = _this$shared3$results === void 0 ? [] : _this$shared3$results,
            _this$shared3$optiona = _this$shared3.optionalResults,
            optionalResults = _this$shared3$optiona === void 0 ? [] : _this$shared3$optiona;
        results.forEach(function (listing) {
          listing.rating_adjective = listing.critics_rating ? setRatingAdjective(listing.critics_rating) : '';
        });

        if (filterToggle === 'All') {
          // @Note (Charlie Garcia 2018-11-26): Returns elements matching the query send it,
          // in case there are no results for the query it returns
          // some optional results which should be display in a random order every time the page is load
          if (results.length) {
            return results;
          }

          optionalResults.forEach(function (listing) {
            listing.rating_adjective = listing.critics_rating ? setRatingAdjective(listing.critics_rating) : '';
          });
          return optionalResults.sort(function () {
            return 0.5 - Math.random();
          });
        }

        return results;
      }
    },
    mounted: function mounted() {
      window.addEventListener('scroll', this.scrollHandler);
    },
    methods: {
      clickHandler: function clickHandler() {
        var _this$shared$activeGr = this.shared.activeGroup,
            activeGroup = _this$shared$activeGr === void 0 ? '' : _this$shared$activeGr; // toggle filters on and off

        if (activeGroup.length) {
          this.prevActiveGroup = activeGroup;
          store.actions.setActiveGroup(activeGroup);
        } else {
          store.actions.setActiveGroup(this.prevActiveGroup);
        }
      },
      toggleHandler: _debounce(function () {
        // handler for when a user toggles the listing type (ie all, restaurants, bars)
        // text is queried is scoped to the vue-search-bar component, get it
        // from the currentQuery
        var queriedText = this.shared.currentQuery.query;
        var query, sortAllResults;

        if (this.shared.labelPrefix === 'All') {
          sortAllResults = true;
        } // listing_type is not visually represented as a filter in the UI BUT
        // is a filter according to Swiftype


        if (this.shared.filterToggle !== 'All') {
          query = service.searchByFilter(queriedText);
        } else {
          query = service.searchByFilter(queriedText.keywordParam);
        }

        query.then(function () {
          // by default, filtered search removes the label prefix. If we're
          // sorting ALL results, we need to preserve the 'All' prefix
          if (sortAllResults) {
            store.actions.setLabelPrefix('All');
          }
        });
      }, 200),
      scrollHandler: _throttle(function () {
        var _this = this;

        var _this$shared4 = this.shared,
            currentQuery = _this$shared4.currentQuery,
            _this$shared4$results = _this$shared4.results,
            results = _this$shared4$results === void 0 ? [] : _this$shared4$results,
            totalResults = _this$shared4.totalResults;
        var currentPage,
            newQuery,
            listingsViewed = Math.round(100 * this.shared.results.length / this.shared.totalResults) || 0;

        if (checkScroll(this.prevScrollY) && !this.loading) {
          currentPage = results.length / 20 + 1; // don't mutate anything plz. This component paginates the results
          // of the most recent query, which is set by other components.

          newQuery = _cloneDeep(currentQuery); // shared.totalResults is set each time shared.currentQuery is set.
          // See service.querySwiftype();

          if (results.length < totalResults) {
            swiftype.setSize(newQuery, 20);
            swiftype.setPage(newQuery, currentPage);
            this.loading = true;
            service.querySwiftype(newQuery).then(function (res) {
              // never change the store directly
              store.actions.updateResults(results.concat(res.results));
              _this.loading = false;
            });
          }
        }

        if (listingsViewedSent !== listingsViewed) {
          listingsViewedSent = listingsViewed;
          sendResultCountToGA(listingsViewedSent);
        }

        this.prevScrollY = window.scrollY;
      }, 1000)
    }
  });
};
}, {"23":23,"41":41,"47":47,"107":107,"148":148,"151":151,"152":152,"153":153}];
