window.modules["chartbeat.legacy"] = [function(require,module,exports){'use strict';

var page = require(116),
    auth0 = require(7);
/* eslint max-params: ["error", 10] */


DS.service('chartbeat', ['$document', '$window', function ($document, $window) {
  var sponsorData = $document.getElementById('cb-sponsor-data');
  /**
   * Get section corresponding to the article.
   * Also gets the content-channel, if applicable
   * @returns {String}
   */

  function getSections() {
    // Get the host section via page data-uri instead of window.location host or pathname
    var host = page.getSiteBase(),
        siteName = page.getSiteName(),
        // Set section to match found, or default to host if not
    section = siteName ? siteName : host; // Add content channel for The Cut and Vulture only

    if (section === 'The Cut' || section === 'Vulture') {
      section += [',', section, page.getChannel()].join(' ');
    }

    return section;
  }
  /**
   * Executes the function either on $window.onload, or immediately if $window.onload already fired.
   * @param {function} fn The function to execute on load.
   */


  function onLoadOrNow(fn) {
    var onLoad;

    if ($document.readyState === 'complete') {
      fn();
    } else {
      onLoad = typeof $window.onload === 'function' ? $window.onload : function () {};

      $window.onload = function () {
        onLoad();
        fn();
      };
    }
  }
  /**
   * Find if the story is sponsored.
   * @returns {boolean}
   */


  function isSponsored() {
    var el = page.getPrimaryPageComponent();
    return el && el.getAttribute('data-type') === 'Sponsored Story';
  }
  /**
   * Get (and set) article authors
   */


  function getAuthors() {
    var authors = $document.querySelectorAll('.article-author');

    if (authors.length) {
      $window._sf_async_config.authors = authors[0].textContent.trim();
    }
  }
  /**
   * Chartbeat init. Provided by Chartbeat.
   */


  function loadChartbeat() {
    var e = $document.createElement('script');
    $window._sf_endpt = new Date().getTime();
    e.setAttribute('language', 'javascript');
    e.setAttribute('type', 'text/javascript');
    e.setAttribute('src', '//static.chartbeat.com/js/chartbeat.js');
    $document.body.appendChild(e);
  } // Chartbeat config. Needs to be global.


  $window._sf_async_config = {
    uid: 19989,
    useCanonical: true,
    domain: 'nymag.com',
    sections: getSections()
  };

  if (isSponsored()) {
    $window._sf_async_config.sponsorName = sponsorData && sponsorData.getAttribute('data-sponsor');
    $window._sf_async_config.type = 'Sponsored';
  } else {
    $window._sf_async_config.sponsorName = undefined;
  } // call this immediately


  getAuthors(); // Cheatbeat custom metrics.

  $window._cbq = $window._cbq || [];
  auth0.on('init', function () {
    $window._cbq.push(['_acct', auth0.isAuthenticated() ? 'lgdin' : 'anon']);

    onLoadOrNow(loadChartbeat);
  });
}]); // Run chartbeat as soon as all services have loaded.

setTimeout(function () {
  DS.get('chartbeat');
}, 0);
}, {"7":7,"116":116}];
