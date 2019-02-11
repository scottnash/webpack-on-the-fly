window.modules["subscription-button.client"] = [function(require,module,exports){'use strict';

var dateFormat = require(52),
    dom = require(1),
    _isArray = require(129),
    _some = require(118),
    _includes = require(33),
    _flow = require(196),
    _forEach = require(27),
    _map = require(37),
    _padStart = require(195),
    querystring = require(171),
    ajax = require(88),
    _require = require(109),
    titleCase = _require.titleCase,
    giftRecipientNumberRegEx = /\Gift-(\d+)/;

DS.controller('subscription-button', [function () {
  var nonDigitsRegex = /\D/g,
      PCDUrl = 'https://xp5mg7dva8.execute-api.us-east-1.amazonaws.com/' + (isProductionEnv() ? 'prd' : 'stg') + '/pcd?';

  function Constructor() {
    this.isGiveAGiftPage = dom.find('.subscription-form-gift-recipient') !== null;
    this.formType = dom.find('.subscription-form-billing-address').dataset.formType;
    this.planIncludesNyXNy = false;
    this.selectedPlanPrice = 0;
    this.selectedPlanType = '';
    this.giftRecipientCount = 0;
    this.giftRecipientsParams = '';
  }

  Constructor.prototype = {
    events: {
      'button.submit-button click': 'handleButtonClick'
    },
    handleButtonClick: function handleButtonClick(e) {
      var button = e.target;
      this.giftRecipientsParams = '';
      this.shouldSubmit();

      if (!button.disabled) {
        button.disabled = true;
        clearCustomErrors();
        var pcdData = this.getPcdData();
        this.sendPCDData(pcdData, function () {
          this.showThankYouPage();
          this.populateOrderSummary(pcdData);
          this.addToNewsletters(pcdData);
          this.addMovableinkTracking(pcdData);
        }.bind(this));
      }
    },
    getPcdData: function getPcdData() {
      var setters = [this.setTransactionInfo.bind(this), this.setPlanInfo.bind(this), this.setBillingInfo.bind(this), this.setPaymentInfo.bind(this)];

      if (this.isGiveAGiftPage) {
        setters.push(this.setGiftRecipientsInfo.bind(this));
      }

      return _flow(setters)({});
    },
    sendPCDData: function sendPCDData(data, callback) {
      var params = querystring.stringify(data),
          submitButton = dom.find('button.submit-button');
      ajax.send(PCDUrl + params + this.giftRecipientsParams, function (err, xmlhr) {
        if (err || xmlhr.status !== 200) {
          showCustomError();
        } else {
          var responseError = JSON.parse(xmlhr.response).response.ERROR;

          if (responseError) {
            var errors = _isArray(responseError.CODE) ? responseError.CODE : [responseError.CODE],
                messages = _isArray(responseError.MESSAGE) ? responseError.MESSAGE : [responseError.MESSAGE];
            errors.forEach(function (errorCode, index) {
              showCustomError(errorCode, messages[index]);
            });
          } else {
            callback();
          }
        }

        submitButton.disabled = false;
      });
    },
    shouldSubmit: function shouldSubmit() {
      var validationEvent = new Event('validate');
      ['.subscription-form-credit-card', '.subscription-form-billing-address'].forEach(function (element) {
        dom.find(element).dispatchEvent(validationEvent);
      });
    },
    populateOrderSummary: function populateOrderSummary(data) {
      var summaryContainer = dom.find('.summary-container .summary-wrapper');

      if (summaryContainer) {
        var orderSummaryData = this.mapPcdDataToOrderSummary(data);

        _forEach(orderSummaryData, function (value, key) {
          dom.find(summaryContainer, '.' + key).textContent = value;
        }.bind(this));
      }
    },
    getCardType: function getCardType(type) {
      var cardMapping = {
        VI: 'Visa',
        DI: 'Discover',
        MC: 'Mastercard',
        AE: 'American Express'
      };
      return cardMapping[type] || '';
    },
    mapPcdDataToOrderSummary: function mapPcdDataToOrderSummary(data) {
      var formType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.formType;
      var plan = dom.find('.subscription-plans .main-wrapper[data-selected=true]'),
          planName = plan ? plan.dataset['planName'] : '',
          countrySelected = dom.find('select[name=country'),
          countryName = countrySelected ? titleCase(countrySelected.selectedOptions[0].innerText) : '',
          locationInfo = formType === 'INT' ? countryName : data.iState + ' ' + data.iPCode,
          city = data.iCity + ', ' + locationInfo;
      return {
        name: data.iFName + ' ' + data.iLName,
        address: data.iPaddr + ' ' + data.iSAddr,
        city: city,
        email: data.iEmailAddr,
        plan: this.isGiveAGiftPage ? planName : 'Plan: ' + planName,
        price: 'Amount' + (this.isGiveAGiftPage ? ' Paid' : '') + ': $' + this.getOrderTotal(data),
        type: 'Payment Type: ' + this.getCardType(data.iPayOpt)
      };
    },
    getOrderTotal: function getOrderTotal(data) {
      return this.isGiveAGiftPage ? this.giftRecipientCount * parseFloat(this.selectedPlanPrice) : data.iAmount;
    },
    showThankYouPage: function showThankYouPage() {
      var thankYouContainer = dom.find('.subscription-page > .thank-you-container'),
          subscriptionContainer = dom.find('.subscription-page > .wrapper'),
          formsLinks = dom.find('.subscription-form-link'),
          subscriptionFormHeader = dom.find('.subscription-form-header');
      [thankYouContainer, formsLinks, subscriptionContainer, subscriptionFormHeader].forEach(function (element) {
        if (element) {
          element.classList.toggle('hidden');
        }
      });
    },
    setTransactionInfo: function setTransactionInfo(data) {
      data.iType = this.isGiveAGiftPage ? 'D' : 'B'; // `iType` param for normal subscriptions should be 'B' and 'D' for gift subscriptions.

      data.iAutRnw = this.isGiveAGiftPage ? 'N' : 'Y'; // `iAutRnw` for gift subscription is 'N'(No) and 'Y'(yes) for normal subscriptions.

      if (this.isGiveAGiftPage) {
        data.iSubscribing = 'N'; // `iSubscribing` param is just for gift subscriptions an it's value should be 'N'.
      }

      return data;
    },
    setPlanInfo: function setPlanInfo(data) {
      var plan = dom.find('.subscription-plans .main-wrapper[data-selected=true]'),
          planData = plan ? plan.dataset : '';
      this.planIncludesNyXNy = planData.includesMembership === 'true';
      this.selectedPlanPrice = planData.planPrice;
      this.selectedPlanType = planData.planType;

      if (!this.isGiveAGiftPage) {
        data.iSource = planData.planSourceKey;
        data.iAmount = planData.planPrice;
        data.iTerm = planData.planTerms;
        data.iMedia = planData.planType;
        data.istax = 0;
        data.iCopis = '01';
      }

      return data;
    },
    setBillingInfo: function setBillingInfo(data) {
      var subscriptionBillingForm = dom.find('.subscription-form-billing'),
          locationResolvers = getLocationResolvers(this.formType);

      if (subscriptionBillingForm) {
        if (locationResolvers.country) {
          data.iCountry = locationResolvers.country;
        }

        var fieldsResolver = Object.assign({
          iFName: 'input[name=firstName]',
          iLName: 'input[name=lastName]',
          iPaddr: 'input[name=address1]',
          iSAddr: 'input[name=address2]',
          iCity: 'input[name=city]',
          iEmailAddr: 'input[name=email]'
        }, locationResolvers.resolvers);
        Object.keys(fieldsResolver).forEach(function (key) {
          data[key] = subscriptionBillingForm.querySelector(fieldsResolver[key]).value;
        });
      }

      if (this.formType === 'CA') {
        // if the form is canadian `CA`, we should strip white spaces from it.
        var config = ['iPCode', 'iGiftPCode'];

        _forEach(config, function (property) {
          if (data[property]) {
            data[property] = data[property].replace(' ', '');
          }
        });
      }

      return data;
    },
    getSailThruVars: function getSailThruVars(pcdData) {
      var subscriptionBillingForm = dom.find('.subscription-form-billing'),
          name = subscriptionBillingForm.querySelector('input[name=firstName]').value,
          planName = dom.find('.subscription-plans .main-wrapper[data-selected=true]').dataset['planName'],
          lastName = subscriptionBillingForm.querySelector('input[name=lastName]').value;
      return {
        source: 'Magazine Subscription form',
        first_name: name,
        last_name: lastName,
        pcd_source_key: pcdData.iSource,
        address_1: pcdData.iPaddr,
        address_2: pcdData.iSAddr,
        city: pcdData.iCity,
        state: pcdData.iState,
        zip_code: pcdData.iPCode,
        gift_order: this.isGiveAGiftPage ? 'YES' : 'NO',
        plan_name: planName,
        order_date: dateFormat(new Date(), 'YYYY-MM-DD')
      };
    },
    createNewsletterParams: function createNewsletterParams(pcdData, newsletterList) {
      return newsletterList.reduce(function (result, newsletter) {
        result.lists[newsletter] = true;
        return result;
      }, {
        email: pcdData.iEmailAddr,
        vars: this.getSailThruVars(pcdData),
        lists: {}
      });
    },
    addToNewsletters: function addToNewsletters(pcdData) {
      var newslettersContainer = dom.find('.subscription-newsletter-content'),
          newslettersInputs = newslettersContainer ? newslettersContainer.querySelectorAll('input.newsletter-checkbox:checked') : [];
      var newsletterList = ['magazine-subscribers'],
          requestData;

      if (this.planIncludesNyXNy) {
        newsletterList.push('nyxny');
      }

      newsletterList = newsletterList.concat(_map(newslettersInputs, function (newsletter) {
        return newsletter.dataset.listId;
      }));
      requestData = {
        method: 'POST',
        url: '/newsletter/users/',
        dataType: 'json',
        data: JSON.stringify(this.createNewsletterParams(pcdData, newsletterList))
      };
      ajax.sendJsonReceiveJson(requestData, function (error) {
        if (error) {
          console.warn(error);
        }
      });
    },
    addMovableinkTracking: function addMovableinkTracking(pcdData) {
      var data = {
        name: pcdData.iFName + ' ' + pcdData.iLName,
        effortKey: pcdData.iSource,
        plan: pcdData.planName,
        price: pcdData.planPrice,
        revenue: this.getOrderTotal(pcdData),
        quantity: this.isGiveAGiftPage ? this.giftRecipientCount : 1,
        type: this.getCardType(pcdData.iPayOpt)
      };

      if (window.mitr) {
        window.mitr('send', 'conversion', {
          revenue: data.revenue,
          identifier: data.plan
        });
        window.mitr('addProduct', {
          sku: data.effortKey,
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          other: data.type
        });
        ;
      }
    },
    setPaymentInfo: function setPaymentInfo(data) {
      var creditCardForm = dom.find('.subscription-form-credit-card .payment-form');
      var cardType, creditCardDataSet;

      if (creditCardForm) {
        creditCardDataSet = creditCardForm.dataset;
        cardType = creditCardDataSet['cardType'];
        data.iPayOpt = cardType;
        data.iCCNum = creditCardForm.querySelector('.credit-card-input').value.replace(nonDigitsRegex, '');
        data.iCCExpMon = creditCardForm.querySelector('.exp-month').value.slice(-2);
        data.iCCExpYear = creditCardForm.querySelector('.exp-year').value.slice(-2);
      }

      return data;
    },
    setGiftRecipientsInfo: function setGiftRecipientsInfo(data) {
      var recipientsContainer = dom.find('.gift-recipients-info');

      if (recipientsContainer) {
        recipientsContainer.remove();
      }

      var recipients = dom.findAll('.subscription-form-gift-recipient[data-send-to-pcd=true]'),
          giftRecipientParent = dom.find('.order-summary-container > .summary-wrapper'),
          giftRecipientsContainer = document.createElement('div'),
          planData = dom.find('.subscription-plans .main-wrapper[data-selected=true]').dataset;
      giftRecipientsContainer.classList.add('gift-recipients-info');
      recipients.forEach(function (recipient, index) {
        var recipientNumber = index + 1,
            locationResolvers = getLocationResolvers(this.formType, true),
            resolver = Object.assign({
          iGiftFName: ['firstName'],
          iGiftLName: ['lastName'],
          iGiftPAddr: ['address1'],
          iGiftSAddr: ['address2'],
          iGiftCity: ['city'],
          iGiftEmailAddr: ['email']
        }, locationResolvers.resolvers),
            recipientPcdParams = {},
            recipientSummaryInfo = {};

        _forEach(resolver, function (fields, key) {
          recipientPcdParams[key + recipientNumber] = fields.map(function (field) {
            var selector = '[name="' + field + '"]',
                value = dom.find(recipient, selector).value;
            recipientSummaryInfo[field] = value;
            return value;
          }).join(' ');
        });

        if (locationResolvers.country) {
          recipientPcdParams['iGiftCountry' + recipientNumber] = data.iCountry;
          recipientSummaryInfo.country = data.iCountry;
        } else {
          recipientPcdParams['iGiftState' + recipientNumber] = ' ';
          recipientPcdParams['iGiftPCode' + recipientNumber] = ' ';
        }

        recipientPcdParams['iGiftAccount' + recipientNumber] = ' ';
        recipientPcdParams['iGiftSource' + recipientNumber] = planData.planSourceKey;
        recipientPcdParams['iGiftTerm' + recipientNumber] = planData.planTerms;
        recipientPcdParams['iGiftAmount' + recipientNumber] = planData.planPrice;
        recipientPcdParams['iGiftSTax' + recipientNumber] = 0;
        recipientPcdParams['iGiftCopis' + recipientNumber] = 1;
        recipientPcdParams['iGiftAutRnw' + recipientNumber] = 'N';
        recipientPcdParams['iGiftCompany' + recipientNumber] = ' ';
        recipientPcdParams['iGiftHpho' + recipientNumber] = ' ';
        recipientPcdParams['iGiftMedia' + recipientNumber] = this.selectedPlanType;
        this.giftRecipientsParams += '&' + querystring.stringify(recipientPcdParams);
        giftRecipientsContainer.appendChild(this.createGiftRecipientNode(recipientSummaryInfo, recipientNumber));
      }.bind(this));
      this.giftRecipientCount = recipients.length;
      giftRecipientParent.insertBefore(giftRecipientsContainer, giftRecipientParent.firstChild);
      return data;
    },
    getGiftRecipientSuffix: function getGiftRecipientSuffix(recipientNumber) {
      return '__' + _padStart(recipientNumber, 2, '0');
    },
    createGiftRecipientNode: function createGiftRecipientNode(recipientInfo, index) {
      var container = document.createElement('div'),
          titleElement = document.createElement('h4'),
          titleText = document.createTextNode('Gift Recipient #' + index),
          formTypeSummaryInfo = getFormTypeSummaryInfo(this.formType, recipientInfo),
          values = [recipientInfo.firstName + ' ' + recipientInfo.lastName, recipientInfo.address1 + (recipientInfo.address2 ? ', ' + recipientInfo.address2 : ''), formTypeSummaryInfo.secondaryAddressLine, formTypeSummaryInfo.country];
      titleElement.classList.add('title');
      titleElement.appendChild(titleText);
      container.classList.add('gift-recipient');
      container.appendChild(titleElement);
      values.forEach(function (value) {
        var dataElement = document.createElement('span');
        dataElement.appendChild(document.createTextNode(value));
        dataElement.classList.add('info');
        container.appendChild(dataElement);
      });
      return container;
    }
  };

  function getFormTypeSummaryInfo(formType, recipientInfo) {
    switch (formType) {
      case 'US':
        {
          return {
            secondaryAddressLine: recipientInfo.city + ', ' + recipientInfo.state + ' ' + recipientInfo.zipCode,
            country: 'United States'
          };
        }

      case 'CA':
        {
          return {
            secondaryAddressLine: recipientInfo.city + ', ' + recipientInfo.province + ' ' + recipientInfo.postalCode,
            country: 'Canada'
          };
        }

      case 'INT':
        {
          return {
            secondaryAddressLine: recipientInfo.city,
            country: dom.find('select[name=country') ? dom.find('select[name=country').selectedOptions[0].innerText : ''
          };
        }

      default:
        {
          return {
            secondaryAddressLine: '',
            country: ''
          };
        }
    }
  }

  function getCustomErrorData(errorCode, errorMessage) {
    var message = '',
        target = '';

    switch (errorCode) {
      case 1001:
        {
          message = '*Please Enter a Valid Name. Max 27 characters';
          target = '.billing-address-firstName';
          break;
        }

      case 1018:
        {
          message = '*City and ZIP code do not match.';
          target = '.billing-address-city';
          break;
        }

      case 1019:
        {
          message = '*Canadian City and Zip/Postal Code do not match: Please correct.';
          target = '.billing-address-city';
          break;
        }

      case errorCode >= 5001 && errorCode <= 5015:
        {
          message = '*There was an error processing your credit card';
          target = '.credit-card-form-container';
          break;
        }

      case 81001:
        {
          message = '*Please Enter a Valid Name. Max 27 characters';
          target = '.subscription-form-gift-recipient[data-gift-recipient="' + getGiftRecipientNumber(errorMessage) + '"] .gift-recipient-firstName';
          break;
        }

      case 81018:
        {
          message = '*City and ZIP code do not match.';
          target = '.subscription-form-gift-recipient[data-gift-recipient="' + getGiftRecipientNumber(errorMessage) + '"] .gift-recipient-city';
          break;
        }

      case 81019:
        {
          message = '*Canadian City and Zip/Postal Code do not match: Please correct.';
          target = '.subscription-form-gift-recipient[data-gift-recipient="' + getGiftRecipientNumber(errorMessage) + '"] .gift-recipient-city';
          break;
        }

      default:
        {
          message = '*An error has occured. Please try again later.';
          target = '.general-error-container';
        }
    }

    return {
      message: message,
      target: target
    };
  }

  ;

  function getGiftRecipientNumber(message) {
    if (giftRecipientNumberRegEx.test(message)) {
      return giftRecipientNumberRegEx.exec(message)[1];
    }
  }

  ;

  function showCustomError(errorCode, errorMessage) {
    var errorObj = getCustomErrorData(errorCode, errorMessage),
        parentContainer = dom.find(errorObj.target);

    if (parentContainer) {
      var error = parentContainer.querySelector('.error-message'),
          customError = parentContainer.querySelector('.custom-error-message');
      customError.innerHTML = errorObj.message;
      parentContainer.classList.add('error');
      customError.classList.remove('hidden');

      if (error) {
        error.classList.add('hidden');
      }
    }
  }

  function clearCustomErrors() {
    var customErrors = dom.find('.subscription-forms').querySelectorAll('fieldset');

    _forEach(customErrors, function (customError) {
      customError.classList.remove('error');
    });
  }

  function getLocationResolvers() {
    var formType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'US';
    var isGiftPage = arguments.length > 1 ? arguments[1] : undefined;
    var giftLocationResolvers = {
      US: {
        iGiftState: ['state'],
        iGiftPCode: ['zipCode']
      },
      CA: {
        iGiftState: ['province'],
        iGiftPCode: ['postalCode']
      },
      INT: {
        iGiftCountry: ['country']
      }
    },
        locationResolvers = {
      US: {
        iState: 'select[name=state]',
        iPCode: 'input[name=zipCode]'
      },
      CA: {
        iState: 'select[name=province]',
        iPCode: 'input[name=postalCode]'
      },
      INT: {
        iCountry: 'select[name=country]'
      }
    },
        locationInfo = {
      resolvers: isGiftPage ? giftLocationResolvers[formType] : locationResolvers[formType],
      country: formType
    };

    if (formType === 'INT') {
      delete locationInfo.country;
    }

    return locationInfo;
  }

  function isProductionEnv() {
    var hostname = window.location.hostname || '',
        notProdEnv = ['qa.', 'beta.', 'localhost', '.aws.'];
    return !_some(notProdEnv, function (env) {
      return _includes(hostname, env);
    });
  }

  return Constructor;
}]);
}, {"1":1,"27":27,"33":33,"37":37,"52":52,"88":88,"109":109,"118":118,"129":129,"171":171,"195":195,"196":196}];
