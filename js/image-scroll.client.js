window.modules["image-scroll.client"] = [function(require,module,exports){'use strict';

var _debounce = require(107),
    _throttle = require(23),
    _forEach = require(27),
    dom = require(1),
    $visibility = require(26);

DS.controller('image-scroll', [function () {
  /**
   * This constructor invokes a number of functions that
   * initiate the functionality of the Image Scroll.
   *
   * @param {string} el
   */
  function Constructor(el) {
    this.el = el; // The `init` function sets object propertiesvariable for later use.

    this.init(); // The `setupHandlers` function creates a throttle
    // for the window scroll event, so that the `onScroll`
    // function isn't repeatedly being invoked every time
    // the user scrolls, but every 30ms.

    this.setupHandlers(); // The `determineImageSwappingPoints` is a function
    // that figures out when the image should update
    // to its next one based on what point in the scroll
    // process it is currently in.

    this.determineImageSwappingPoints();
  }

  Constructor.prototype = {
    /**
     * Creates the `this.$image` and `this.$imageArray`
     * variables, which store the first image and
     * all of the images of later modification.
     */
    init: function init() {
      this.$imageArray = dom.findAll(this.el, '.image-scroll-image');
      this.$image = this.$imageArray[0];
      this.$image.style.display = 'block';
      this.imagesContainer = dom.find(this.el, '.image-scroll-images-container'); // Margin top is used in scroll calculations in determineBottom.
      // This value cannot be easily retrieved via window.getComputedStyle, so
      // changes to this value need to also be made in styles.scss

      this.marginTop = 60;
    },

    /**
     * Determines when the first image should update
     * its source to be the one of the next image in
     * the list based on what point in the scrolling
     * process it is currently at.
     *
     * The way this works is that it takes all of the
     * images added to the component, for example: 4
     * and then it divides that number by the height
     * of the entire component to setup the appropriate
     * breakpoints.
     */
    determineImageSwappingPoints: function determineImageSwappingPoints() {
      var i,
          numImages = this.$imageArray.length,
          componentHeight = this.el.clientHeight,
          // divisionLine takes the number of pixels where
      // the image should change. It is the height of the
      // component minus the image height divided by the number of images.
      divisionLine = Math.floor((componentHeight - this.$image.clientHeight) / numImages); // `this.points` creates an array of objects where each
      // point is tied to its respective image.

      this.points = []; // This for loop multiplies the `divisionLine` by
      // its step in the iteration, and then pushes
      // a new object into the `this.point` array.

      for (i = 0; i < numImages; i++) {
        this.points.push(divisionLine * i);
      }
    },

    /**
     * The `setupHandlers` function attaches a debounced resize handler
     * and a throttled scroll handler
     */
    setupHandlers: function setupHandlers() {
      var resizeHandler = _debounce(this.handleViewportChange, 200);

      window.addEventListener('resize', resizeHandler.bind(this));
      this.handleViewportChange();
    },

    /**
     * Subject scroll handlers to viewport logic
     */
    handleViewportChange: function handleViewportChange() {
      // Determine viewport state
      this.isMobile = window.innerWidth <= 600; // apply changes subject to viewport logic

      if (this.isMobile) {
        this.removeScrollHandler();
        this.removeStyling();
      } else {
        this.attachScrollHandler();
        this.applyStyling();
      }
    },

    /**
     * Remove scroll handler
     */
    removeScrollHandler: function removeScrollHandler() {
      if (this.onScrollHandler) {
        window.removeEventListener('scroll', this.onScrollHandler);
        this.onScrollHandler = null;
      }
    },

    /**
     * Attach a throttled scroll handler if one hasn't already been attached
     */
    attachScrollHandler: function attachScrollHandler() {
      if (!this.onScrollHandler) {
        this.onScrollHandler = _throttle(this.onScroll, 30).bind(this);
        window.addEventListener('scroll', this.onScrollHandler);
      }
    },

    /**
     * The `onScroll` function has a condition that
     * receives the return value of the
     * `this.findPastTop()` function and decides what
     * to do based on whether it is true or false.
     *
     * If it is true, meaning that the scroll of the
     * window has reached the top of the image, then
     * the image will become fixed to the top of the
     * window until it no longer is.
     */
    onScroll: function onScroll() {
      if (this.findPastTop()) {
        // apply fixed positioning and set to position-top
        this.imagesContainer.classList.add('fixed', 'position-top');
        this.imagesContainer.classList.remove('position-bottom'); // The `this.imageSwap()` function is invoked
        // to swap the image if it is time.

        this.imageSwap(); // The `this.determineBottom()` function checks
        // to see if the image is at the bottom.

        this.determineBottom();
      } else {
        // remove fixed positioning and set to position-top
        this.imagesContainer.classList.remove('fixed', 'position-bottom');
        this.imagesContainer.classList.add('position-top');
      }
    },

    /**
     * The `imageSwap` function changes the image if
     * it is the appropriate time. There are a bunch
     * of pieces at work, such as detecting if there
     * is another item that is next in the queue,
     * otherwise it will be treated as the last item.
     */
    imageSwap: function imageSwap() {
      var i, newImage, nextPoint, rangeTop, rangeBottom;

      for (i = 0; i < this.points.length; i++) {
        nextPoint = this.points[i + 1];
        rangeTop = this.points[i];
        rangeBottom = nextPoint || this.el.clientHeight;

        if (this.scrollPos - this.scrollHistory > rangeTop && this.scrollPos - this.scrollHistory < rangeBottom) {
          newImage = this.$imageArray[i];

          if (newImage != this.$image) {
            // hide the old image and reveal the new one
            this.hideImage(this.$image);
            this.showImage(newImage);
            this.$image = newImage; // imagesContainer is position absolute/fixed, so height needs to be set explicitly

            this.imagesContainer.style.height = this.$image.clientHeight + 'px';
          } // break loop when match is found


          break;
        }
      }
    },

    /**
     * Show image
     * @param {Element} image
     */
    showImage: function showImage(image) {
      image.classList.remove('hide');
    },

    /**
     * Hide image
     * @param {Element} image
     */
    hideImage: function hideImage(image) {
      image.classList.add('hide');
    },

    /**
     * This checks to see if the image is at the
     * bottom of the entire component, so that
     * it no longer needs to be fixed and can stick
     * to the bottom with an artificial `marginTop`
     */
    determineBottom: function determineBottom() {
      // base value of 20 corresponds to the 20px margin-bottom on clay-paragraph
      // marginTop corresponds to the spacing from the image when it is fixed to the top of the window
      var marginBottom = 20 + this.marginTop,
          imagesContainerHeight = this.imagesContainer.clientHeight,
          atBottom = this.scrollPos - this.scrollHistory >= this.el.clientHeight - imagesContainerHeight - marginBottom;

      if (atBottom) {
        // remove fixed position and set to position-bottom
        this.imagesContainer.classList.remove('fixed', 'position-top');
        this.imagesContainer.classList.add('position-bottom');
      }
    },

    /**
     * The `findPastTop` function gets the offset
     * of the entire window and then determines
     * if the offset top of the component
     * is less than the offset of the window.
     *
     * @return {Boolean}
     */
    findPastTop: function findPastTop() {
      var verticalOffset = $visibility.getPageOffset(this.el).top,
          pastTop = window.scrollY > verticalOffset - this.marginTop;
      this.scrollPos = window.scrollY;

      if (pastTop && !this.scrollHistory) {
        this.scrollHistory = verticalOffset;
      }

      return pastTop;
    },

    /**
     * Apply styling to images.
     * Images are stacked on top of each other inside .image-scroll-images-container,
     * but only one image will be visible at a time.
     */
    applyStyling: function applyStyling() {
      var transitionSpeed = this.el.getAttribute('data-transition') || '0s';

      _forEach(this.$imageArray, function (image, i) {
        // Hide images after the first
        if (i > 0) {
          image.classList.add('hide');
        } // Set opacity transition


        image.style.transition = 'opacity ' + transitionSpeed;
      }); // ImageContainer is position absolute/fixed, so height needs to be set explicitly


      this.imagesContainer.style.height = this.$image.clientHeight + 'px';
    },

    /**
     * Remove styling to images.
     * Images will not be stacked on top of each other or hidden,
     * as needed for mobile.
     */
    removeStyling: function removeStyling() {
      _forEach(this.$imageArray, function (image) {
        // Unhide images
        image.classList.remove('hide');
      }); // ImageContainer is position absolute/fixed, so height should be set explicitly


      this.imagesContainer.style.height = 'auto';
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"26":26,"27":27,"107":107}];
