window.modules["36"] = [function(require,module,exports){'use strict';
/**
 * ========
 * Overview
 * ========
 *
 * This service creates subtag query params for product links, for affiliates such as
 * Amazon, Rakuten, and Shareasale
 *
 * At the time of its creation, this service is used by the product components and by the gtm service for inline links
 *
 */

var dom = require(1),
    querystring = require(171),
    _memoize = require(35),
    _includes = require(33),
    _map = require(37),
    _mapValues = require(178),
    _reduce = require(124),
    _assign = require(57),
    _get = require(32),
    _pickBy = require(59),
    _find = require(71),
    page = require(116),
    affiliateSettings = {
  amazon: {
    domains: ['amazon.com'],
    subtagKey: 'ascsubtag',
    fields: ['siteShortKey', 'pageUri', 'productId', 'deviceAbbreviation', 'utmSource', 'utmMedium', 'utmCampaign', 'referrer', 'zone'],
    maxLength: 99
  },
  rakuten: {
    domains: ['click.linksynergy.com/deeplink'],
    subtagKey: 'u1',
    fields: ['siteShortKey', 'pageUri', 'productId', 'deviceAbbreviation', 'zone'],
    maxLength: 72
  },
  shareasale: {
    domains: ['shareasale.com'],
    subtagKey: 'afftrack',
    fields: ['siteShortKey', 'pageUri', 'productId', 'deviceAbbreviation', 'utmSource', 'utmMedium', 'utmCampaign', 'referrer', 'zone'],
    maxLength: 99
  }
},
    // really wish we did not need to hard-code this here
internalHosts = ['nymag.com', 'vulture.com', 'grubstreet.com', 'thecut.com'],
    gtm = dom.find('.gtm'),
    _siteShortKey = gtm && gtm.getAttribute('data-site-short-key'),
    shortenedPageUri = shortenUri(page.getPageUri()),
    getters = {
  siteShortKey: function siteShortKey() {
    return _siteShortKey;
  },
  pageUri: function pageUri() {
    return shortenedPageUri;
  },
  productId: function productId(_ref) {
    var productLink = _ref.productLink;
    return productLink && productLink.getAttribute('data-track-id');
  },
  deviceAbbreviation: _memoize(function (_ref2) {
    var visitState = _ref2.visitState;
    return guessDeviceAbbreviation(visitState.os, visitState.screenWidth);
  }),
  utmSource: _memoize(function (_ref3) {
    var visitState = _ref3.visitState;
    return (visitState.utm_source || '').substr(0, 3);
  }),
  utmMedium: _memoize(function (_ref4) {
    var visitState = _ref4.visitState;
    return (visitState.utm_medium || '').substr(0, 2);
  }),
  utmCampaign: _memoize(function (_ref5) {
    var visitState = _ref5.visitState;
    return (visitState.utm_campaign || '').substr(0, 17);
  }),
  referrer: _memoize(function (_ref6) {
    var visitState = _ref6.visitState;
    return shortenReferrer(visitState.referrer);
  }),
  zone: function zone(_ref7) {
    var productLink = _ref7.productLink;
    return getPageZone(productLink);
  }
},
    zoneAttr = 'data-track-zone',
    generateSubtagParser = _memoize(function (value) {
  var escapeValue = value.replace(/\[/, '\\[').replace(/\]/, '\\]'),
      exp = new RegExp(escapeValue + '[^\[]+');
  return function (subtag) {
    var match = subtag.match(exp); // remove delimiter (e.g. '[p]') from match

    return match && match[0].replace(new RegExp(escapeValue), '');
  };
}),
    // Mapping between subtag property and subtag key
// NOTE: order of properties here dictates order in the subtag string itself
// Any changes here should be documented in /_components/product/schema.yml description
subtagDictionary = {
  siteShortKey: '[]',
  pageUri: '[p]',
  productId: '[i]',
  zone: '[z]',
  deviceAbbreviation: '[d]',
  utmSource: '[s]',
  utmMedium: '[m]',
  utmCampaign: '[c]',
  referrer: '[r]' // referrer at the end in case need to truncate

};
/**
 *
 * @param {string} os
 * @param {number} width
 * @returns {string} one letter string to indicate device
 */


function guessDeviceAbbreviation(os, width) {
  /* eslint complexity: [2, 20] */
  // yes, this is "complex", but is best effort.
  switch (os) {
    case 'Windows Phone':
    case 'iOS':
    case 'Android':
    case 'BlackBerry':
      return width < 728 ? 'M' : 'T';

    case 'Linux':
    case 'Windows':
    case 'Mac OS X':
      return 'D';

    default:
      if (width < 728) {
        return 'M';
      }

      return width > 1024 ? 'D' : 'T';
  }
}
/**
 * retrieve page zone containing the product-link
 * @param {string} el
 * @returns {string} one letter string to indicate device
 */


function getPageZone(el) {
  var zone = dom.closest(el, '[' + zoneAttr + ']'),
      zoneStr = zone && zone.getAttribute(zoneAttr) || '';
  return zoneStr.substr(0, 1);
}
/**
 * removes the `www.` from host
 * @param {string} host - lowercase string
 * @returns {string}
 */


function shortenHost(host) {
  return host.substr(0, 4) === 'www.' ? host.substr(4) : host;
}
/**
 * shortens referrer to shortest usable string:
 *  removes www.
 *  keeps rest of host
 *  keeps first directory in path
 *  removes query and hash
 *  host and path are separated by `/`
 * @param {string} [referrer]
 * @returns {string} defaults to empty string if no referrer found
 */


function shortenReferrer(referrer) {
  var parts = referrer && referrer.match(/\/\/([^\/]+)(\/[^\/#?]+)?/),
      shortenedReferrer = '',
      formattedHost,
      firstDirectory;

  if (parts) {
    formattedHost = shortenHost(parts[1] || '').toLowerCase();
    firstDirectory = parts[2] || '';
    shortenedReferrer = formattedHost + (_includes(internalHosts, formattedHost) ? firstDirectory : '');
  }

  return shortenedReferrer;
}
/**
 * shortens uri to shortest usable string:
 *  reduce to instance key
 *  replace `ambrose-` with `a-`
 *  removes `@published` version
 * @param {string} [uri]
 * @returns {string}
 */


function shortenUri(uri) {
  return (uri || '').split('/').pop().replace('ambrose-', 'a-').replace('@published', '');
}
/**
 * parses a product link subtag and returns data as an object
 * @param {string} [subtag]
 * @returns {object}
 */


function parseSubtag(subtag) {
  return _mapValues(subtagDictionary, function (value) {
    var parseValueFromSubtag = generateSubtagParser(value);
    return parseValueFromSubtag(subtag);
  });
}
/**
 * generate subtag string based on fixed property names
 * @param {object} subtagData
 * @param {object} subTagDictionary
 * @returns {string}
 */


function generateSubtag(subtagData, subTagDictionary) {
  return _reduce(subtagData, function (result, value, key) {
    return result += value ? subTagDictionary[key] + value : '';
  }, '');
}
/**
 * return subtag string, truncated to 99 characters as needed
 * @param {string} subtag
 * @param {number} length
 * @returns {string}
 */


function applySubtagMaxlength(subtag, length) {
  var maxLength = length - 3 * (subtag.split(',').length - 1 + subtag.split('|').length - 1);
  return subtag.substr(0, maxLength);
}
/**
 * generate subtag data
 * @param {array} fields
 * @param {Object} obj
 * @param {Object} obj.visitState
 * @param {Element} obj.productLink
 * @returns {Object}
 */


function getSubtagData(_ref8) {
  var _ref8$fields = _ref8.fields,
      fields = _ref8$fields === void 0 ? [] : _ref8$fields,
      visitState = _ref8.visitState,
      productLink = _ref8.productLink;
  var obj = {};
  fields.forEach(function (field) {
    obj[field] = getters[field] && getters[field]({
      visitState: visitState,
      productLink: productLink
    });
  });
  return obj;
}
/**
 * append or extend product tracking subtag
 * @param {Object} obj
 * @param {string} obj.affiliate
 * @param {Element} obj.productLink
 * @param {Object} obj.visitState
 */


function processSubtag(_ref9) {
  var affiliate = _ref9.affiliate,
      productLink = _ref9.productLink,
      _ref9$visitState = _ref9.visitState,
      visitState = _ref9$visitState === void 0 ? {} : _ref9$visitState;

  var url = productLink.href || '',
      fields = _get(affiliateSettings[affiliate], 'fields'),
      subtagKey = _get(affiliateSettings[affiliate], 'subtagKey'),
      maxLength = _get(affiliateSettings[affiliate], 'maxLength');

  var query = url.indexOf('?') >= 0 ? url.split('?').pop() : '',
      queryData = querystring.parse(query),
      subtagData = getSubtagData({
    fields: fields,
    visitState: visitState,
    productLink: productLink
  }),
      subtagString;

  if (subtagKey) {
    subtagString = queryData[subtagKey] || '';
    subtagData = _assign(parseSubtag(subtagString), _pickBy(subtagData));
    subtagString = generateSubtag(subtagData, subtagDictionary);
    queryData[subtagKey] = applySubtagMaxlength(subtagString, maxLength);
    query = _map(queryData, function (value, key) {
      return "".concat(key, "=").concat(value);
    }).join('&');
    productLink.search = query ? "?".concat(query) : '';
  }
}
/**
 * Return affiliate matching product link
 * @param {Element} productLink
 * @returns {string}
 */


function getAffiliate(productLink) {
  var href = _get(productLink, 'href', '').toLowerCase(),
      affiliates = Object.keys(affiliateSettings);

  return _find(affiliates, function (affiliate) {
    return _find(affiliateSettings[affiliate].domains, function (domain) {
      return href.includes(domain);
    });
  }) || '';
}
/**
 * add or extend subtag on amazon and narrativ links
 * server-side subtag params will be augmented by client-side params
 * @param {Element} [productLink]
 * @param {object} [visitState]
 */


function ensureSubtag(productLink, visitState) {
  var affiliate = getAffiliate(productLink);

  if (affiliate) {
    processSubtag({
      productLink: productLink,
      visitState: visitState,
      affiliate: affiliate
    });
  }
}

module.exports.guessDeviceAbbreviation = guessDeviceAbbreviation;
module.exports.shortenUri = shortenUri;
module.exports.getPageZone = getPageZone;
module.exports.generateSubtag = generateSubtag;
module.exports.ensureSubtag = ensureSubtag; // exports for testing

module.exports.processSubtag = processSubtag;
module.exports.getAffiliate = getAffiliate;
}, {"1":1,"32":32,"33":33,"35":35,"37":37,"57":57,"59":59,"71":71,"116":116,"124":124,"171":171,"178":178}];
