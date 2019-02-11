window.modules["vertical-center-timeline-event.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('vertical-center-timeline-event', [function () {
  // Cache magic strings
  var SELECTORS = {
    IMAGE_SECTION: '.vertical-center-timeline-event-image-section',
    PRODUCT_INFO: '.vertical-center-timeline-event-product-info',
    CLOSE_ICON: '.vertical-center-close-icon',
    OPEN_ICON: '.vertical-center-info-icon',
    PRODUCT_INFO_WITH_SHOW_CLASS: '.vertical-center-timeline-event-product-info.show'
  },
      VIEWPORT_WIDTH = window.innerWidth,
      SHOW = 'show';

  function Constructor(el) {
    // Find dom elements
    this.el = el;
    this.imageSection = dom.find(el, SELECTORS.IMAGE_SECTION);
    this.productInfo = dom.find(el, SELECTORS.PRODUCT_INFO);
    this.closeIcon = dom.find(el, SELECTORS.CLOSE_ICON).parentElement;
    this.openIcon = dom.find(el, SELECTORS.OPEN_ICON).parentElement; // Only toggle open and close on mobile viewports

    if (VIEWPORT_WIDTH < 1024) {
      this.setupHandlers();
      this.attachEvents();
    }
  }

  Constructor.prototype = {
    setupHandlers: function setupHandlers() {
      this.showInfo = this.showInfo.bind(this);
      this.closeInfo = this.closeInfo.bind(this);
      return this;
    },
    attachEvents: function attachEvents() {
      this.imageSection.addEventListener('click', this.showInfo);
      this.closeIcon.addEventListener('click', this.closeInfo);
      return this;
    },
    // Show product info
    showInfo: function showInfo() {
      var i,
          activeInfos = dom.findAll(this.el.parentElement, '.show');

      for (i = 0; i < activeInfos.length; i++) {
        activeInfos[i].classList.remove(SHOW);
      }

      this.productInfo.classList.add(SHOW);
      window.addEventListener('click', this.closeInfoWithWindowClick.bind(this));
    },
    // Hide product info
    closeInfo: function closeInfo() {
      this.productInfo.classList.remove(SHOW);
    },
    closeInfoWithWindowClick: function closeInfoWithWindowClick(e) {
      if (!e.target.parentElement.classList.contains('vertical-center-info-icon') && !e.target.parentElement.parentElement.classList.contains('vertical-center-info-icon') && !e.target.parentElement.classList.contains('vertical-center-timeline-event-image-section') && !e.target.parentElement.parentElement.classList.contains('vertical-center-timeline-event-image-section')) {
        this.closeInfo();
      }
    }
  };
  return Constructor;
}]);
}, {"1":1}];
