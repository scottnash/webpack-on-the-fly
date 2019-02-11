window.modules["taboola.client"] = [function(require,module,exports){'use strict';

module.exports = function (el) {
  var taboolaId = el.getAttribute('data-taboolaId'),
      site = el.getAttribute('data-site-slug');

  if (el.classList.contains('disabled')) {
    return;
  } // Initialize Taboola.


  window._taboola = window._taboola || [];

  window._taboola.push({
    article: 'auto'
  });

  !function (e, f, u, i) {
    if (!document.getElementById(i)) {
      e.async = 1;
      e.src = u;
      e.id = i;
      f.parentNode.insertBefore(e, f);
    }
  }(document.createElement('script'), document.getElementsByTagName('script')[0], "//cdn.taboola.com/libtrc/".concat(taboolaId, "/loader.js"), 'tb_loader_script');

  if (window.performance && typeof window.performance.mark == 'function') {
    window.performance.mark('tbl_ic');
  } // Fire the units.


  pushUnits(window._taboola, site); // Finish up.

  window._taboola.push({
    flush: true
  });
};

function pushUnits(taboola, site) {
  var isVulture = site === 'vulture'; // Push different units to taboola based on breakpoint

  if (window.innerWidth >= 1180) {
    // Desktop.
    taboola.push({
      mode: isVulture ? 'thumbnails-f' : 'thumbnails-b',
      container: 'taboola-desktop-below-article-thumbnails',
      placement: 'Desktop Below Article Thumbnails',
      target_type: 'mix'
    });
  } else if (window.innerWidth >= 768) {
    // Tablet
    taboola.push({
      mode: isVulture ? 'thumbnails-g' : 'thumbnails-c',
      container: 'taboola-tablet-below-article-thumbnails',
      placement: 'Tablet Below Article Thumbnails',
      target_type: 'mix'
    });
  } else {
    // Mobile.
    taboola.push({
      mode: isVulture ? 'thumbnails-h' : 'thumbnails-d',
      container: 'taboola-mobile-below-article-thumbnails',
      placement: 'Mobile Below Article Thumbnails',
      target_type: 'mix'
    });
  }
}
}, {}];
