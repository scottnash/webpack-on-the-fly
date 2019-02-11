window.modules["dual-scroll.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _throttle = require(23),
    _debounce = require(107),
    _reverse = require(106),
    _parseInt = require(108),
    $visibility = require(26);

DS.controller('dual-scroll', [function () {
  var CLASSES = {
    FIXED_BOTTOM: 'fixed-bottom',
    FIXED: 'fixed'
  },
      SELECTORS = {
    WAYPOINT: '.waypoint',
    RIGHT_COL_CONTENT: '.right-column-content',
    RIGHT_COL: '.right-column',
    LEFT_COL: '.left-column'
  };

  function Constructor(el) {
    // Element
    this.el = el; // Position from top

    this.elOffset; // Position on the page

    this.scrollPos; // Boolean indicator if we're below the start of the element

    this.pastTop = false; // The offset of the last waypoint in the right column
    // from the top of its parent.

    this.lastWaypointOffset = null; // Distance that has been scrolled inside the component

    this.scrollDistInside; // Boolean tracker for being below the component or not

    this.belowComponent = false; // Boolean tracker for mobile state

    this.mobile;
    this.init();
  }

  Constructor.prototype = {
    init: function init() {
      this.setupHandlers().createChildren().attachEvents().establishValues().initializeRightColContentPosition().cloneRightColContent(); // Once we have all the things, let's see if we should
      // fix the right col to the window

      if (this.pastTop && !this.belowComponent) {
        this.affixRightCol();
        this.updateRightColPosition();
      }

      return this;
    },

    /**
     * Find the initial values on page load
     *
     * @return {Constructor}
     */
    establishValues: function establishValues() {
      // Grab distance from top
      this.elOffset = $visibility.getPageOffset(this.el); // Sets the `pastTop` value and the `scrollPos` value

      this.findPastTop();
      this.scrollDistInside = this.scrollPos - this.elOffset.top;
      this.lastWaypointOffset = this.rightColWaypoints[this.rightColWaypoints.length - 1].offsetTop;
      this.belowComponent = -(this.lastWaypointOffset - this.scrollDistInside) > 0;
      this.mobile = window.innerWidth < 1180;
      return this;
    },

    /**
     * Create child references
     *
     * @return {Object}
     */
    createChildren: function createChildren() {
      this.leftColumn = dom.find(this.el, SELECTORS.LEFT_COL);
      this.rightColumn = dom.find(this.el, SELECTORS.RIGHT_COL);
      this.rightColumnContent = dom.find(this.rightColumn, SELECTORS.RIGHT_COL_CONTENT);
      this.rightColWaypoints = dom.findAll(this.rightColumnContent, SELECTORS.WAYPOINT);
      this.leftColWaypoints = dom.findAll(this.leftColumn, SELECTORS.WAYPOINT);
      return this;
    },

    /**
     * Create bound event handlers
     *
     * @return {Object}
     */
    setupHandlers: function setupHandlers() {
      this.onScrollHandler = _throttle(this.onScroll, 100).bind(this);
      this.onResizeHandler = _debounce(this.onResize, 200).bind(this);
      return this;
    },

    /**
     * Create event listeners
     *
     * @return {Object}
     */
    attachEvents: function attachEvents() {
      window.addEventListener('scroll', this.onScrollHandler);
      window.addEventListener('resize', this.onResizeHandler);
      return this;
    },

    /**
     * The magic Victoria copy function which loops over the right col
     * content, determines if there are images or text and then clones
     * the content over to the left column.
     *
     * @return {Constructor}
     */
    cloneRightColContent: function cloneRightColContent() {
      var waypointsLeft, waypointsRight, toClone, clonedContent, forMobile, waypointIndex, toCloneImage, toCloneText; // Convert Node Lists to Arrays, but reverse the order of the
      // right column array because we want it to be at p

      waypointsLeft = [].slice.call(this.leftColWaypoints);
      waypointsRight = _reverse([].slice.call(this.rightColWaypoints));
      waypointIndex = 0;

      while (waypointIndex < waypointsRight.length) {
        toClone = dom.find(waypointsRight[waypointIndex], '.waypoint-content-desktop');
        clonedContent = toClone.cloneNode(true);
        toCloneImage = dom.find(toClone, '.mediaplay-image');
        toCloneText = dom.find(toClone, '.clay-paragraph');

        if (toCloneImage) {
          forMobile = dom.find(waypointsLeft[waypointIndex], '.for-mobile-img');
        } else if (toCloneText) {
          forMobile = dom.find(waypointsLeft[waypointIndex], '.for-mobile-text');
        }

        forMobile.appendChild(clonedContent);
        waypointIndex += 1;
      }

      return this;
    },

    /**
     * Resize event handler. Basically re-runs the `establishValues`
     * function to find values based on new window dimensions and
     * then updates positions.
     */
    onResize: function onResize() {
      this.mobile = window.innerWidth < 1180; // We only want to do this if we're sizing above the
      // mobile/tablet view. Otherwise rightCol is hidden
      // and we don't want to wait energy

      if (!this.mobile) {
        this.establishValues();
        this.affixRightCol(true);
        this.updateRightColPosition();
      }
    },

    /**
     * Scroll handler for the component. If we're "inside" the
     * component then let's translate the right column. If we're above
     * or below it let's just clear some styles or set the inital
     * position of the right column
     *
     * @param  {Object} e
     * @return {Constructor}
     */
    onScroll: function onScroll(e) {
      var prevState = this.findPastTop();

      if (prevState !== this.pastTop && !this.belowComponent) {
        if (!this.pastTop) {
          // Make sure to reset if we scroll _really_ fast
          this.setTranslate3d(this.rightColumnContent, -this.lastWaypointOffset);
        }

        this.affixRightCol();
      }

      this.pastTop ? this.ifScrollingAndPastTop(e) : this.clearInlineStyles();
      return this;
    },

    /**
     * When we're scrolling and past the top of the component
     *
     * @return {Constructor}
     */
    ifScrollingAndPastTop: function ifScrollingAndPastTop() {
      this.scrollDistInside = this.scrollPos - this.elOffset.top;
      this.updateRightColPosition();
      return this;
    },

    /**
     * Check if we're paste the top of the component
     *
     * @return {Boolean}
     */
    findPastTop: function findPastTop() {
      var prevState = this.pastTop;
      this.scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      this.pastTop = this.scrollPos > this.elOffset.top;
      return prevState;
    },

    /**
     * Clear out the styles on the right column.
     *
     * @return {Constructor}
     */
    clearInlineStyles: function clearInlineStyles() {
      this.rightColumn.setAttribute('style', '');
      return this;
    },

    /**
     * Add the class to fix the right columm and sets the
     * positioning/width styles that are needed. This is run
     * once when the user scrolls below the top of the component
     * and anytime there's a resize.
     *
     * @param {Boolean} doNotToggle
     * @return {Constructor}
     */
    affixRightCol: function affixRightCol(doNotToggle) {
      var width = window.getComputedStyle(this.leftColumn).width;
      this.rightColumn.style.width = width;
      this.rightColumn.style.right = (window.innerWidth - _parseInt(width) * 2) / 2 + 'px';

      if (!doNotToggle) {
        this.rightColumn.classList.toggle(CLASSES.FIXED);
      }

      return this;
    },

    /**
     * Set the translate
     *
     * @param {Element} el
     * @param {Number} val
     * @return {Constructor}
     */
    setTranslate3d: function setTranslate3d(el, val) {
      el.style.transform = 'translate3d(0, ' + val + 'px, 0)';
      return this;
    },

    /**
     * This is the main logic for determining the position (translateY)
     * of the content inside the right column. Basically we want to
     * map the scroll distance within the component to the scroll
     * position of the entire page. Then we want to check that we're
     * at the bottom of the component (when `newPos` is zero) and if
     * we're at the bottom we want to fix the content to the bottom
     * right of our dual scroll component.
     *
     * @return {Constructor}
     */
    updateRightColPosition: function updateRightColPosition() {
      var newPos = -(this.lastWaypointOffset - this.scrollDistInside); // If it's not zero..

      if (newPos <= 0) {
        this.setTranslate3d(this.rightColumnContent, newPos);

        if (this.rightColumn.classList.contains(CLASSES.FIXED_BOTTOM)) {
          this.toggleRightColStateAndClasses(false);
        }
      } else {
        this.setTranslate3d(this.rightColumnContent, 0);
        this.toggleRightColStateAndClasses(true);
      }

      return this;
    },

    /**
     * Just separating out the logic for class manipulation from
     * `updateRightColPosition`. Felt like that function was getting
     * a little too long. Also sets the `belowComponent` attribute
     *
     * @param  {Boolean} arg
     * @return {Constructor}
     */
    toggleRightColStateAndClasses: function toggleRightColStateAndClasses(arg) {
      if (arg) {
        this.belowComponent = arg;
        this.rightColumn.classList.add(CLASSES.FIXED_BOTTOM);
        this.rightColumn.classList.remove(CLASSES.FIXED);
      } else {
        this.belowComponent = arg;
        this.rightColumn.classList.remove(CLASSES.FIXED_BOTTOM);
        this.rightColumn.classList.add(CLASSES.FIXED);
      }

      return this;
    },

    /**
     * Set the position of the right column content
     * based on the distance of the last waypoint
     * from the top of the right column. Assumption
     * here is that the last item in the right column
     * is paired with the first item in the left column.
     *
     * @return {Construcot}
     */
    initializeRightColContentPosition: function initializeRightColContentPosition() {
      this.lastWaypointOffset = this.rightColWaypoints[this.rightColWaypoints.length - 1].offsetTop;
      this.setTranslate3d(this.rightColumnContent, -this.lastWaypointOffset);
      return this;
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"26":26,"106":106,"107":107,"108":108}];
