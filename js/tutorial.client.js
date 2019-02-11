window.modules["tutorial.client"] = [function(require,module,exports){'use strict';

var _forEach = require(27),
    dom = require(1);

DS.controller('tutorial', [function () {
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
    this.currentOffset = 0; // Calls on the `findAvailableShifts()` function to determine
    // amount of clicks that can be made.

    this.position = 0;
    this.availableShifts = this.findAvailableShifts(); // Determines if any arrows should be displayed based
    // on the current viewport.

    if (window.innerWidth >= 1024) {
      this.offset = 165;

      if (this.$tabs.length > 4) {
        this.$downArrow.classList.remove('obscure');
      }
    } else if (window.innerWidth >= 768) {
      this.offset = 93;

      if (this.$tabs.length > 5) {
        this.$rightArrow.classList.remove('obscure');
      }
    } else {
      this.offset = 93;

      if (this.$tabs.length > 3) {
        this.$rightArrow.classList.remove('obscure');
      }
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
      '.tutorial-tab-row-tab click': 'tabClickHandler',
      '.tutorial-tab-up-arrow click': 'buttonHandler',
      '.tutorial-tab-down-arrow click': 'buttonHandler',
      '.tutorial-tab-row-left-arrow click': 'buttonHandler',
      '.tutorial-tab-row-right-arrow click': 'buttonHandler',
      '.next-button click': 'contentShifter',
      '.prev-button click': 'contentShifter'
    },

    /**
     * This `createChildren` function obtains the basic essential
     * elements on the component, such as the tabs, the content areas,
     * the tab row, and the arrows. This is used for future manipulation.
     *
     * @return {this}
     */
    createChildren: function createChildren() {
      this.$tabs = dom.findAll(this.el, '.tutorial-tab-row-tab');
      this.$contents = dom.findAll(this.el, '.tutorial-cnt-wrap');
      this.$upArrow = dom.find(this.el, '.tutorial-tab-up-arrow');
      this.$downArrow = dom.find(this.el, '.tutorial-tab-down-arrow');
      this.$leftArrow = dom.find(this.el, '.tutorial-tab-row-left-arrow');
      this.$rightArrow = dom.find(this.el, '.tutorial-tab-row-right-arrow');
      this.$prevButton = dom.find(this.el, '.prev-button');
      this.$nextButton = dom.find(this.el, '.next-button');
      this.$scrollWrap = dom.find(this.el, '.scroll-wrap'); // Returns `this` so that we could reuse all of the above properties
      // anywhere else in this file.

      return this;
    },
    contentShifter: function contentShifter(e) {
      var activePosition,
          parentButton = dom.closest(e.target, 'button'),
          directionIsRight;
      dom.find(this.el, '.tutorial-tab-title').scrollIntoView();

      _forEach(this.$tabs, function ($tab, index) {
        if ($tab.classList.contains('active')) {
          activePosition = index;
        }
      });

      if (parentButton.classList.contains('next-button')) {
        directionIsRight = true;

        if (activePosition === this.$tabs.length - 2) {
          parentButton.classList.add('disappear');
        }

        if (activePosition !== 1) {
          this.$prevButton.classList.remove('disappear');
        }

        this.$tabs[activePosition].classList.remove('active');
        this.$tabs[activePosition + 1].classList.add('active');
        this.$contents[activePosition].classList.remove('show');
        this.$contents[activePosition + 1].classList.add('show');
      } else {
        directionIsRight = false;

        if (activePosition !== this.$tabs.length - 2) {
          this.$nextButton.classList.remove('disappear');
        }

        if (activePosition - 1 === 0) {
          parentButton.classList.add('disappear');
        }

        this.$tabs[activePosition].classList.remove('active');
        this.$tabs[activePosition - 1].classList.add('active');
        this.$contents[activePosition].classList.remove('show');
        this.$contents[activePosition - 1].classList.add('show');
      }

      if (this.availableShifts > 0 && activePosition >= this.$tabs.length - 4) {
        this.shiftClickHandler(directionIsRight);
      }
    },

    /**
     * This function handles the click event for the tabs,
     * if a user clicks on a tab, it will obtain the entire
     * tab element, and then with that information,
     * it will set the clicked tab to an active state
     * and remove all other tabs from their possible active state.
     *
     * This will also display the content relating to the tab that
     * was clicked on.
     *
     * @param {Object} e
     */
    tabClickHandler: function tabClickHandler(e) {
      // This gets the index of the tab and the tab content for later
      // reference and connection, as well as the next/prev buttons.
      var tabID = dom.closest(e.target, '[data-tab-id]').getAttribute('data-tab-id'),
          $tabContent = dom.find(this.el, '[data-content-id="' + tabID + '"]'); // This visually updated the next/prev buttons to correlate
      // with the tab positions.

      if (tabID == 0) {
        this.$prevButton.classList.add('disappear');
        this.$nextButton.classList.remove('disappear');
      } else if (tabID == this.$tabs.length - 1) {
        this.$nextButton.classList.add('disappear');
        this.$prevButton.classList.remove('disappear');
      } else {
        this.$nextButton.classList.remove('disappear');
        this.$prevButton.classList.remove('disappear');
      } // For each tab, remove the active state.


      _forEach(this.$tabs, function ($tab) {
        $tab.classList.remove('active');
      }); // For each content, remove the active state.


      _forEach(this.$contents, function ($content) {
        $content.classList.remove('show');
      }); // Add an active state to both the tab and the content if
      // it was clicked on.


      e.target.parentElement.classList.add('active');
      $tabContent.classList.add('show');
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
      var downArrow = dom.closest(e.target, 'button').classList.contains('tutorial-tab-down-arrow'),
          upArrow = dom.closest(e.target, 'button').classList.contains('tutorial-tab-up-arrow'),
          leftArrow = dom.closest(e.target, 'button').classList.contains('tutorial-tab-row-left-arrow'),
          rightArrow = dom.closest(e.target, 'button').classList.contains('tutorial-tab-row-right-arrow'),
          value;

      if (!downArrow) {
        if (!upArrow) {
          value = rightArrow;
          this.$upArrow = this.$leftArrow;
          this.$downArrow = this.$rightArrow;
        }
      } else if (!rightArrow) {
        if (!leftArrow) {
          value = downArrow;
        }
      } // `shiftClickHandler` receives a true or false boolean value.


      this.shiftClickHandler(value);
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
        this.$upArrow.classList.remove('obscure');
      } else if (!dir && this.position > 0) {
        this.shift(dir);
        this.$upArrow.classList.remove('obscure');
      }

      if (this.position === 0) {
        this.$upArrow.classList.add('obscure');
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
        return this.$tabs.length - 3;
      } else if (width >= 768 && width < 1024) {
        return this.$tabs.length - 5;
      } else if (width >= 1024) {
        return this.$tabs.length - 4;
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

      if (window.innerWidth < 1024) {
        this.$scrollWrap.style.transform = 'translateX(-' + this.currentOffset + 'px)';
      } else {
        this.$scrollWrap.style.transform = 'translateY(-' + this.currentOffset + 'px)';
      }
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
        this.$rightArrow.classList.add('obscure');
        this.$downArrow.classList.add('obscure');
      } else if (this.position < this.availableShifts) {
        if (this.position === this.availableShifts - 1) {
          this.$leftArrow.classList.remove('obscure');
        } else if (this.position === this.availableShifts - 2) {
          this.$leftArrow.classList.add('obscure');
        }

        if (this.$downArrow.classList.contains('obscure') || this.$rightArrow.classList.contains('obscure')) {
          this.$rightArrow.classList.remove('obscure');
          this.$downArrow.classList.remove('obscure');
        }
      }
    }
  };
  return Constructor;
}]);
}, {"1":1,"27":27}];
