window.modules["13"] = [function(require,module,exports){;(function(){
'use strict';

var auth0 = require(7);

module.exports = {
  props: {
    editIcon: {
      type: String,
      required: true
    }
  },
  data: function data() {
    return {
      email: '',
      username: '',
      modal: ''
    };
  },
  methods: {
    openModal: function openModal() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      this.modal = name;
    },
    closeModal: function closeModal() {
      this.modal = '';
    }
  },
  created: function created() {
    var _this = this;

    var email = auth0.getEmail(),
        username = auth0.getUserMetadata() && auth0.getUserMetadata().username;
    this.email = email || '';
    this.username = username || '';
    auth0.on('init login logout', function () {
      _this.email = auth0.getEmail();
      _this.username = auth0.getUserMetadata() && auth0.getUserMetadata().username;
    });
  },
  components: {
    password: require(21)
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"account-body"},[_c('div',{staticClass:"account-field"},[_c('div',{staticClass:"account-field-label"},[_vm._v("Email")]),_vm._v(" "),_c('div',{staticClass:"account-field-value"},[_vm._v(_vm._s(_vm.email))])]),_vm._v(" "),_c('div',{staticClass:"account-field"},[_c('div',{staticClass:"account-field-label"},[_vm._v("Password")]),_vm._v(" "),_c('div',{staticClass:"account-field-value"},[_vm._v("**********")]),_vm._v(" "),_c('a',{staticClass:"account-field-edit",on:{"click":function($event){_vm.openModal('password')}}},[_c('span',{staticClass:"account-field-edit-logo",domProps:{"innerHTML":_vm._s(_vm.editIcon)}}),_vm._v(" "),_c('span',{staticClass:"account-field-edit-text"},[_vm._v("Reset")])])]),_vm._v(" "),_c('div',{staticClass:"account-field account-field-username"},[_c('div',{staticClass:"account-field-label"},[_vm._v("Username")]),_vm._v(" "),_c('div',{staticClass:"account-field-value"},[_vm._v(_vm._s(_vm.username))])]),_vm._v(" "),_c('transition',{attrs:{"name":"fade"}},[(_vm.modal==='password')?_c('password',{attrs:{"close":_vm.closeModal,"closeIcon":_vm.closeIcon},on:{"close":_vm.closeModal}}):_vm._e()],1)],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-32575bce", __vue__options__)
  } else {
    hotAPI.reload("data-v-32575bce", __vue__options__)
  }
})()}}, {"7":7,"8":8,"10":10,"21":21}];
