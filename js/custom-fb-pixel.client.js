window.modules["custom-fb-pixel.client"] = [function(require,module,exports){'use strict';

DS.controller('custom-fb-pixel', [function () {
  function Constructor() {
    var fbPixel = document.querySelector('.custom-fb-pixel'),
        customName = fbPixel.dataset.name,
        fbq = window.fbq;

    if (customName) {
      fbq('track', customName);
    }
  }

  return Constructor;
}]);
}, {}];
