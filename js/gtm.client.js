window.modules["gtm.client"] = [function(require,module,exports){'use strict';

var $gtm = require(41);

DS.controller('gtm', [function () {
  return function (el) {
    $gtm.init(el.getAttribute('data-container-id'));
  };
}]);
}, {"41":41}];
