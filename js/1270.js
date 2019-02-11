window.modules["1270"] = [function(require,module,exports){(function (process){
'use strict';

require(182);

var _map = require(37),
    _get = require(32),
    _pickBy = require(59),
    _throttle = require(23),
    fastXml = require(569),
    promises = require(46),
    crypto = require(1262),
    API_KEY = window.process.env.AMZN_PAAPI_KEY || '',
    API_SECRET = window.process.env.AMZN_PAAPI_SECRET || '',
    // number of milliseconds to allow for API call to complete
API_TIMEOUT = window.process.env.AMZN_PAAPI_TIMEOUT || 0,
    callLimit = 1,
    // number of calls allowed per callPeriod
callPeriod = 10000; // number of milliseconds over which callLimit is applied


var callCounter = 0,
    resetCallCounter = _throttle(function () {
  callCounter = 0;
}, callPeriod, {
  leading: false,
  trailing: true
});
/**
 * Parse Amazon ASIN product ID from url
 * @param {string} url
 * @returns {string}
 */


function getAmazonProductId(url) {
  var amazonProductDelimiter = '\/(dp|gp\/product)\/',
      amazonProductExp = new RegExp(amazonProductDelimiter + '[^?\/]+'),
      match = url.match(amazonProductExp);
  return match ? match[0].split('/').pop().trim() : '';
}
/**
 * Strip query params and other unnecessary text from amazon url
 * @param {string} url
 * @return {string}
 */


function sanitizeAmazonLink(url) {
  var id = getAmazonProductId(url);
  return id ? "https://www.amazon.com/dp/".concat(id) : url;
}
/**
 * Execute query and return xml/text
 * @param {string} url
 * @return {Promise.<string>}
 */


function queryAmazonProductAPI(url) {
  return fetch(url).then(function (res) {
    return res.text();
  }).catch(function (err) {
    throw new Error(err.message);
  });
}

;
/**
 * Generate signed hash
 * @param {string} message
 * @param {string} secret
 * @returns {Promise.<object|undefined>}
 */

function generateHash(message, secret) {
  var hmac = crypto.createHmac('sha256', secret);

  try {
    return Promise.resolve(hmac.update(message).digest('base64'));
  } catch (e) {
    return Promise.resolve(null);
  }
}
/**
 * Parse and munge the XML response from a product API request
 * @param {string} xml
 * @returns {Object}
 */


function parseAmazonXML(xml) {
  var res = fastXml.parse(xml),
      itemPath = 'ItemLookupResponse.Items.Item',
      listPricePath = itemPath + '.ItemAttributes.ListPrice.FormattedPrice',
      offerPricePath = itemPath + '.Offers.Offer.OfferListing.Price.FormattedPrice',
      salePricePath = itemPath + '.Offers.Offer.OfferListing.SalePrice.FormattedPrice',
      upcPath = itemPath + '.ItemAttributes.UPC',
      itemErrorPath = 'ItemLookupResponse.Items.Request.Errors.Error.Message',
      lookupErrorPath = 'ItemLookupErrorResponse.Error.Message',
      responseError = _get(res, lookupErrorPath) || _get(res, itemErrorPath),
      parsePrice = function parsePrice(data, path) {
    return parseFloat(_get(data, path, '').replace('$', '').replace(',', ''), 10);
  };

  if (responseError || !res) {
    throw new Error(responseError || 'Error parsing XML');
  }

  return _pickBy({
    listPrice: parsePrice(res, listPricePath),
    offerPrice: parsePrice(res, offerPricePath),
    salePrice: parsePrice(res, salePricePath),
    upc: _get(res, upcPath)
  }, function (item) {
    return !!item;
  });
}
/**
 * Generate authenticated url and query string for amazon product API
 * @param {string} productUrl
 * @returns {Promise.<object>}
 */


function generateAmazonQuery(productUrl) {
  var ASSOCIATE_TAG = 'nymagcom-20',
      productId = getAmazonProductId(productUrl),
      baseUrl = 'http://webservices.amazon.com/onca/xml',
      params = {
    AWSAccessKeyId: API_KEY,
    AssociateTag: ASSOCIATE_TAG,
    IdType: 'ASIN',
    ItemId: productId,
    Operation: 'ItemLookup',
    ResponseGroup: 'ItemAttributes, Offers',
    Service: 'AWSECommerceService',
    Timestamp: new Date().toISOString()
  },
      paramString = _map(params, function (val, key) {
    return "".concat(key, "=").concat(encodeURIComponent(val));
  }).join('&');

  return generateHash("GET\nwebservices.amazon.com\n/onca/xml\n".concat(paramString), API_SECRET).then(function (signedParamString) {
    return "".concat(baseUrl, "?").concat(paramString, "&Signature=").concat(encodeURIComponent(signedParamString));
  }).catch(function () {
    return Promise.reject('Error signing amazon query');
  });
}
/**
 * Generate amazon product API query,
 * execute request, and return parsed data
 * @param {string} productUrl
 * @returns {Promise.<object|undefined>}
 */


function getProductDataFromAmazon(productUrl) {
  if (API_TIMEOUT === 0) {
    return Promise.reject('Amazon Sync Disabled');
  }

  return generateAmazonQuery(productUrl).then(function (url) {
    return promises.timeout(queryAmazonProductAPI(url), API_TIMEOUT);
  }).then(parseAmazonXML).catch(function (err) {
    throw new Error("Amazon Product query failed: ".concat(err.message));
  });
}
/**
 * Manage state and logic around closely-spaced calls to Amazon.
 * Amazon product updates are not currently batched together, and 
 * need to be rate-limited here to avoid getting throttled by Amazon
 * @param {object} data
 * @returns {function}
 */


function meetsCallThreshold() {
  if (callCounter >= callLimit) {
    resetCallCounter();
    return false;
  }

  callCounter++;
  return true;
}

module.exports.generateHash = generateHash;
module.exports.getAmazonProductId = getAmazonProductId;
module.exports.getProductDataFromAmazon = getProductDataFromAmazon;
module.exports.sanitizeAmazonLink = sanitizeAmazonLink;
module.exports.meetsCallThreshold = meetsCallThreshold;

}).call(this,require(22))}, {"22":22,"23":23,"32":32,"37":37,"46":46,"59":59,"182":182,"569":569,"1262":1262}];
