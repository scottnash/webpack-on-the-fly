window.modules["subscription-container.client"] = [function(require,module,exports){'use strict';

var Vue = require(151),
    // min toggles on production mode (not dev mode)
// const Vue = require('../../node_modules/vue/dist/vue.js'),
store = require(197),
    auth0 = require(7),
    PlanButton = require(199),
    SubscriptionTierOption = require(200),
    AddressForm = require(201),
    CreditCardForm = require(204),
    OrderSummary = require(202),
    SubscriptionError = require(203),
    VueSimpleSpinner = require(9),
    gtmUtils = require(198);

function smoothScroll(element, position) {
  var i = position || window.pageYOffset;

  if (i < element) {
    setTimeout(function () {
      window.scrollTo(0, i);
      smoothScroll(element, i + 5);
    }, 5);
  }
}

;

module.exports = function (el) {
  var includeAccountSetup = el.getAttribute('data-include-account-setup') === 'true';
  new Vue({
    el: '.subscription-app',
    delimiters: ['${', '}'],
    data: {
      state: store.state,
      spinner: {
        size: 75,
        status: true,
        color: '#e83a29',
        depth: 3,
        rotation: true,
        speed: 0.8
      }
    },
    computed: {
      selectedPlanName: function selectedPlanName() {
        return store.getters.selectedPlanName();
      },
      paymentMessage: function paymentMessage() {
        return store.getters.selectedTierMessage();
      },
      showTierOptions: function showTierOptions() {
        return store.getters.hasTierOptions();
      },
      hasCompletedPayment: function hasCompletedPayment() {
        return store.state.hasCompletedPayment;
      },
      isValidated: function isValidated() {
        return store.state.hasValidAddressForm && store.state.hasValidCreditCardForm && store.state.selectedPlan;
      },
      hasSubmittedForm: function hasSubmittedForm() {
        return store.state.hasSubmittedForm;
      },
      isAuthenticated: function isAuthenticated() {
        return auth0.isAuthenticated();
      },
      hasDefaultPlan: function hasDefaultPlan() {
        return store.getters.getDefaultPlan();
      }
    },
    mounted: function mounted() {
      var tiers;
      store.actions.selectDefaultTier();
      store.actions.setIncludeAccountSetup(includeAccountSetup); // fire impressions

      tiers = store.getters.availableTiers();
      gtmUtils.trackProductDetailView(tiers);
    },
    methods: {
      handleSubmit: function handleSubmit() {
        this.$root.$emit('handle-submit');
        store.actions.setErrorMessage('');
        store.actions.setHasSubmittedForm(true);
      }
    },
    components: {
      'subscription-plan-button': PlanButton,
      'subscription-tier-option': SubscriptionTierOption,
      'address-form': AddressForm,
      'credit-card-form': CreditCardForm,
      'order-summary': OrderSummary,
      'subscription-error': SubscriptionError,
      'vue-simple-spinner': VueSimpleSpinner
    },
    watch: {
      selectedPlanName: function selectedPlanName(newValue, oldValue) {
        var form = this.$el.querySelector('.subscription-forms');
        form.classList.remove('hidden');

        if (newValue && !oldValue && !this.hasDefaultPlan) {
          smoothScroll(form.offsetTop - 100);
        }
      }
    }
  });
};
}, {"7":7,"9":9,"151":151,"197":197,"198":198,"199":199,"200":200,"201":201,"202":202,"203":203,"204":204}];
