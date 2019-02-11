window.modules["204"] = [function(require,module,exports){(function (__filename){
;(function(){
'use strict';

var cookie = require(28),
    _assign = require(57),
    _findKey = require(206),
    _pickBy = require(59),
    log = require(81).setup({
  file: __filename
}),
    _require = require(91),
    fullToAbbreviation = _require.fullToAbbreviation,
    _require2 = require(205),
    canadaProvinces = _require2.canadaProvinces,
    countries = _require2.countries,
    store = require(197),
    isProd = ['nymag.com', 'subs.nymag.com', 'www.thecut.com', 'www.grubstreet.com', 'www.vulture.com'].includes(window.location.hostname),
    isLocal = window.location.hostname.includes('localhost'),
    STRIPE_KEY = isProd ? 'pk_live_lRvD5MtbcKAjFfOTyzxHsC2t' : 'pk_test_fe2osSy4vEesRDXpITp9RHVr',
    ENV_KEY = isProd ? 'prd' : 'stg',
    fulfillmentEndpoint = isLocal ? '/create-subscription' : "https://xp5mg7dva8.execute-api.us-east-1.amazonaws.com/".concat(ENV_KEY, "/create-subscription"),
    ajax = require(88),
    gtmUtils = require(198),
    style = {
  base: {
    fontSize: '16px',
    fontFamily: 'Helvetica',
    fontSmoothing: 'antialiased'
  }
};

var stripe,
    elements,
    card,
    hasSentCheckoutEvent = false;

try {
  stripe = new Stripe(STRIPE_KEY);
  elements = stripe.elements();
  card = elements.create('card', {
    style: style,
    hidePostalCode: true
  });
} catch (error) {
  log('error', "Error initializing Stripe: ".concat(error.message));
}

function transformAddressFields(addressFields) {
  return {
    name: "".concat(addressFields.firstName, " ").concat(addressFields.lastName),
    address_line1: addressFields.address1,
    address_city: addressFields.city,
    address_state: addressFields.state || addressFields.province,
    address_zip: addressFields.zipCode || addressFields.postalCode,
    address_country: addressFields.countryCode || (addressFields.province ? 'CA' : 'US'),
    email: addressFields.email
  };
}

function trackInMovableInk(_ref) {
  var address = _ref.address,
      tier = _ref.tier;
  var name = "".concat(address.firstName, " ").concat(address.lastName),
      sku = tier.pcdId,
      identifier = tier.subscriptionPlanType,
      price = tier.recurringChargeAmount,
      revenue = tier.isGift ? tier.giftRecipientCount * parseFloat(tier.recurringChargeAmount) : tier.recurringChargeAmount,
      quantity = tier.isGift ? tier.giftRecipientCount : 1;

  if (window.mitr) {
    window.mitr('send', 'conversion', {
      revenue: revenue,
      identifier: identifier
    });
    window.mitr('addProduct', {
      sku: sku,
      name: name,
      price: price,
      quantity: quantity
    });
  }
}

function handlePaymentSuccess(data) {
  trackInMovableInk(data);
  gtmUtils.trackPurchase({
    tier: store.getters.selectedTier(),
    pcdAccount: store.getters.pcdAccountNumber()
  });
}

function sendToPaymentProcessor(data) {
  var payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  return fetch(fulfillmentEndpoint, payload).then(function (res) {
    log('debug', 'nymag-fullfillment response', res);
    return res.json();
  }).then(function (res) {
    if (res.pcdAccount) {
      log('debug', 'PCD response', res);
      store.actions.setPcdAccountNumber(res.pcdAccount);
      store.actions.setHasCompletedPayment(true);
      store.actions.setLayout();
      window.scrollTo(0, 0);
      return handlePaymentSuccess(data);
    } else {
      log('error', 'PCD error', res);
      var err = res.thirdPartyMessage;
      store.actions.setErrorMessage(err ? err.split('*').join('').trim() : 'something went wrong');
      store.actions.setHasSubmittedForm(false);
    }
  }).catch(function (err) {
    log('error', 'subscription error', err);
    store.actions.setErrorMessage(err);
    store.actions.setHasSubmittedForm(false);
  });
}

function getSailThruVars(addressFields, tier) {
  return {
    first_name: addressFields.firstName,
    last_name: addressFields.lastName,
    address_1: addressFields.address1,
    address_2: addressFields.address2,
    city: addressFields.city,
    state: addressFields.state,
    zip_code: addressFields.zipCode,
    country: addressFields.country,
    pcd_source_key: tier.pcdId,
    plan_name: tier.planType,
    recurring_charge_period: tier.recurringChargePeriod,
    order_date: new Date().toISOString().slice(0, 10),
    source: 'Magazine Subscription form'
  };
}

function createNewsletterParams(_ref2, newsletterList) {
  var addressFields = _ref2.addressFields,
      tier = _ref2.tier;
  return newsletterList.reduce(function (result, newsletter) {
    result.lists[newsletter] = true;
    return result;
  }, {
    email: addressFields.email,
    vars: getSailThruVars(addressFields, tier),
    lists: {}
  });
}

function addToNewsletters(data) {
  var newsletterList = data.tier.isGift ? ['magazine-subscribers'] : ['paywall-subscribers'];
  var requestData;

  if (data.tier.planType === 'NY x NY Membership') {
    newsletterList.push('nyxny');
  }

  requestData = {
    method: 'POST',
    url: '/newsletter/users/',
    dataType: 'json',
    data: JSON.stringify(createNewsletterParams(data, newsletterList))
  };
  ajax.sendJsonReceiveJson(requestData, function (error) {
    log('debug', 'Sailthru data', requestData.data);

    if (error) {
      log('error', 'Error handling magazine subscriber list', error);
    }
  });
}

module.exports = {
  data: function data() {
    return {
      errorMessage: ''
    };
  },
  mounted: function mounted() {
    var _this = this;

    if (card) {
      card.mount('#card-element');
      card.addEventListener('change', function (event) {
        if (event.complete) {
          _this.setCreditCardFormValidation(true);

          _this.errorMessage = '';
        } else {
          _this.setCreditCardFormValidation(false);

          if (event.error) {
            _this.errorMessage = event.error.message;
          } else {
            _this.errorMessage = '';
          }
        }
      });
    }
  },
  created: function created() {
    this.$root.$on('handle-submit', this.charge);
  },
  beforeDestroy: function beforeDestroy() {
    this.$root.$off('handle-submit', this.charge);
  },
  methods: {
    charge: function charge() {
      var _this2 = this;

      var locale = store.getters.getLocale(),
          address = store.getters.getAddressData(),
          data = transformAddressFields(address);

      var _store$getters$select = store.getters.selectedTier(),
          pcdId = _store$getters$select.pcdId,
          stripeId = _store$getters$select.stripeId,
          subscriptionPlanType = _store$getters$select.planType,
          planTerms = _store$getters$select.planTerms,
          firstChargeAmount = _store$getters$select.firstChargeAmount,
          recurringChargeAmount = _store$getters$select.recurringChargeAmount,
          recurringChargePeriod = _store$getters$select.recurringChargePeriod,
          stripePremiumId = _store$getters$select.stripePremiumId;

      _assign(address, _pickBy({
        stateCode: fullToAbbreviation(address.state),
        provinceCode: _findKey(canadaProvinces, function (value) {
          return address.province === value;
        }),
        countryCode: _findKey(countries, function (value) {
          return address.country === value;
        })
      }));

      stripe.createToken(card, data).then(function (result) {
        if (result.error) {
          _this2.errorMessage = result.error.message;
        } else {
          sendToPaymentProcessor({
            stripeToken: result.token,
            tier: {
              pcdId: pcdId,
              stripeId: stripeId,
              subscriptionPlanType: subscriptionPlanType,
              planTerms: planTerms,
              firstChargeAmount: firstChargeAmount,
              recurringChargeAmount: recurringChargeAmount,
              recurringChargePeriod: recurringChargePeriod,
              stripePremiumId: stripePremiumId
            },
            cd13: cookie.get('_ga'),
            cd9: cookie.get('nyma'),
            cd60: cookie.get('nymcid'),
            locale: locale,
            address: address
          });

          _this2.handleNewsletters();
        }
      }).catch(function (err) {
        log('error', "Stripe error generating user token: ".concat(err.message));
      });
    },
    setCreditCardFormValidation: function setCreditCardFormValidation(validated) {
      var selectedTier;
      store.actions.setCreditCardFormStatus(validated);

      if (validated && !hasSentCheckoutEvent) {
        selectedTier = store.getters.selectedTier();
        gtmUtils.trackCheckout(selectedTier, 2);
        hasSentCheckoutEvent = true;
      }
    },
    handleNewsletters: function handleNewsletters() {
      var locale = store.getters.getLocale(),
          addressFields = store.getters.getAddressData(),
          tier = store.getters.selectedTier();
      addToNewsletters({
        addressFields: addressFields,
        tier: tier
      });
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"subscription-credit-card-form"},[_c('span',{staticClass:"title",attrs:{"data-content":"formTitle"}},[_vm._v("Payment Details")]),_vm._v(" "),_c('div',{staticClass:"subscription-cc-form-content"},[_c('div',{staticClass:"form-row"},[_c('label',{attrs:{"for":"card-element"}},[_vm._v("\n        Card Number\n      ")]),_vm._v(" "),_c('div',{attrs:{"id":"card-element"}}),_vm._v(" "),_c('div',{staticClass:"stripe-errors",attrs:{"id":"card-errors","role":"alert"}},[_c('span',[_vm._v(_vm._s(_vm.errorMessage))])])])])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-66017804", __vue__options__)
  } else {
    hotAPI.reload("data-v-66017804", __vue__options__)
  }
})()}
}).call(this,"/components/subscription-container/vue/credit-card-form.vue")}, {"8":8,"10":10,"28":28,"57":57,"59":59,"81":81,"88":88,"91":91,"197":197,"198":198,"205":205,"206":206}];
