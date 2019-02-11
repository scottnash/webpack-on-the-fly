window.modules["product-list.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _debounce = require(107);

DS.controller('product-list', [function () {
  function Constructor(el) {
    var itemLength = parseInt(dom.find(el, '.product-list-wrapper').getAttribute('data-items')),
        slides = dom.findAll(el, '.product'),
        list = dom.find(el, '.product-list-products');
    this.nextButton = dom.find(el, '.next');
    this.prevButton = dom.find(el, '.prev');
    this.slides = slides;
    this.list = list;

    function setButtons() {
      var windowWidth = window.innerWidth;

      if (itemLength <= 1) {
        return;
      }

      if (windowWidth <= 768 || windowWidth <= 1180 && itemLength > 2 || windowWidth > 1180 && itemLength > 3) {
        // eslint-disable-line no-extra-parens
        slides[slides.length - 1].classList.add('reference');
        list.classList.add('slideable');
      } else {
        list.classList.remove('slideable');
      }
    }

    setButtons();
    window.addEventListener('resize', _debounce(setButtons, 300));
  }

  Constructor.prototype = {
    events: {
      '.next click': 'next',
      '.prev click': 'prev'
    },
    next: function next() {
      this.slide('next');
    },
    prev: function prev() {
      this.slide('prev');
    },
    slide: function slide(where) {
      var el, i, newSlide;
      el = dom.find(this.list, '.reference');
      el.classList.remove('reference');

      if (where === 'next') {
        newSlide = this.getNextSlide(el);
        this.list.classList.remove('is-reversing');
      } else {
        newSlide = this.getPrevSlide(el);
        this.list.classList.add('is-reversing');
      }

      newSlide.classList.add('reference');
      newSlide.style.order = 1;

      for (i = 2; i <= this.slides.length; i++) {
        newSlide = this.getNextSlide(newSlide);
        newSlide.style.order = i;
      }

      this.list.classList.remove('is-set');
      window.setTimeout(function () {
        this.list.classList.add('is-set');
      }.bind(this), 50);
    },
    getNextSlide: function getNextSlide(el) {
      return el.nextElementSibling || this.slides[0];
    },
    getPrevSlide: function getPrevSlide(el) {
      return el.previousElementSibling || this.slides[this.slides.length - 1];
    }
  };
  return Constructor;
}]);
}, {"1":1,"107":107}];
