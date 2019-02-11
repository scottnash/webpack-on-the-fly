window.modules["giphy.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    $visibility = require(26);

DS.controller('giphy', [function () {
  // Number of giphy components that must be on the page to activate lazy loading.
  var LAZY_LOAD_MINIMUM = 10,
      // Percentage of giphy component's vertical space must be shown for the giphy to load
  SHOWN_TRESHOLD = 0.05,
      totalGiphys = document.querySelectorAll('.giphy').length,
      lazyLoadGiphys = totalGiphys >= LAZY_LOAD_MINIMUM,
      viewportIsDesktop = window.innerWidth >= 1180;

  function Constructor(el) {
    this.el = el;

    if (lazyLoadGiphys) {
      this.initializeVisible();
    } else {
      this.showContent();
    }
  }

  Constructor.prototype = {
    events: {
      '.overlay-button-hide click': 'playVideo'
    },
    playVideo: function playVideo() {
      if (this.video.paused) {
        this.video.play();
        this.button.classList.add('overlay-button-hide');
      } else {
        this.video.pause();
        this.button.classList.remove('overlay-button-hide');
      }
    },
    setPlayElements: function setPlayElements() {
      this.video = dom.find(this.el, '.giphy-embed');
      this.button = dom.find(this.el, '.overlay-button-hide');
    },
    setDesktopVideoSrcAndPoster: function setDesktopVideoSrcAndPoster() {
      this.video.src = this.video.dataset.desktopSrc;
      this.video.poster = this.video.dataset.desktopPoster;
    },
    initializeVisible: function initializeVisible() {
      var visible = new $visibility.Visible(this.el, {
        shownThreshold: SHOWN_TRESHOLD
      });
      visible.on('shown', this.showContent.bind(this, this.el));
    },

    /**
    * Reveal an element's commented-out HTML content.
    * @param {HtmlElement} el
    **/
    showContent: function showContent() {
      var html = this.el.innerHTML;
      html = html.replace('<!--', '');
      html = this.replaceRight(html, '-->', '');
      this.el.innerHTML = html;
      this.setPlayElements();

      if (viewportIsDesktop) {
        this.setDesktopVideoSrcAndPoster();
      }
    },

    /**
    * Replace needle in string.
    * @param {string} str
    * @param {string} needle
    * @param {string} replace
    * @returns {string}
    */
    replaceRight: function replaceRight(str, needle, replace) {
      var pos = str.lastIndexOf(needle);
      if (pos === -1) return str;
      return str.substring(0, pos) + replace + str.substring(pos + needle.length);
    }
  };
  return Constructor;
}]);
}, {"1":1,"26":26}];
