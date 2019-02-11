window.modules["listicle-nav-hundred-jokes.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _throttle = require(23),
    _find = require(71),
    _findLast = require(146),
    _forEach = require(27),
    $visibility = require(26);

DS.controller('listicle-nav-hundred-jokes', [function () {
  function Constructor(el) {
    this.el = el; // Primary nav pane (always visible when user scrolls into listicle-list)

    this.primaryNav = dom.find(this.el, '.listicle-nav-primary-list'); // Secondary nav pane (visible when user interacts with primary nav)

    this.secondaryNav = dom.find(this.el, '.listicle-nav-secondary-list'); // Listicle-list element associated with listicle-nav

    this.listicleList = dom.find(document.body, '.listicle-list'); // Array of all listicle-items, which provides the content for listicle-nav

    this.listicleItems = dom.findAll('.listicle-hundred-jokes'); // this.listItems = sidebar.getSidebarData(); // TODO: potential refactor to rely on service ( or ??? )
    // Toggle button (used for sub-desktop navigation)

    this.toggleButton = dom.find(this.el, '.listicle-nav-toggle-button'); // Tracker for currently active primary nav pane item

    this.primaryNavActiveItem = null; // Tracker for currently active secondary nav pane item

    this.secondaryNavActiveItem = null; // Boolean tracker for whether the secondary nav pane is visible

    this.navIsExpanded = false; // Page offset of listicle-list

    this.listicleTop = $visibility.getPageOffset(this.listicleList).top; // Track window scrollY

    this.lastWindowTop = 0; // Track index of current active listicle-item (used for optimization in getNewActivePrimaryNavItem)

    this.activeListiceItemIndex = null; // Boolean for device viewport

    this.userIsOnIpadOrLarger = window.innerWidth >= 768; // Booleans for browser

    this.userOnFirefox = !!window.navigator.userAgent.match(/firefox/i);
    this.userOnIE = /MSIE 9/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent); // Custom transformation of category into header for use in secondary nav pane

    this.categoryMap = function (elementType, dataCategory) {
      var parsed = dataCategory.indexOf('-TO-') > -1 ? dataCategory.split('-TO-') : dataCategory.split('-'),
          firstYear = parsed[0],
          lastYear = parsed[1],
          firstYearEl = document.createElement('span'),
          delimiterEl = document.createElement('span'),
          lastYearEl = document.createElement('span'),
          category = document.createElement(elementType),
          contentWrapper = document.createElement('div');
      firstYearEl.innerHTML = firstYear;
      delimiterEl.innerHTML = 'TO';
      lastYearEl.innerHTML = lastYear;
      firstYearEl.classList.add('listicle-nav-category-first-year');
      delimiterEl.classList.add('listicle-nav-category-delimiter');
      lastYearEl.classList.add('listicle-nav-category-last-year');
      contentWrapper.classList.add('listicle-nav-category-wrapper');
      contentWrapper.appendChild(firstYearEl);
      contentWrapper.appendChild(delimiterEl);
      contentWrapper.appendChild(lastYearEl);
      category.appendChild(contentWrapper);
      return category;
    };

    this.initialize();
  }

  Constructor.prototype = {
    /**
     * Run initialization functions
     */
    initialize: function initialize() {
      // disable nav bar on IE
      if (this.userOnIE) {
        return;
      }

      if (window.innerWidth < 1024) {
        document.body.style.overflow = 'hidden';
      }

      this.populateNavList().attachEventHandlers().updateNavState();
    },

    /**
     * attach event handlers
     * @return {object}
     */
    attachEventHandlers: function attachEventHandlers() {
      var throttledScrollCallback = _throttle(this.updateNavState, 100);

      window.addEventListener('scroll', throttledScrollCallback.bind(this)); // on touchscreen devices, interacting outside the nav bar will trigger collapse

      document.body.addEventListener('touchstart', this.handleTouchOutsideNav.bind(this));
      return this;
    },
    events: {
      // click on a category in primary nav pane
      '.listicle-nav-primary-list li click': 'handleClickOnPrimaryNavItem',
      '.listicle-nav-primary-list li touchend': 'handleClickOnPrimaryNavItem',
      // click on an item in secondary nav pane
      '.listicle-nav-secondary-list li click': 'handleClickOnSecondaryNavItem',
      // click on the open/close nav button
      '.listicle-nav-toggle-button click': 'handleClickOnToggleButton',
      // mouseenter/leave also handle touchscreen interaction
      mouseenter: 'handleSidebarExpand',
      mouseleave: 'handleSidebarCollapse'
    },

    /**
     * Get nav item corresponding to listicle-item with itemId
     * @param {string} itemId
     * @return {object}
     */
    getNavItem: function getNavItem(itemId) {
      return dom.find(this.el, '[data-id="' + itemId + '"]');
    },

    /**
     * Get new primary nav active item if exists
     * (Also sets new secondary nav active item if exists)
     * @return {object}
     */
    getNewActivePrimaryNavItem: function getNewActivePrimaryNavItem() {
      var windowTop = window.scrollY,
          userScrolledDown = windowTop > this.lastWindowTop,
          index = this.activeListiceItemIndex || 0,
          findOrFindLast = userScrolledDown || index === -1 ? _find : _findLast,
          newIndex = null,
          activeNavItem = null,
          category,
          itemCenter,
          // item is active if its center is in view
      activeListicleItem = findOrFindLast(this.listicleItems, function (item, i) {
        itemCenter = $visibility.getPageOffset(item).top + 0.5 * item.clientHeight;
        newIndex = i;

        if (i === index && !userScrolledDown) {
          return false;
        }

        return itemCenter > windowTop && itemCenter < windowTop + window.innerHeight;
      }, index);

      if (activeListicleItem) {
        category = activeListicleItem.getAttribute('data-category').split(' ').join('');
        activeNavItem = this.getNavItem(category);
        this.setSecondaryNavActiveItem(activeListicleItem.id);
        this.activeListiceItemIndex = newIndex;
      }

      return activeNavItem;
    },

    /**
     * Handle behavior for when user clicks a category in the primary nav pane
     * @param {object} e
     */
    handleClickOnPrimaryNavItem: function handleClickOnPrimaryNavItem(e) {
      var listicleNavItem = dom.closest(e.target, '.listicle-nav-primary-list-item'); // expand navbar if it hasn't already been expanded
      // (useful for touchscreen click on primary navbar)

      if (!this.navIsExpanded) {
        this.handleSidebarExpand();
      }

      this.setPrimaryNavActiveItem(listicleNavItem);
      this.scrollNavToCategory({
        target: listicleNavItem
      });
    },

    /**
     * Handle behavior for when user clicks an item in the secondary nav pane
     * @param {object} e
     */
    handleClickOnSecondaryNavItem: function handleClickOnSecondaryNavItem(e) {
      var listicleNavItem = dom.closest(e.target, '.listicle-nav-item-wrapper'),
          category = listicleNavItem.getAttribute('data-category').split(' ').join(''),
          primaryNavItem = dom.find(this.primaryNav, '[data-id="' + category + '"]'),
          listicleItemId = listicleNavItem.getAttribute('data-id');

      if (!this.userIsOnIpadOrLarger) {
        this.handleSidebarCollapse();
      }

      this.scrollToListicleItem(listicleNavItem);
      this.setPrimaryNavActiveItem(primaryNavItem);
      this.setSecondaryNavActiveItem(listicleItemId); // reset activeListicleItemId so it updates correctly on next scroll event

      this.activeListiceItemIndex = 0;
    },

    /**
     * Handle behavior for when user clicks the toggle button to open or close the nav on mobile devices
     */
    handleClickOnToggleButton: function handleClickOnToggleButton() {
      this.navIsExpanded ? this.handleSidebarCollapse() : this.handleSidebarExpand();
    },

    /**
     * Handle behavior for collapsing nav when touchscreen user interacts outside of nav
     * @param {object} e
     */
    handleTouchOutsideNav: function handleTouchOutsideNav(e) {
      var target = e.target,
          listicleNav = dom.closest(target, '.listicle-nav-hundred-jokes');

      if (!listicleNav) {
        this.handleSidebarCollapse();
      }
    },

    /**
     * Wrapper function with logic around handling sidebar collapse (making the secondary nav pane hidden)
     * @param {object} e (optional argument that is only passed in when called by events)
     */
    handleSidebarCollapse: function handleSidebarCollapse(e) {
      var collapseFn = this.userIsOnIpadOrLarger ? this.sidebarCollapse : this.sidebarCollapseTouchscreen,
          userOnIpad = navigator.userAgent.match(/iPad/i) != null; // temporary fix to deal with tablet bug in which undesired mouseleave is being triggered

      if (userOnIpad && e && e.type === 'mouseleave') {
        return;
      } // time logic needed to prevent touchscreen interaction from rapid-firing expand/collapse
      // (attaching position fixed to body triggers an undesired mouseleave event)


      if (this.navIsExpanded && Date.now() - this.expandTimestamp > 300) {
        // remove the transition styling set by handleSidebarExpand
        document.body.style.transition = '';
        this.el.classList.remove('transition'); // collapse requires a few moving parts, so wrap in animation frame

        window.requestAnimationFrame(collapseFn.bind(this));
        this.navIsExpanded = false;
      }
    },

    /**
     * Wrapper function with logic around handling sidebar expansion (making the secondary nav pane visible)
     */
    handleSidebarExpand: function handleSidebarExpand() {
      var expansionFn = this.userIsOnIpadOrLarger ? this.sidebarExpand : this.sidebarExpandTouchscreen;

      if (!this.navIsExpanded) {
        this.navIsExpanded = true;
        this.expandTimestamp = Date.now();
        window.requestAnimationFrame(expansionFn.bind(this));
      }
    },

    /**
     * Remove class from nav to hide
     */
    hideNav: function hideNav() {
      this.el.classList.remove('show');
    },

    /**
     * Populate primary and secondary panes of sidebar nav with content
     * @return {object}
     */
    populateNavList: function populateNavList() {
      var li,
          anchor,
          primarySpan,
          secondarySpan,
          tertiarySpan,
          primaryText,
          secondaryText,
          tertiaryText,
          categoryText,
          categories = {},
          categoryHeader,
          columnOne,
          columnTwo; // organize into categories before appending to DOM

      _forEach(this.listicleItems, function (item) {
        categoryText = item.getAttribute('data-category');
        categoryText = categoryText.split(' ').join(''); // strip spaces

        if (categories[categoryText]) {
          categories[categoryText].push(item);
        } else {
          categories[categoryText] = [item];
        }
      }.bind(this)); // append to secondary nav, grouped by categories


      _forEach(categories, function (category, key) {
        categoryHeader = this.categoryMap('header', key);
        categoryHeader.classList.add('secondary-list-header');
        key = key.split(' ').join(''); // spaces break classList.add

        categoryHeader.classList.add('category-' + key);
        this.secondaryNav.appendChild(categoryHeader);

        _forEach(category, function (item) {
          li = document.createElement('li'), anchor = document.createElement('div'), // primary, secondary and tertiary spans will display text corresponding to
          // data attributes exposed on listicle-hundred-jokes instances
          primarySpan = document.createElement('span');
          secondarySpan = document.createElement('span');
          tertiarySpan = document.createElement('span');
          columnOne = document.createElement('div');
          columnOne.classList.add('listicle-nav-secondary-col-one');
          columnOne.appendChild(primarySpan);
          columnTwo = document.createElement('div');
          columnTwo.classList.add('listicle-nav-secondary-col-two');
          columnTwo.appendChild(secondarySpan);
          columnTwo.appendChild(tertiarySpan);
          primaryText = item.getAttribute('data-nav-primary'), secondaryText = item.getAttribute('data-nav-secondary'), tertiaryText = item.getAttribute('data-nav-tertiary'); // strip extra characters out of primaryText

          primaryText = primaryText.match(/[0-9]+/);
          primarySpan.innerHTML = primaryText;
          primarySpan.classList.add('listicle-nav-item-primary');
          secondarySpan.innerHTML = secondaryText;
          secondarySpan.classList.add('listicle-nav-item-secondary');
          tertiarySpan.innerHTML = tertiaryText;
          tertiarySpan.classList.add('listicle-nav-item-tertiary');
          anchor.classList.add('listicle-nav-item-wrapper');
          anchor.setAttribute('data-id', item.id);
          anchor.setAttribute('data-category', key);
          anchor.appendChild(columnOne);
          anchor.appendChild(columnTwo);
          li.appendChild(anchor);
          this.secondaryNav.appendChild(li);
        }.bind(this));
      }.bind(this)); // append categories to primary nav


      _forEach(Object.keys(categories), function (category) {
        li = this.categoryMap('li', category);
        li.setAttribute('data-id', category);
        li.classList.add('listicle-nav-primary-list-item');
        this.primaryNav.appendChild(li);
      }.bind(this));

      return this;
    },

    /**
     * Scroll secondary nav pane to the category selected in primary nav pane
     * @param {object} e
     */
    scrollNavToCategory: function scrollNavToCategory(e) {
      var dataId, categoryName, categoryHeader, categoryTop, secondaryNavContainer, scrollYPosition, newScrollYPosition;

      if (e.target) {
        dataId = e.target.getAttribute('data-id').split(' ').join('');
        categoryName = 'category-' + dataId;
        categoryHeader = dom.find(this.el, '.secondary-list-header.' + categoryName);
        categoryTop = categoryHeader.getBoundingClientRect().top;
        secondaryNavContainer = this.secondaryNav.parentElement;
        scrollYPosition = secondaryNavContainer.scrollTop;
        newScrollYPosition = scrollYPosition + categoryTop;
        secondaryNavContainer.scrollTop = newScrollYPosition;
      }
    },

    /**
     * Automate scrolling to listicle-item in the main article body
     * Works recursively until rectTop is equal to marginTop
     * (handles both desktop and mobile versions)
     * @param {object} listicleNavItem
     */
    scrollToListicleItem: function scrollToListicleItem(listicleNavItem) {
      var listicleItemId = listicleNavItem.getAttribute('data-id'),
          scrollPoint,
          listicleItem = document.getElementById(listicleItemId),
          rectTop = listicleItem.getBoundingClientRect().top,
          marginTop = 20,
          // margin from the top of page
      translateAmt,
          errorMargin = 10; // allowable margin of error in scroll to listicle item
      // abort if listicle item is within view

      if (Math.abs(rectTop - marginTop) < errorMargin) {
        return;
      }

      if (this.userIsOnIpadOrLarger) {
        translateAmt = document.body.style.transform.match(/[0-9]+/)[0];
        scrollPoint = parseInt(translateAmt) + rectTop - marginTop;
        window.requestAnimationFrame(function () {
          // body is position:fixed at this point, so scroll is simulated by translateY transformation
          document.body.style.transform = 'translateY(' + -scrollPoint + 'px)'; // translateY applied to body is applied to nav as well, so nav must be translated in the opposing direction

          this.el.style.transform = 'translateY(' + scrollPoint + 'px)';
        }.bind(this)); // // body is position:fixed at this point, so scroll is simulated by translateY transformation
        // document.body.style.transform = 'translateY(' + -scrollPoint + 'px)';
        //
        // // translateY applied to body is applied to nav as well, so nav must be translated in the opposing direction
        // this.el.style.transform = 'translateY(' + scrollPoint + 'px)';
      } else {
        translateAmt = window.scrollY;
        scrollPoint = parseInt(translateAmt) + rectTop - marginTop;
        window.scrollTo(0, scrollPoint);
      } // recursive call in case the first automated scroll didn't do the trick


      window.setTimeout(function () {
        this.scrollToListicleItem(listicleNavItem);
      }.bind(this), 300); // 300 ms timeout is consistent with the current transition speed set in styles
    },

    /**
     * Set primary nav item corresponding to active listicle item and add active class
     * @param {object} navListItem
     */
    setPrimaryNavActiveItem: function setPrimaryNavActiveItem(navListItem) {
      navListItem.classList.add('active'); // remove active from previous active item

      if (!!this.primaryNavActiveItem && navListItem != this.primaryNavActiveItem) {
        this.primaryNavActiveItem.classList.remove('active');
      }

      this.primaryNavActiveItem = navListItem;
    },

    /**
     * Find secondary nav item corresponding to active listicle item and add active class
     * @param {string} activeListicleItemId
     */
    setSecondaryNavActiveItem: function setSecondaryNavActiveItem(activeListicleItemId) {
      var navItem = dom.find(this.secondaryNav, '[data-id="' + activeListicleItemId + '"]'); // remove active from previously active item

      if (!!this.secondaryNavActiveItem) {
        this.secondaryNavActiveItem.classList.remove('active');
      }

      navItem.classList.add('active');
      this.secondaryNavActiveItem = navItem;
    },

    /**
     * Toggle styling on nav bar to show when scrolled into view
     */
    showNav: function showNav() {
      this.el.classList.add('show');
    },

    /**
     * Perform styling changes needed to create the effect of the sidebar nav collapsing
     * (reverse changes made by sidebarExpand)
     */
    sidebarCollapse: function sidebarCollapse() {
      var scrollY = document.body.style.transform.match(/[0-9]+/)[0]; // remove inline styling set by sidebarExpand

      document.body.style.position = '';
      document.body.style.transform = '';
      this.el.style.transform = ''; // return user to their scrollY position

      window.scrollTo(0, scrollY); // remove styling classes added by sidebarExpand

      this.el.classList.remove('expanded');
      this.listicleList.classList.remove('background');
    },

    /**
     * Perform styling changes needed to create the effect of the sidebar nav collapsing
     * (reverse changes made by sidebarExpandTouchscreen)
     */
    sidebarCollapseTouchscreen: function sidebarCollapseTouchscreen() {
      // remove styling classes added by sidebarExpandTouchscreen
      this.el.classList.remove('expanded');
    },

    /**
     * Perform styling changes needed to create the effect of the sidebar nav expanding with the following additional constraint:
     * scrolling to the top and bottom of the secondary nav pane should not bleed into scrolling the main content
     *
     * when sidebar expands the following things must also happen in order to prevent scrolling in the sidebar from bleeding into scrolling on the main document
     *   1) document.body gets `position: fixed` (which brings the window up to the top)
     *   2) document.body gets `transformation: translateY(amount)` (to counteract (1) and keep content in place)
     */
    sidebarExpand: function sidebarExpand() {
      var scrollY = window.scrollY; // to prevent scrolling within the sidebar to bleed out into scrolling the main content, the following styling changes are made and removed on collapse

      document.body.style.position = 'fixed';
      document.body.style.transform = 'translateY(' + -scrollY + 'px)';
      this.el.style.transform = 'translateY(' + scrollY + 'px)'; // need to add and remove transitions strategically to create the effect/illusion of a fixed navbar

      this.addTransitionFn = function () {
        document.body.style.transition = 'transform 0.3s';
        this.el.classList.add('transition');
      }; // Firefox chokes on handling these joint transitions


      if (!this.userOnFirefox) {
        window.setTimeout(this.addTransitionFn.bind(this), 300);
      } // scroll secondary pane to the correct category


      this.scrollNavToCategory({
        target: this.primaryNavActiveItem
      }); // attach styling

      this.el.classList.add('expanded');
      this.listicleList.classList.add('background');
    },

    /**
     * Perform styling changes needed for navbar expansion for touchscreen devices
     * (The `position:fixed + transform: translateY` workaround needed for desktop is not needed for touchscreen)
     */
    sidebarExpandTouchscreen: function sidebarExpandTouchscreen() {
      // scroll secondary pane to the correct category
      this.scrollNavToCategory({
        target: this.primaryNavActiveItem
      }); // attach styling

      this.el.classList.add('expanded');
    },

    /**
     * Respond to user's scrollY position with changes to nav UI
     */
    updateNavState: function updateNavState() {
      var isBelowListicleTop = window.scrollY >= this.listicleTop,
          isAboveListicleBottom = window.scrollY + window.innerHeight <= this.listicleTop + this.listicleList.offsetHeight,
          isInListicle = isBelowListicleTop && isAboveListicleBottom,
          activePrimaryNavItem; // navIsExpanded logic needed to treat case when position fixed is applied to body (to avoid immediately collapsing the nav)

      isInListicle || this.navIsExpanded ? this.showNav() : this.hideNav();
      activePrimaryNavItem = this.getNewActivePrimaryNavItem(); // only set active item on scroll if there is a new nav item to update to and when this function isn't being triggered by hover on primary nav pane

      if (activePrimaryNavItem && !this.navIsExpanded) {
        this.setPrimaryNavActiveItem(activePrimaryNavItem);
      }

      this.lastWindowTop = window.scrollY;
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"26":26,"27":27,"71":71,"146":146}];
