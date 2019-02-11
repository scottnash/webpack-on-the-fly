window.modules["197"] = [function(require,module,exports){'use strict';

var _get = require(32),
    store = {
  // NOTE: do not mutate state props directly
  state: {
    includeAccountSetup: false,
    locale: '',
    selectedPlan: '',
    defaultPlan: '',
    selectedTierID: '',
    tiers: [],
    plans: [],
    hasValidAddressForm: false,
    hasValidCreditCardForm: false,
    pcdAccountNumber: '',
    errorMessage: '',
    // address form fields
    addressFields: {
      email: '',
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      postalCode: '',
      province: '',
      country: ''
    },
    hasSubmittedForm: false,
    hasCompletedSubscriptionForm: false,
    hasCompletedPayment: false
  },
  // NOTE: use actions to mutate state
  actions: {
    setIncludeAccountSetup: function setIncludeAccountSetup(bool) {
      store.state.includeAccountSetup = bool;
    },
    setLocale: function setLocale(locale) {
      store.state.locale = locale.toLowerCase().trim();
    },
    selectDefaultTier: function selectDefaultTier() {
      var tiers = store.getters.getTiersBySelectedPlan();
      var defaultTier = tiers.find(function (tier) {
        return !!tier.defaultSelection;
      }); // set default to the first tier if not defined

      if (!defaultTier && tiers.length) {
        defaultTier = tiers[0];
      }

      if (defaultTier) {
        store.state.selectedTierID = defaultTier.id;
      }
    },
    registerTier: function registerTier(tier) {
      store.state.tiers.push(tier);
    },
    registerPlan: function registerPlan(plan) {
      store.state.plans.push(plan);
    },
    selectPlanType: function selectPlanType(planType) {
      store.state.selectedPlan = planType;
      store.actions.selectDefaultTier();
    },
    setSelectedTierID: function setSelectedTierID(id) {
      store.state.selectedTierID = id;
    },
    setAddressField: function setAddressField(field, val) {
      if (store.state.addressFields.hasOwnProperty(field)) {
        store.state.addressFields[field] = val;
      }
    },
    setPcdAccountNumber: function setPcdAccountNumber(pcd) {
      store.state.pcdAccountNumber = pcd;
    },
    setAddressFormStatus: function setAddressFormStatus(status) {
      store.state.hasValidAddressForm = status;
    },
    setCreditCardFormStatus: function setCreditCardFormStatus(status) {
      store.state.hasValidCreditCardForm = status;
    },
    setErrorMessage: function setErrorMessage(error) {
      store.state.errorMessage = error;
    },
    setLayout: function setLayout() {
      document.querySelector('.subscription-page').classList.add('subscription-form-complete');
    },
    setHasSubmittedForm: function setHasSubmittedForm(status) {
      store.state.hasSubmittedForm = status;
    },
    setHasCompletedAccount: function setHasCompletedAccount(status) {
      store.state.hasCompletedAccount = status;
    },
    setDefaultPlan: function setDefaultPlan(planName) {
      store.state.defaultPlan = planName;
    },
    setHasCompletedPayment: function setHasCompletedPayment(status) {
      store.state.hasCompletedPayment = status;
    }
  },
  // helper methods for getting state
  getters: {
    availableTiers: function availableTiers() {
      var planTypes = store.state.plans.map(function (item) {
        return item.planType;
      });
      return store.state.tiers.filter(function (tier) {
        return planTypes.includes(tier.planType);
      });
    },
    pcdAccountNumber: function pcdAccountNumber() {
      return store.state.pcdAccountNumber;
    },
    selectedTierMessage: function selectedTierMessage() {
      return _get(store.getters.selectedTier(), 'tierMessage');
    },
    getLocale: function getLocale() {
      return store.state.locale;
    },
    getAddressData: function getAddressData() {
      return store.state.addressFields;
    },
    getDefaultPlan: function getDefaultPlan() {
      return store.state.defaultPlan;
    },
    selectedPlan: function selectedPlan() {
      return store.state.plans.find(function (plan) {
        return plan.planType === store.state.selectedPlan;
      });
    },
    selectedPlanType: function selectedPlanType() {
      return _get(store.getters.selectedPlan(), 'planType');
    },
    selectedPlanName: function selectedPlanName() {
      return _get(store.getters.selectedPlan(), 'planName');
    },
    selectedTierID: function selectedTierID() {
      return store.state.selectedTierID;
    },
    selectedTier: function selectedTier() {
      return store.state.tiers.find(function (tier) {
        return tier.id === store.state.selectedTierID;
      });
    },
    getTiersBySelectedPlan: function getTiersBySelectedPlan() {
      return store.state.tiers.filter(function (tier) {
        return tier.planType === store.state.selectedPlan;
      });
    },
    hasTierOptions: function hasTierOptions() {
      var tiers = store.getters.getTiersBySelectedPlan();
      return tiers.length > 1;
    },
    currentMonthlyTier: function currentMonthlyTier() {
      var tiers = store.getters.getTiersBySelectedPlan();
      return tiers.find(function (tier) {
        return tier.recurringChargePeriod === 'month';
      });
    }
  }
};

module.exports = store;
}, {"32":32}];
