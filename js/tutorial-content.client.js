window.modules["tutorial-content.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('tutorial-content', [function () {
  /**
   * This constructor initiates certain properties such as
   * the amount of tabs inside of the tab row, the amount of
   * times the user can move directions in the carousel based
   * on the amount of tabs, and a debouncing mechanism for
   * catching window resizes.
   *
   * @param {string} el
   */
  function Constructor(el) {
    this.el = el; // This calls the `createChildren()` function to obtain
    // basic essential elements.

    this.createChildren();
    this.offset = 275;
    this.currentOffset = 0; // Calls on the `findAvailableShifts()` function to determine
    // amount of clicks that can be made.

    this.position = 0;
    this.availableShifts = this.findAvailableShifts(); // Detects if arrows should appear.

    if (this.$carouselBoxes.length > 3 && window.innerWidth >= 1024) {
      this.$carouselRightArrow.classList.remove('obscure');
    } else if (this.$carouselBoxes.length > 2 && window.innerWidth < 1024 && window.innerWidth >= 768) {
      this.$carouselRightArrow.classList.remove('obscure');
    } else if (this.$carouselBoxes.length > 1 && window.innerWidth < 768 && window.innerWidth >= 0) {
      this.$carouselRightArrow.classList.remove('obscure');
    }
  }

  Constructor.prototype = {
    /**
     * @type {Object}
     *
     * This is an object for event handling across different
     * elements on the component.
     */
    events: {
      '.tutorial-carousel-right-arrow click': 'buttonHandler',
      '.tutorial-carousel-left-arrow click': 'buttonHandler'
    },

    /**
     * This `createChildren` function obtains the basic essential
     * elements on the component, such as the tabs, the content areas,
     * the tab row, and the arrows. This is used for future manipulation.
     *
     * @return {this}
     */
    createChildren: function createChildren() {
      this.$carouselBoxes = dom.findAll(this.el, '.tutorial-carousel-box-item');
      this.$carouselRightArrow = dom.find(this.el, '.right-arrow');
      this.$carouselLeftArrow = dom.find(this.el, '.left-arrow');
      this.$carouselWrapper = dom.find(this.el, '.car-wrap'); // Returns `this` so that we could reuse all of the above properties
      // anywhere else in this file.

      return this;
    },

    /**
     * This takes the element that was clicked, (either the left or
     * right arrow), and then it passes it to the `shiftClickHandler`
     * function but it's a boolean that indicates if the target element
     * is the right arrow, then it will be true, otherwise, false.
     *
     * @param {string} e
     */
    buttonHandler: function buttonHandler(e) {
      // `shiftClickHandler` receives a true or false boolean value.
      this.shiftClickHandler(dom.closest(e.target, 'button').classList.contains('tutorial-carousel-right-arrow'));
    },

    /**
     * This function determines the directionIsRight based on the boolean
     * value passed in as an argument, and then it calls the `shift`
     * function and passes it the appropriate directionIsRight if there are
     * available shifts.
     *
     * @param {boolean} dir
     */
    shiftClickHandler: function shiftClickHandler(dir) {
      if (dir && this.position < this.availableShifts) {
        this.shift(dir);
        this.$carouselLeftArrow.classList.remove('hide');
      } else if (!dir && this.position > 0) {
        this.shift(dir);
        this.$carouselLeftArrow.classList.remove('hide');
      }

      if (this.position === 0) {
        this.$carouselLeftArrow.classList.add('hide');
      } // This function is called to hide the right arrow if the user
      // has reached the end of the carousel.


      this.updateButtonState(dir);
    },

    /**
     * The `findAvailableShifts` function detects the width of the
     * window and then with that information it takes the total
     * number of tabs and subtracts it by the total number of
     * tabs currently present according to its media query
     * equivalent.
     *
     * In order to determine how many shifts are remaining to the
     * right or the left to get to the end, you need to take the
     * total amount of tabs and subtract it by the total amount
     * of tabs in the current view, and that's your number of
     * available shifts.
     *
     * Right now as it stands, the current algorithim for detecting
     * how many available shifts should be present is `c = t - v`
     * where `c` is the amount of available shifts, `t` is the total
     * amount of tabs, and `v` is the total amount of tabs in the view
     * determined by the width of the window.
     *
     * So if `v` is 2 and `t` is 7, `c = 7 - 2` resulting in the amount
     * of available shifts being 5.
     *
     * @return {integer}
     */
    findAvailableShifts: function findAvailableShifts() {
      var width = window.innerWidth;

      if (width >= 375 && width < 768) {
        return this.$carouselBoxes.length - 1;
      } else if (width >= 768 && width < 1024) {
        return this.$carouselBoxes.length - 2;
      } else if (width >= 1024) {
        return this.$carouselBoxes.length - 3;
      }
    },

    /**
     * The `shift` function is what moves the tab to
     * simulate the effect of a carousel. The directionIsRight
     * paramater is a boolean value, where `true` indicates
     * that the tabs should move to the right, and `false`
     * to the left.
     *
     * @param {boolean} directionIsRight
     */
    shift: function shift(directionIsRight) {
      this.updateCurrentOffset(directionIsRight);
      this.$carouselWrapper.style.transform = 'translate(-' + this.currentOffset + 'px)';
    },

    /**
     * If directionIsRight is true (right), then increment the current offset
     * by 125 pixels, else if directionIsRight is false (left), then decrement
     * the current offset by 125 pixels. It also increases and decreases
     * the position count respectively.
     *
     * @param {boolean} dir
     */
    updateCurrentOffset: function updateCurrentOffset(dir) {
      this.currentOffset = dir ? this.currentOffset + this.offset : this.currentOffset - this.offset;
      dir ? this.position++ : this.position--;
    },

    /**
     * This is a very simple, very humble function. It's purpose is to
     * to hide the right arrow if the user has reached the end of the
     * carousel and also to un-hide it if they have left the end.
     *
     * It is only hiding the right arrow because hiding the left arrow
     * would look very weird. Waiting for design's input in the meantime
     * to decide whether or not we should hide the left arrow completely
     * or hide the left arrow and add a transparent filler with the same
     * width to make it look nice and even.
     */
    updateButtonState: function updateButtonState() {
      if (this.position === this.availableShifts) {
        this.$carouselRightArrow.classList.add('obscure');
      } else if (this.position < this.availableShifts && this.$carouselRightArrow.classList.contains('obscure')) {
        this.$carouselRightArrow.classList.remove('obscure');
      }
    }
  };
  return Constructor;
}]);
}, {"1":1}];
