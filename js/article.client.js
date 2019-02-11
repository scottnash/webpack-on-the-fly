window.modules["article.client"] = [function(require,module,exports){'use strict';

var $visibility = require(26),
    $gtm = require(41),
    ImageZoom = require(45);

DS.controller('article', [function () {
  var Constructor,
      bottomMargin = 40;
  /**
   * send custom GTM custom event when the user scrolls to end of article
   * note: this implementation assumes that tags are visible only at the end of the article
   * @param {Element} el
   */

  function watchForEndOfArticle(el) {
    var tags = el.querySelector('.bottom-share'),
        tagsVisible;

    if (!!tags) {
      tagsVisible = new $visibility.Visible(tags);
      tagsVisible.on('shown', function () {
        var url = window.location.href.split('?')[0];
        $gtm.reportCustomEvent({
          category: 'scroll tracking',
          action: 'article end',
          label: 'on=' + url
        });
        tagsVisible.destroy();
      });
    }
  }

  function adjustRightRailHeight(el) {
    var tertiaryContainer = document.querySelector('.wrapper > .tertiary'),
        header = el.querySelector('.article-header'),
        headerImg = header ? header.querySelector('img') : null,
        setPadding = function setPadding() {
      tertiaryContainer.style.paddingTop = header.getBoundingClientRect().height + bottomMargin + 'px';
    };

    if (!tertiaryContainer || !header) {
      return;
    }

    if (window.innerWidth < 1180) {
      tertiaryContainer.style.paddingTop = '0px';
      return;
    } // if theres no img in the header or the img is already loaded, calculate the height of the header
    // and set the padding on the right rail


    if (!headerImg) {
      setPadding();
    } else if (headerImg.complete) {
      // Firefox computes the height slightly slower than when img.complete is set to true. So, listen
      // to onload instead.
      if (headerImg.getBoundingClientRect().height === 0) {
        headerImg.onload = setPadding;
      }

      setPadding();
    } else {
      // otherwise wait for the img to load before setting the padding
      headerImg.addEventListener('load', setPadding);
    }
  }
  /**
   * @param {Element} el
   * @constructor
   * @property {Element} el
   */


  Constructor = function Constructor(el) {
    this.el = el;
    $visibility.setPrimaryContent(el.querySelector('.article-content'));
    ImageZoom(el);
    watchForEndOfArticle(el);
    adjustRightRailHeight(el);
    window.addEventListener('resize', function () {
      return adjustRightRailHeight(el);
    });
  };

  return Constructor;
}]);
}, {"26":26,"41":41,"45":45}];
