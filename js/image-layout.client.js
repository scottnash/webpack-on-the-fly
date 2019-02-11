window.modules["image-layout.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('image-layout', ['$window', function ($window) {
  function Constructor(el) {
    this.el = el;
    this.row = dom.findAll(this.el, '.hidden');
    this.inView();
    this.handleEvents();
  }

  Constructor.prototype = {
    handleEvents: function handleEvents() {
      $window.addEventListener('scroll', this.inView.bind(this));
    },
    // start fade in transition when image enters the viewport
    inView: function inView() {
      var i,
          posFromTop,
          windowHeight = window.innerHeight;

      for (i = 0; i < this.row.length; i++) {
        posFromTop = this.row[i].getBoundingClientRect().top;

        if (posFromTop - windowHeight <= 0) {
          this.row[i].classList.remove('hidden');
          this.row[i].classList.add('fade-in-element');
        }
      }
    }
  };
  return Constructor;
}]);
}, {"1":1}];
