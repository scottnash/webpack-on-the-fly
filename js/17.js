window.modules["17"] = [function(require,module,exports){;(function(){
'use strict';

var provinces = require(19),
    countries = require(18)(),
    auth0 = require(7),
    linkAccount = require(4);

module.exports = {
  data: function data() {
    return {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      states: provinces.filter(function (p) {
        return ['US', 'CA'].includes(p.country);
      }).sort(function (a, b) {
        return a.name > b.name;
      }),
      postalCode: '',
      country: '',
      countries: countries.getData(),
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
    lookupAddress: function lookupAddress() {
      var _this = this;

      this.isSubmitting = true;
      this.$emit('load', true);
      return linkAccount({
        id: auth0.getUserID(),
        type: 'address',
        firstName: this.firstName.trim(),
        lastName: this.lastName.trim(),
        address: this.address.trim(),
        city: this.city.trim(),
        state: this.state,
        postalCode: this.postalCode.trim(),
        country: this.country
      }).then(function () {
        return auth0.refresh();
      }).then(function () {
        _this.isSubmitting = false;
        _this.success = true;
      }).catch(function (err) {
        console.error(err);
        _this.isSubmitting = false;
        _this.error = "We couldn't find a subscription that matched that mailing address. \n            If you're having issues linking your account please contact customer service.";
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
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('modal',{attrs:{"showCloseButton":_vm.viewState === 'error'}},[(_vm.viewState === 'initial')?_c('h3',{staticClass:"account-modal-header",attrs:{"slot":"header"},slot:"header"},[_vm._v("Link Your Subscription")]):_vm._e(),_vm._v(" "),_c('template',{slot:"body"},[(_vm.viewState === 'initial')?_c('form',{staticClass:"account-modal-form",on:{"submit":function($event){$event.stopPropagation();$event.preventDefault();return _vm.lookupAddress($event)}}},[_c('div',{staticClass:"account-modal-input account-modal-input-short"},[_c('label',{staticClass:"account-modal-input-label"},[_c('span',{staticClass:"account-modal-input-label-text"},[_vm._v("First Name")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.firstName),expression:"firstName"}],staticClass:"account-modal-input-value",attrs:{"required":"","type":"text"},domProps:{"value":(_vm.firstName)},on:{"input":function($event){if($event.target.composing){ return; }_vm.firstName=$event.target.value}}})])]),_vm._v(" "),_c('div',{staticClass:"account-modal-input account-modal-input-short"},[_c('label',{staticClass:"account-modal-input-label"},[_c('span',{staticClass:"account-modal-input-label-text"},[_vm._v("Last Name")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.lastName),expression:"lastName"}],staticClass:"account-modal-input-value",attrs:{"required":"","type":"text"},domProps:{"value":(_vm.lastName)},on:{"input":function($event){if($event.target.composing){ return; }_vm.lastName=$event.target.value}}})])]),_vm._v(" "),_c('div',{staticClass:"account-modal-input"},[_c('label',{staticClass:"account-modal-input-label"},[_c('span',{staticClass:"account-modal-input-label-text"},[_vm._v("Address")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.address),expression:"address"}],staticClass:"account-modal-input-value",attrs:{"required":"","type":"text"},domProps:{"value":(_vm.address)},on:{"input":function($event){if($event.target.composing){ return; }_vm.address=$event.target.value}}})])]),_vm._v(" "),_c('div',{staticClass:"account-modal-input"},[_c('label',{staticClass:"account-modal-input-label"},[_c('span',{staticClass:"account-modal-input-label-text"},[_vm._v("City")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.city),expression:"city"}],staticClass:"account-modal-input-value",attrs:{"required":"","type":"text"},domProps:{"value":(_vm.city)},on:{"input":function($event){if($event.target.composing){ return; }_vm.city=$event.target.value}}})])]),_vm._v(" "),_c('div',{staticClass:"account-modal-input"},[_c('label',{staticClass:"account-modal-input-label"},[_c('span',{staticClass:"account-modal-input-label-text"},[_vm._v("State or Province")]),_vm._v(" "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.state),expression:"state"}],staticClass:"account-modal-input-value",attrs:{"required":""},on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.state=$event.target.multiple ? $$selectedVal : $$selectedVal[0]}}},[_vm._l((_vm.states),function(stateOption,index){return _c('option',{domProps:{"value":stateOption.short}},[_vm._v(_vm._s(stateOption.name))])}),_vm._v(" "),_c('option',{attrs:{"value":"NA"}},[_vm._v("Other")])],2)])]),_vm._v(" "),_c('div',{staticClass:"account-modal-input account-modal-input-short"},[_c('label',{staticClass:"account-modal-input-label"},[_c('span',{staticClass:"account-modal-input-label-text"},[_vm._v("Postal Code")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.postalCode),expression:"postalCode"}],staticClass:"account-modal-input-value",attrs:{"required":"","type":"text"},domProps:{"value":(_vm.postalCode)},on:{"input":function($event){if($event.target.composing){ return; }_vm.postalCode=$event.target.value}}})])]),_vm._v(" "),_c('div',{staticClass:"account-modal-input account-modal-input-short"},[_c('label',{staticClass:"account-modal-input-label"},[_c('span',{staticClass:"account-modal-input-label-text"},[_vm._v("Country")]),_vm._v(" "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.country),expression:"country"}],staticClass:"account-modal-input-value",attrs:{"required":""},on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.country=$event.target.multiple ? $$selectedVal : $$selectedVal[0]}}},_vm._l((_vm.countries),function(countryOption,index){return _c('option',{domProps:{"value":countryOption.code}},[_vm._v(_vm._s(countryOption.name))])}),0)])]),_vm._v(" "),_c('div',{staticClass:"account-modal-buttons"},[_c('button',{staticClass:"account-button-filled",attrs:{"type":"submit","disabled":_vm.isSubmitting}},[_vm._v("Save")]),_vm._v(" "),_c('button',{staticClass:"account-button-outlined",attrs:{"type":"button"},on:{"click":function($event){_vm.$emit('close')}}},[_vm._v("Cancel")])])]):_vm._e(),_vm._v(" "),(_vm.viewState === 'error')?_c('p',{staticClass:"account-modal-error-text",attrs:{"slot":"body"},slot:"body"},[_vm._v(_vm._s(_vm.error))]):_vm._e(),_vm._v(" "),(_vm.viewState === 'success')?_c('template',{slot:"body"},[_c('p',{staticClass:"account-modal-success-text"},[_vm._v("Your account has been linked")]),_vm._v(" "),_c('button',{staticClass:"account-button-filled account-button-wide",attrs:{"type":"button"},on:{"click":function($event){_vm.$emit('close')}}},[_vm._v("Done")])]):_vm._e(),_vm._v(" "),(_vm.viewState === 'loading')?_c('template',{slot:"body"},[_c('vue-simple-spinner',{staticClass:"account-spinner-overlay",attrs:{"size":"big","line-fg-color":"#e53c31"}})],1):_vm._e()],2)],2)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-25bc4121", __vue__options__)
  } else {
    hotAPI.reload("data-v-25bc4121", __vue__options__)
  }
})()}}, {"4":4,"7":7,"8":8,"10":10,"15":15,"18":18,"19":19}];
