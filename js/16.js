window.modules["16"] = [function(require,module,exports){;(function(){
'use strict';

var auth0 = require(7),
    linkAccount = require(4),
    VueSimpleSpinner = require(9);

module.exports = {
  props: {
    exampleImage: {
      type: String,
      required: true
    }
  },
  data: function data() {
    return {
      accountNumber: '',
      isSubmitting: false,
      error: '',
      success: false
    };
  },
  computed: {
    viewState: function viewState() {
      if (this.error) {
        return 'error';
      }

      if (this.success) {
        return 'success';
      }

      if (this.isSubmitting) {
        return 'loading';
      }

      return 'initial';
    }
  },
  methods: {
    lookupAccountNumber: function lookupAccountNumber() {
      var _this = this;

      this.isSubmitting = true;
      return linkAccount({
        id: auth0.getUserID(),
        type: 'account',
        account: this.accountNumber.trim()
      }).then(function () {
        return auth0.refresh();
      }).then(function () {
        _this.isSubmitting = false;
        _this.success = true;
      }).catch(function () {
        _this.isSubmitting = false;
        _this.error = "We couldn't find a subscription that matched that account number. \n            If you're having issues linking your account please contact customer service.";
      });
    }
  },
  components: {
    modal: require(15),
    VueSimpleSpinner: VueSimpleSpinner
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('modal',{attrs:{"showCloseButton":_vm.viewState === 'error'}},[(_vm.viewState === 'initial')?_c('h3',{staticClass:"account-modal-header",attrs:{"slot":"header"},slot:"header"},[_vm._v("Link Your Subscription")]):_vm._e(),_vm._v(" "),_c('template',{slot:"body"},[(_vm.viewState === 'initial')?_c('form',{staticClass:"account-modal-form",on:{"submit":function($event){$event.stopPropagation();$event.preventDefault();return _vm.lookupAccountNumber($event)}}},[_c('div',{staticClass:"account-modal-input"},[_c('label',{staticClass:"account-modal-input-label"},[_c('span',{staticClass:"account-modal-input-label-text"},[_vm._v("Account Number")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.accountNumber),expression:"accountNumber"}],staticClass:"account-modal-input-value",attrs:{"required":"","type":"text"},domProps:{"value":(_vm.accountNumber)},on:{"input":function($event){if($event.target.composing){ return; }_vm.accountNumber=$event.target.value}}})])]),_vm._v(" "),_c('div',{staticClass:"account-modal-buttons"},[_c('button',{staticClass:"account-button-filled",attrs:{"type":"submit","disabled":_vm.isSubmitting}},[_vm._v("Save")]),_vm._v(" "),_c('button',{staticClass:"account-button-outlined",attrs:{"type":"button"},on:{"click":function($event){_vm.$emit('close')}}},[_vm._v("Cancel")])]),_vm._v(" "),_c('div',{staticClass:"account-modal-example"},[_c('p',{staticClass:"account-modal-example-text"},[_vm._v("Your 9-digit account number can be found on your subscription label.")]),_vm._v(" "),_c('img',{staticClass:"account-modal-example-image",attrs:{"src":_vm.exampleImage,"alt":"Example subscription label"}})])]):_vm._e(),_vm._v(" "),(_vm.viewState === 'error')?_c('p',{staticClass:"account-modal-error-text"},[_vm._v(_vm._s(_vm.error))]):_vm._e(),_vm._v(" "),(_vm.viewState === 'success')?[_c('p',{staticClass:"account-modal-success-text"},[_vm._v("Your account has been linked")]),_vm._v(" "),_c('button',{staticClass:"account-button-filled account-button-wide",attrs:{"type":"button"},on:{"click":function($event){_vm.$emit('close')}}},[_vm._v("Done")])]:_vm._e(),_vm._v(" "),(_vm.viewState === 'loading')?[_c('vue-simple-spinner',{staticClass:"account-spinner-overlay",attrs:{"size":"big","line-fg-color":"#e53c31"}})]:_vm._e()],2)],2)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-03e1d0d2", __vue__options__)
  } else {
    hotAPI.reload("data-v-03e1d0d2", __vue__options__)
  }
})()}}, {"4":4,"7":7,"8":8,"9":9,"10":10,"15":15}];
