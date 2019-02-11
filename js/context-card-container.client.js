window.modules["context-card-container.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('context-card-container', [function () {
  function Constructor(el) {
    this.cardWrapper = dom.find(el, '.context-cards-wrapper');
    this.cardsDeck = dom.findAll(el, '.context-card');
    this.leftArrow = dom.find(el, '.card-left-arrow');
    this.rightArrow = dom.find(el, '.card-right-arrow');
    this.cardIndex = 1;
    this.numCards = this.cardsDeck.length;
    this.cardsCount = dom.find(el, '.cards-count');
    this.currentCardNumber = dom.find(el, '.current');
  }

  Constructor.prototype = {
    events: {
      '.card-left-arrow click': 'slideLeft',
      '.card-right-arrow click': 'slideRight'
    },
    // slide right unless this is the last card
    slideRight: function slideRight() {
      if (this.cardIndex < this.numCards) {
        this.cardIndex += 1;
        this.moveCards();
      }
    },
    // slide left unless this is the first card
    slideLeft: function slideLeft() {
      if (this.cardIndex > 1) {
        this.cardIndex -= 1;
        this.moveCards();
      }
    },
    moveCards: function moveCards() {
      if (this.cardsDeck[this.cardIndex - 1]) {
        var dist = this.cardsDeck[this.cardIndex - 1].offsetLeft;
        this.cardWrapper.setAttribute('style', 'transform: translateX(-' + dist + 'px)');
        this.setCardNav();
      }
    },
    setCardNav: function setCardNav() {
      this.currentCardNumber.innerHTML = this.cardIndex + ' / ';

      if (this.cardIndex === 1) {
        this.leftArrow.classList.add('hidden');
      } else {
        this.leftArrow.classList.remove('hidden');
      }

      if (this.cardIndex === this.numCards) {
        this.rightArrow.classList.add('hidden');
      } else {
        this.rightArrow.classList.remove('hidden');
      }
    }
  };
  return Constructor;
}]);
}, {"1":1}];
