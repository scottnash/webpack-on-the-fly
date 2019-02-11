window.modules["flip-cards.client"] = [function(require,module,exports){'use strict';

var _throttle = require(23),
    $visibility = require(26);

DS.controller('flip-cards', [function () {
  function Constructor(el) {
    this.cards = el.querySelectorAll('.flip-cards-card, .flip-card-shoppable');
    this.firstCard = this.cards[0];
    this.flipSet = this.firstCard.classList.contains('flip-cards-card-flips');
    this.multipleCards = this.cards.length > 1;
    this.shouldAutoFlip = this.flipSet && this.multipleCards;

    if (this.shouldAutoFlip) {
      this.flipListener = window.addEventListener('scroll', _throttle(this.firstCardFlip.bind(this), 33));
    }
  }

  Constructor.prototype = {
    firstCardFlip: function firstCardFlip() {
      if (this.shouldAutoFlip && $visibility.isElementInViewport(this.firstCard)) {
        window.removeEventListener('scroll', this.flipListener);
        this.firstCard.classList.toggle('active');
        this.shouldAutoFlip = false;
        window.setTimeout(function () {
          this.firstCard.classList.toggle('active');
        }.bind(this), 1000);
      }
    }
  };
  return Constructor;
}]);
}, {"23":23,"26":26}];
