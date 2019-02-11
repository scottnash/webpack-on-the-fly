window.modules["vertical-navigation.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _findIndex = require(79),
    _throttle = require(23),
    $visibility = require(26);

DS.controller('vertical-navigation', [function () {
  function Constructor(el) {
    this.el = el;
    this.verticalNav = dom.find(this.el, '.nav');
    this.navLinks = dom.find(this.el, '.nav-links');
    this.link = dom.findAll(this.el, '.link');
    this.dropDownHeader = dom.find(this.el, '.mobile-dropdown-header');
    this.mobileSectionHeader = dom.find(this.el, '.mobile-section-header');
    this.caret = dom.find(this.el, '.caret');
    this.bottom = dom.find('.bottom-share');
    this.navHeight = this.verticalNav.clientHeight;
    this.stuck = false;
    this.autoScrolling = false;
    this.dropDownExpanded = false;
    this.selectedIndex = 0;
    this.stickPoint = this.getDistance(); // initialize some functions

    this.init();
  }

  Constructor.prototype = {
    events: {
      '.link click': 'jumpLink',
      '.mobile-dropdown-header click': 'toggleDropdown'
    },
    // init functions
    init: function init() {
      this.updateDropdownHeader(this.selectedIndex);
      this.selectedNavItem(this.selectedIndex);
      this.stickyNav();
      this.inView();
      this.updateAriaExpanded();
      this.eventHandlers();
    },
    jumpLink: function jumpLink(e) {
      var newLinkId, newLinkIndex;
      e.preventDefault();
      newLinkId = dom.closest(e.target, '.link').getAttribute('data-id');
      newLinkIndex = _findIndex(this.link, function (t) {
        return t.getAttribute('data-id') === newLinkId;
      }); // smoothly scroll to the section

      this.smoothScroll(newLinkId); // updated current index

      this.selectedNavItem(newLinkIndex); // on mobile, collapse the the dropdown when a link is clicked

      this.collapseDropdown();
      this.updateDropdownHeader(newLinkIndex);
    },

    /* update the current sections aria and active state
     * @param {number} newIndex - index for the next selected section
     */
    selectedNavItem: function selectedNavItem(newIndex) {
      if (newIndex >= 0 && newIndex < this.link.length) {
        this.link[this.selectedIndex].removeAttribute('aria-current');
        this.link[this.selectedIndex].classList.remove('current');
        this.link[newIndex].setAttribute('aria-current', true);
        this.link[newIndex].classList.add('current');
        this.selectedIndex = newIndex;
      }
    },

    /* update the header of the mobile dropdown with the currently selected section
     * @param {number} index - index number of the section currently active or in-view
     */
    updateDropdownHeader: function updateDropdownHeader(index) {
      if (this.selectedIndex === 0) {
        this.mobileSectionHeader.innerHTML = this.link[this.selectedIndex].innerHTML;
      } else {
        this.mobileSectionHeader.innerHTML = this.link[index].innerHTML;
      }
    },
    // get the distance of the navigation bar from the top of the window
    // returns a number
    getDistance: function getDistance() {
      var topDist = this.el.getBoundingClientRect().top + window.scrollY;
      return topDist;
    },
    // if the viewport is a certain distance from the top, fix the navigation to the top
    // of the window and stay fixed when scrolled
    // this function is called only if position: sticky not supported
    stickyNav: function stickyNav() {
      var distance = this.getDistance() - window.pageYOffset,
          endLocation = this.bottom.getBoundingClientRect().top,
          offset = window.pageYOffset,
          vertNav = this.el.getBoundingClientRect().top + this.navHeight;

      if (distance <= 0 && !this.stuck) {
        this.el.style.position = 'fixed';
        this.el.style.display = 'block';
        this.el.classList.add('nav-fixed');
        this.stuck = true;
      } else if (offset <= this.stickPoint) {
        this.el.style.position = 'static';
        this.el.style.display = 'block';
        this.el.classList.remove('nav-fixed');
        this.stuck = false;
      } // when the nav hits the bottom make it disappear


      if (vertNav >= endLocation) {
        this.el.style.display = 'none';
        this.el.style.position = 'static';
        this.stuck = false;
      }
    },

    /* animate the scroll of the window
     * @param {number} dist - difference of how far screen needs to be scrolled in either direction
     * @param {number} start - current Y position
     * @param {number} stop - Y location where window should stop
     */
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

    /* Smoothly scroll the window to the selected section
     * @param {string} anchor - ID of selected link
     */
    smoothScroll: function smoothScroll(anchor) {
      var distance,
          stopY,
          rectTop,
          startY = document.body.scrollTop,
          item = document.getElementById(anchor),
          marginTop = 50,
          // margin from the top of page
      translateAmt;
      rectTop = item.getBoundingClientRect().top;
      translateAmt = window.scrollY;
      stopY = parseInt(translateAmt) + rectTop - marginTop;
      distance = stopY > startY ? stopY - startY : startY - stopY;

      if (distance < 100) {
        scrollTo(0, stopY);
        return;
      }

      this.animateScroll(distance, startY, stopY);
    },

    /* ripped off 'isElememtInViewport' service to adjust when in-view elements update
     * @param {object} el - the element with the specified ID
     */
    isElementVisible: function isElementVisible(el) {
      var rect = el.getBoundingClientRect(),
          offsetInViewTop,
          offsetInViewBottom = this.navHeight * 2; // the number here is arbitrary. Can be changed as needed.
      // mobile requires different offset values

      if ($visibility.getViewportWidth() < 768) {
        offsetInViewTop = this.navHeight * 8;
      } else {
        offsetInViewTop = this.navHeight * 4;
      }

      return rect.top + offsetInViewTop >= 0 && rect.left >= 0 && rect.bottom + offsetInViewBottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    },
    // update the navigation links to active when page is scrolled
    // to indicate the section currently in-view
    inView: function inView() {
      var sectionInView, navID, i;

      for (i = 0; i < this.link.length; i++) {
        navID = this.link[i].getAttribute('data-id');
        sectionInView = document.getElementById(navID);

        if (this.isElementVisible(sectionInView)) {
          if (!this.autoScrolling) {
            this.selectedNavItem(i); // needs to only happen when you're scrolling and not being autoscrolled

            this.updateDropdownHeader(i);
          }
        }
      }
    },
    // on mobile, expand dropdown when header is clicked
    expandDropdown: function expandDropdown() {
      this.dropDownExpanded = true;
      this.caret.classList.add('up');
      this.caret.classList.remove('down');
      this.updateAriaExpanded();
    },
    // on mobile, collapse the dropdown when the header or link is clicked
    // when the nav is expanded
    collapseDropdown: function collapseDropdown() {
      this.dropDownExpanded = false;
      this.caret.classList.add('down');
      this.caret.classList.remove('up');
      this.updateAriaExpanded();
    },
    updateAriaExpanded: function updateAriaExpanded() {
      if ($visibility.getViewportWidth() < 1180) {
        if (this.dropDownExpanded === true) {
          this.dropDownHeader.setAttribute('aria-expanded', true);
          this.navLinks.setAttribute('aria-hidden', false);
        } else {
          this.dropDownHeader.setAttribute('aria-expanded', false);
          this.navLinks.setAttribute('aria-hidden', true);
        }
      } else {
        this.dropDownHeader.removeAttribute('aria-expanded', false);
        this.navLinks.setAttribute('aria-hidden', false);
      }
    },
    // toggle dropdown expanded/collapsed states
    toggleDropdown: function toggleDropdown() {
      // if dropdown is expanded, collapse
      if (this.dropDownExpanded) {
        this.collapseDropdown();
      } else {
        // if dropdown is collapsed, expand
        this.expandDropdown();
      }
    },
    // handle scroll and resize events
    eventHandlers: function eventHandlers() {
      var throttledStickyNav = _throttle(this.stickyNav, 100),
          throttledInView = _throttle(this.inView, 100),
          throttledResize = _throttle(this.updateAriaExpanded, 100);

      window.addEventListener('scroll', throttledInView.bind(this));
      window.addEventListener('scroll', throttledStickyNav.bind(this));
      window.addEventListener('resize', throttledResize.bind(this));
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"26":26,"79":79}];
