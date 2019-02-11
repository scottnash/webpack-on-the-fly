window.modules["clay-share.client"] = [function(require,module,exports){'use strict';

var $visibility = require(26),
    $popup = require(40),
    $gtm = require(41);

DS.controller('clay-share', [function () {
  function Constructor(el) {
    this.el = el;
  }

  Constructor.prototype = {
    events: {
      click: 'shareTap',
      'a click': 'shareClick'
    },

    /**
     * tap entire component to share on mobile and tablet
     * @param {Event} e
     */
    shareTap: function shareTap() {
      var el = this.el,
          overlayDiv,
          overlayDivInner;

      if ($visibility.getViewportWidth() < 600) {
        // clone the share component into an overlay
        overlayDiv = document.createElement('div');
        overlayDivInner = el.cloneNode(true); // add classes

        overlayDiv.classList.add('clay-share-overlay-wrapper');
        overlayDivInner.classList.remove('vertical');
        overlayDivInner.classList.add('clay-share-overlay'); // append to body

        overlayDiv.appendChild(overlayDivInner);
        document.body.appendChild(overlayDiv); // add click event to close overlay

        overlayDiv.addEventListener('click', function () {
          var foundOverlay = document.querySelector('.clay-share-overlay-wrapper');
          document.body.removeChild(foundOverlay); // note: link clicks will open in a new tab
          // also note: removing the div will unbind this event
        });
      }
    },

    /**
     * click individual service link to share on desktop
     * @param {Event} e
     */
    shareClick: function shareClick(e) {
      var target = e.currentTarget,
          url = target.getAttribute('href'),
          handle = target.getAttribute('data-handle'),
          popClass = $popup.getPopupClass(target.classList),
          // careful of changes b/c socialNetwork value goes into analytics
      socialNetwork = popClass,
          isEmail = target.className.indexOf('email') > -1,
          clickLocation = $visibility.isBelowPrimaryContent(target) ? 'bottom' : 'top';

      if (socialNetwork || isEmail) {
        $gtm.reportNow({
          event: 'social-share-widget',
          clickLocation: clickLocation,
          socialNetwork: socialNetwork || 'email'
        });
      }

      if ($visibility.getViewportWidth() >= 600 && popClass) {
        e.preventDefault();
        $popup.popWindow(popClass, handle, url);
      }
    }
  };
  return Constructor;
}]);
}, {"26":26,"40":40,"41":41}];
