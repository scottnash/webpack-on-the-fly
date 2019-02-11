window.modules["lede-video.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    $visibility = require(26);

DS.controller('lede-video', [function () {
  /**
   * @param {Element} el
   * @Constructor
   */
  function Constructor(el) {
    this.el = el;
    $visibility.setPrimaryContent(el.querySelector('.lede-video-container'));
  }

  Constructor.prototype = {
    events: {
      '.lede-video-read-more click': 'readMoreHandler'
    },
    readMoreHandler: function readMoreHandler() {
      var textContainer = dom.find(this.el, '.lede-video-hide-description'),
          readMoreButton = dom.find(this.el, '.lede-video-read-more');

      if (textContainer && readMoreButton) {
        textContainer.classList.remove('lede-video-hide-description');
        dom.removeElement(readMoreButton);
      }
    }
  };
  return Constructor;
}]);
}, {"1":1,"26":26}];
