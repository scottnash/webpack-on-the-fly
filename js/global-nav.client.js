window.modules["global-nav.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    auth0 = require(7),
    signInButton = dom.find('.user-signin'),
    signOutButton = dom.find('.user-signout'),
    globalNav = dom.find('[class^="global-nav"]'),
    body = dom.find('body'),
    dropdownItems = dom.findAll('.dropdown-wrap'),
    gtm = require(41),
    pageUri = require(116).getPageUri();
/**
 * close dropdown when a non-dropdown element is clicked or the escape key is pressed, or the dropdown button is clicked again
 * @param {event} event - click or keypress event
 */


function closeDropdowns(event) {
  var openDropDowns = globalNav.querySelectorAll('.dropdown.open');
  dropdownItems.forEach(function (dropdownWrap) {
    var dropdown = dropdownWrap.querySelector('.dropdown');

    if (!!openDropDowns && (!dropdownWrap.contains(event.target) || event.keyCode === 27)) {
      dropdown.classList.remove('open');
    }
  });
}
/**
 * send call to gtm tracking for global nav
 * @param {brandName} brandName - if link is a vertical link then link text, else text of button
 * @param {eventTarget} eventTarget - the link or button that was clicked
 * @param {type} type - vertical link or user info link
 */


function gtmSendReport(brandName, eventTarget, type) {
  var gtmObject = {
    eventCategory: 'ecommerce',
    eventAction: 'componentClick',
    brand: brandName,
    dimension23: 'global-nav',
    list: pageUri,
    pageZone: 'header',
    variant: 'nav-link'
  };

  if (type === 'global-nav-link') {
    gtmObject.eventLabel = eventTarget.href;
  }

  gtm.reportNow(gtmObject);
} // toggle magazine and account dropdowns on button click


dropdownItems.forEach(function (dropdownWrap) {
  dropdownWrap.addEventListener('click', function () {
    var dropdown = dropdownWrap.querySelector('.dropdown');
    dropdown.classList.toggle('open');
  });
}); // close with click outside dropdown

body.addEventListener('click', closeDropdowns); // close with esc key

document.addEventListener('keydown', closeDropdowns); // gtm tracking

globalNav.addEventListener('click', function (e) {
  var link = e.target;

  if (link.classList.contains('global-nav-track')) {
    gtmSendReport(link.text, link, 'global-nav-link');
  }
});
/**
 * initialization function for global nav
 * @param  {Element} el
 */

function init(el) {
  auth0.on('init', function () {
    // add click handler to sign in button
    signInButton.addEventListener('click', function (e) {
      e.preventDefault();
      auth0.showLogin(function (err) {
        if (!err) {
          gtmSendReport('Sign In', e.target, 'user-info-link');
        } // TODO: should not see one, but what if error occurs

      });
    }); // add click handler to sign out button

    signOutButton.addEventListener('click', function (e) {
      e.preventDefault();
      auth0.logout();
      gtmSendReport('Sign Out', e.target, 'user-info-link');
    });

    if (auth0.isAuthenticated()) {
      el.classList.add('signed-in');
    }

    if (auth0.isSubscriber()) {
      el.classList.add('subscribed');
    } // make sign-in visible; added after event listeners so there is no flicker


    el.querySelectorAll('.user-link').forEach(function (e) {
      e.classList.add('active');
    });
  }); // if the reader logs in, add classes

  auth0.on('login', function () {
    el.classList.add('signed-in');

    if (auth0.isSubscriber()) {
      el.classList.add('subscribed');
    }
  }); // if the reader logs out, remove classes

  auth0.on('logout', function () {
    el.classList.remove('signed-in');
    el.classList.remove('subscribed');
  });
}

module.exports = init;
}, {"1":1,"7":7,"41":41,"116":116}];
