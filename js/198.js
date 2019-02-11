window.modules["198"] = [function(require,module,exports){(function (__filename){
'use strict';

var _get = require(32),
    _map = require(37),
    _assign = require(57),
    cookie = require(28),
    gtm = require(41),
    _require = require(68),
    getClientHistory = _require.getClientHistory,
    log = require(81).setup({
  file: __filename,
  component: 'subscription-container'
}),
    visitData = {},
    brand = 'NYMag';

var hasCalledClientHistory = false;
/**
 * Retrieve client id from cookie
 * @returns {string}
 */

function getClientId() {
  var key = 'nymcid';
  return cookie.get(key);
}
/**
 * Gets client history and executes callback,
 * in which a GTM event is fired
 * @param {Function} callback
 * @returns {Function}
 */


function callAfterGettingUserVisits(callback) {
  return function () {
    // arrow functions do not provide 'arguments'
    var args = arguments,
        clientId = getClientId(); // apply callback immediately if visitData has already been populated

    if (hasCalledClientHistory) {
      callback.apply(null, args);
      return Promise.resolve();
    }

    return getClientHistory(clientId).then(function (res) {
      _assign(visitData, {
        totalArticleCount: _get(res.global, 'total', 0),
        standardArticleCount: _get(res.global, 'Article', 0),
        featureArticleCount: _get(res.global, 'Feature', 0),
        magazineArticleCount: _get(res.global, 'Magazine', 0)
      });

      hasCalledClientHistory = true;
    }).catch(function (err) {
      log('error', "Error retrieving user visit data: ".concat(err.message));
    }).then(function () {
      return callback.apply(null, args);
    });
  };
}
/**
 * Send eec.detail event to GTM
 * @param {object} tiers
 */


function trackProductDetailView(tiers) {
  var list = window.location.pathname,
      products = _map(tiers, function (tier) {
    return {
      id: tier.stripeId,
      name: tier.planType,
      category: 'regular subscription',
      // later support gift subs
      variant: determineVariant(tier),
      brand: brand,
      totalArticleCount: visitData.totalArticleCount,
      standardArticleCount: visitData.standardArticleCount,
      featureArticleCount: visitData.featureArticleCount,
      magazineArticleCount: visitData.magazineArticleCount
    };
  });

  gtm.reportNow({
    event: 'eec.detail',
    ecommerce: {
      detail: {
        actionField: {
          list: list
        },
        products: products
      }
    }
  });
}
/**
 * Send eec.checkout event to GTM
 * @param {object} tier
 * @param {number} step
 */


function trackCheckout() {
  var tier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var step = arguments.length > 1 ? arguments[1] : undefined;
  gtm.reportNow({
    event: 'eec.checkout',
    ecommerce: {
      checkout: {
        actionField: {
          step: step,
          option: tier.pcdId
        },
        products: [{
          id: tier.stripeId,
          name: tier.planType,
          category: 'regular subscription',
          // later support gift subs
          variant: determineVariant(tier),
          brand: brand,
          quantity: 1,
          totalArticleCount: visitData.totalArticleCount,
          standardArticleCount: visitData.standardArticleCount,
          featureArticleCount: visitData.featureArticleCount,
          magazineArticleCount: visitData.magazineArticleCount
        }]
      }
    }
  });
}
/**
 * Send eec.purchase event to GTM
 * @param {object} tier
 * @param {string} pcdAccount
 * @param {string} coupon
 */


function trackPurchase(_ref) {
  var tier = _ref.tier,
      pcdAccount = _ref.pcdAccount,
      _ref$coupon = _ref.coupon,
      coupon = _ref$coupon === void 0 ? null : _ref$coupon;
  gtm.reportNow({
    event: 'eec.purchase',
    ecommerce: {
      currencyCode: 'USD',
      purchase: {
        actionField: {
          id: pcdAccount,
          affiliation: 'SUBSCRIPTION',
          // extra details about where the purchase happened
          revenue: parseFloat(tier.firstChargeAmount).toFixed(2),
          coupon: coupon
        },
        products: [{
          id: tier.stripeId,
          name: tier.planType,
          category: 'regular subscription',
          // later support gift subs
          variant: determineVariant(tier),
          brand: brand,
          quantity: 1,
          price: parseFloat(tier.recurringChargeAmount).toFixed(2),
          coupon: coupon,
          // not current using
          totalArticleCount: visitData.totalArticleCount,
          standardArticleCount: visitData.standardArticleCount,
          featureArticleCount: visitData.featureArticleCount,
          magazineArticleCount: visitData.magazineArticleCount
        }]
      }
    }
  });
}

function determineVariant() {
  var tier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var planType = tier.planType,
      chargePeriod = tier.recurringChargePeriod;
  return "".concat(planType, " - subscription - ").concat(chargePeriod);
}

module.exports = {
  trackProductDetailView: callAfterGettingUserVisits(trackProductDetailView),
  trackCheckout: callAfterGettingUserVisits(trackCheckout),
  trackPurchase: callAfterGettingUserVisits(trackPurchase)
};

}).call(this,"/components/subscription-container/lib/gtm-utils.js")}, {"28":28,"32":32,"37":37,"41":41,"57":57,"68":68,"81":81}];
