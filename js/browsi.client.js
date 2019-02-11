window.modules["browsi.client"] = [function(require,module,exports){'use strict';

DS.controller('browsi', ['$window', function ($window) {
  function Constructor(el) {
    var browsiUrl = el.getAttribute('data-src');

    if ($window.innerWidth < 768) {
      el.setAttribute('src', browsiUrl);
    }
  }

  return Constructor;
}]);
}, {}];
