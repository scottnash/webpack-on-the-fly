window.modules["image-reveal.client"] = [function(require,module,exports){'use strict';

DS.controller('image-reveal', [function () {
  function Constructor(el) {
    this.el = el;
  }

  Constructor.prototype = {
    events: {
      '.img-wrap click': 'swapImage'
    },
    swapImage: function swapImage() {
      this.el.classList.toggle('active');
    }
  };
  return Constructor;
}]);
}, {}];
