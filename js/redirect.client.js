window.modules["redirect.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _mapValues = require(178),
    _omit = require(121),
    _isString = require(164),
    globalClick = require(30),
    visit = require(31),
    auth0 = require(7);
/**
 * updates urls to go through our redirect for server-side tracking
 */


DS.service('redirectService', [function () {
  var href = 'href',
      // set `data-no-redirect="true"` to not track/redirect the link
  noRedirectAttribute = 'data-no-redirect',
      // `base` needs to be on same host so that cookies remain in request
  // `base` is calculated based on site.redirectPath when component loads
  base = '',
      visitStateQueryParam = '',
      maxValueLength = 255; // same as mixpanel's library; helps prevent query-string from getting too long

  /**
   *
   * @param {string} url
   * @returns {boolean}
   */

  function isRedirectUrl(url) {
    return url.indexOf(base) === 0;
  }
  /**
   *
   * @param {string} url - redirect URL
   * @returns {string} original destination URL
   */


  function redirectUrlToUrl(url) {
    return decodeURIComponent(url.split(base + '?url=').pop().split('&')[0]);
  }
  /**
   * convert URL to a redirect URL if it is not already a redirect URL
   * @param {string} url - resolved, absolute url to which to redirect
   * @param {string} [componentUri] - uri of the closest component
   * @returns {string} format of the redirect url:
   *                   {{ host }}/url?url={{ urlClickedOn }}&c={{ parentComponentUri }}&v={{ visitStateOnPageLoad }}&ts={{ timeOfClick }}
   */


  function urlToRedirectUrl(url, componentUri) {
    if (isRedirectUrl(url)) {
      // it is a redirect URL, but the data is not correct, so need to rebuild the redirect URL
      url = redirectUrlToUrl(url);
    }

    return base + '?url=' + encodeURIComponent(url) + ( // url goes first in case the full tracking url is truncated during request
    ((componentUri ? '&c=' + encodeURIComponent(componentUri) : ''))) + // we only know the componentUri on click
    '&v=' + visitStateQueryParam + // we know this on load so stored in a var
    '&ts=' + Date.now(); // could allow us to transfer user id across domains, also prevents caching
  }
  /**
   *
   * @param {Element} el
   * @returns {string|null}
   */


  function getClosestComponentUri(el) {
    var component = dom.closest(el, '[data-uri]');
    return component && component.getAttribute('data-uri');
  }
  /**
   *
   * @param {Element} anchor
   * @param {string}  anchor.href
   */


  function ensureRedirectAnchor(anchor) {
    anchor.setAttribute(href, urlToRedirectUrl(anchor[href], getClosestComponentUri(anchor)));
  }
  /**
   *
   * @param {string} url
   * @returns {boolean}
   */


  function isStandardUriScheme(url) {
    var urlHead = url.toLowerCase().substr(0, 5);
    return urlHead === 'http:' || urlHead === 'https';
  }
  /**
   * only redirect if it is a normal link that does not have have the noRedirectAttribute
   * @param {Element} anchor
   * @returns {boolean}
   */


  function shouldRedirectAnchor(anchor) {
    return anchor.getAttribute(noRedirectAttribute) !== 'true' && isStandardUriScheme(anchor[href] || '');
  }
  /**
   * adds the redirect
   * @param {Event} e
   */


  function addRedirect(e) {
    var anchor = dom.closest(e.target, 'a');

    if (!e.defaultPrevented && anchor && shouldRedirectAnchor(anchor)) {
      ensureRedirectAnchor(anchor);
    }
  }
  /**
   * removes the redirect if it has been added
   * @param {Event} e
   */


  function removeRedirect(e) {
    var anchor = dom.closest(e.target, 'a'),
        url = anchor && anchor[href];

    if (url && isRedirectUrl(url)) {
      anchor.setAttribute(href, redirectUrlToUrl(url));
    }
  }
  /**
   * document-specific tracking data;
   * right now this is all handled by the visit service
   *
   * todo: consider if the query params are getting too long, and could do more on server-side
   *
   * @param {object}  visitState
   * @param {string}  visitState.browser              todo: could do server-side, but would need to pass userAgent
   * @param {string}  visitState.browserVersion       todo: could do server-side, but would need to pass userAgent
   * @param {string}  visitState.clientId             todo: **should** do server-side with cookie
   * @param {string}  visitState.currentUrl
   * @param {number}  visitState.firstVisitTimestamp  todo: could do server-side, but would require storing sessions
   * @param {string}  visitState.initialReferrer      todo: could do server-side, but would require storing sessions
   * @param {boolean} visitState.isNewVisit           todo: could do server-side, but would require storing sessions
   * @param {string}  visitState.os                   todo: could do server-side, but would need to pass userAgent
   * @param {string}  visitState.pageUri              clay-specific
   * @param {string}  visitState.referrer
   * @param {number}  visitState.screenHeight
   * @param {number}  visitState.screenWidth
   * @param {string}  visitState.utm_campaign         todo: could do server-side, but would need to pass full queryString
   * @param {string}  visitState.utm_content          todo: could do server-side, but would need to pass full queryString
   * @param {string}  visitState.utm_source           todo: could do server-side, but would need to pass full queryString
   * @param {string}  visitState.utm_medium           todo: could do server-side, but would need to pass full queryString
   * @param {string}  visitState.utm_term             todo: could do server-side, but would need to pass full queryString
   * @param {number}  visitState.visitCount           todo: could do server-side, but would require storing sessions
   *
   */


  function setVisitStateQueryParam(visitState) {
    visitState.isLoggedIn = auth0.isAuthenticated();

    try {
      visitStateQueryParam = encodeURIComponent( // base64 encoded works in all contexts including email
      btoa(JSON.stringify(_mapValues( // omit visitState.timestamp because contains time of page load not of click, and time handled server-side
      _omit(visitState, 'timestamp'), // prevent any value from being too long
      function (val) {
        return _isString(val) && val.length > maxValueLength ? val.substr(0, maxValueLength) : val;
      }))));
    } catch (e) {
      visitStateQueryParam = ''; // to debug look in the `v` query param on click
    }
  }
  /**
   * waits for the visit service before adding click tracking
   */


  function init() {
    visit.onceReady(function (visitState) {
      setVisitStateQueryParam(visitState);
      globalClick.setFinalHandler(addRedirect, removeRedirect);
    });
  }
  /**
   *
   * @param {string} resolvedUrl  - this should be a resolved, absolute url so that it can be matched properly
   */


  function setBase(resolvedUrl) {
    base = resolvedUrl;
  }

  init();
  this.setBase = setBase;
}]);
DS.controller('redirect', ['redirectService', function (redirectService) {
  return function (componentEl) {
    // resolvedRedirectBase prepends the current domain to the `site.redirectPath`
    var resolvedRedirectBase = componentEl.href;
    redirectService.setBase(resolvedRedirectBase);
  };
}]);
}, {"1":1,"7":7,"30":30,"31":31,"121":121,"164":164,"178":178}];
