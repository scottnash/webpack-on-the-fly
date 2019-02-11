window.modules["subscription-order-summary.client"] = [function(require,module,exports){'use strict';

DS.controller('subscription-order-summary', [function () {
  function Constructor(el) {
    this.orderSummary = el;
    this.planName = this.orderSummary.querySelector('.plan-name');
    this.planPrice = this.orderSummary.querySelector('.plan-price');
    this.init();
  }

  Constructor.prototype = {
    init: function init() {
      this.shouldDisplay();
      this.updatePlanInfo();
    },
    shouldDisplay: function shouldDisplay() {
      var plans = document.querySelectorAll('.subscription-plan_original') || [];

      if (plans.length < 2) {
        this.orderSummary.style.display = 'none';
      }
    },
    updatePlanInfo: function updatePlanInfo() {
      var selectedPlan = document.querySelector('.subscription-plan_original div[data-selected=true]');

      if (selectedPlan) {
        this.planName.textContent = selectedPlan.querySelector('.plan-name').textContent;
        this.planPrice.textContent = selectedPlan.querySelector('.plan-price').textContent;
      }
    }
  };
  return Constructor;
}]);
}, {}];
