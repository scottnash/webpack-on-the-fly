window.modules["subscription-form-link.client"] = [function(require,module,exports){'use strict';

var store = require(197);

module.exports = function (el) {
  var planType = el.getAttribute('data-plan-type');

  if (planType) {
    store.actions.setLocale(planType);
  }
};
}, {"197":197}];
