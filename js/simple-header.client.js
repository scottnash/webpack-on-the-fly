window.modules["simple-header.client"] = [function(require,module,exports){/* jshint strict: true, browser: true */

/* global DS */
'use strict';

var dom = require(1),
    _throttle = require(23),
    $visibility = require(26),
    $gtm = require(41);

DS.controller('simple-header', [function () {
  var VARIATIONS = {};

  function Constructor(el) {
    var variation = el.getAttribute('data-variation');
    VARIATIONS[variation].init(el);
  }

  VARIATIONS['simple-header'] = {
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
    },
    addEvents: function addEvents() {
      this.mobileNavButton.addEventListener('click', this.toggleNav.bind(this));
      this.endEl.addEventListener('click', this.collapseNav.bind(this));
    },
    init: function init(el) {
      this.mobileNavButton = el.querySelector('.nav-mobile');
      this.mobileNav = el.querySelector('.primary-nav');
      this.endEl = dom.find(el, '.end');
      this.navExpanded = false;
      this.addEvents();
    }
  };
  VARIATIONS['simple-header-redesign'] = {
    /**
     * determine whether or not the nav should be sticking to the top
     * @return {boolean}
     */
    shouldStick: function shouldStick() {
      var scrollY = Math.max(window.scrollY, document.body.scrollTop);

      if (typeof this.pageOffset === 'undefined') {
        this.pageOffset = $visibility.getPageOffset(this.el);
      }

      return (scrollY || this.scrollHeight) >= this.pageOffset.top;
    },

    /**
     * set page header height, to maintain placement when the header has
     * position fixed applied to it
     */
    setPageHeaderHeight: function setPageHeaderHeight() {
      var pageHeader = dom.closest(this.el, '.page-header'),
          pageHeaderHeight = pageHeader && pageHeader.clientHeight;

      if (pageHeaderHeight) {
        pageHeader.style.height = pageHeaderHeight + 'px';
      }
    },

    /**
     * toggle 'fixed' class on scroll
     * @param {object} e
     */
    scrollHandler: function scrollHandler(e) {
      this.shouldStick(e) ? this.wrapperEl.classList.add('fixed') : this.wrapperEl.classList.remove('fixed');
    },

    /**
     * manage event listener around scroll events
     */
    manageScrollListener: function manageScrollListener() {
      var scrollBreakpoint = 768,
          scrollListenerAlreadyAdded = !!this.throttledScrollListener;
      this.throttledScrollListener = this.throttledScrollListener || _throttle(this.scrollHandler, 30).bind(this);

      if (!scrollListenerAlreadyAdded && window.innerWidth > scrollBreakpoint) {
        window.addEventListener('scroll', this.throttledScrollListener);
      } else {
        window.removeEventListener('scroll', this.throttledScrollListener);
        this.throttledScrollListener = null;
        this.wrapperEl.classList.remove('fixed');
      }
    },

    /**
     * add event listeners on resize and scroll
     */
    initalizeScrollUI: function initalizeScrollUI() {
      var manageScrollListener = _throttle(this.manageScrollListener, 100).bind(this);

      manageScrollListener();
      window.addEventListener('resize', manageScrollListener);
    },

    /**
     * initialize state and properties for button UI
     */
    initializeButtonUI: function initializeButtonUI() {
      this.menuButton = this.el.querySelector('.simple-header-menu-button');
      this.menuPane = this.el.querySelector('.simple-header-pane');
      this.overlay = this.el.querySelector('.simple-header-overlay');
      this.navExpanded = false;
    },

    /**
     * expand navigation menu
     */
    expandNav: function expandNav() {
      this.menuPane.classList.add('show');
      this.fixPageBody();
      this.showOverlay();
      this.addClickOutListener();
      this.addClickTracking();
      this.navExpanded = true;
      this.menuButton.setAttribute('aria-expanded', true);
      this.trackInGA('opened nav');
    },

    /**
     * collapse navigation menu
     */
    collapseNav: function collapseNav() {
      this.menuPane.classList.remove('show');
      this.unfixPageBody();
      this.hideOverlay();
      this.removeClickOutListener();
      this.removeClickTracking();
      this.navExpanded = false;
      this.menuButton.setAttribute('aria-expanded', false);
      this.menuButton.blur();
    },

    /**
     * toggle navigation menu
     */
    toggleNav: function toggleNav() {
      this.navExpanded ? this.collapseNav() : this.expandNav();
    },

    /**
     * allow user to click out to collapse menu
     * @param {object} e
     */
    clickOutHandler: function clickOutHandler(e) {
      var primaryNav = dom.closest(e.target, '.simple-header-pane');

      if (this.navExpanded && !primaryNav) {
        this.collapseNav();
      }
    },

    /**
     * add event listener for clicking out of navigation menu
     */
    addClickOutListener: function addClickOutListener() {
      this.click = this.clickOutHandler.bind(this); // collapse menu if user clicks outside of primary nav

      window.setTimeout(function () {
        document.body.addEventListener('click', this.click);
      }.bind(this), 0);
    },

    /**
     * remove event listener for clicking out of navigation menu
     */
    removeClickOutListener: function removeClickOutListener() {
      window.setTimeout(function () {
        document.body.removeEventListener('click', this.click);
      }.bind(this), 0);
    },

    /**
     * attach click-tracking event listener
     */
    addClickTracking: function addClickTracking() {
      this.clickTracker = function (e) {
        var target = e.target,
            anchor = dom.closest(target, 'a');

        if (anchor) {
          this.trackInGA(anchor.innerText);
        } else {
          this.trackInGA(target.className);
        }
      }.bind(this);

      window.setTimeout(function () {
        document.body.addEventListener('click', this.clickTracker);
      }.bind(this), 0);
    },

    /**
     * detach click-tracking event listener
     */
    removeClickTracking: function removeClickTracking() {
      window.setTimeout(function () {
        document.body.removeEventListener('click', this.clickTracker);
      }.bind(this), 0);
    },

    /**
     * hide overlay element
     */
    hideOverlay: function hideOverlay() {
      this.overlay.classList.remove('show');
    },

    /**
     * show overlay element
     */
    showOverlay: function showOverlay() {
      this.overlay.classList.add('show');
    },

    /**
     * apply fixed positioning to page body (to prevent scrolling)
     */
    fixPageBody: function fixPageBody() {
      this.scrollHeight = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.height = '100%'; // don't set overflow scroll on page body if on mobile

      if (window.innerWidth > 768) {
        document.body.style.overflowY = 'scroll';
        document.body.scrollTop = this.scrollHeight;
      }
    },

    /**
     * remove fixed positioning to page body (to prevent scrolling)
     * and restore original scroll position
     */
    unfixPageBody: function unfixPageBody() {
      document.body.style.position = 'relative';
      document.body.style.height = 'auto';
      document.body.style.overflowY = null;
      document.body.scrollTop = 0;
      window.scrollTo(0, this.scrollHeight); // Fix for Safari. Resetting scrollHeight to 0 ensure the header
      // doesn't stay fixed when scrolled all the way back to the top of the page
      // Used in the shouldStick() function.

      this.scrollHeight = 0;
    },

    /**
     * report nav click in GA
     * TODO: remove click tracking after evaluation of component performance
     * @param {string} action
     */
    trackInGA: function trackInGA(action) {
      $gtm.reportCustomEvent({
        category: 'strategist-nav',
        label: 'on=' + window.location.href,
        action: action
      });
    },
    addEvents: function addEvents(el) {
      var menuButton = dom.find(el, '.simple-header-menu-button'),
          closeButton = dom.find(el, '.simple-header-pane-close');
      menuButton.addEventListener('click', this.toggleNav.bind(this));
      closeButton.addEventListener('click', this.collapseNav.bind(this));
    },
    init: function init(el) {
      this.el = el;
      this.wrapperEl = dom.find(el, '.simple-header-wrapper');
      this.setPageHeaderHeight();
      this.initalizeScrollUI();

      if (!el.classList.contains('has-dropdown-button')) {
        this.initializeButtonUI();
        this.addEvents(el);
      }
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"26":26,"41":41}];
