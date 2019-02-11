window.modules["image-slide.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _debounce = require(107);

DS.controller('image-slide', ['$window', function ($window) {
  function ImageSlide(el) {
    this.el = el;
    this.xCoord;
    this.secondaryImage = dom.find(el, '.secondary-image');
    this.primaryImage = dom.find(el, '.primary-image');
    this.divisor;
    this.arrow = dom.find(el, '.arrow');
    this.slider = dom.find(el, '.slider');
    this.debounceResizeHandler = _debounce(this.resizeDebounced, 300);
    $window.addEventListener('resize', this.resizeImages.bind(this));

    if (window.innerWidth < 1180) {
      this.sizeImage();
    }
  }

  ImageSlide.prototype = {
    events: {
      '.image-slide-wrapper mousemove': 'hoverToMove',
      '.slider input': 'slideToMove'
    },
    hoverToMove: function hoverToMove(evt) {
      this.setDivisor();
      this.setCoord(evt);
    },
    slideToMove: function slideToMove() {
      var sliderPos = this.slider.value;
      this.secondaryImage.style.width = sliderPos + '%';
      this.hideArrow();
    },
    moveThumb: function moveThumb(value) {
      this.slider.value = value;
    },
    setCoord: function setCoord(evt) {
      if (evt.touches) {
        this.xCoord = evt.touches[0].pageX;
      } else {
        this.xCoord = evt.offsetX ? evt.offsetX : evt.layerX;
      }

      this.hideArrow();
      this.moveImage();
    },
    setDivisor: function setDivisor() {
      var width = this.el.offsetWidth;
      this.divisor = width / 100;
    },
    moveImage: function moveImage() {
      var percentage = Math.ceil(this.xCoord / this.divisor);

      if (percentage <= 100) {
        this.secondaryImage.style.width = percentage + '%';
        this.moveThumb(percentage);
      }
    },
    resizeDebounced: function resizeDebounced() {
      this.sizeImage();
    },
    resizeImages: function resizeImages() {
      this.debounceResizeHandler();
    },
    hideArrow: function hideArrow() {
      if (!this.arrow.classList.contains('hide-arrow')) {
        this.arrow.classList.add('hide-arrow');
      }
    },
    sizeImage: function sizeImage() {
      var width = this.el.offsetWidth,
          height = this.el.offsetHeight;
      this.secondaryImage.style.maxWidth = width + 'px';
      this.secondaryImage.children[0].style.height = height + 'px';
    }
  };
  return ImageSlide;
}]);
}, {"1":1,"107":107}];
