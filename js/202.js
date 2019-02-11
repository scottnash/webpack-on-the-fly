window.modules["202"] = [function(require,module,exports){;(function(){
"use strict";

var store = require(197);

module.exports = {
  data: function data() {
    return {
      paymentType: 'Credit Card'
    };
  },
  computed: {
    selectedPlan: function selectedPlan() {
      return store.state.selectedPlan;
    },
    pcdAccountNumber: function pcdAccountNumber() {
      return store.state.pcdAccountNumber;
    },
    firstChargeAmount: function firstChargeAmount() {
      var selectedTier = store.getters.selectedTier();
      return selectedTier ? selectedTier.firstChargeAmount : '';
    },
    recurringChargeAmount: function recurringChargeAmount() {
      var selectedTier = store.getters.selectedTier();
      return selectedTier ? selectedTier.recurringChargeAmount : '';
    },
    recurringChargePeriod: function recurringChargePeriod() {
      var selectedTier = store.getters.selectedTier();
      return selectedTier ? selectedTier.recurringChargePeriod : '';
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"subscription-order-summary"},[_c('header',{staticClass:"title"},[_vm._v("Order Summary")]),_vm._v(" "),_c('div',{staticClass:"subs-order-summary"},[_c('p',{staticClass:"subs-first-charge"},[_vm._v("Your total today was $"+_vm._s(_vm.firstChargeAmount))]),_vm._v(" "),_c('div',{staticClass:"subs-order-details"},[_c('div',{staticClass:"detail"},[_c('div',{staticClass:"detail-label"},[_vm._v("Account #")]),_vm._v(" "),_c('div',{staticClass:"detail-content"},[_vm._v(_vm._s(_vm.pcdAccountNumber))])]),_vm._v(" "),_c('div',{staticClass:"detail"},[_c('div',{staticClass:"detail-label"},[_vm._v("Subscription Plan")]),_vm._v(" "),_c('div',{staticClass:"detail-content"},[_vm._v(_vm._s(_vm.selectedPlan))])]),_vm._v(" "),_c('div',{staticClass:"detail"},[_c('div',{staticClass:"detail-label"},[_vm._v("Plan Cost")]),_vm._v(" "),_c('div',{staticClass:"detail-content"},[_vm._v("$"+_vm._s(_vm.recurringChargeAmount)+"/"+_vm._s(_vm.recurringChargePeriod))])]),_vm._v(" "),_c('div',{staticClass:"detail"},[_c('div',{staticClass:"detail-label"},[_vm._v("Payment Type")]),_vm._v(" "),_c('div',{staticClass:"detail-content"},[_vm._v(_vm._s(_vm.paymentType))])])]),_vm._v(" "),_c('p',{staticClass:"subs-email"},[_vm._v("We've also sent an email with your order confirmation and complete details.")])])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-220f5980", __vue__options__)
  } else {
    hotAPI.reload("data-v-220f5980", __vue__options__)
  }
})()}}, {"8":8,"10":10,"197":197}];
