window.modules["flip-card-shoppable.client"] = [function(require,module,exports){'use strict';

var $gtm = require(41);

DS.controller('flip-card-shoppable', [function () {
  function Constructor(el) {
    this.el = el;
    this.shouldFlip = el.classList.contains('flip-cards-card-flips');
  }

  Constructor.prototype = {
    events: {
      '.front-image-wrapper click': 'addFlipClass',
      '.close-shoppable click': 'addFlipClass',
      '.shop-now-url click': 'addGoogleTracking'
    },
    addFlipClass: function addFlipClass() {
      if (this.shouldFlip) {
        this.el.classList.toggle('active');
      }
    },
    addGoogleTracking: function addGoogleTracking(e) {
      var productNameEl = e.target.parentElement.querySelector('.product-name'),
          productNameText = productNameEl.innerText;
      $gtm.reportCustomEvent({
        category: 'sponsored',
        label: 'shoppable flip card',
        action: 'shop now click product is : ' + productNameText
      });
    }
  };
  return Constructor;
}]);
}, {"41":41}];
