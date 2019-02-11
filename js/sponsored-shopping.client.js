window.modules["sponsored-shopping.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('sponsored-shopping', [function () {
  // Cache magic strings
  var SELECTORS = {
    NEXT: '.next-arrow',
    PREVIOUS: '.previous-arrow',
    UP: '.up-arrow',
    DOWN: '.down-arrow',
    PRODUCT_GROUP: '.products',
    PRODUCT: '.sponsored-shopping-product',
    CONTAINER: '.sponsored-products-group',
    IMAGE: '.product-image'
  },
      ACTIVE = 'active',
      topY = 0,
      rightX = 0,
      onStandardArticlePage = 'on-standard-page',
      productImageFixedHeight = 320;

  function Constructor(el) {
    // Treatment depends whether component is horizontal or vertical and whether page is standard article or one column
    this.isHorizontal = dom.closest(el, '.sponsored-shopping').classList.contains('sponsored-shopping-horizontal');
    this.isVertical = dom.closest(el, '.sponsored-shopping').classList.contains('sponsored-shopping-vertical');
    this.isOnStandardArticlePage = dom.closest(el, 'body').classList.contains('layout'); // Reference to individual el
    // Basic calculations

    this.el = el;
    this.productGroup = dom.find(el, SELECTORS.PRODUCT_GROUP);
    this.products = dom.findAll(el, SELECTORS.PRODUCT);
    this.nextArrow = dom.find(el, SELECTORS.NEXT);
    this.previousArrow = dom.find(el, SELECTORS.PREVIOUS);
    this.upArrow = dom.find(el, SELECTORS.UP);
    this.downArrow = dom.find(el, SELECTORS.DOWN);
    this.container = dom.find(el, SELECTORS.CONTAINER);
    this.productImage = dom.find(el, SELECTORS.IMAGE); // Use image height to calculate where the arrows go

    this.productImageHeight = window.getComputedStyle(this.productImage, null).getPropertyValue('height').replace(/[^\d\.\-]/g, ''); // For the horizontal unit, arrows should be at half the height of the product images, plus 60 px which is the space
    // from the top of the unit to the top of the image row, minus 1/2 the height of the arrow (16.5px)

    this.nextAndPreviousArrowsFromTop = this.productImageHeight / 2 + 43.5;
    this.productCount = this.products.length; // For horizontal component.  If it's on a standard article page, constrain natural width of 536px to leave room for arrows.

    if (this.isOnStandardArticlePage) {
      this.containerWidth = 450;
    } else {
      this.containerWidth = this.container.offsetWidth;
    }

    this.productsInView = this.setNumberOfProductsInView(this.productCount);
    this.scrollXBy = this.containerWidth / this.productsInView;
    this.widthOfAllProducts = this.productCount * this.scrollXBy; // For vertical component

    this.containerHeight = this.container.offsetHeight;
    this.scrollYBy = productImageFixedHeight;
    this.heightOfAllProducts = this.productCount * this.scrollYBy;
    this.hiddenProductCount = this.productCount - this.productsInView;

    if (this.isOnStandardArticlePage) {
      el.classList.add(onStandardArticlePage);
    }

    if (this.isHorizontal && this.productCount > 3 && this.isOnStandardArticlePage) {
      this.setupHorizontalHandlers();
      this.attachHorizontalEvents();
      this.prepareHorizontalArrows();
    } else if (this.isHorizontal && this.productCount > 4 && !this.isOnStandardArticlePage) {
      this.setupHorizontalHandlers();
      this.attachHorizontalEvents();
      this.prepareHorizontalArrows();
    } else if (this.isVertical && this.productCount > 2) {
      this.setupVerticalHandlers();
      this.attachVerticalEvents();
      this.prepareDownArrow();
    }
  }

  Constructor.prototype = {
    // For the horizontal component
    // Set up horizontal event handlers
    setupHorizontalHandlers: function setupHorizontalHandlers() {
      this.nextHandler = this.nextHandler.bind(this);
      this.previousHandler = this.previousHandler.bind(this);
      return this;
    },
    // Attach horizontal events
    attachHorizontalEvents: function attachHorizontalEvents() {
      this.nextArrow.addEventListener('click', this.nextHandler);
      this.previousArrow.addEventListener('click', this.previousHandler);
      return this;
    },
    // Prepare initial arrow (right) for horizontal layout and set top position on both arrows
    prepareHorizontalArrows: function prepareHorizontalArrows() {
      this.nextArrow.style.top = this.nextAndPreviousArrowsFromTop + 'px';
      this.previousArrow.style.top = this.nextAndPreviousArrowsFromTop + 'px';
      this.nextArrow.classList.add(ACTIVE);
    },
    setNumberOfProductsInView: function setNumberOfProductsInView(count) {
      if (this.isHorizontal) {
        if (count <= 3 || this.isOnStandardArticlePage) {
          return 3;
        } else {
          return 4;
        }
      } else if (this.isVertical) {
        return 2;
      }
    },
    // handle what happens when next and previous are clicked on horizontal
    nextHandler: function nextHandler() {
      if (rightX === 0) {
        this.previousArrow.classList.add(ACTIVE);
      }

      if (rightX < this.widthOfAllProducts - this.scrollXBy) {
        rightX += this.scrollXBy;
        this.productGroup.style.right = rightX + 'px';

        if (rightX === this.hiddenProductCount * this.scrollXBy) {
          this.nextArrow.classList.remove(ACTIVE);
        }
      }
    },
    previousHandler: function previousHandler() {
      if (rightX > 0) {
        rightX -= this.scrollXBy;
        this.productGroup.style.right = rightX + 'px';

        if (rightX === 0) {
          this.previousArrow.classList.remove(ACTIVE);
          this.nextArrow.classList.add(ACTIVE);
        }

        if (rightX <= this.widthOfAllProducts - this.scrollXBy) {
          this.nextArrow.classList.add(ACTIVE);
        }
      }
    },
    // For the vertical component
    // Set up vertical event handlers
    setupVerticalHandlers: function setupVerticalHandlers() {
      this.upHandler = this.upHandler.bind(this);
      this.downHandler = this.downHandler.bind(this);
    },
    // Attach vertical events
    attachVerticalEvents: function attachVerticalEvents() {
      this.upArrow.addEventListener('click', this.upHandler);
      this.downArrow.addEventListener('click', this.downHandler);
      return this;
    },
    // Prepare initial arrow (down) for vertical layout
    prepareDownArrow: function prepareDownArrow() {
      this.downArrow.classList.add(ACTIVE);
    },
    // handle what happens when up and down are clicked on horizontal
    upHandler: function upHandler() {
      if (topY > 0) {
        topY -= this.scrollYBy;
        this.productGroup.style.bottom = topY + 'px';

        if (topY === 0) {
          this.upArrow.classList.remove(ACTIVE);
          this.downArrow.classList.add(ACTIVE);
        }

        if (topY < this.heightOfAllProducts) {
          this.downArrow.classList.add(ACTIVE);
        }
      }
    },
    downHandler: function downHandler() {
      if (topY === 0) {
        this.upArrow.classList.add(ACTIVE);
      }

      if (topY < this.heightOfAllProducts - this.scrollYBy) {
        topY += this.scrollYBy;
        this.productGroup.style.bottom = topY + 'px';
      }

      if (topY === this.hiddenProductCount * this.scrollYBy) {
        this.downArrow.classList.remove(ACTIVE);
      }
    }
  };
  return Constructor;
}]);
}, {"1":1}];
