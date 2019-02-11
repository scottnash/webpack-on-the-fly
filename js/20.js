window.modules["20"] = [function(require,module,exports){;(function(){
'use strict';

module.exports = {
  props: {
    appStoreInstructions: {
      type: String,
      required: true
    }
  },
  components: {
    modal: require(15)
  },
  methods: {
    alertClose: function alertClose() {
      console.log('close');
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('modal',{attrs:{"showCloseButton":true}},[_c('h3',{staticClass:"account-modal-header",attrs:{"slot":"header"},slot:"header"},[_vm._v("Instructions for App Store Purchases")]),_vm._v(" "),_c('template',{slot:"body"},[_c('span',{staticClass:"account-modal-text",domProps:{"innerHTML":_vm._s(_vm.appStoreInstructions)}})])],2)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0e63790e", __vue__options__)
  } else {
    hotAPI.reload("data-v-0e63790e", __vue__options__)
  }
})()}}, {"8":8,"10":10,"15":15}];
