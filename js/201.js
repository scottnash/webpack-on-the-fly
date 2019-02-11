window.modules["201"] = [function(require,module,exports){;(function(){
'use strict';

var store = require(197),
    gtmUtils = require(198),
    _every = require(93),
    _assign = require(57),
    _reduce = require(124),
    _set = require(87),
    _require = require(91),
    fullToAbbreviation = _require.fullToAbbreviation,
    statesToArray = _require.statesToArray,
    _require2 = require(205),
    canadaProvinces = _require2.canadaProvinces,
    countries = _require2.countries,
    fields = ['email', 'firstName', 'lastName', 'address1', 'address2', 'city', 'state', 'zipCode', 'postalCode', 'province', 'country'],
    pcdValidate = {
  name: function name(str) {
    var nameRE = /^[-'a-zA-Z ]+$/,
        maxNameLength = 27;

    if (str.length && str.length <= maxNameLength && nameRE.test(str)) {
      return true;
    } else {
      throw new Error('Please enter a valid name');
    }
  },
  address: function address(str) {
    var exp = new RegExp('[`,~!@\$%\^&\*\(\)_\+=\\[\\]\\\\{\}\|\/]'),
        maxAddressLength = 27,
        passesRegexp = !exp.test(str),
        passesAddressLength = isValidRange(str.length, 0, maxAddressLength);

    if (!passesRegexp) {
      throw new Error('Please enter a street address without special characters');
    } else if (!passesAddressLength) {
      throw new Error('Address is too long');
    } else if (!str) {
      throw new Error('Please enter a street address');
    }

    return true;
  },
  city: function city(str) {
    var cityRE = /\w{3}/,
        maxCityNameLength = 20;

    if (isValidRange(str.length, 0, maxCityNameLength) && cityRE.test(str)) {
      return true;
    } else {
      throw new Error('Please enter a valid city name');
    }
  },
  state: function state(str) {
    if (!!str) {
      return true;
    } else {
      throw new Error('Please make a selection');
    }
  },
  zipcode: function zipcode(str) {
    var zipCodeRE = /^\d{5}$/;

    if (zipCodeRE.test(str)) {
      return true;
    } else {
      throw new Error('Please enter a valid five-digit ZIP code');
    }

    ;
  },
  postalCode: function postalCode(str) {
    var postalCodeRE = /^\w{3}\s\w{3}$/;

    if (postalCodeRE.test(str)) {
      return true;
    } else {
      throw new Error('Please enter a valid six-character postal code');
    }

    ;
  },
  intCode: function intCode(str) {
    return true;
  },
  email: function email(str) {
    var emailRE = /^(?:(?:[^<>()\[\]\\.,;:\s@"]+(?:\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        maxEmailLength = 50;

    if (isValidRange(str.length, 0, maxEmailLength) && emailRE.test(str)) {
      return true;
    } else {
      throw new Error('Please enter a valid email address');
    }

    ;
  }
};

var hasSentCheckoutEvent = false;

function isValidRange(value, minimum, maximum) {
  return value > minimum && value <= maximum;
}

function getValidator(field, locale) {
  var validators = {
    firstName: pcdValidate.name,
    lastName: pcdValidate.name,
    address1: pcdValidate.address,
    address2: pcdValidate.address,
    city: pcdValidate.city,
    state: pcdValidate.state,
    zipCode: pcdValidate.zipcode,
    postalCode: locale === 'int' ? pcdValidate.intCode : pcdValidate.postalCode,
    province: pcdValidate.state,
    country: pcdValidate.state,
    email: pcdValidate.email
  };
  return validators[field] ? validators[field] : null;
}

module.exports = {
  data: function data() {
    var formFields = _reduce(fields, function (acc, val, key) {
      return _set(acc, val, '');
    }, {}),
        showErrorState = _reduce(fields, function (acc, val, key) {
      return _set(acc, val, false);
    }, {}),
        formErrors = _reduce(fields, function (acc, val, key) {
      return _set(acc, val, '');
    }, {});

    return _assign({
      usStates: statesToArray(),
      canadaProvinces: canadaProvinces,
      countries: countries,
      showErrorState: showErrorState,
      formErrors: formErrors
    }, formFields);
  },
  computed: {
    hasSubmitted: function hasSubmitted() {
      return store.state.hasSubmittedForm;
    },
    locale: function locale() {
      return store.state.locale;
    },
    showFormError: function showFormError() {
      var _this = this;

      return function (field) {
        return !!_this[field] && _this.showErrorState[field];
      };
    },
    typeIsUS: function typeIsUS() {
      return this.locale === 'us';
    },
    typeIsCA: function typeIsCA() {
      return this.locale === 'ca';
    },
    typeIsINT: function typeIsINT() {
      return this.locale === 'int';
    },
    fieldsToValidate: function fieldsToValidate() {
      switch (this.locale) {
        case 'us':
          return ['email', 'firstName', 'lastName', 'address1', 'city', 'state', 'zipCode'];

        case 'ca':
          return ['email', 'firstName', 'lastName', 'address1', 'city', 'province', 'postalCode'];

        case 'int':
          return ['email', 'firstName', 'lastName', 'address1', 'city', 'country'];

        default:
          return [];
      }
    },
    hasValidInputFields: function hasValidInputFields() {
      var _this2 = this;

      return this.fieldsToValidate.length && _every(this.fieldsToValidate, function (field) {
        return !_this2.formErrors[field];
      });
    },
    showEmailMessage: function showEmailMessage() {
      return !!store.state.includeAccountSetup;
    }
  },
  methods: {
    stateAbbreviation: function stateAbbreviation(state) {
      return fullToAbbreviation(state);
    },
    handlePostalCodeInput: function handlePostalCodeInput(evt) {
      var canadianPostalCodeRE = /.{1,3}/g;
      this.postalCode = this.postalCode.split(' ').join('');
      this.postalCode = this.postalCode.length ? this.postalCode.match(canadianPostalCodeRE).join(' ') : this.postalCode;
      this.validateField('postalCode');
    },
    validateField: function validateField(field) {
      var value = this[field],
          validator = getValidator(field, this.locale);
      var isValid, errorMessage;

      try {
        isValid = validator(value);
        this.formErrors[field] = '';
      } catch (error) {
        errorMessage = error.message;
        this.formErrors[field] = errorMessage;
        isValid = false;
      }

      store.actions.setAddressFormStatus(this.hasValidInputFields);

      if (isValid) {
        store.actions.setAddressField(field, value);
      }
    },
    clearError: function clearError(field) {
      this.showErrorState[field] = false;
    },
    evalError: function evalError(field) {
      this.showErrorState[field] = !!this.formErrors[field];
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    fields.forEach(function (field) {
      return _this3.validateField(field);
    });
  },
  watch: {
    hasValidInputFields: function hasValidInputFields(value) {
      var selectedTier;

      if (value && !hasSentCheckoutEvent) {
        selectedTier = store.getters.selectedTier();
        gtmUtils.trackCheckout(selectedTier, 1);
        hasSentCheckoutEvent = true;
      }
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"subscription-address-form"},[_c('span',{staticClass:"title",attrs:{"data-content":"formTitle"}},[_vm._v("Your Information")]),_vm._v(" "),_c('form',{staticClass:"subscription-form-content",attrs:{"autocomplete":"on"}},[_c('fieldset',{staticClass:"address-form-field full-width",class:{ error: _vm.showFormError('email') },attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"email"}},[_vm._v("Email address")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.email),expression:"email"}],staticClass:"address-form-input",attrs:{"type":"email","name":"email","autocomplete":"on","maxlength":""},domProps:{"value":(_vm.email)},on:{"focus":function($event){_vm.clearError('email')},"input":[function($event){if($event.target.composing){ return; }_vm.email=$event.target.value},function($event){_vm.validateField('email')}],"blur":function($event){_vm.evalError('email')}}}),_vm._v(" "),(_vm.showEmailMessage)?_c('p',{staticClass:"custom-message"},[_vm._v("\n          You'll use your email address to sign into all "),_c('i',[_vm._v("New York")]),_vm._v(" sites and apps. If this is a new \n          account, we'll ask you to set a password later.\n        ")]):_vm._e(),_vm._v(" "),_vm._m(0),_vm._v(" "),(_vm.showFormError('email'))?_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.formErrors.email))]):_vm._e()]),_vm._v(" "),_c('fieldset',{staticClass:"address-form-field half-width",class:{ error: _vm.showFormError('firstName') },attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"firstName"}},[_vm._v("First Name")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.firstName),expression:"firstName"}],staticClass:"address-form-input",attrs:{"type":"text","name":"firstName","autocomplete":"on","maxlength":""},domProps:{"value":(_vm.firstName)},on:{"focus":function($event){_vm.clearError('firstName')},"input":[function($event){if($event.target.composing){ return; }_vm.firstName=$event.target.value},function($event){_vm.validateField('firstName')}],"blur":function($event){_vm.evalError('firstName')}}}),_vm._v(" "),(_vm.showFormError('firstName'))?_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.formErrors.firstName))]):_vm._e()]),_vm._v(" "),_c('fieldset',{staticClass:"address-form-field half-width",class:{ error: _vm.showFormError('lastName') },attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"lastName"}},[_vm._v("Last Name")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.lastName),expression:"lastName"}],staticClass:"address-form-input",attrs:{"type":"text","name":"lastName","autocomplete":"on","maxlength":""},domProps:{"value":(_vm.lastName)},on:{"focus":function($event){_vm.clearError('lastName')},"input":[function($event){if($event.target.composing){ return; }_vm.lastName=$event.target.value},function($event){_vm.validateField('lastName')}],"blur":function($event){_vm.evalError('lastName')}}}),_vm._v(" "),(_vm.showFormError('lastName'))?_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.formErrors.lastName))]):_vm._e()]),_vm._v(" "),_c('fieldset',{staticClass:"address-form-field half-width",class:{ error: _vm.showFormError('address1') },attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"address1"}},[_vm._v("Address 1")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.address1),expression:"address1"}],staticClass:"address-form-input",attrs:{"type":"text","name":"address1","autocomplete":"on","maxlength":"27"},domProps:{"value":(_vm.address1)},on:{"focus":function($event){_vm.clearError('address1')},"input":[function($event){if($event.target.composing){ return; }_vm.address1=$event.target.value},function($event){_vm.validateField('address1')}],"blur":function($event){_vm.evalError('address1')}}}),_vm._v(" "),(_vm.showFormError('address1'))?_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.formErrors.address1))]):_vm._e()]),_vm._v(" "),_c('fieldset',{staticClass:"address-form-field half-width",class:{ error: _vm.showFormError('address2') },attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"address2"}},[_vm._v("Address 2")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.address2),expression:"address2"}],staticClass:"address-form-input",attrs:{"type":"text","name":"address2","placeholder":"Apartment, floor, suite ...","autocomplete":"on","maxlength":"27"},domProps:{"value":(_vm.address2)},on:{"focus":function($event){_vm.clearError('address2')},"input":[function($event){if($event.target.composing){ return; }_vm.address2=$event.target.value},function($event){_vm.validateField('address2')}],"blur":function($event){_vm.evalError('address2')}}}),_vm._v(" "),(_vm.showFormError('address2'))?_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.formErrors.address2))]):_vm._e()]),_vm._v(" "),_c('fieldset',{staticClass:"address-form-field half-width",class:{ error: _vm.showFormError('city') },attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"city"}},[_vm._v("City")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.city),expression:"city"}],staticClass:"address-form-input",attrs:{"type":"text","name":"city","autocomplete":"on","maxlength":"20"},domProps:{"value":(_vm.city)},on:{"focus":function($event){_vm.clearError('city')},"input":[function($event){if($event.target.composing){ return; }_vm.city=$event.target.value},function($event){_vm.validateField('city')}],"blur":function($event){_vm.evalError('city')}}}),_vm._v(" "),(_vm.showFormError('city'))?_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.formErrors.city))]):_vm._e()]),_vm._v(" "),(_vm.typeIsUS)?_c('fieldset',{staticClass:"address-form-field quarter-width",class:{ error: _vm.showFormError('state') },attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"state"}},[_vm._v("State")]),_vm._v(" "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.state),expression:"state"}],staticClass:"address-form-select",attrs:{"name":"state"},on:{"focus":function($event){_vm.clearError('state')},"change":[function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.state=$event.target.multiple ? $$selectedVal : $$selectedVal[0]},function($event){_vm.validateField('state')}],"blur":function($event){_vm.evalError('state')}}},[_c('option',{attrs:{"value":""}},[_vm._v("SELECT")]),_vm._v(" "),_vm._l((_vm.usStates),function(item){return _c('option',{key:item,domProps:{"value":item}},[_vm._v(_vm._s(item))])})],2),_vm._v(" "),(_vm.showFormError('state'))?_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.formErrors.state))]):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.typeIsCA)?_c('fieldset',{staticClass:"address-form-field quarter-width",class:{ error: _vm.showFormError('province') },attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"province"}},[_vm._v("Province")]),_vm._v(" "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.province),expression:"province"}],staticClass:"address-form-select",attrs:{"name":"province"},on:{"focus":function($event){_vm.clearError('province')},"change":[function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.province=$event.target.multiple ? $$selectedVal : $$selectedVal[0]},function($event){_vm.validateField('province')}],"blur":function($event){_vm.evalError('province')}}},[_c('option',{attrs:{"value":""}},[_vm._v("SELECT")]),_vm._v(" "),_vm._l((_vm.canadaProvinces),function(key){return _c('option',{key:key,domProps:{"value":key}},[_vm._v(_vm._s(key))])})],2),_vm._v(" "),(_vm.showFormError('province'))?_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.formErrors.province))]):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.typeIsINT)?_c('fieldset',{staticClass:"address-form-field quarter-width",class:{ error: _vm.showFormError(_vm.country) },attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"country"}},[_vm._v("Country")]),_vm._v(" "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.country),expression:"country"}],staticClass:"address-form-select",attrs:{"name":"country"},on:{"focus":function($event){_vm.clearError('country')},"change":[function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.country=$event.target.multiple ? $$selectedVal : $$selectedVal[0]},function($event){_vm.validateField('country')}],"blur":function($event){_vm.evalError('country')}}},[_c('option',{attrs:{"value":""}},[_vm._v("SELECT")]),_vm._v(" "),_vm._l((_vm.countries),function(item){return _c('option',{key:item,domProps:{"value":item}},[_vm._v(_vm._s(item))])})],2),_vm._v(" "),(_vm.showFormError('country'))?_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.formErrors.country))]):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.typeIsUS)?_c('fieldset',{staticClass:"address-form-field quarter-width",class:{ error: _vm.showFormError('zipCode') },attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"zipCode"}},[_vm._v("ZIP Code")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.zipCode),expression:"zipCode"}],staticClass:"address-form-input",attrs:{"type":"text","name":"zipCode","autocomplete":"on","maxlength":""},domProps:{"value":(_vm.zipCode)},on:{"focus":function($event){_vm.clearError('zipCode')},"input":[function($event){if($event.target.composing){ return; }_vm.zipCode=$event.target.value},function($event){_vm.validateField('zipCode')}],"blur":function($event){_vm.evalError('zipCode')}}}),_vm._v(" "),(_vm.showFormError('zipCode'))?_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.formErrors.zipCode))]):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.typeIsCA)?_c('fieldset',{staticClass:"address-form-field quarter-width",class:{ error: _vm.showFormError('postalCode') },attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"postalCode"}},[_vm._v("Postal Code")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.postalCode),expression:"postalCode"}],staticClass:"address-form-input postal-code-input",attrs:{"type":"text","name":"postalCode","autocomplete":"on","maxlength":""},domProps:{"value":(_vm.postalCode)},on:{"focus":function($event){_vm.clearError('postalCode')},"input":[function($event){if($event.target.composing){ return; }_vm.postalCode=$event.target.value},_vm.handlePostalCodeInput],"blur":function($event){_vm.evalError('postalCode')}}}),_vm._v(" "),(_vm.showFormError('postalCode'))?_c('span',{staticClass:"error-message"},[_vm._v(_vm._s(_vm.formErrors.postalCode))]):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.typeIsINT)?_c('fieldset',{staticClass:"address-form-field quarter-width",attrs:{"disabled":_vm.hasSubmitted}},[_c('label',{attrs:{"for":"postalCode"}},[_vm._v("Postal Code")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.postalCode),expression:"postalCode"}],staticClass:"address-form-input",attrs:{"type":"text","name":"postalCode","autocomplete":"on","maxlength":""},domProps:{"value":(_vm.postalCode)},on:{"focus":function($event){_vm.clearError('postalCode')},"input":[function($event){if($event.target.composing){ return; }_vm.postalCode=$event.target.value},function($event){_vm.validateField('postalCode')}],"blur":function($event){_vm.evalError('postalCode')}}})]):_vm._e()])])}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',{staticClass:"custom-message"},[_vm._v("\n          By submitting your email, you agree to our "),_c('a',{attrs:{"href":"http://nymag.com/newyork/terms/","rel":"noopener noreferrer","target":"_blank"}},[_vm._v("Terms")]),_vm._v(" and "),_c('a',{attrs:{"href":"http://nymag.com/newyork/privacy/","rel":"noopener noreferrer","target":"_blank"}},[_vm._v("Privacy Policy")]),_vm._v(" and to receive email correspondence from us.\n        ")])}]
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a275aa18", __vue__options__)
  } else {
    hotAPI.reload("data-v-a275aa18", __vue__options__)
  }
})()}}, {"8":8,"10":10,"57":57,"87":87,"91":91,"93":93,"124":124,"197":197,"198":198,"205":205}];
