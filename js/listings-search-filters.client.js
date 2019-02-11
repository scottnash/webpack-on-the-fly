window.modules["listings-search-filters.client"] = [function(require,module,exports){'use strict';

var _flatten = require(150),
    _kebabCase = require(70),
    _values = require(60),
    service = require(148),
    store = service.store,
    Vue = require(151),
    filtersEl;

var SearchFilters = new Vue({
  // eslint-disable-line
  el: '.listings-search-filters-inner',
  template: '#search-filters-tmpl',
  delimiters: ['${', '}'],
  data: {
    shared: store.state,
    filters: nabes,
    // eslint-disable-line
    activeSubgroup: ''
  },
  mounted: function mounted() {
    // grabbing the neighbhood data from the global variable, which is set by
    // inline-javascript in the template
    // NOTE: iOS 10+ doesn't support Object.values() or Array.flat, hence using
    // lodash here
    var neighborhoodFilters = _flatten(_values(nabes)); // eslint-disable-line


    store.actions.setFilters('neighborhood', 'allFilters', neighborhoodFilters.sort(service.alphaSort));
  },
  watch: {
    // if the active group has changed and no group is set, make sure no subgroup
    // is selected either
    'shared.activeGroup': function sharedActiveGroup() {
      if (!this.shared.activeSubgroup) {
        this.activeSubgroup = '';
      }
    }
  },
  filters: {
    kebabCase: function kebabCase(val) {
      return _kebabCase(val);
    }
  },
  methods: {
    activateGroup: function activateGroup(group) {
      store.actions.setActiveGroup(group);
      this.resetScrollPosition();
    },
    toggleSubgroup: function toggleSubgroup(subgroup) {
      if (this.activeSubgroup === subgroup) {
        this.activeSubgroup = '';
      } else {
        // when a user expands a subgroup, scroll to the top of the div so that
        // the user sees all options
        this.resetScrollPosition();
        this.activeSubgroup = subgroup;
      }
    },
    isActiveGroup: function isActiveGroup(group) {
      if (group === this.shared.activeGroup) {
        return 'active';
      }
    },
    isActiveSubgroup: function isActiveSubgroup(subgroup) {
      if (subgroup === this.activeSubgroup) {
        return 'active';
      }
    },
    resetScrollPosition: function resetScrollPosition() {
      if (!filtersEl) {
        filtersEl = this.$el.querySelector('.groups-wrapper');
      }

      if (filtersEl) {
        // scroll to the top
        filtersEl.scrollTop = 0;
      }
    }
  }
});
}, {"60":60,"70":70,"148":148,"150":150,"151":151}];
