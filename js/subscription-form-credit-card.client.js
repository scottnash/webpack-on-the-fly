window.modules["subscription-form-credit-card.client"] = [function(require,module,exports){'use strict';

var validator = require(207),
    // Docs: https://github.com/braintree/card-validator
format = require(52),
    subYears = require(208),
    _includes = require(33),
    _get = require(32),
    _every = require(93),
    monthDefaultOption = 'MM',
    yearDefaultOption = 'YYYY';

DS.controller('subscription-form-credit-card', [function () {
  function Constructor(el) {
    this.el = el;
    this.body = document.body;
    this.submitButton = this.body.querySelector('.submit-button');
    this.formContainer = el.querySelector('.payment-form');
    this.buttonsContainer = el.querySelector('.payment-type-buttons');
    this.creditCardInput = this.formContainer.querySelector('.credit-card-input');
    this.creditCardErrorSpan = this.formContainer.querySelector('.credit-card-error');
    this.expMonthInput = this.formContainer.querySelector('.exp-month');
    this.expYearInput = this.formContainer.querySelector('.exp-year');
    this.expDateErrorSpan = this.formContainer.querySelector('.exp-date-error');
    this.creditCardsLogoContainer = this.formContainer.querySelector('.cards-logos-container');
    this.creditCardButton = this.buttonsContainer.querySelector('.credit-card-button');
    this.inputError = 'input-error';
    this.unknownType = 'unknown';
    this.validCardNumberLength = 13;
    this.monthsCount = 12;
    this.creditCardValidYears = 7;
    this.backSpaceKeys = [8, 46];
    this.formErrorCreditCard = 'form-error-credit-card';
    this.formFieldStatus = {
      currentValidator: 'creditCard',
      creditCard: {
        numberValid: false,
        expDateValid: false
      }
    };
    this.shouldAlwaysValidateExpDate = false;
    this.creditCardButton.classList.add('selected');
    this.body.classList.add(this.formErrorCreditCard);
    this.submitButton.disabled = true;
    this.creditCardFormatRegex = /.{1,4}/g;
    this.nonDigitsRegex = /\D/g;
    this.init();
  }

  Constructor.prototype = {
    events: {
      '.credit-card-input keydown': 'handleCreditCardFormat',
      '.credit-card-input focusout': 'handleCreditCardValidation',
      '.exp-month change': 'verifyExpDate',
      '.exp-year change': 'verifyExpDate'
    },
    init: function init() {
      this.setYears();
      this.setMonths();
      this.setValidationListener();
    },
    setValidationListener: function setValidationListener() {
      this.el.addEventListener('validate', function () {
        return this.isFormValid();
      }.bind(this));
    },
    setMonths: function setMonths() {
      var options = this.createOptions(monthDefaultOption, this.monthsCount, function (index) {
        var month = String(index + 1);
        return month.length === 1 ? '0' + month : month;
      });
      this.expMonthInput.appendChild(options);
    },
    setYears: function setYears() {
      var currentYear = parseInt(format(subYears(new Date(), 1), 'YYYY'));
      var options = this.createOptions(yearDefaultOption, this.creditCardValidYears, function () {
        return ++currentYear;
      });
      this.expYearInput.appendChild(options);
    },
    createOptions: function createOptions(defaultOption, items, generator) {
      var fragment = document.createDocumentFragment();
      var index;

      for (index = 0; index < items; index++) {
        var value = generator(index);
        fragment.appendChild(this.createOption(value));
      }

      fragment.insertBefore(this.createOption(defaultOption), fragment.firstChild);
      return fragment;
    },
    createOption: function createOption(value) {
      var option = document.createElement('option');
      option.textContent = value;
      option.setAttribute('value', value);
      return option;
    },
    handleCreditCardFormat: function handleCreditCardFormat(e) {
      if (_includes(this.backSpaceKeys, e.keyCode)) {
        this.toggleSelectedCardType(this.unknownType);
      } else {
        var cardNumbers = this.removeDigits(e.target.value);

        if (cardNumbers.length !== this.validCardNumberLength) {
          this.toggleSelectedCardType(this.unknownType);
        }

        this.creditCardInput.value = cardNumbers.length ? cardNumbers.match(this.creditCardFormatRegex).join(' ') : cardNumbers;
      }
    },
    removeDigits: function removeDigits(value) {
      return value.replace(this.nonDigitsRegex, '');
    },
    shouldValidateCreditCard: function shouldValidateCreditCard() {
      var isCreditCardSelected = this.creditCardButton.classList.contains('selected'),
          isValidInput = this.removeDigits(this.creditCardInput.value).length >= this.validCardNumberLength;
      return isCreditCardSelected && isValidInput;
    },
    handleCreditCardValidation: function handleCreditCardValidation() {
      var cardType = this.unknownType,
          method;
      this.enableSubmit();
      this.enableSubmit();

      if (this.shouldValidateCreditCard()) {
        var cardNumber = this.creditCardInput.value,
            cardInput = this.creditCardInput,
            numberValidation = validator.number(cardNumber),
            isCardValid = _get(numberValidation, 'isValid');

        cardType = this.getCardType(_get(numberValidation, 'card.type', this.unknownType));
        method = cardType === this.unknownType || !isCardValid ? 'add' : 'remove';
        cardInput.classList[method](this.inputError);
        this.creditCardErrorSpan.classList[method]('visible');

        if (!isCardValid) {
          this.formContainer.removeAttribute('data-card-type');
          this.creditCardErrorSpan.textContent = !isCardValid ? '*Please confirm credit card number.' : '*Credit card type not accepted.';
          this.formFieldStatus.creditCard.numberValid = false;
        } else {
          this.formContainer.setAttribute('data-card-type', cardType);
          this.formFieldStatus.creditCard.numberValid = true;
        }
      }

      this.isFormValid();
      this.toggleSelectedCardType(cardType);
    },
    toggleSelectedCardType: function toggleSelectedCardType(type) {
      var cards = this.creditCardsLogoContainer.getElementsByTagName('img'),
          index;

      for (index = 0; index < cards.length; index++) {
        var card = cards[index];

        if (type !== this.unknownType) {
          var method = card.dataset['type'] !== type ? 'add' : 'remove';
          card.classList[method]('blurred');
        } else {
          card.classList.remove('blurred');
        }
      }
    },
    getCardType: function getCardType(cardType) {
      var cardMapping = {
        visa: 'VI',
        discover: 'DI',
        'master-card': 'MC',
        'american-express': 'AE'
      };
      return cardMapping[cardType] || this.unknownType;
    },
    shouldValidateExpDate: function shouldValidateExpDate() {
      var isCreditCard = this.creditCardButton.classList.contains('selected'),
          isExpDateSet = this.shouldAlwaysValidateExpDate || this.expMonthInput.value !== monthDefaultOption && this.expYearInput.value !== yearDefaultOption;
      return isCreditCard && isExpDateSet;
    },
    verifyExpDate: function verifyExpDate() {
      if (!this.shouldValidateExpDate()) {
        return;
      }

      this.shouldAlwaysValidateExpDate = true;
      var expDate = this.expMonthInput.value + '' + this.expYearInput.value,
          isDateValid = validator.expirationDate(expDate, this.creditCardValidYears).isValid || expDate.length === 4,
          method = isDateValid ? 'remove' : 'add';
      this.expYearInput.classList[method](this.inputError);
      this.expMonthInput.classList[method](this.inputError);
      this.expDateErrorSpan.classList[method]('visible');
      this.formFieldStatus.creditCard.expDateValid = isDateValid;
      this.isFormValid();
    },
    isFormValid: function isFormValid() {
      var allFormsValid = _every(this.formFieldStatus[this.formFieldStatus.currentValidator]),
          method = allFormsValid ? 'remove' : 'add';

      this.body.classList[method](this.formErrorCreditCard);
      this.enableSubmit();
    },
    enableSubmit: function enableSubmit() {
      this.submitButton.disabled = _includes(this.body.className, 'form-error');
    }
  };
  return Constructor;
}]);
}, {"32":32,"33":33,"52":52,"93":93,"207":207,"208":208}];
