window.modules["14"] = [function(require,module,exports){;(function(){
'use strict';

module.exports = {
  props: {
    linkIcon: {
      type: String,
      required: true
    },
    exampleImage: {
      type: String,
      required: true
    },
    appStoreInstructions: {
      type: String,
      required: true
    }
  },
  data: function data() {
    return {
      modal: ''
    };
  },
  methods: {
    closeModal: function closeModal() {
      this.modal = '';
      vendorRedirect('magplus-url');
    },
    openModal: function openModal() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      this.modal = name;
    }
  },
  components: {
    'account-number': require(16),
    'address-lookup': require(17),
    appstore: require(20)
  }
};

function vendorRedirect() {
  var queryParam = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var queryParams = window.URLSearchParams && new URLSearchParams(window.location.search),
      target = queryParams && queryParams.get(queryParam);

  if (target) {
    window.location.href = target;
  }
}
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"account-body"},[_c('a',{staticClass:"account-button-filled account-button-wide",attrs:{"href":"https://subs.nymag.com/magazine/subscribe/official-subscription.html","target":"_blank"}},[_vm._v("Subscribe Now!")]),_vm._v(" "),_vm._m(0),_vm._v(" "),_c('a',{staticClass:"account-link",on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.openModal('account-number')}}},[_c('span',{staticClass:"account-link-text"},[_vm._v("Use my account number")]),_vm._v(" "),_c('span',{staticClass:"account-link-icon",domProps:{"innerHTML":_vm._s(_vm.linkIcon)}})]),_vm._v(" "),_c('a',{staticClass:"account-link",on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.openModal('address-lookup')}}},[_c('span',{staticClass:"account-link-text"},[_vm._v("Use my mailing address")]),_vm._v(" "),_c('span',{staticClass:"account-link-icon",domProps:{"innerHTML":_vm._s(_vm.linkIcon)}})]),_vm._v(" "),_c('a',{staticClass:"account-link",on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.openModal('appstore')}}},[_c('span',{staticClass:"account-link-text"},[_vm._v("I purchased from iTunes or Google Play")]),_vm._v(" "),_c('span',{staticClass:"account-link-icon",domProps:{"innerHTML":_vm._s(_vm.linkIcon)}})]),_vm._v(" "),_c('transition',{attrs:{"name":"fade"}},[(_vm.modal==='account-number')?_c('account-number',{attrs:{"exampleImage":_vm.exampleImage},on:{"close":_vm.closeModal}}):_vm._e(),_vm._v(" "),(_vm.modal==='address-lookup')?_c('address-lookup',{on:{"close":_vm.closeModal}}):_vm._e(),_vm._v(" "),(_vm.modal==='appstore')?_c('appstore',{attrs:{"appStoreInstructions":_vm.appStoreInstructions},on:{"close":_vm.closeModal}}):_vm._e()],1)],1)}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',{staticClass:"account-message"},[_c('strong',[_vm._v("Already a subscriber?")]),_vm._v(" Link your current subscription for online access.\n  ")])}]
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-54c5b0a2", __vue__options__)
  } else {
    hotAPI.reload("data-v-54c5b0a2", __vue__options__)
  }
})()}}, {"8":8,"10":10,"16":16,"17":17,"20":20}];
