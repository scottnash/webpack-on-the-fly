window.modules["share-button.client"] = [function(require,module,exports){'use strict';

var $visibility = require(26),
    $popup = require(40),
    $gtm = require(41);

DS.controller('share-button', [function () {
  function Constructor(el) {
    this.el = el;
  }

  Constructor.prototype = {
    events: {
      click: 'clickHandler'
    },
    clickHandler: function clickHandler(e) {
      var target = e.currentTarget,
          link = target.querySelector('a'),
          url = link.getAttribute('href'),
          handle = link.getAttribute('data-handle'),
          popClass = $popup.getPopupClass(target.classList),
          clickLocation = $visibility.isBelowPrimaryContent(target) ? 'bottom' : 'top';
      $gtm.reportNow({
        event: 'social-share-widget',
        clickLocation: clickLocation,
        socialNetwork: popClass // careful of changes b/c this value goes into analytics

      });

      if ($visibility.getViewportWidth() >= 768 && popClass) {
        e.preventDefault();
        $popup.popWindow(popClass, handle, url);
      } // on mobile, we just open the link like normal

    }
  };
  return Constructor;
}]);
}, {"26":26,"40":40,"41":41}];
