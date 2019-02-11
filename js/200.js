window.modules["200"] = [function(require,module,exports){;(function(){
"use strict";

var _assign = require(57),
    _pick = require(174),
    store = require(197);

module.exports = {
  props: ['id', 'planType', 'firstChargeAmount', 'recurringChargeAmount', 'recurringChargePeriod', 'customMessage', 'defaultSelection', 'pcdId', 'stripeId', 'stripePremiumId', 'planTerms'],
  computed: {
    isSelected: {
      get: function get() {
        return store.getters.selectedTierID() === this.id;
      },
      set: function set(id) {
        store.actions.setSelectedTierID(id);
      }
    },
    autoTierMessage: function autoTierMessage() {
      return store.getters.hasTierOptions() ? "Your total today is $".concat(this.firstChargeAmount || 0, ". You can pay") : "Your total today is $".concat(this.firstChargeAmount || 0, ". You\u2019ll be charged $").concat(this.recurringChargeAmount, " a ").concat(this.recurringChargePeriod, " for your subscription plan.");
    },
    tierMessage: function tierMessage() {
      return this.customMessage || this.autoTierMessage;
    },
    shouldDisplay: function shouldDisplay() {
      var matchesSelectedPlan = this.planType === store.getters.selectedPlanType();
      return matchesSelectedPlan && store.getters.hasTierOptions();
    },
    recurringChargeSavings: function recurringChargeSavings() {
      var isYearly = this.recurringChargePeriod === 'year';
      var monthlyTier, monthlyTotalCost, yearlyCost, savingsAmount;

      if (isYearly) {
        yearlyCost = this.recurringChargeAmount;
        monthlyTier = store.getters.currentMonthlyTier();

        if (monthlyTier) {
          monthlyTotalCost = monthlyTier.recurringChargeAmount * 12;
          savingsAmount = Math.max(monthlyTotalCost - yearlyCost, 0);
          return Math.floor(100 * savingsAmount / monthlyTotalCost);
        }

        return 0;
      }

      return 0;
    },
    recurringChargeMessage: function recurringChargeMessage() {
      return "$".concat(this.recurringChargeAmount, "/").concat(this.recurringChargePeriod);
    }
  },
  mounted: function mounted() {
    var _this = this;

    var propNames = Object.keys(this._props),
        data = propNames.reduce(function (acc, propName) {
      acc[propName] = _this[propName];
      return acc;
    }, {});
    data.defaultSelection = this.defaultSelection;
    data.tierMessage = this.tierMessage;
    store.actions.registerTier(data);
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.shouldDisplay)?_c('label',{staticClass:"subscription-tier-option-label"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.isSelected),expression:"isSelected"}],attrs:{"type":"radio"},domProps:{"value":_vm.id,"checked":_vm._q(_vm.isSelected,_vm.id)},on:{"change":function($event){_vm.isSelected=_vm.id}}}),_vm._v(" "),_c('span',{staticClass:"styled-input",class:{ checked: _vm.isSelected }}),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.recurringChargeMessage))]),_vm._v(" "),(_vm.recurringChargeSavings)?_c('span',{staticClass:"subscription-tier-option-label-savings"},[_vm._v("to save "+_vm._s(_vm.recurringChargeSavings)+"%")]):_vm._e()]):_vm._e()}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-24a36e07", __vue__options__)
  } else {
    hotAPI.reload("data-v-24a36e07", __vue__options__)
  }
})()}}, {"8":8,"10":10,"57":57,"174":174,"197":197}];
