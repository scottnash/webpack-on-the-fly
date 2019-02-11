window.modules["2"] = [function(require,module,exports){;(function(){
'use strict';

var VueSimpleSpinner = require(9),
    auth0 = require(7),
    profile = require(13),
    login = require(11),
    manageSubscriptions = require(12),
    subscribe = require(14);

module.exports = {
  data: function data() {
    return {
      isLoading: true,
      isAuthenticated: false,
      isSubscriber: false
    };
  },
  created: function created() {
    var _this = this;

    auth0.on('init login logout refresh', function () {
      _this.isAuthenticated = auth0.isAuthenticated();
      _this.isSubscriber = auth0.isSubscriber();
      _this.isLoading = false;
    });
  },
  components: {
    VueSimpleSpinner: VueSimpleSpinner,
    profile: profile,
    login: login,
    'manage-subscriptions': manageSubscriptions,
    subscribe: subscribe
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"account-inner"},[(!_vm.isLoading)?_c('section',{staticClass:"account-section"},[(_vm.isAuthenticated)?_c('header',{staticClass:"account-header"},[_vm._v("Profile")]):_vm._e(),_vm._v(" "),(_vm.isAuthenticated)?_c('profile',{attrs:{"editIcon":_vm.$options.editIcon}}):_vm._e(),_vm._v(" "),(!_vm.isAuthenticated)?_c('header',{staticClass:"account-header"},[_vm._v("Account")]):_vm._e(),_vm._v(" "),(!_vm.isAuthenticated)?_c('login'):_vm._e()],1):_vm._e(),_vm._v(" "),(!_vm.isLoading && _vm.isAuthenticated)?_c('section',{staticClass:"account-section"},[_c('header',{staticClass:"account-header"},[_vm._v("Subscription")]),_vm._v(" "),(_vm.isSubscriber)?_c('manage-subscriptions',{attrs:{"linkIcon":_vm.$options.linkIcon}}):_vm._e(),_vm._v(" "),(!_vm.isSubscriber)?_c('subscribe',{attrs:{"linkIcon":_vm.$options.linkIcon,"exampleImage":_vm.$options.exampleImage,"appStoreInstructions":_vm.$options.appStoreInstructions}}):_vm._e()],1):_vm._e(),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isLoading),expression:"isLoading"}],staticClass:"account-spinner-overlay"},[_c('vue-simple-spinner',{attrs:{"size":"big","line-fg-color":"#e53c31"}})],1)])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5b607a52", __vue__options__)
  } else {
    hotAPI.reload("data-v-5b607a52", __vue__options__)
  }
})()}}, {"7":7,"8":8,"9":9,"10":10,"11":11,"12":12,"13":13,"14":14}];
