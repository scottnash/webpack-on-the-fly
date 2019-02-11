window.modules["11"] = [function(require,module,exports){;(function(){
'use strict';

var auth0 = require(7);

module.exports = {
  methods: {
    openLogin: function openLogin() {
      auth0.showLogin();
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"account-body"},[_c('p',{staticClass:"account-message"},[_vm._v("Please log in to view your account details or link an existing digital or print subscription.")]),_vm._v(" "),_c('button',{staticClass:"account-button-filled account-button-wide",attrs:{"type":"button"},on:{"click":function($event){$event.stopPropagation();return _vm.openLogin($event)}}},[_vm._v("Log In / Create Account")])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-49f0fe64", __vue__options__)
  } else {
    hotAPI.reload("data-v-49f0fe64", __vue__options__)
  }
})()}}, {"7":7,"8":8,"10":10}];
