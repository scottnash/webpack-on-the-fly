window.modules["12"] = [function(require,module,exports){;(function(){
'use strict';

var auth0 = require(7);

module.exports = {
  props: ['linkIcon'],
  data: function data() {
    return {
      appMeta: null
    };
  },
  computed: {
    hasPCDAccount: function hasPCDAccount() {
      return this.appMeta && this.appMeta.has_pcd_subscription;
    },
    planName: function planName() {
      var appMeta = this.appMeta,
          hasPCDAccount = appMeta && appMeta.has_pcd_subscription,
          hasPrintAndDigitalAccount = hasPCDAccount && appMeta.pcd_account_type === 'both',
          hasDigitalPCDAccount = hasPCDAccount && appMeta.pcd_account_type === 'digital',
          hasAppleAccount = appMeta && appMeta.has_apple_subscription,
          hasGoogleAccount = appMeta && appMeta.has_google_subscription,
          hasEmployeeAccount = appMeta && appMeta.has_staff_subscription;

      if (hasPrintAndDigitalAccount) {
        return 'Print and Digital';
      } else if (hasDigitalPCDAccount || hasAppleAccount || hasGoogleAccount) {
        return 'Digital';
      } else if (hasEmployeeAccount) {
        return 'Employee Account';
      } else {
        return 'Other';
      }
    },
    accountNumber: function accountNumber() {
      var appMeta = this.appMeta,
          hasPCDAccount = appMeta && appMeta.has_pcd_subscription,
          hasPCDAccountNumber = appMeta && appMeta.pcd_account_number,
          hasAppleAccount = appMeta && appMeta.has_apple_subscription,
          hasGoogleAccount = appMeta && appMeta.has_google_subscription;

      if (hasPCDAccount && hasPCDAccountNumber) {
        return appMeta.pcd_account_number;
      } else if (hasAppleAccount) {
        return 'N/A (iTunes Subscription)';
      } else if (hasGoogleAccount) {
        return 'N/A (Android Subscription)';
      } else {
        return 'N/A';
      }
    }
  },
  created: function created() {
    var _this = this;

    this.appMeta = auth0.getAppMetadata();
    auth0.on('init login logout', function () {
      _this.appMeta = auth0.getAppMetadata();
    });
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"account-body"},[_c('div',{staticClass:"account-field"},[_c('div',{staticClass:"account-field-label"},[_vm._v("Your Plan")]),_vm._v(" "),_c('div',{staticClass:"account-field-value"},[_vm._v(_vm._s(_vm.planName))])]),_vm._v(" "),_c('div',{staticClass:"account-field"},[_c('div',{staticClass:"account-field-label"},[_vm._v("Account Number")]),_vm._v(" "),_c('div',{staticClass:"account-field-value"},[_vm._v(_vm._s(_vm.accountNumber))])]),_vm._v(" "),(_vm.hasPCDAccount)?_c('a',{staticClass:"account-link",attrs:{"href":"https://nym.pcdfusion.com/pcd/CustomerSupport/App/13277","target":"_blank"}},[_c('span',{staticClass:"account-link-text"},[_vm._v("Manage Plan")]),_vm._v(" "),_c('span',{staticClass:"account-link-icon",domProps:{"innerHTML":_vm._s(_vm.linkIcon)}})]):_vm._e(),_vm._v(" "),(_vm.hasPCDAccount)?_c('p',{staticClass:"account-input-help"},[_vm._v("* You will be prompted to enter your subscription information again")]):_vm._e(),_vm._v(" "),(_vm.hasPCDAccount)?_c('p',{staticClass:"account-message"},[_c('strong',[_vm._v("Need additional assistance?")]),_vm._v(" Call us at 1-800-678-0900.\n  ")]):_vm._e()])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-90c93d8e", __vue__options__)
  } else {
    hotAPI.reload("data-v-90c93d8e", __vue__options__)
  }
})()}}, {"7":7,"8":8,"10":10}];
