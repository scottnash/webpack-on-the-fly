window.modules["subscription-plans-content.client"] = [function(require,module,exports){'use strict';

DS.controller('subscription-plans-content', [function () {
  function Constructor(el) {
    this.mainContainer = el;
    this.init();
  }

  Constructor.prototype = {
    init: function init() {
      this.setPlansLength();
    },
    setPlansLength: function setPlansLength() {
      var plans = document.querySelectorAll('.subscription-plan_original') || [],
          plansContainer = this.mainContainer.parentElement;
      plansContainer.setAttribute('data-plans', plans.length);
    }
  };
  return Constructor;
}]);
}, {}];
