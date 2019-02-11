window.modules["di-header.client"] = [function(require,module,exports){'use strict';

module.exports = function (el) {
  var mobileNavButton = el.querySelector('.nav-mobile'),
      endButton = el.querySelector('.end'),
      mobileNav = el.querySelector('.primary-nav');
  var navExpanded = false;
  mobileNavButton.addEventListener('click', toggleNav);
  endButton.addEventListener('click', collapseNav); // toggles navigation button

  function expandNav() {
    navExpanded = true;
    mobileNav.classList.add('on');
    mobileNavButton.classList.add('on');
    mobileNavButton.setAttribute('aria-expanded', true);
  }

  function collapseNav() {
    navExpanded = false;
    mobileNav.classList.remove('on');
    mobileNavButton.classList.remove('on');
    mobileNavButton.setAttribute('aria-expanded', false);
  }

  function toggleNav() {
    if (navExpanded) {
      collapseNav();
    } else {
      expandNav();
    }
  }
};
}, {}];
