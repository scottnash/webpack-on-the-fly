window.modules["leftovers-nav.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _throttle = require(23);

DS.controller('leftovers-nav', [function () {
  var isUserOnDevice;

  function Constructor(el) {
    this.el = el;
    this.nav = this.el.querySelector('.nav-container');
    this.navIsExpanded = false; // Boolean tracker to check if nav is expanded or not

    this.modalShade = dom.find('.modal-shade');
    this.lede = dom.find('.lede-full-bleed');
    this.share = dom.find('.bottom-share');
    this.html = dom.find('html'); // Device and Browser checks

    isUserOnDevice = /Android | iPhone | iPod/i.test(navigator.userAgent); // Initialize functions

    this.init();
  }

  Constructor.prototype = {
    events: {
      '.nav-toggle-button click': 'toggleNav',
      // Toggles nav animation
      '.modal-shade click': 'closeNav',
      // Closes nav when any part of window (besides nav) is clicked
      '.leftovers-nav-item click': 'scrollToSection'
    },
    // Init functions
    init: function init() {
      this.showStickyNav();
      this.eventHandlers();
    },
    toggleNav: function toggleNav() {
      this.navIsExpanded ? this.closeNav() : this.expandNav();
    },
    closeNav: function closeNav() {
      // remove inline styling set by expandNav
      this.html.style.overflow = '';
      this.nav.classList.add('closed');
      this.navIsExpanded = false;
      this.modalShade.classList.remove('exposed');
    },
    expandNav: function expandNav() {
      this.nav.classList.remove('closed');
      this.navIsExpanded = true;

      if (window.innerWidth <= 1250 || isUserOnDevice) {
        // Prevent the content body from scrolling when scrolling within the sidebar
        // But only when the nav bar covers content and/or the user is on a device
        // This technique works on browers not iOS
        this.html.style.overflow = 'hidden';
        this.modalShade.classList.add('exposed');
      }
    },
    showNav: function showNav() {
      this.nav.classList.remove('hide');
      this.navIsExpanded = false;
    },
    hideNav: function hideNav() {
      this.nav.classList.add('hide');
      this.navIsExpanded = false;
    },
    scrollToSection: function scrollToSection(e) {
      var itemHref = dom.closest(e.target, '.leftovers-nav-item').getAttribute('data-href');
      e.preventDefault();
      this.smoothScroll(itemHref);
      this.closeNav();
    },
    // Smooth scroll the window to the selected section
    smoothScroll: function smoothScroll(anchor) {
      var distance,
          stopY,
          rectTop,
          startY = document.body.scrollTop,
          item = document.querySelector('#' + anchor),
          marginTop = 50,
          // margin from the top of page
      translateAmt;
      rectTop = item.getBoundingClientRect().top - marginTop;
      translateAmt = window.scrollY;
      stopY = parseInt(translateAmt) + rectTop - marginTop;
      distance = stopY > startY ? stopY - startY : startY - stopY;

      if (distance < 100) {
        scrollTo(0, stopY);
        return;
      }

      this.animateScroll(distance, startY, stopY);
    },
    // Animate the scroll of the window
    animateScroll: function animateScroll(dist, start, stop) {
      var speed = Math.round(dist / 100),
          step,
          leapY,
          timer,
          i;

      if (speed >= 20) {
        speed = 20;
      }

      step = Math.round(dist / 25);
      leapY = stop > start ? start + step : start - step;
      timer = 0;

      function scrollTo(leapY) {
        this.autoScrolling = true;
        window.scrollTo(0, leapY);
      }

      if (stop > start) {
        for (i = start; i < stop; i += step) {
          setTimeout(scrollTo.bind(this, leapY), timer * speed);
          leapY += step;
          if (leapY > stop) leapY = stop;
          timer++;
        }
      } else {
        for (i = start; i > stop; i -= step) {
          setTimeout(scrollTo.bind(this, leapY), timer * speed);
          leapY -= step;
          if (leapY < stop) leapY = stop;
          timer++;
        }
      }

      setTimeout(function () {
        this.autoScrolling = false;
      }.bind(this), timer * speed);
    },
    // Vertical nav fades in only if the lede and bottom share are out of viewport
    showStickyNav: function showStickyNav() {
      var ledeBottom = this.lede.getBoundingClientRect().bottom,
          // Bottom of the lede in relation to top of viewport
      shareTop = this.share.getBoundingClientRect().top; // Top of end share tools in relation to top of viewport

      if (ledeBottom > 0 || shareTop < 900) {
        this.closeNav();
        this.hideNav();
      } else {
        this.showNav();
      }
    },
    eventHandlers: function eventHandlers() {
      var throttledStickyNav = _throttle(this.showStickyNav, 100);

      window.addEventListener('scroll', throttledStickyNav.bind(this));
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23}];
