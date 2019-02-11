window.modules["subscription-gift-promo.client"] = [function(require,module,exports){'use strict';

DS.controller('subscription-gift-promo', [function () {
  function Constructor(el) {
    var promoText = el.querySelector('.subscription-gift-promo .promo-text');

    if (promoText) {
      var container = promoText.parentElement,
          containerHeight = container.offsetHeight;

      if (promoText.offsetHeight > containerHeight) {
        container.classList.toggle('grow');
      }
    }
  }

  return Constructor;
}]);
}, {}];
