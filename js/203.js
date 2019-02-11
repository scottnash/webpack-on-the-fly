window.modules["203"] = [function(require,module,exports){;(function(){
"use strict";

var store = require(197);

module.exports = {
  computed: {
    errorMessage: function errorMessage() {
      return store.state.errorMessage;
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.errorMessage)?_c('div',{staticClass:"subscription-form-error"},[_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.errorMessage))])]):_vm._e()}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6621a6e2", __vue__options__)
  } else {
    hotAPI.reload("data-v-6621a6e2", __vue__options__)
  }
})()}}, {"8":8,"10":10,"197":197}];
