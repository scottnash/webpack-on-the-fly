window.modules["restaurant-and-bar-listing.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _throttle = require(23),
    $visibility = require(26);

module.exports = function (el) {
  var menu = dom.find(el, '.utility-menu'),
      badgeInfo = dom.find(el, '.badge-info-container'),
      tapHandler = function tapHandler(e) {
    var selectors = e.target.className; // there is no such thing as a media query for touchscreens, so assume
    // that if there's a touchstart event, that the device is a touchscreen

    badgeInfo.classList.add('is-touchscreen'); // when the user taps on the badge, toggle the badge info dialog

    if (selectors.includes('rating-')) {
      badgeInfo.classList.toggle('active'); // ensure that the dialog stays open if the user taps on it
    } else if (selectors.includes('badge-info-text') || selectors.includes('badge-info-link')) {
      badgeInfo.classList.add('active');
    } else {
      // when the user tags outside of the badge info dialog, hide the dialog
      badgeInfo.classList.remove('active');
    }
  },
      scrollHandler = _throttle(function () {
    var details = dom.find(el, '.location-details'),
        layout = dom.find('.restaurant-and-bar-listing-layout'); // if the Details section is out of view, trigger the utility menu and
    // add padding to the layout so content isn't cut off

    if (!$visibility.isElementInViewport(details)) {
      layout.classList.add('utility-menu-active');
      menu.classList.add('active');
    } else {
      menu.classList.remove('active');
      layout.classList.remove('utility-menu-active');
    }
  }, 30); // only trigger the utility menu animation if the utility menu exists


  if (menu) {
    window.addEventListener('scroll', scrollHandler);
  }

  window.addEventListener('touchstart', tapHandler);
};
}, {"1":1,"23":23,"26":26}];
