window.modules["affiliate-links.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _memoize = require(35),
    _includes = require(33),
    _startsWith = require(34),
    _get = require(32),
    amazonLinks = require(36),
    globalClick = require(30),
    visit = require(31);
/**
 * Skimlinks adds affiliate ids to links so that we gain revenue from links to Zappos, J.Crew, etc.
 * We use the Amazon ID directly on Amazon links.
 *
 * Skimlinks should only be applied to external links.
 *
 * Note: `internalHostnames` in the site's config must be updated when a new host is added.
 *
 * Skimlinks API Documentation:
 * http://go.redirectingat.com/doc/
 */

/* eslint max-params: ["error", 6] */


DS.controller('affiliate-links', ['$window', function ($window) {
  var excludedHostnames,
      skimlinksBaseUrl,
      amazonTag,
      constructor,
      skimlinksId,
      ignoreDataAttribute = 'data-affiliate-links-ignore',
      skimLinksHostname = 'go.redirectingat.com',
      article = $window.document.querySelector('article'),
      isSponsored = article && article.getAttribute('data-type') === 'Sponsor Story',
      visitState,
      getUtmSource = _memoize(function (visitState) {
    return (visitState.utm_source || '').substr(0, 3);
  }),
      getUtmMedium = _memoize(function (visitState) {
    return (visitState.utm_medium || '').substr(0, 2);
  }),
      getUtmCampaign = _memoize(function (visitState) {
    return (visitState.utm_campaign || '').substr(0, 17);
  }),
      // using underscores as delimiters as this is what skimlinks is ok with
  subtagDictionary = {
    pageUri: '__p_',
    productId: '__i_',
    utmCampaign: '__c_',
    utmSource: '__s_',
    utmMedium: '__m_',
    zone: '__z_',
    deviceAbbreviation: '__d_'
  };
  /**
   * get product id from anchor element
   * @param {Element} [el]
   * @returns {string}
   */


  function getProductId(el) {
    return el.getAttribute('data-track-id') || '';
  }
  /**
   * properties needed for skimlinks subtag
   * @param {Element} [productLink]
   * @param {object} visitState
   * @returns {string}
   */


  function addSkimlinksSubtag(productLink, visitState) {
    var skimlinksSubtag = amazonLinks.generateSubtag({
      pageUri: amazonLinks.shortenUri(visitState.pageUri),
      productId: getProductId(productLink),
      utmCampaign: getUtmCampaign(visitState),
      utmSource: getUtmSource(visitState),
      utmMedium: getUtmMedium(visitState),
      zone: amazonLinks.getPageZone(productLink),
      deviceAbbreviation: amazonLinks.guessDeviceAbbreviation(visitState.os, visitState.screenWidth)
    }, subtagDictionary);
    return skimlinksSubtag;
  }
  /**
  * Excluded hostnames: All links that match this list will not get affiliate id's added.
  * @param {Element} componentEl
  */


  function setExcludedHostnames(componentEl) {
    excludedHostnames = (componentEl.getAttribute('data-excluded-hostnames') || '').toLowerCase().split(',');
  }
  /**
  * Check for skimlinks
  * @param {Element} componentEl
  * @returns {boolean}
  */


  function isSkimLink(componentEl) {
    skimlinksId = componentEl.getAttribute('data-skimlinks');
    return !!skimlinksId;
  }
  /**
  * Check for Amazon affiliate tag.
  * @param {Element} componentEl
  * @returns {boolean}
  */


  function setAmazonTag(componentEl) {
    amazonTag = componentEl.getAttribute('data-amazon');
    return !!amazonTag;
  }
  /**
  * Test if the link is an excluded hostname
  * @param {string} hostname ideally is the hostname, but can also be the URL.
  * @returns {boolean}
  */


  function isExcluded(hostname) {
    return _includes(excludedHostnames, hostname) || _startsWith(hostname, 'www.') && _includes(excludedHostnames, hostname.slice(4)) || isSponsored;
  }
  /**
  * Test if the link is a standard URL. e.g. not a mailto: or javascript:.
  * @param {string} url
  * @returns {boolean}
  */


  function isUrlProtocol(url) {
    return url.indexOf('mailto:') !== 0 && url.indexOf('javascript:') !== 0;
  }
  /**
  * Returns hostname from an HTML element.
  * @param {object} target
  * @returns {string}
  */


  function getTargetHostname(target) {
    return (target.hostname || target.host || target.href || '').toLowerCase();
  }
  /**
  * Add Amazon tag to amazon links that do no already have the "tag" param set.
  * @param {Element} anchor
  * @param {string} hostname
  * @returns {string|undefined} only returns undefined if it is not an amazon link or there is no amazon tag set
  */


  function convertAmazonLink(anchor, hostname) {
    var isAmazonUrl = hostname.indexOf('amazon.com') > -1,
        tagKey = 'tag=',
        tagKeyMatch = new RegExp('[\\?&]' + tagKey + '[^&]+'),
        query;

    if (isAmazonUrl && amazonTag) {
      query = _get(anchor, 'search', '');

      if (!query.match(tagKeyMatch)) {
        anchor.search = (query ? query + '&' : '?') + tagKey + amazonTag;
      }

      return anchor.href;
    }
  }
  /**
   * return subtag string, truncated to 50 characters as needed by skimlinks
   * @param {string} subtag
   * @returns {string}
   */


  function applyMaxlength(subtag) {
    var maxLength = 50 - 3 * (subtag.split(',').length - 1 + subtag.split('|').length - 1);
    return subtag.substr(0, maxLength);
  }
  /**
   * Send the URL through skimlinks, with a subtag for added tracking.
   * @param {string} url
   * @param {string} hostname
   * @param {string} el
   * @returns {string}
   */


  function convertSkimlink(url, hostname, el) {
    var urlIsSkimlink = hostname.indexOf(skimLinksHostname) === 0,
        baseTag = addSkimlinksSubtag(el, visitState),
        subTag = applyMaxlength(baseTag); // construct the skimlinks url and try to create the base url or set the base url to undefined.

    skimlinksBaseUrl = skimlinksBaseUrl || skimlinksId ? '//go.redirectingat.com/?xs=1&id=' + skimlinksId + '&sref=' + encodeURIComponent($window.location.href) + '&xcust=' + encodeURIComponent(subTag) + '&url=' : undefined;
    return !urlIsSkimlink && skimlinksBaseUrl && skimlinksBaseUrl + encodeURIComponent(url);
  }
  /**
   * skimlink url to normal url
   * @param {string} url
   * @returns {string}
   */


  function skimlinkUrlToUrl(url) {
    var splitUrl = url.split(skimlinksBaseUrl);
    return splitUrl.length > 1 ? decodeURIComponent(splitUrl[1]) : url;
  }
  /**
   * For cases where we do not want affiliate-links to run and we do not know the hostname, then
   * `data-affiliate-links-ignore` can be set to 'true'.
   * This was created for bam-x, a third-party script that rewrites the href and we do not want it to go through skimlinks.
   * `data-affiliate-links-ignore` is set by `components/product/client.js`
   * TODO: consider server-side implemenation of bam-x, so that we do not have their script on our pages.
   * @param {Element} target
   * @returns {boolean}
   */


  function hasIgnoreAttribute(target) {
    return target.getAttribute(ignoreDataAttribute) === 'true';
  }
  /**
  * Add amazon or skimlinks to external links.
  * Notes:
  *  * First try Amazon link and then skimlink.
  *  * We do not change the href property because it is used by omniture for tracking.
  * @param {object} e browser event object.
  */


  function convertAffiliateLink(e) {
    var url,
        hostname,
        closestAnchor = dom.closest(e.target, 'a'),
        href = closestAnchor && closestAnchor.href;

    if (href && href.length && !e.defaultPrevented) {
      hostname = getTargetHostname(closestAnchor);

      if (isUrlProtocol(href) && !isExcluded(hostname) && !hasIgnoreAttribute(closestAnchor)) {
        // NOTE: amazon site-tag is added server-side
        // convertAmazonLink is in place here as a fallback
        url = convertAmazonLink(closestAnchor, hostname) || convertSkimlink(href, hostname, closestAnchor); // First try to convert Amazon link, then try to convert skim link.

        if (url) {
          closestAnchor.href = url; // replaces the href and lets browser handle navigation
        }
      }
    }
  }
  /**
   * We only need to revert skimlinks; amazon is fine to leave with the code
   * @param {Event} e
   */


  function revertSkimLink(e) {
    var closestAnchor = dom.closest(e.target, 'a'),
        href = closestAnchor && closestAnchor.href;

    if (href && href.length) {
      closestAnchor.href = skimlinkUrlToUrl(href);
    }
  }
  /**
  * @constructs
  * @param {Element} componentEl
  */


  constructor = function constructor(componentEl) {
    var skimlinksIsOn = isSkimLink(componentEl),
        amazonIsOn = setAmazonTag(componentEl);
    visit.onceReady(function (visitData) {
      visitState = visitData;
    });

    if (skimlinksIsOn || amazonIsOn) {
      setExcludedHostnames(componentEl);
      globalClick.addHandler(convertAffiliateLink, revertSkimLink);
    }
  };

  return constructor;
}]);
}, {"1":1,"30":30,"31":31,"32":32,"33":33,"34":34,"35":35,"36":36}];
