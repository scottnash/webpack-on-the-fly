window.modules["interactive-homelessness.client"] = [function(require,module,exports){/* global $:false */
'use strict';

var dom = require(1),
    _findIndex = require(79),
    _throttle = require(23);

DS.controller('interactive-homelessness', [function () {
  function Constructor(el) {
    this.el = el;
    this.tabs = dom.findAll(this.el, '.interactive-homelessness-tab-link');
    this.tabPanels = dom.findAll(this.el, '.interactive-homelessness-panel');
    this.selectedIndex = 0;
    this.lastWindowTop = 0;
    this.vertNav = dom.find(this.el, '.tab-mobile-vertical-nav');
    this.navIsExpanded = false; // Boolean tracker for whether the secondary nav pane is visible

    this.tabsNav = dom.find(this.el, '.tabs-nav');
    this.stickyTabs = dom.find(this.el, '.tab-wrap-sticky');
    this.tabWrap = dom.find(this.el, '.tab-wrap');
    this.listContainer = dom.find(this.el, '.tabs-nav-list-container');
    this.tabPanel = dom.find(this.el, '.tab-panel-wrap');
    this.underlay = dom.find(this.el, '.underlay');
    this.initTabs();
    this.updateNavOnScroll();
    this.initAnnotations(); // only perform these functions when vertical nav is selected

    if (this.hasClass(this.tabsNav, 'tab-mobile-vertical-nav') || this.hasClass(this.tabsNav, 'tab-wrap-sticky')) {
      this.getScrollPosition();
      this.attachEventHandlers();
    }
  }

  Constructor.prototype = {
    events: {
      '.interactive-homelessness-tab-link click': 'navigateClick',
      '.tabs-nav-toggle-button click': 'vertNavToggleButton' // click on the open/close nav button

    },
    initTabs: function initTabs() {
      var i, randomId, linkElem, panelElem;

      for (i = 0; i < this.tabPanels.length; i++) {
        if (i < this.tabs.length) {
          panelElem = this.tabPanels[i];
          linkElem = this.tabs[i]; // create association

          randomId = Math.random().toString(36).substring(7);
          linkElem.setAttribute('id', 'tab_' + randomId);
          panelElem.setAttribute('id', 'panel_' + randomId);
          linkElem.setAttribute('href', '#panel_' + randomId);
          linkElem.setAttribute('data-href', '#panel_' + randomId);
          panelElem.setAttribute('tabindex', '-1'); // set state

          if (i === this.selectedIndex) {
            linkElem.setAttribute('aria-current', 'true');
          }
        }
      }
    },
    // check to see if an element has a particular class
    hasClass: function hasClass(el, cls) {
      return el.classList.contains(cls);
    },
    navigateClick: function navigateClick(e) {
      var newTabId, newTabIndex, tabHref;
      e.preventDefault();
      tabHref = dom.closest(e.target, '.interactive-homelessness-tab-link').getAttribute('data-href');
      this.smoothScroll(tabHref);
      newTabId = dom.closest(e.target, '.interactive-homelessness-tab-link').getAttribute('id');
      newTabIndex = _findIndex(this.tabs, function (t) {
        return t.getAttribute('id') === newTabId;
      });
      this.selectTab(newTabIndex); // only perform this function when mobile vertical nav is checked as option

      if (this.hasClass(this.tabsNav, 'tab-mobile-vertical-nav')) {
        this.vertNavCollapse();
      }
    },
    selectTab: function selectTab(newIndex) {
      if (newIndex >= 0 && newIndex < this.tabs.length) {
        this.tabs[this.selectedIndex].removeAttribute('aria-current');
        this.tabs[newIndex].setAttribute('aria-current', true);
        this.selectedIndex = newIndex;
      }
    },
    // smooth scroll to sections when clicked
    smoothScroll: function smoothScroll(target) {
      var tabWrapHeight = $('.tab-wrap').outerHeight(),
          tabNavHeight = 0;

      if (this.hasClass(this.tabsNav, 'tab-wrap-sticky')) {
        tabNavHeight = window.innerWidth >= 1024 ? tabWrapHeight : 0;
      }

      $('body,html').animate({
        scrollTop: $(target).offset().top - tabNavHeight
      }, 600, function () {
        $(target).focus();
      });
    },
    // update the navigation when page is scrolled
    updateNavOnScroll: function updateNavOnScroll() {
      var windowPos = window.scrollY,
          panelTop,
          panelHeight,
          navHref,
          i;

      for (i = 0; i < this.tabs.length; i++) {
        navHref = this.tabs[i].getAttribute('data-href'), panelTop = dom.find(navHref).offsetTop, panelHeight = dom.find(navHref).offsetHeight;

        if (windowPos >= panelTop && windowPos < panelTop + panelHeight) {
          this.selectTab(i);
        }
      }
    },
    // MOBILE ONLY: Vertical Tabbed Navigation
    // handle behavior for when user clicks the toggle button to open or close the nav on mobile devices
    vertNavToggleButton: function vertNavToggleButton() {
      this.navIsExpanded ? this.vertNavCollapse() : this.vertNavExpand();
    },
    vertNavCollapse: function vertNavCollapse() {
      // remove inline styling set by sidebarExpand
      dom.find('html').style.overflow = '';
      this.vertNav.classList.remove('expanded');
      this.underlay.classList.remove('exposed');
      this.navIsExpanded = false;
    },
    vertNavExpand: function vertNavExpand() {
      // prevent the content body from scrolling when scrolling within the sidebar
      // this technique works on browers not iOS
      dom.find('html').style.overflow = 'hidden';
      this.vertNav.classList.add('expanded');
      this.underlay.classList.add('exposed');
      this.navIsExpanded = true;
    },
    // show vertical nav and create sticky
    showNav: function showNav() {
      this.tabsNav.classList.add('show');
    },
    // hide vertical nav
    hideNav: function hideNav() {
      this.tabsNav.classList.remove('show');
    },
    touchOutsideNav: function touchOutsideNav(e) {
      var target = e.target,
          tabNav = dom.closest(target, '.tabs-nav');

      if (!tabNav) {
        this.vertNavCollapse();
      }
    },
    // get the windowY position and show/hide
    // vertical nav if the story is in view
    getScrollPosition: function getScrollPosition() {
      var elemTop = this.el.getBoundingClientRect().top <= window.scrollY,
          elemBottom = window.scrollY + window.innerHeight <= this.el.getBoundingClientRect().bottom + this.el.offsetHeight,
          isVisible = elemTop && elemBottom;
      isVisible || this.navIsExpanded ? this.showNav() : this.hideNav();
    },
    // on window scroll, check the position of the window
    attachEventHandlers: function attachEventHandlers() {
      var throttledScrollCallback = _throttle(this.getScrollPosition, 100),
          throttledNavOnScroll = _throttle(this.updateNavOnScroll, 100);

      window.addEventListener('scroll', throttledScrollCallback.bind(this));
      window.addEventListener('scroll', throttledNavOnScroll.bind(this));
      return this;
    },
    initAnnotations: function initAnnotations() {
      var annotatedText = dom.findAll(this.el, '.clay-annotated'),
          annotations = dom.findAll(document, '.annotations .annotation'),
          i; // set up annotations, since we're deeper than article level

      for (i = 0; i < annotatedText.length; i++) {
        annotatedText[i].setAttribute('tabindex', '0');

        if (annotations && annotations.length > i) {
          annotatedText[i].setAttribute('aria-describedby', annotations[i].getAttribute('id'));
        }
      }
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"79":79}];
