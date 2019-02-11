window.modules["lede-gallery.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('lede-gallery', [function () {
  function Constructor(el) {
    this.gallery = dom.find(el, '.image-gallery-nav'); // use the .nav-container as the gallery top so sticky nav doesn't slightly overlap the first photo
  }

  Constructor.prototype = {
    events: {
      '.lede-image-wrapper click': 'goToGallery'
    },
    goToGallery: function goToGallery() {
      this.gallery.scrollIntoView();
      this.gallery.focus();
    }
  };
  return Constructor;
}]);
}, {"1":1}];
