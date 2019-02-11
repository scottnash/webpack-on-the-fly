window.modules["21"] = [function(require,module,exports){;(function(){
'use strict';

var auth0 = require(7);

module.exports = {
  data: function data() {
    return {
      success: false,
      error: ''
    };
  },
  computed: {
    viewState: function viewState() {
      if (this.success) {
        return 'success';
      }

      if (this.error) {
        return 'error';
      }

      return 'initial';
    },
    email: function email() {
      return auth0.getEmail() || 'nowhere';
    }
  },
  methods: {
    resetPassword: function resetPassword() {
      var _this = this;

      return auth0.triggerPasswordReset(this.email).then(function () {
        return _this.success = true;
      }).catch(function (err) {
        return _this.error = String(err);
      });
    }
  },
  components: {
    modal: require(15)
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('modal',{attrs:{"showCloseButton":true}},[(_vm.viewState === 'initial')?[_c('h3',{staticClass:"account-modal-header",attrs:{"slot":"header"},slot:"header"},[_vm._v("Reset Your Password")]),_vm._v(" "),_c('template',{slot:"body"},[_c('p',{staticClass:"account-modal-text"},[_vm._v("Are you sure you want to reset your password? We will email a password reset link to "+_vm._s(_vm.email)+".")]),_vm._v(" "),_c('div',{staticClass:"account-modal-buttons"},[_c('button',{staticClass:"account-button-filled",attrs:{"type":"submit"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.resetPassword($event)}}},[_vm._v("Confirm")]),_vm._v(" "),_c('button',{staticClass:"account-button-outlined",attrs:{"type":"button"},on:{"click":function($event){_vm.$emit('close')}}},[_vm._v("Cancel")])])])]:_vm._e(),_vm._v(" "),(_vm.viewState === 'error')?[_c('p',{staticClass:"account-modal-error-text",attrs:{"slot":"body"},slot:"body"},[_vm._v(_vm._s(_vm.error))]),_vm._v(" "),_c('template',{slot:"dismiss"},[_c('button',{staticClass:"account-modal-close",attrs:{"type":"button"},domProps:{"innerHTML":_vm._s(_vm.closeIcon)},on:{"click":function($event){_vm.$emit('close')}}})])]:_vm._e(),_vm._v(" "),(_vm.viewState === 'success')?_c('template',{slot:"body"},[_c('p',{staticClass:"account-modal-success-text"},[_vm._v("An email has been sent to "+_vm._s(_vm.email)+" with instructions to update your password.")]),_vm._v(" "),_c('button',{staticClass:"account-button-filled account-button-wide",attrs:{"type":"button"},on:{"click":function($event){_vm.$emit('close')}}},[_vm._v("Done")])]):_vm._e()],2)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-46511a6e", __vue__options__)
  } else {
    hotAPI.reload("data-v-46511a6e", __vue__options__)
  }
})()}}, {"7":7,"8":8,"10":10,"15":15}];
