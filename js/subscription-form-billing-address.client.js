window.modules["subscription-form-billing-address.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _omit = require(121),
    _every = require(93),
    _includes = require(33);

DS.controller('subscription-form-billing-address', [function () {
  /**
   * These regex|lengths are used to validate form against TCS API endpoint.
   */
  var maxAddressLength = 27,
      maxNameLength = 27,
      maxCityNameLength = 20,
      maxEmailLength = 50,
      maxStateNameLength = 20,
      zipCodeRE = /^\d{5}$/,
      postalCodeRE = /^\w{3}\s\w{3}$/,
      nameRE = /^[-'a-zA-Z ]+$/,
      cityRE = /\w{3}/,
      canadianPostalCodeRE = /.{1,3}/g,

  /*
   * @Note (c.g. 2018-02-06) email regex adapted from: http://emailregex.com/
   */
  emailRE = /^(?:(?:[^<>()\[\]\\.,;:\s@"]+(?:\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  /**
   * Checks if a number matches certain range
   * @param  {Integer} value - The value to be validated
   * @param  {Integer} minimum
   * @param  {Integer} maximum
   * @return {boolean} true if the value is between a range of numbers
   */

  function isValidRange(value, minimum, maximum) {
    return value > minimum && value <= maximum;
  }
  /**
   * Validates name field value
   * @param {string} str - firstname input string
   * @return {boolean} true if input is not empty
   */


  function isValidName(str) {
    return str.length && str.length <= maxNameLength && nameRE.test(str);
  }
  /**
   * Validates address input field value
   * @param {string} str - address1 or address2 input string
   * @return {boolean} true if address is shorter or equal than 27 characters
   */


  function isValidAddress(str) {
    return isValidRange(str.length, 0, maxAddressLength);
  }
  /**
   * Validates city input field value
   * @param {string} str - city input string
   * @return {boolean} true if city field has value and
   *  it's shorter or equal than 20 characters
   */


  function isValidCity(str) {
    return isValidRange(str.length, 0, maxCityNameLength) && cityRE.test(str);
  }
  /**
   * Validates state select field
   * @param {string} str - state selected value
   * @return {boolean} true if state has a value and
   * it's shorter or equal than 20 characters
   */


  function isValidState(str) {
    return isValidRange(str.length, 0, maxStateNameLength);
  }

  function isValidPostalCode(str) {
    return postalCodeRE.test(str);
  }
  /**
   * Validates input zip code value
   * @param {string} str - zip code input value
   * @return {boolean} true if zip code matches the regexp
   * e.g.: 33122 or  33195-6503
   */


  function isValidZipCode(str) {
    return zipCodeRE.test(str);
  }
  /**
   * Validates input email value
   * @param {string} str - email input value
   * @return {boolean} true if email has value and
   * it's shorter or equal than 50 characters and
   * matches the regex above
   */


  function isValidEmail(str) {
    return isValidRange(str.length, 0, maxEmailLength) && emailRE.test(str);
  }

  function getLocationFields(formType) {
    switch (formType) {
      case 'CA':
        {
          return {
            province: false,
            postalCode: false
          };
        }

      case 'INT':
        {
          return {
            country: false
          };
        }

      default:
        {
          return {
            state: false
          };
        }
    }
  }

  function Constructor(el) {
    this.billingForm = el;
    this.body = document.body;
    this.submitButton = this.body.querySelector('.submit-button');
    this.formType = this.billingForm.dataset.formType;
    this.postalCodeInput = this.billingForm.querySelector('.billing-address-postalCode input');
    this.errorClass = 'error';
    this.formErrorBillingAddress = 'form-error-billing-address';
    this.optionalFields = ['address2'];
    this.formFieldStatus = {
      firstName: false,
      lastName: false,
      address1: false,
      city: false,
      email: false
    };
    Object.assign(this.formFieldStatus, getLocationFields(this.formType));
    this.submitButton.disabled = true;
    this.body.classList.add(this.formErrorBillingAddress);
    this.billingForm.addEventListener('validate', function () {
      return this.isFormValid();
    }.bind(this));
  }

  Constructor.prototype = {
    events: {
      'input[name="firstName"] blur': 'validateField',
      'input[name="lastName"] blur': 'validateField',
      'input[name="address1"] blur': 'validateField',
      'input[name="address2"] blur': 'validateField',
      'input[name="city"] blur': 'validateField',
      'select[name="state"] change': 'validateField',
      'select[name="province"] change': 'validateField',
      'input[name="zipCode"] blur': 'handleZipCodeValidation',
      'input[name="postalCode"] blur': 'validateField',
      'input[name="email"] blur': 'validateField',
      'select[name="country"] blur': 'validateField',
      'input[name="firstName"] keyup': 'validateOnKeyPress',
      'input[name="lastName"] keyup': 'validateOnKeyPress',
      'input[name="address1"] keyup': 'validateOnKeyPress',
      'input[name="address2"] keyup': 'validateOnKeyPress',
      'input[name="city"] keyup': 'validateOnKeyPress',
      'input[name="zipCode"] keyup': 'handleKeyPressZipCodeValidation',
      'input[name="postalCode"] keyup': 'validateOnKeyPress',
      'input[name="postalCode"] keydown': 'handleCanadianPostalCodeFormat',
      'input[name="email"] keyup': 'validateOnKeyPress'
    },
    toggleError: function toggleError(isValid, parentNode, styleClass) {
      var addOrRemove = isValid ? 'remove' : 'add';
      styleClass = styleClass || this.errorClass;
      parentNode.classList[addOrRemove](styleClass);
    },
    getValidator: function getValidator(fieldName) {
      var validators = {
        firstName: isValidName,
        lastName: isValidName,
        address1: isValidAddress,
        address2: isValidAddress,
        city: isValidCity,
        state: isValidState,
        postalCode: isValidPostalCode,
        province: isValidState,
        country: isValidState,
        email: isValidEmail
      };
      return validators[fieldName] ? validators[fieldName] : null;
    },
    validateField: function validateField(evt) {
      var node = evt.target,
          fieldName = node.getAttribute('name'),
          parentNode = dom.closest(node, 'fieldset'),
          validator = this.getValidator(fieldName),
          value = (node.value || '').trim(),
          isOptional = this.isFieldOptional(fieldName, value),
          isValid = validator ? validator(value || '') : null,
          shouldHideError = !value && isOptional ? true : isValid;

      if (!isOptional) {
        this.formFieldStatus[fieldName] = isValid;
      } else {
        this.formFieldStatus = _omit(this.formFieldStatus, fieldName);
      }

      this.toggleError(shouldHideError, parentNode);
      this.isFormValid();
    },
    validateOnKeyPress: function validateOnKeyPress(evt) {
      var parentNode = dom.closest(evt.target, 'fieldset'),
          error = parentNode.querySelector('.error-message'),
          generalError = dom.find('.general-error-container'),
          customError = parentNode.querySelector('.custom-error-message');
      error.classList.remove('hidden');
      generalError.classList.remove('error');
      customError.classList.add('hidden');

      if (parentNode.classList.contains(this.errorClass)) {
        this.validateField(evt);
      }
    },
    handleZipCodeValidation: function handleZipCodeValidation(evt) {
      var value = (evt.target.value || '').trim(),
          isValid = isValidZipCode(value),
          parentNode = dom.closest(evt.target, 'fieldset');
      this.toggleError(value, parentNode, 'empty');
      this.toggleError(isValid, parentNode);
      this.formFieldStatus.zipCode = isValid;
      this.isFormValid();
    },

    /*
     * KeyPress validation
     * These functions just recheck if input is valid when the user
     * is reentering information right after an error on certain field
     */
    handleKeyPressZipCodeValidation: function handleKeyPressZipCodeValidation(evt) {
      var isValid = false;
      var parentNode = dom.closest(evt.target, 'fieldset'),
          value = (evt.target.value || '').trim();

      if ((parentNode.classList.contains('empty') || parentNode.classList.contains(this.errorClass)) && value.length >= 5) {
        isValid = isValidZipCode(value || '');
        this.toggleError(value, parentNode, 'empty');
        this.toggleError(isValid, parentNode);
      }
    },
    isFormValid: function isFormValid() {
      var allFormsValid = _every(this.formFieldStatus),
          method = allFormsValid ? 'remove' : 'add';

      this.body.classList[method](this.formErrorBillingAddress);
      this.enableSubmit();
    },
    enableSubmit: function enableSubmit() {
      this.submitButton.disabled = _includes(this.body.className, 'form-error');
    },
    isFieldOptional: function isFieldOptional(fieldName, value) {
      return _includes(this.optionalFields, fieldName) && !value.length;
    },
    handleCanadianPostalCodeFormat: function handleCanadianPostalCodeFormat(e) {
      if (this.formType === 'CA') {
        var postalCodeValue = e.target.value.replace(' ', '');
        this.postalCodeInput.value = postalCodeValue.length ? postalCodeValue.match(canadianPostalCodeRE).join(' ') : postalCodeValue;
      }
    }
  };
  return Constructor;
}]);
}, {"1":1,"33":33,"93":93,"121":121}];
