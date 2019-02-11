window.modules["sailthru-personalization-pixel.client"] = [function(require,module,exports){/* global Sailthru:false */
'use strict';

DS.controller('sailthru-personalization-pixel', [function () {
  function Constructor() {
    var pixelComponent = document.querySelector('.sailthru-personalization-pixel'),
        horizonDomain = pixelComponent.getAttribute('data-horizon');

    function loadHorizon() {
      var horizonScript = document.createElement('script');
      horizonScript.type = 'text/javascript';
      horizonScript.async = true;
      horizonScript.src = 'https://ak.sail-horizon.com/horizon/v1.js';

      horizonScript.onload = function () {
        Sailthru.setup({
          domain: horizonDomain,
          useStoredTags: false
        });
      };

      pixelComponent.appendChild(horizonScript);
    }

    loadHorizon();
  }

  return Constructor;
}]);
}, {}];
