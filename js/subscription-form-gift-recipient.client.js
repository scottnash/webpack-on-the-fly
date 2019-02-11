window.modules["subscription-form-gift-recipient.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _last = require(24),
    _omit = require(121),
    _every = require(93),
    _isEmpty = require(75),
    _includes = require(33);

DS.controller('subscription-form-gift-recipient', [function () {
  /**
   * These regex|lengths are used to validate form against TCS API endpoint.
   */
  var digitsRegex = /\d/g,
      maxAddressLength = 27,
      maxNameLength = 27,
      maxCityNameLength = 20,
      maxStateNameLength = 20,
      maxEmailLength = 50,
      zipCodeRE = /^\d{5}$/,
      postalCodeRE = /^\w{6}$/,
      nameRE = /^[-'a-zA-Z ]+$/,
      cityRE = /\w{3}/,
      maxRecipientPerOrder = 10,
      validators = {
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
  },

  /*
  * @Note (c.g. 2018-02-06) email regex adapted from: http://emailregex.com/
  */
  emailRE = /^(?:(?:[^<>()\[\]\\.,;:\s@"]+(?:\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  /**
   * Checks if a number matches certain range
   * @param  {Integer}  value   [description]
   * @param  {Integer}  minimum [description]
   * @param  {Integer}  maximum [description]
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
   * @return {boolean} true if address is shorter or equal than 30 characters
   */


  function isValidAddress(str) {
    return isValidRange(str.length, 0, maxAddressLength);
  }
  /**
   * Validates city input field value
   * @param {string} str - city input string
   * @return {boolean} true if city field has value and
   *  it's shorter or equal than 30 characters
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
  /**
   * Validates input zip code value
   * @param {string} str - zip code input value
   * @return {boolean} true if zip code matches the regexp
   * e.g.: 33122 or 33195-6503
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

  function isValidPostalCode(str) {
    return postalCodeRE.test(str);
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
    this.recipientForm = el;
    this.recipientTemplate = el.cloneNode(true);
    this.body = document.body;
    this.formType = dom.find('.subscription-form-billing-address').dataset.formType;
    this.submitButton = dom.find('.submit-button');
    this.errorClass = 'error';
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
    this.recipientForm.setAttribute('data-form-error-class', this.getFormErrorRecipientClass());
    this.body.classList.add(this.getFormErrorRecipientClass());
    this.recipientForm.addEventListener('validate', function () {
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
      'input[name="postalCode"] blur': 'validateField',
      'input[name="email"] blur': 'validateField',
      'input[name="zipCode"] blur': 'handleZipCodeValidation',
      'select[name="country"] blur': 'validateField',
      'input[name="firstName"] keyup': 'validateOnKeyPress',
      'input[name="lastName"] keyup': 'validateOnKeyPress',
      'input[name="address1"] keyup': 'validateOnKeyPress',
      'input[name="address2"] keyup': 'validateOnKeyPress',
      'input[name="city"] keyup': 'validateOnKeyPress',
      'input[name="email"] keyup': 'validateOnKeyPress',
      'input[name="zipCode"] keyup': 'handleKeyPressZipCodeValidation',
      'input[name="postalCode"] keyup': 'validateOnKeyPress',
      '.add-recipient click': 'handleAddRecipientClick'
    },
    getRecipientNumber: function getRecipientNumber() {
      return this.recipientForm.getAttribute('data-gift-recipient');
    },
    getFormErrorRecipientClass: function getFormErrorRecipientClass() {
      return 'form-error-gift-recipient-' + this.getRecipientNumber();
    },
    getOrderSummaryPlanPrice: function getOrderSummaryPlanPrice() {
      return dom.find('.order-summary-container .plan-price');
    },
    handleAddRecipientClick: function handleAddRecipientClick() {
      var recipients = dom.findAll('.subscription-forms .subscription-form-gift-recipient'),
          lastRecipient = _last(recipients),
          recipientNumber = lastRecipient.getAttribute('data-gift-recipient'),
          newRecipient = this.recipientTemplate.cloneNode(true),
          selectedPlanPrice = dom.find('.subscription-plans .main-wrapper[data-selected=true]').dataset.planPrice,
          orderSummaryPlanPrice = this.getOrderSummaryPlanPrice();

      if (recipientNumber < maxRecipientPerOrder) {
        var parent = this.recipientForm.parentNode,
            newRecipientNumber = parseInt(recipientNumber) + 1,
            recipientTitle = dom.find(newRecipient, '.title'),
            deleteButton = this.createDeleteRecipientButton(),
            orderTotal = parseFloat(selectedPlanPrice) * newRecipientNumber;
        dom.find(this.recipientForm, '.add-recipient').classList.add('hidden');
        newRecipient.setAttribute('data-gift-recipient', newRecipientNumber);
        recipientTitle.textContent = recipientTitle.textContent.replace(digitsRegex, newRecipientNumber);
        DS.get('subscription-form-gift-recipient', newRecipient);
        newRecipient.insertBefore(deleteButton, recipientTitle.nextSibling);
        parent.insertBefore(newRecipient, lastRecipient.nextSibling);

        if (orderSummaryPlanPrice) {
          orderSummaryPlanPrice.textContent = '$' + orderTotal;
        }
      }
    },
    createDeleteRecipientButton: function createDeleteRecipientButton() {
      var deleteButton = document.createElement('button');
      deleteButton.classList.add('remove-gift-recipient');
      deleteButton.textContent = 'DELETE';
      deleteButton.setAttribute('type', 'button');
      deleteButton.addEventListener('click', this.handleDeleteGiftRecipient.bind(this));
      return deleteButton;
    },
    handleDeleteGiftRecipient: function handleDeleteGiftRecipient(e) {
      var giftRecipient = e.target.parentElement,
          giftRecipientsContainer = giftRecipient.parentElement,
          orderSummaryPlanPrice = this.getOrderSummaryPlanPrice();
      var giftRecipients, selectedPlanPrice;
      giftRecipientsContainer.removeChild(giftRecipient);
      giftRecipients = dom.findAll('.subscription-form-gift-recipient');
      this.body.classList.remove('form-error-gift-recipient-' + (giftRecipients.length + 1));
      dom.find(this.recipientForm, '.add-recipient').classList.remove('hidden');
      giftRecipients.forEach(function (recipient, index) {
        var title = dom.find(recipient, '.title'),
            newIndex = index + 1;
        recipient.setAttribute('data-gift-recipient', newIndex);
        recipient.setAttribute('data-form-error-class', 'form-error-gift-recipient-' + newIndex);
        title.textContent = title.textContent.replace(digitsRegex, newIndex);
      });

      if (orderSummaryPlanPrice) {
        selectedPlanPrice = dom.find('.subscription-plans .main-wrapper[data-selected=true]').dataset.planPrice;
        orderSummaryPlanPrice.textContent = '$' + parseFloat(selectedPlanPrice) * giftRecipients.length;
      }

      this.isFormValid();
    },
    toggleError: function toggleError(isValid, parentNode, styleClass) {
      styleClass = styleClass || this.errorClass;
      var addOrRemove = isValid ? 'remove' : 'add';
      parentNode.classList[addOrRemove](styleClass);
    },
    getValidator: function getValidator(fieldName) {
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
    handleKeyPressZipCodeValidation: function handleKeyPressZipCodeValidation(evt) {
      var parentNode = dom.closest(evt.target, 'fieldset'),
          value = (evt.target.value || '').trim();

      if ((parentNode.classList.contains('empty') || parentNode.classList.contains(this.errorClass)) && value.length >= 5) {
        var isValid = isValidZipCode(value || '');
        this.toggleError(value, parentNode, 'empty');
        this.toggleError(isValid, parentNode);
      }
    },
    isFormEmpty: function isFormEmpty() {
      var fields = ['firstName', 'lastName', 'address1', 'address2', 'city', 'state-select', 'zipCode'],
          isFormEmpty = _every(fields, function (field) {
        var selector = this.getSelectorFromItem(field),
            element = dom.find(this.recipientForm, selector),
            value = element.value;
        return _isEmpty(value);
      }.bind(this));

      if (isFormEmpty) {
        this.removeErrors(fields);
      }

      this.recipientForm.setAttribute('data-send-to-pcd', !isFormEmpty);
      return isFormEmpty;
    },
    removeErrors: function removeErrors(fields) {
      fields.forEach(function (field) {
        var selector = this.getSelectorFromItem(field),
            element = dom.find(this.recipientForm, selector);
        this.toggleError(true, dom.closest(element, 'fieldset'));
      }.bind(this));
    },
    getSelectorFromItem: function getSelectorFromItem(item) {
      var tokens = item.split('-'),
          name = tokens[0],
          input = tokens[1] || 'input';
      return input + '[name=' + name + ']';
    },
    isFormValid: function isFormValid() {
      var allFieldsValid = _every(this.formFieldStatus),
          method = allFieldsValid ? 'remove' : 'add';

      this.body.classList[method](this.getFormErrorRecipientClass());
      this.enableSubmit();
    },
    enableSubmit: function enableSubmit() {
      this.submitButton.disabled = _includes(this.body.className, 'form-error');
    },
    isFieldOptional: function isFieldOptional(fieldName, value) {
      return _includes(this.optionalFields, fieldName) && !value.length;
    }
  };
  return Constructor;
}]);
}, {"1":1,"24":24,"33":33,"75":75,"93":93,"121":121}];
