window.modules["subscription-plan.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

var isOriginalVariation;
DS.controller('subscription-plan', [function () {
  var planSelectedClass = 'bg-selected',
      buttonSelectedClass = 'selected';

  function Constructor(el) {
    isOriginalVariation = el.classList.contains('subscription-plan_original'); // only run client on `subscription-plan_original` variation

    if (isOriginalVariation) {
      this.planContainer = el;
      this.mainWrapper = dom.find(el, '.main-wrapper');
      this.planButton = dom.find(el, '.plan-button');

      if (this.mainWrapper) {
        this.init();
      }

      if (this.planButton) {
        this.planButton.addEventListener('click', this.handleButtonClick.bind(this));
      }
    }
  }

  Constructor.prototype = {
    init: function init() {
      this.onePlanHeader = this.mainWrapper.querySelector('.one-plan-header');
      this.planImage = this.mainWrapper.querySelector('.plan-image');
      this.planDescription = this.mainWrapper.querySelector('.plan-description');
      this.selectPlanButton = this.mainWrapper.querySelector('.plan-button');
      this.planName = this.mainWrapper.querySelector('.plan-name');
      this.planPrice = this.mainWrapper.querySelector('.plan-price');
      this.selectPlanButtonText = this.selectPlanButton.querySelector('.button-text');
      this.checkedSpan = this.selectPlanButton.querySelector('.checked-span');
      this.plansCount = this.getPlansCount();
      this.toggleElements();
      this.getPlanImage();
    },
    getPlanImage: function getPlanImage() {
      var wrapper, promoImage, promoImageSource, planHeadline;

      if (this.isOnePlan()) {
        this.orderSummary = dom.find('.order-summary');

        if (this.orderSummary) {
          promoImage = this.orderSummary.querySelector('.promo-image');

          if (promoImage) {
            promoImageSource = promoImage.src;
            wrapper = this.mainWrapper.querySelector('.wrapper');
            planHeadline = wrapper.querySelector('.plan-headline');

            if (!this.planImage) {
              this.planImage = document.createElement('img');
              wrapper.insertBefore(this.planImage, planHeadline);
            }

            this.planImage.src = promoImageSource;
            this.planImage.classList.add('plan-image');
          }
        }
      }
    },
    isOnePlan: function isOnePlan() {
      return this.plansCount === 1;
    },
    getPlansCount: function getPlansCount() {
      return parseInt(this.planContainer.parentElement.dataset.plans.trim());
    },
    toggleElements: function toggleElements() {
      var elementsToHide = [];

      if (this.isOnePlan()) {
        this.planDescription.style.marginBottom = '27px';
        elementsToHide.push(this.selectPlanButton);
      } else {
        elementsToHide.push(this.onePlanHeader);
        elementsToHide.push(this.planImage);
      }

      elementsToHide.forEach(function (element) {
        this.hideElement(element);
      }.bind(this));
    },
    hideElement: function hideElement(element) {
      if (element) {
        element.style.display = 'none';
      }
    },
    handleButtonClick: function handleButtonClick() {
      this.clearSelection();
      this.selectPlan();
      this.updateOrderSummary();
    },
    clearSelection: function clearSelection() {
      this.togglePlan(false);
    },
    selectPlan: function selectPlan() {
      this.togglePlan(true);
    },
    togglePlan: function togglePlan(active) {
      var plan, planButton, checkedSpan, planButtonText, buttonTextAttr;

      if (active) {
        plan = this.mainWrapper;
        planButton = this.selectPlanButton;
        checkedSpan = this.checkedSpan;
        planButtonText = this.selectPlanButtonText;
        buttonTextAttr = 'selectedButtonText';
      } else {
        plan = document.querySelector('.subscription-plan_original div[data-selected=true]');
        planButton = plan.querySelector('.plan-button');
        checkedSpan = planButton.querySelector('.checked-span');
        planButtonText = planButton.querySelector('.button-text');
        buttonTextAttr = 'unselectedButtonText';
      }

      plan.classList.toggle(planSelectedClass);
      planButton.classList.toggle(buttonSelectedClass);
      checkedSpan.classList.toggle('visible');
      plan.dataset.selected = active;
      planButtonText.textContent = planButton.dataset[buttonTextAttr];
    },
    updateOrderSummary: function updateOrderSummary() {
      if (this.orderSummary) {
        this.summaryPlanName.textContent = this.planName.textContent;
        this.summaryPlanPrice.textContent = this.planPrice.textContent;
      } else {
        this.orderSummary = dom.find('.order-summary');

        if (this.orderSummary) {
          this.summaryPlanName = this.orderSummary.querySelector('.plan-name');
          this.summaryPlanPrice = this.orderSummary.querySelector('.plan-price');
          this.summaryPlanName.textContent = this.planName.textContent;
          this.summaryPlanPrice.textContent = this.planPrice.textContent;
        }
      }
    }
  };
  return Constructor;
}]);
}, {"1":1}];
