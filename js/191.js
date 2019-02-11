window.modules["191"] = [function(require,module,exports){'use strict';

var productSubtags = require(36),
    _includes = require(33),
    thirdParty = require(78),
    bamxDomain = 'shop-links.co/';
/**
 * Handle product url clicks
 * @param {string} productUrl
 * @param {string} eventType
 * @returns {function}
 */


function handleBuyClick(productUrl, eventType) {
  return function () {
    if (window.fbq) {
      window.fbq('trackCustom', eventType, {
        domain: productUrl
      });
    }
  };
}
/**
 * Append third-party ecomm scripts to the page
 * @param {string} productUrl
 * @param {boolean} includeNarrativ
 */


function attachThirdPartyScripts(productUrl) {
  var includeNarrativ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var isAmazon = _includes(productUrl, 'amazon.com/'),
      amazonOnetagId = '74e5d3e9-e5c4-4fa2-85e4-0e43ae3f0f84',
      amazonOnetagSrc = "z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=".concat(amazonOnetagId),
      bamxSrc = 'static.bam-x.com/tags/nymag.js';

  if (isAmazon) {
    thirdParty.includeScript(amazonOnetagSrc, 2500);
  }

  if (_includes(productUrl, bamxDomain) || includeNarrativ) {
    thirdParty.includeScript(bamxSrc);
  }
}
/**
 * Handle behavior universal to all product links
 * @param {Element} buyLink
 * @param {object} visitState
 */


function initLink(buyLink, visitState) {
  var productUrl = buyLink && buyLink.href,
      // not `getAttribute`, because want resolved url
  // dynamic narrativ links have the class 'narrativ-link'
  isNarrativeSecondBuyButton = buyLink.classList.contains('narrativ-link');

  if (productUrl) {
    if (_includes(productUrl, bamxDomain)) {
      // indicate that affiliate id's should not be added by `components/affiliate-links/client.js`
      buyLink.setAttribute('data-affiliate-links-ignore', 'true');
    } // add click handler


    buyLink.addEventListener('click', handleBuyClick(productUrl, 'Click-Out')); // handle right clicks event

    buyLink.addEventListener('contextmenu', handleBuyClick(productUrl, 'Click-Out-Right')); // add/extend amazon subtag with client-side params

    productSubtags.ensureSubtag(buyLink, visitState);
    attachThirdPartyScripts(productUrl, isNarrativeSecondBuyButton);
  }
}

module.exports.initLink = initLink;
}, {"33":33,"36":36,"78":78}];
