window.modules["nav-search-button.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    $gtm = require(41);

DS.controller('nav-search-button', [function () {
  var openClass = 'open',
      closeClass = 'closed';

  function Constructor(el) {
    var body = dom.find('body');
    this.el = el;
    this.button = dom.find(el, '.nav-search-button-trigger');
    this.search = dom.find(el, '.nav-search-form');
    this.inputField = dom.find(el, '.search-input');
    body.addEventListener('click', this.collapseSearch.bind(this));
    /**
     * This event is added as a handler for collapsing search because 
     * Mobile Safari does not fire the click event for all elements:
     * https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile
     */

    body.addEventListener('touchend', this.collapseSearch.bind(this));
    document.addEventListener('keydown', this.escapeSearch.bind(this));
  }

  Constructor.prototype = {
    events: {
      '.nav-search-button-trigger click': 'expandSearch',
      '.nav-search-form submit': 'submitHandler'
    },
    toggleClasses: function toggleClasses() {
      var body = dom.find('body');
      this.el.classList.toggle(closeClass);
      this.el.classList.toggle(openClass);
      body.classList.toggle('disabled');
      body.classList.toggle('search-active');
    },
    expandSearch: function expandSearch() {
      this.toggleClasses();

      if (this.el.classList.contains(openClass)) {
        this.inputField.focus();
      }
    },
    collapseSearch: function collapseSearch(e) {
      if (!this.el.contains(e.target) && this.el.classList.contains(openClass)) {
        this.toggleClasses();
      }
    },
    escapeSearch: function escapeSearch(e) {
      if (e.keyCode === 27 && this.el.classList.contains(openClass)) {
        this.toggleClasses();
      }
    },
    submitHandler: function submitHandler(e) {
      e.preventDefault();
      this.search.submit();
      this.emitTrackingEvent();
    },
    emitTrackingEvent: function emitTrackingEvent() {
      $gtm.reportCustomEvent({
        category: 'search',
        label: 'on=' + window.location.href,
        action: this.inputField.value
      });
    }
  };
  return Constructor;
}]);
}, {"1":1,"41":41}];
