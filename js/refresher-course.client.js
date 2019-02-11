window.modules["refresher-course.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _debounce = require(107),
    _forEach = require(27);

DS.controller('refresher-course', [function () {
  /**
   * @type {Object}
   *
   * Below are a series of objects containing magic strings,
   * or strings that are prone to eventual dynamicalifacation.
   */
  var SELECTORS = {
    TAB: '.refresher-course-tab',
    CONTENT: '.refresher-course-content',
    NEXT: 'next-button',
    PREV: 'prev-button'
  },
      CLASSES = {
    ACTIVE_TAB: 'active',
    ACTIVE_CONTENT: 'display-content',
    ACTIVE_TEXT: 'active'
  },
      DATA = {
    TAB: 'data-id'
  };
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
    this.currentOffset = 0; // Total amount of tabs inside of the Refresher Course.

    this.tabCount = this.$tabs.length; // Calls on the `findAvailableShifts()` function to determine
    // amount of clicks that can be made.

    this.availableShifts = this.findAvailableShifts();

    if (this.availableShifts === 0) {
      this.$rightArrow.classList.add('hide-button');
    }

    this.dataOffset = this.getDataOffset();
    this.position = 0;
    this.videoScrollUp = true; // This handles debouncing, specifically for catching window
    // resizes and then adjusting the amount of available shifts
    // automatically.

    this.debounceResizeHandler = _debounce(this.resizeDebounced, 100);
    window.addEventListener('resize', this.resizeWindow.bind(this));
  }

  Constructor.prototype = {
    /**
     * @type {Object}
     *
     * This is an object for event handling across different
     * elements on the component.
     */
    events: {
      '.refresher-course-tab click': 'tabClickHandler',
      '.left-button click': 'buttonHandler',
      '.right-button click': 'buttonHandler',
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
      this.$tabs = dom.findAll(this.el, SELECTORS.TAB);
      this.$contents = dom.findAll(this.el, SELECTORS.CONTENT);
      this.$tabRow = dom.find(this.el, '.tab-row-content');
      this.$leftArrow = dom.find(this.el, '.left-button');
      this.$rightArrow = dom.find(this.el, '.right-button');
      this.$nextButton = dom.find(this.el, '.next-button');
      this.$prevButton = dom.find(this.el, '.prev-button');
      this.$contentArea = dom.find(this.el, '.content-area'); // Returns `this` so that we could reuse all of the above properties
      // anywhere else in this file.

      return this;
    },
    // Calculate how much to move carousel by
    getDataOffset: function getDataOffset() {
      if (this.$tabs.length) {
        return this.$tabs[0].offsetWidth;
      } else {
        return 0;
      }
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
      var rightButton = dom.closest(e.target, '.right-button');
      this.shiftClickHandler(rightButton && rightButton !== null);
    },
    // Triggers video load by scrolling.  At present, the allowed content list components using lazy load are video and ooyala. THIS IS A HACK TO BE USED UNTIL VISIBILITY SERVICE IS UPDATED.
    scrollContentIfVideo: function scrollContentIfVideo() {
      var displayedContent = this.el.querySelector('.refresher-course-content.display-content');

      if (displayedContent.querySelector('.video-component, .ooyala-player')) {
        if (this.videoScrollUp) {
          window.scrollBy(0, 1);
          this.adjustVideoHeight();
          this.videoScrollUp = false;
        } else {
          window.scrollBy(0, -1);
          this.adjustVideoHeight();
          this.videoScrollUp = true;
        }
      }
    },
    // Override video component inline styling, which is setting video height to 0.
    adjustVideoHeight: function adjustVideoHeight() {
      var displayedVideos = this.el.querySelectorAll('.display-content .video-component'),
          i = 0;

      for (i; i < displayedVideos.length; i++) {
        displayedVideos[i].style.height = 'auto';
      }
    },

    /* eslint-disable complexity */
    contentShifter: function contentShifter(e) {
      var activePosition,
          directionIsRight,
          newActive,
          parentButton = dom.closest(e.target, 'button'),
          tabsShownAtOnce = this.$tabs.length - this.findAvailableShifts(); // jump back to tab row

      dom.find(this.el, '.tab-row-content').scrollIntoView();

      _forEach(this.$tabs, function ($tab, index) {
        if ($tab.classList.contains('active')) {
          activePosition = index;
        }
      }); // Direction is right


      if (parentButton.classList.contains(SELECTORS.NEXT)) {
        newActive = parseInt(this.$contents[activePosition].getAttribute('data-id')) + 1;
        directionIsRight = true;

        if (activePosition === this.$tabs.length - 2) {
          parentButton.classList.add('disappear');
        }

        if (activePosition !== 1) {
          dom.find(this.el, '.prev-button').classList.remove('disappear');
        }

        this.$tabs[activePosition].classList.remove('active');
        this.$tabs[activePosition + 1].classList.add('active');
        this.$contents[activePosition].classList.remove('display-content');
        this.$contents[activePosition + 1].classList.add('display-content');
        this.scrollContentIfVideo();

        if (newActive == this.position + tabsShownAtOnce) {
          this.shiftClickHandler(directionIsRight);
        } // Direction is left

      } else {
        newActive = parseInt(this.$contents[activePosition].getAttribute('data-id')) - 1;
        directionIsRight = false;

        if (activePosition !== this.$tabs.length - 2) {
          dom.find(this.el, '.next-button').classList.remove('disappear');
        }

        if (activePosition - 1 === 0) {
          parentButton.classList.add('disappear');
        }

        this.$tabs[activePosition].classList.remove('active');
        this.$tabs[activePosition - 1].classList.add('active');
        this.$contents[activePosition].classList.remove('display-content');
        this.$contents[activePosition - 1].classList.add('display-content');
        this.scrollContentIfVideo();

        if (newActive == this.position - 1) {
          this.shiftClickHandler(directionIsRight);
        }
      }

      if (this.availableShifts > 0 && activePosition >= this.$tabs.length - 2) {
        this.shiftClickHandler(directionIsRight);
      }
    },

    /* eslint-enable complexity */

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
        this.$leftArrow.classList.remove('hide-left-button');
        this.$leftArrow.children[0].classList.remove('hide-button');
      } else if (!dir && this.position > 0) {
        this.shift(dir);
        this.$leftArrow.classList.remove('hide-left-button');
        this.$leftArrow.children[0].classList.remove('hide-button');
      }

      if (this.position === 0) {
        this.$leftArrow.children[0].classList.add('hide-button');
        this.$leftArrow.classList.add('hide-left-button');
      } // This function is called to hide the right arrow if the user
      // has reached the end of the carousel.


      this.updateButtonState(dir);
    },

    /**
     * This is a very simple, very humble function. Its purpose is to
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
        this.$rightArrow.classList.add('hide-button');
      } else if (this.position < this.availableShifts && this.$rightArrow.classList.contains('hide-button')) {
        this.$rightArrow.classList.remove('hide-button');
      }
    },

    /**
     * If directionIsRight is true (right), then increment the current offset
     * by the width of a tab, else if directionIsRight is false (left), then decrement
     * the current offset by the tab width. It also increases and decreases
     * the position count respectively.
     *
     * @param {boolean} dir
     */
    updateCurrentOffset: function updateCurrentOffset(dir) {
      this.currentOffset = dir ? this.currentOffset + this.dataOffset : this.currentOffset - this.dataOffset;
      dir ? this.position++ : this.position--;
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
      var width = window.innerWidth,
          hiddenTabs;

      if (width >= 320 && width < 375) {
        hiddenTabs = this.tabCount - 2;
      } else if (width >= 375 && width < 600) {
        hiddenTabs = this.tabCount - 3;
      } else if (width >= 600 && width < 737) {
        hiddenTabs = this.tabCount - 4;
      } else if (width >= 737 && width < 900) {
        hiddenTabs = this.tabCount - 5;
      } else if (width >= 900 && width < 1024) {
        hiddenTabs = this.tabCount - 6;
      } else if (width >= 1024) {
        hiddenTabs = this.tabCount - 7;
      } else {
        hiddenTabs = 0;
      }

      if (hiddenTabs < 0) {
        return 0;
      } else {
        return hiddenTabs;
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
      this.$tabRow.style.transform = 'translate(-' + this.currentOffset + 'px)';
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
      var tabID = dom.closest(e.target, '[' + DATA.TAB + ']').getAttribute(DATA.TAB),
          $tabContent = dom.find(this.$contentArea, '[' + DATA.TAB + '="' + tabID + '"]'); // This visually updated the next/prev buttons to correlate
      // with the tab positions.

      if (tabID == 0) {
        this.$prevButton.classList.add('disappear');
        this.$nextButton.classList.remove('disappear');
      } else if (tabID == this.$tabs.length - 1) {
        this.$nextButton.classList.add('disappear');
        this.$prevButton.classList.remove('disappear');
      } else {
        this.$prevButton.classList.remove('disappear');
        this.$nextButton.classList.remove('disappear');
      } // For each tab, remove the active state.


      _forEach(this.$tabs, function ($tab) {
        $tab.classList.remove(CLASSES.ACTIVE_TAB);
      }); // For each content, remove the active state.


      _forEach(this.$contents, function ($content) {
        // To prevent multiple video playback, we need to also reset
        // the source of the iframe if this content was active.
        $content.classList.remove(CLASSES.ACTIVE_CONTENT);
      }); // Add an active state to both the tab and the content if
      // it was clicked on.


      e.target.parentElement.parentElement.classList.add(CLASSES.ACTIVE_TAB);
      $tabContent.classList.add(CLASSES.ACTIVE_CONTENT);
      this.scrollContentIfVideo();
    },

    /**
     * This function calls on the `debounceResizeHandler()` function
     * for window resize handling.
     */
    resizeWindow: function resizeWindow() {
      this.debounceResizeHandler();
    },

    /**
     * This function handles what takes place when the debounced
     * function gets triggered. In this case, it will re-run the
     * `findAvailableShifts()` function and then run a check to
     * determine if there's a difference between the current
     * available shifts and the new available shifts.
     *
     * If there is then the tabs will adjust according to the
     * resize of the window.
     */
    resizeDebounced: function resizeDebounced() {
      var newAvailableShifts = this.findAvailableShifts();
      this.dataOffset = this.getDataOffset();

      if (this.availableShifts !== newAvailableShifts) {
        // Reset everything about the tabs, including
        // offset, position, and available shifts.
        this.position = 0;
        this.currentOffset = 0;
        this.$tabRow.setAttribute('style', '');
        this.availableShifts = newAvailableShifts;
        this.$leftArrow.classList.add('hide-left-button');
      }

      if (newAvailableShifts > 0) {
        this.$rightArrow.classList.remove('hide-button');
      }
    }
  };
  return Constructor;
}]);
}, {"1":1,"27":27,"107":107}];
