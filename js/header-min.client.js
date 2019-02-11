window.modules["header-min.client"] = [function(require,module,exports){/* jshint strict: true */

/* global DS */
'use strict';

DS.controller('header-min', [function () {
  function Constructor(el) {
    this.mobileNavButton = el.querySelector('.nav-mobile');
    this.mobileNav = el.querySelector('.primary-nav');
    this.navExpanded = false;
  }

  Constructor.prototype = {
    events: {
      '.nav-mobile click': 'toggleNav',
      '.end click': 'collapseNav'
    },

    /**
     * toggles navigation button
     */
    expandNav: function expandNav() {
      this.navExpanded = true;
      this.mobileNav.classList.add('on');
      this.mobileNavButton.classList.add('on');
      this.mobileNavButton.setAttribute('aria-expanded', true);
    },
    collapseNav: function collapseNav() {
      this.navExpanded = false;
      this.mobileNav.classList.remove('on');
      this.mobileNavButton.classList.remove('on');
      this.mobileNavButton.setAttribute('aria-expanded', false);
    },
    toggleNav: function toggleNav() {
      if (this.navExpanded) {
        this.collapseNav();
      } else {
        this.expandNav();
      }
    }
  };
  return Constructor;
}]);
}, {}];
