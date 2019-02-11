window.modules["15"] = [function(require,module,exports){;(function(){
'use strict';

module.exports = {
  props: {
    showCloseButton: Boolean
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"account-modal-overlay"},[_c('div',{staticClass:"account-modal"},[(_vm.showCloseButton)?_c('button',{staticClass:"account-modal-close",attrs:{"type":"button"},on:{"click":function($event){_vm.$parent.$emit('close')}}},[_c('svg',{attrs:{"width":"18","height":"18","viewBox":"0 0 18 18","xmlns":"http://www.w3.org/2000/svg"}},[_c('title',[_vm._v("Combined Shape")]),_vm._v(" "),_c('path',{attrs:{"d":"M9 7.78L16.78 0 18 1.22 10.22 9 18 16.78 16.78 18 9 10.22 1.22 18 0 16.78 7.78 9 0 1.22 1.22 0 9 7.78z","fill":"#000","fill-rule":"nonzero"}})])]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"account-modal-body"},[_vm._t("header"),_vm._v(" "),_vm._t("body")],2)])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7a536bdc", __vue__options__)
  } else {
    hotAPI.reload("data-v-7a536bdc", __vue__options__)
  }
})()}}, {"8":8,"10":10}];
