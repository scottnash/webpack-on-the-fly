window.modules["walking-tour-nav.client"] = [function(require,module,exports){'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dom = require(1),
    _findIndex = require(79),
    _throttle = require(23),
    $visibility = require(26);

DS.controller('walking-tour-nav', [function () {
  var _Constructor$prototyp;

  var isUserOnDevice, isUserOnIE;

  function Constructor(el) {
    this.el = el;
    this.mapNav = dom.find(this.el, '.nav-wrapper');
    this.navLink = dom.findAll(this.el, '.nav-link');
    this.navPaths = dom.find(this.el, '.poly-path');
    this.selectedIndex = 0;
    this.stuck = false;
    this.stickPoint = this.getDistance();
    this.bottom = dom.find('.bottom-share');
    this.navHeight = this.mapNav.clientHeight;
    this.lastScrollLocation = window.scrollTop;
    this.prev = dom.find(this.el, '.prev');
    this.next = dom.find(this.el, '.next');
    this.btn = dom.findAll(this.el, '.nav-button'); // this.number = dom.find(this.el, '.number');

    this.location = dom.find(this.el, '.location');
    this.locNum = dom.findAll(this.el, '.loc-num');
    this.label = dom.findAll(this.el, '.label');
    this.activeIconDelay = null; // Device and Browser checks

    isUserOnDevice = /Android|iPhone|iPod/i.test(navigator.userAgent);
    isUserOnIE = /MSIE 9/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent); // init functions

    this.init();
  }

  Constructor.prototype = (_Constructor$prototyp = {
    events: {
      '.nav-link click': 'jumpLink',
      '.next-btn click': 'nextJumpLink',
      '.prev-btn click': 'prevJumpLink'
    },
    // init functions
    init: function init() {
      this.inView();
      this.stickyNav();
      this.eventHandlers();
      this.showArrows();
      this.setBtnID();
    },
    // check to see if an element has a particular class
    hasClass: function hasClass(el, cls) {
      return el.classList.contains(cls);
    },
    resetScrollTop: function resetScrollTop() {
      window.onload(function () {
        window.scrollTo(0, 0);
      });
    },
    // Function that jumps to selected section on click
    jumpLink: function jumpLink(e) {
      var navID, newLinkId, newLinkIndex;

      if (isUserOnDevice) {
        e.preventDefault();
        e.stopPropragation();
      }

      e.preventDefault();
      navID = dom.closest(e.target, '.nav-link').getAttribute('data-id'); // call smooth scroll function

      this.smoothScroll(navID); // add active class to selected link

      setTimeout(function () {
        dom.closest(e.target, '.nav-link').classList.add('selected');
      }, 500);
      newLinkId = dom.closest(e.target, '.nav-link').getAttribute('data-id');
      newLinkIndex = _findIndex(this.navLink, function (t) {
        return t.getAttribute('data-id') === newLinkId;
      });
      this.selectedPath(newLinkIndex); // update the text in the navigation header

      this.updateMobileText(newLinkIndex);
    },
    nextJumpLink: function nextJumpLink() {
      var nextID, mobileLinkIndex; // add active class to selected link

      nextID = this.next.getAttribute('data-id');
      mobileLinkIndex = _findIndex(this.navLink, function (t) {
        return t.getAttribute('data-id') === nextID;
      }); // animate the appropriate paths

      this.selectedPath(mobileLinkIndex); // add active class to selected link

      this.navLink[this.selectedIndex].classList.add('selected'); // call smooth scroll function

      this.smoothScroll(nextID); // update the text in the navigation header

      this.updateMobileText(mobileLinkIndex);
    },
    prevJumpLink: function prevJumpLink() {
      var prevID, mobileLinkIndex; // e.preventDefault();

      prevID = this.prev.getAttribute('data-id');
      mobileLinkIndex = _findIndex(this.navLink, function (t) {
        return t.getAttribute('data-id') === prevID;
      }); // call smooth scroll function

      this.smoothScroll(prevID); // animate the appropriate paths

      this.selectedPath(mobileLinkIndex); // add active class to selected link

      this.navLink[this.selectedIndex].classList.add('selected'); // update the text in the navigation header

      this.updateMobileText(mobileLinkIndex);
    },
    // on mobile, update the number and location when in viewport
    updateMobileText: function updateMobileText(index) {
      if (this.selectedIndex === 0) {
        // this.number.innerHTML = this.locNum[this.selectedIndex].innerHTML;
        this.location.innerHTML = this.label[this.selectedIndex].innerHTML;
      } else {
        // this.number.innerHTML = this.locNum[index].innerHTML;
        this.location.innerHTML = this.label[index].innerHTML;
      }
    },
    // the mobile next and prev buttons grouped together
    setBtnID: function setBtnID() {
      this.setNextID();
      this.setPrevID();
    },
    // set the data-id for the mobile next button based on the current section
    setNextID: function setNextID() {
      var nextID;

      if (this.selectedIndex !== this.navLink.length - 1) {
        nextID = this.navLink[this.selectedIndex + 1].getAttribute('data-id');
        this.next.setAttribute('data-id', nextID);
      } else {
        this.next.removeAttribute('data-id');
      }
    },
    // set the data-id for the mobile previous button based on the current section
    setPrevID: function setPrevID() {
      var prevID;

      if (this.selectedIndex !== 0) {
        prevID = this.navLink[this.selectedIndex - 1].getAttribute('data-id');
        this.prev.setAttribute('data-id', prevID);
      } else {
        this.prev.removeAttribute('data-id');
      }
    },
    // mobile arrow buttons grouped together
    showArrows: function showArrows() {
      this.nextArrow();
      this.prevArrow();
    },
    // determine when to show/hide previous arrow
    prevArrow: function prevArrow() {
      if (this.selectedIndex === 0) {
        this.prev.classList.add('hide');
      } else {
        this.prev.classList.remove('hide');
      }
    },
    // determine when to show/hide next arrow
    nextArrow: function nextArrow() {
      if (this.selectedIndex === this.navLink.length - 1) {
        this.next.classList.add('hide');
      } else {
        this.next.classList.remove('hide');
      }
    },
    // select/unselect the paths if a user clicks around and not sequentially
    updateSelected: function updateSelected(newIndex) {
      var i, isGreater;

      if (newIndex > this.selectedIndex) {
        isGreater = true;
      } else {
        isGreater = false;
      } // going down the page, up in the index


      if (isGreater === true) {
        for (i = newIndex; i >= this.selectedIndex; i--) {
          this.animateNavPath(i);
          this.activeIconDelay = setTimeout(this.navLink[i].classList.add('selected'), 1000);
        }
      } else {
        // going up the page, down in the index
        for (i = newIndex + 1; i <= this.selectedIndex; i++) {
          this.navLink[i].classList.remove('selected');
          this.unanimateNavPath(i);
        }
      }
    },
    // update current selected aria and add/remove the lines in the path
    // if a user clicks around and not sequentially
    selectedPath: function selectedPath(newIndex) {
      if (newIndex >= 0 && newIndex < this.navLink.length) {
        this.updateSelected(newIndex);
        this.navLink[this.selectedIndex].removeAttribute('aria-current');
        this.navLink[newIndex].setAttribute('aria-current', true);
        this.selectedIndex = newIndex;
      }
    },
    // animate the lines in the map when clicked ot scrolled
    animateNavPath: function animateNavPath(linkIndex) {
      var el = this.el,
          navPath;

      if (linkIndex > 0) {
        navPath = dom.find(el, '.active-path polyline:nth-of-type(' + linkIndex + ')'); // if the currently selected nav item isn't active, make it active and draw the line

        if (!this.hasClass(navPath, 'active')) {
          if (isUserOnIE) {
            // remove animation if user on IE
            navPath.classList.add('active');
          } else {
            navPath.classList.add('active');
            navPath.classList.add('path-animation');
          }
        } else {
          // if path to point is already active and drawn, don't reanimate it when clicked
          navPath.classList.add('active');
        }

        setTimeout(function () {
          navPath.classList.remove('path-animation');
        }, 500);
      }
    },
    unanimateNavPath: function unanimateNavPath(linkIndex) {
      var el = this.el,
          navPath = dom.find(el, '.active-path polyline:nth-of-type(' + linkIndex + ')');
      navPath.classList.remove('active');
      navPath.classList.remove('path-animation');
    }
  }, _defineProperty(_Constructor$prototyp, "showArrows", function showArrows() {
    this.nextArrow();
    this.prevArrow();
  }), _defineProperty(_Constructor$prototyp, "prevArrow", function prevArrow() {
    if (this.selectedIndex === 0) {
      this.prev.classList.add('hide');
    } else {
      this.prev.classList.remove('hide');
    }
  }), _defineProperty(_Constructor$prototyp, "nextArrow", function nextArrow() {
    if (this.selectedIndex === this.navLink.length - 1) {
      this.next.classList.add('hide');
    } else {
      this.next.classList.remove('hide');
    }
  }), _defineProperty(_Constructor$prototyp, "getDistance", function getDistance() {
    var topDist = this.mapNav.getBoundingClientRect().top + window.scrollY;
    return topDist;
  }), _defineProperty(_Constructor$prototyp, "stickyNav", function stickyNav() {
    var distance = this.getDistance() - window.pageYOffset,
        endLocation = this.bottom.getBoundingClientRect().top,
        offset = window.pageYOffset,
        mapNav = this.mapNav.getBoundingClientRect().top + this.navHeight;

    if (distance <= 0 && !this.stuck) {
      this.mapNav.style.position = 'fixed';
      this.mapNav.style.display = 'block';
      this.mapNav.style.top = '0px';
      this.stuck = true;
    } else if (offset <= this.stickPoint) {
      // else if (offset <= this.stickPoint) { // else if (offset <= this.stickPoint || offset > endLocation)
      this.mapNav.style.position = 'static';
      this.mapNav.style.display = 'block';
      this.stuck = false;
    } // when the nav hits the bottom make it disappear


    if (mapNav >= endLocation) {
      this.mapNav.style.display = 'none';
      this.mapNav.style.position = 'static';
      this.stuck = false;
    }
  }), _defineProperty(_Constructor$prototyp, "animateScroll", function animateScroll(dist, start, stop) {
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
  }), _defineProperty(_Constructor$prototyp, "smoothScroll", function smoothScroll(anchor) {
    var distance,
        stopY,
        rectTop,
        startY = document.body.scrollTop,
        item = document.getElementById(anchor),
        marginTop = 100,
        // margin from the top of page
    translateAmt; // if first nav item is clicked adjust the offset

    if (this.selectedIndex === 0) {
      // no adjustment needed
      rectTop = item.getBoundingClientRect().top - this.navHeight - marginTop;
    } else {
      // adjust the top scroll position based on the height of the nav
      rectTop = item.getBoundingClientRect().top - this.navHeight;
    }

    translateAmt = window.scrollY;
    stopY = parseInt(translateAmt) + rectTop - marginTop;
    distance = stopY > startY ? stopY - startY : startY - stopY;

    if (distance < 100) {
      scrollTo(0, stopY);
      return;
    }

    this.animateScroll(distance, startY, stopY);
  }), _defineProperty(_Constructor$prototyp, "isElementVisible", function isElementVisible(el) {
    var rect = el.getBoundingClientRect(),
        offsetInViewTop,
        offsetInViewBottom = this.navHeight * 2; // the number '4' here is arbitrary. Can be changed as needed.
    // mobile requires different offset values

    if ($visibility.getViewportWidth() < 768) {
      offsetInViewTop = this.navHeight * 8;
    } else {
      offsetInViewTop = this.navHeight * 4;
    }

    return rect.top + offsetInViewTop >= 0 && rect.left >= 0 && rect.bottom + offsetInViewBottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }), _defineProperty(_Constructor$prototyp, "inView", function inView() {
    var sectionInView, navID, i;

    for (i = 0; i < this.navLink.length; i++) {
      navID = this.navLink[i].getAttribute('data-id');
      sectionInView = document.getElementById(navID);

      if (this.isElementVisible(sectionInView)) {
        // make sure the first dot is active when in view
        if (this.selectedIndex === 0) {
          this.navLink[0].classList.add('selected');
        } // on scroll, update the nav indexes and select or deselect nav items based
        // on whether scrolling up or down


        if (!this.autoScrolling) {
          this.selectedPath(i); // needs to only happen when you're scrolling and not being autoscrolled
        }

        this.updateMobileText(i);
      }
    }
  }), _defineProperty(_Constructor$prototyp, "eventHandlers", function eventHandlers() {
    var throttledStickyNav = _throttle(this.stickyNav, 100),
        throttleInView = _throttle(this.inView, 100),
        throttleShowArrows = _throttle(this.showArrows, 100),
        throttleSetBtnID = _throttle(this.setBtnID, 100);

    window.addEventListener('scroll', throttledStickyNav.bind(this));
    window.addEventListener('scroll', throttleInView.bind(this));
    window.addEventListener('scroll', throttleShowArrows.bind(this));
    window.addEventListener('scroll', throttleSetBtnID.bind(this));
  }), _Constructor$prototyp);
  return Constructor;
}]);
}, {"1":1,"23":23,"26":26,"79":79}];
