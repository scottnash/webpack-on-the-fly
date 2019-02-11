window.modules["share-video.client"] = [function(require,module,exports){'use strict';

var $visibility = require(26),
    $popup = require(40),
    $gtm = require(41);

DS.controller('share-video', [function () {
  function Constructor(el) {
    this.el = el;
  }

  Constructor.prototype = {
    events: {
      'a click': 'clickHandler'
    },
    clickHandler: function clickHandler(e) {
      var target = e.currentTarget,
          url = target.getAttribute('href'),
          popClass = $popup.getPopupClass(target.parentNode.classList),
          clickLocation = $visibility.isBelowPrimaryContent(target) ? 'bottom' : 'top';
      $gtm.reportNow({
        event: 'social-share-widget',
        clickLocation: clickLocation,
        socialNetwork: popClass || 'email' // careful of changes b/c this value goes into analytics

      }); // Above mobile viewports, open share links in popup window

      if ($visibility.getViewportWidth() >= 768 && popClass) {
        e.preventDefault();
        $popup.popWindow(popClass, '', url);
      }
    }
  };
  return Constructor;
}]);
}, {"26":26,"40":40,"41":41}];
