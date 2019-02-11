window.modules["flip-cards-card.client"] = [function(require,module,exports){'use strict';

DS.controller('flip-cards-card', [function () {
  function Constructor(el) {
    this.el = el;
    this.shouldFlip = el.classList.contains('flip-cards-card-flips');
  }

  Constructor.prototype = {
    events: {
      click: 'addFlipClass'
    },
    addFlipClass: function addFlipClass() {
      if (this.shouldFlip) {
        this.el.classList.toggle('active');
      }
    }
  };
  return Constructor;
}]);
}, {}];
