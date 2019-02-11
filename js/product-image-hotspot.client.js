window.modules["product-image-hotspot.client"] = [function(require,module,exports){'use strict';

var _debounce = require(107),
    Hammer = require(112),
    dom = require(1);

DS.controller('product-image-hotspot', ['$window', function ($window) {
  function Constructor(el) {
    var hammerTime;
    this.offset = 0, this.increment = $window.innerWidth, this.colored = 0, this.items = dom.findAll(el, '.product-image-hotspot-item-wrapper'), this.productTotal = this.items.length, this.width = this.productTotal * $window.innerWidth, this.imageItem = dom.findAll(el, '.product-image-hotspot-item-first-column');
    this.dotIcons = dom.findAll(el, '.product-image-hotspot-item-second-column-dot');
    this.imageItemsList = dom.find(el, '.product-image-hotspot-item');
    this.icon = dom.findAll(el, '.product-image-hotspot-info-icon');
    this.image = dom.find(el, '.product-image-hotspot-image');

    if ($window.innerWidth < 1180) {
      this.imageItemsList.style.width = this.width + 'px';
    }

    this.debounceResizeHandler = _debounce(this.resizeDebounced, 300);
    $window.addEventListener('resize', this.resizeItems.bind(this));
    hammerTime = new Hammer(this.imageItemsList);
    hammerTime.on('swiperight', this.swipeItemRight.bind(this));
    hammerTime.on('swipeleft', this.swipeItemLeft.bind(this));

    this.selectIcon = function () {
      var index = this.items[0].firstElementChild.getAttribute('data-index');
      this.icon[index].classList.add('active');
    };

    $window.addEventListener('load', this.selectIcon.bind(this));
  }

  Constructor.prototype = {
    events: {
      '.product-image-hotspot-info-icon click': 'handleClick'
    },
    handleClick: function handleClick(e) {
      var i, parentDiv, position;

      if ($window.innerWidth >= 1180) {
        parentDiv = dom.closest(e.target, 'button');
        position = parentDiv.parentElement.getAttribute('data-index');

        for (i = 0; i < this.imageItem.length; i++) {
          if (i == position) {
            this.imageItem[i].classList.add('show');
            this.icon[i].classList.add('active');
            this.dotIcons[i].classList.add('current-dot');
          } else {
            this.imageItem[i].classList.remove('show');
            this.icon[i].classList.remove('active');
            this.dotIcons[i].classList.add('remove-dot');
          }
        }
      }
    },
    swipeItemLeft: function swipeItemLeft() {
      var i;

      if ($window.innerWidth < 1180) {
        if (this.offset < $window.innerWidth * (this.productTotal - 1)) {
          this.offset += this.increment;
          this.colored++;
          this.imageItemsList.style.webkitTransform = 'translate(-' + this.offset + 'px)';
          this.imageItemsList.style.transform = 'translate(-' + this.offset + 'px)';

          for (i = 0; i < this.items.length; i++) {
            if (i == this.colored) {
              this.dotIcons[i].classList.add('current-dot');
            } else {
              this.dotIcons[i].classList.remove('current-dot');
            }
          }
        }
      }
    },
    swipeItemRight: function swipeItemRight() {
      var i;

      if ($window.innerWidth < 1180) {
        if (this.offset > 0) {
          this.offset -= this.increment;
          this.colored--;
          this.imageItemsList.style.webkitTransform = 'translate(-' + this.offset + 'px)';
          this.imageItemsList.style.transform = 'translate(-' + this.offset + 'px)';

          for (i = 0; i < this.items.length; i++) {
            if (i == this.colored) {
              this.dotIcons[i].classList.add('current-dot');
            } else {
              this.dotIcons[i].classList.remove('current-dot');
            }
          }
        }
      }
    },
    resizeDebounced: function resizeDebounced() {
      this.sizeItem();
    },
    resizeItems: function resizeItems() {
      this.debounceResizeHandler();
    },
    sizeItem: function sizeItem() {
      var previousWidth = this.width,
          previousOffset = this.offset,
          itemShown = previousWidth / previousOffset;
      this.increment = $window.innerWidth;
      this.width = this.productTotal * $window.innerWidth;

      if (itemShown == Infinity) {
        // handles the case where the first item is shown, so the offset is 0
        this.offset = 0;
      } else {
        this.offset = itemShown * this.width;
      }

      if ($window.innerWidth < 1180) {
        this.productTotal = this.items.length;
        this.imageItemsList.style.width = this.width + 'px';
        this.imageItemsList.style.webkitTransform = 'translate(-' + this.offset + 'px)';
        this.imageItemsList.style.transform = 'translate(-' + this.offset + 'px)';
      } else {
        this.width = this.image.offsetWidth;
        this.imageItemsList.style.width = this.width + 'px';
        this.imageItemsList.style.transform = 'translate(0px)';
        this.imageItemsList.style.webkitTransform = 'translate(0px)';
      }
    }
  };
  return Constructor;
}]);
}, {"1":1,"107":107,"112":112}];
