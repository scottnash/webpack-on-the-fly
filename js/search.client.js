window.modules["search.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    $gtm = require(41);

DS.controller('search', ['$document', '$window', function ($document, $window) {
  function Constructor(el) {
    this.el = el;
    this.search = dom.find(el, '.search-form');
    this.query = dom.find(el, '.search-query');
    this.expand = dom.find(el, '.expand-button');
    this.close = dom.find(el, '.close-button');
    this.submit = dom.find(el, '.submit-button');
    this.placeholderText = el.getAttribute('data-placeholder-text') || '';
  }

  Constructor.prototype = {
    events: {
      '.search-form keypress': 'expandSearch',
      '.search-query keypress': 'expandSearch',
      '.search-query click': 'expandSearch',
      '.expand-button click': 'expandSearch',
      '.submit-button click': 'submitHandler',
      '.close-button click': 'compressSearch',
      '.search-query blur': 'compressSearch'
    },
    compressSearch: function compressSearch() {
      if ($window.innerWidth >= 1180 && this.query.value == '' || $window.innerWidth < 1180) {
        this.search.classList.remove('expanded');
        this.query.placeholder = this.placeholderText;
        this.query.value = '';
      }
    },
    expandSearch: function expandSearch() {
      if (!this.search.classList.contains('expanded')) {
        this.search.classList.add('expanded');
        this.query.value = '';

        if ($window.innerWidth < 1180) {
          this.query.placeholder = '';
        } else {
          this.query.placeholder = this.placeholderText;
        }

        this.query.focus();
      }
    },
    submitHandler: function submitHandler() {
      this.search.submit();
      this.emitTrackingEvent();
    },
    emitTrackingEvent: function emitTrackingEvent() {
      $gtm.reportCustomEvent({
        category: 'search',
        label: 'on=' + window.location.href,
        action: this.query.value
      });
    }
  };
  return Constructor;
}]);
}, {"1":1,"41":41}];
